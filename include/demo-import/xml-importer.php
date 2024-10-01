<?php
/**
 * @package wpOpus
 * @category XML importer
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}
class WpOpus_XML_Importer
{
    private $xml;
    private $processed_posts = array();
    private $processed_terms = array();
    private $terms = array();
    private $fetch_attachments = true;
    private $url_remap = array();
    private $featured_images = array();

    public function __construct($xml_data)
    {
        $this->xml = simplexml_load_string($xml_data);
        if ($this->xml === false) {
            $this->log_error('Failed to load XML data.');
            return;
        }
        $this->xml->registerXPathNamespace('wp', 'http://wordpress.org/export/1.2/');
    }

    public function import()
    {
        if ($this->xml === false) {
            $this->log_error('XML data is invalid.');
            return;
        }

        $this->process_options();
        $this->process_categories();
        $this->process_tags();
        $this->process_terms();
        $this->process_posts();

        return array(
            'processed_posts' => count($this->processed_posts),
            'processed_terms' => count($this->processed_terms)
        );
    }

    private function process_options()
    {
        foreach ($this->xml->xpath('/rss/channel/wp:options/wp:option') as $option) {
            $option_name = isset($option->xpath('wp:option_name')[0]) ? (string) $option->xpath('wp:option_name')[0] : '';
            $option_value = isset($option->xpath('wp:option_value')[0]) ? (string) $option->xpath('wp:option_value')[0] : '';

            if (!empty($option_name)) {
                $decoded_value = html_entity_decode($option_value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $json_decoded = json_decode($decoded_value, true);
                $final_value = (json_last_error() === JSON_ERROR_NONE) ? $json_decoded : $decoded_value;
                update_option($option_name, maybe_unserialize($final_value));
            }
        }
    }

    private function process_categories()
    {
        $categories = $this->xml->xpath('/rss/channel/wp:category');

        foreach ($categories as $category) {
            $cat = array(
                'term_id' => (int) $category->xpath('wp:term_id')[0],
                'cat_name' => (string) $category->xpath('wp:cat_name')[0],
                'category_nicename' => (string) $category->xpath('wp:category_nicename')[0],
                'category_parent' => (string) $category->xpath('wp:category_parent')[0],
                'category_description' => (string) $category->xpath('wp:category_description')[0],
            );

            $term_id = term_exists($cat['category_nicename'], 'category');
            if ($term_id) {
                if (is_array($term_id))
                    $term_id = $term_id['term_id'];
                if (isset($cat['term_id']))
                    $this->processed_terms[intval($cat['term_id'])] = (int) $term_id;
                continue;
            }

            $parent = empty($cat['category_parent']) ? 0 : category_exists($cat['category_parent']);
            $description = isset($cat['category_description']) ? $cat['category_description'] : '';

            $data = array(
                'category_nicename' => $cat['category_nicename'],
                'category_parent' => $parent,
                'cat_name' => wp_slash($cat['cat_name']),
                'category_description' => wp_slash($description),
            );

            $id = wp_insert_category($data, true);
            if (!is_wp_error($id) && $id > 0) {
                if (isset($cat['term_id']))
                    $this->processed_terms[intval($cat['term_id'])] = $id;
            } else {
                $this->log_error(sprintf(__('Failed to import category %s'), $cat['category_nicename']));
                continue;
            }

            $this->process_termmeta($category, $id);
        }
    }

    private function process_tags()
    {
        $tags = $this->xml->xpath('/rss/channel/wp:tag');

        foreach ($tags as $tag) {
            $tag_data = array(
                'term_id' => (int) $tag->xpath('wp:term_id')[0],
                'tag_slug' => (string) $tag->xpath('wp:tag_slug')[0],
                'tag_name' => (string) $tag->xpath('wp:tag_name')[0],
                'tag_description' => (string) $tag->xpath('wp:tag_description')[0],
            );

            $term_id = term_exists($tag_data['tag_slug'], 'post_tag');
            if ($term_id) {
                if (is_array($term_id))
                    $term_id = $term_id['term_id'];
                if (isset($tag_data['term_id']))
                    $this->processed_terms[intval($tag_data['term_id'])] = (int) $term_id;
                continue;
            }

            $description = isset($tag_data['tag_description']) ? $tag_data['tag_description'] : '';
            $args = array(
                'slug' => $tag_data['tag_slug'],
                'description' => wp_slash($description),
            );

            $id = wp_insert_term(wp_slash($tag_data['tag_name']), 'post_tag', $args);
            if (!is_wp_error($id)) {
                if (isset($tag_data['term_id']))
                    $this->processed_terms[intval($tag_data['term_id'])] = $id['term_id'];
            } else {
                $this->log_error(sprintf(__('Failed to import post tag %s'), $tag_data['tag_name']));
                continue;
            }

            $this->process_termmeta($tag, $id['term_id']);
        }
    }

    private function process_terms()
    {
        $terms = $this->xml->xpath('/rss/channel/wp:term');

        foreach ($terms as $term) {
            $term_data = array(
                'term_id' => (int) $term->xpath('wp:term_id')[0],
                'term_taxonomy' => (string) $term->xpath('wp:term_taxonomy')[0],
                'slug' => (string) $term->xpath('wp:term_slug')[0],
                'term_parent' => (string) $term->xpath('wp:term_parent')[0],
                'term_name' => (string) $term->xpath('wp:term_name')[0],
                'term_description' => (string) $term->xpath('wp:term_description')[0],
            );

            $term_id = term_exists($term_data['slug'], $term_data['term_taxonomy']);
            if ($term_id) {
                if (is_array($term_id))
                    $term_id = $term_id['term_id'];
                if (isset($term_data['term_id']))
                    $this->processed_terms[intval($term_data['term_id'])] = (int) $term_id;
                continue;
            }

            if (empty($term_data['term_parent'])) {
                $parent = 0;
            } else {
                $parent = term_exists($term_data['term_parent'], $term_data['term_taxonomy']);
                if (is_array($parent))
                    $parent = $parent['term_id'];
            }

            $description = isset($term_data['term_description']) ? $term_data['term_description'] : '';
            $args = array(
                'slug' => $term_data['slug'],
                'description' => wp_slash($description),
                'parent' => (int) $parent
            );

            $id = wp_insert_term(wp_slash($term_data['term_name']), $term_data['term_taxonomy'], $args);
            if (!is_wp_error($id)) {
                if (isset($term_data['term_id']))
                    $this->processed_terms[intval($term_data['term_id'])] = $id['term_id'];
            } else {
                $this->log_error(sprintf(__('Failed to import %s %s'), $term_data['term_taxonomy'], $term_data['term_name']));
                continue;
            }

            $this->process_termmeta($term, $id['term_id']);
        }
    }

    private function process_termmeta($term, $term_id)
    {
        $termmeta = $term->xpath('wp:termmeta');
        foreach ($termmeta as $meta) {
            $key = (string) $meta->xpath('wp:meta_key')[0];
            $value = (string) $meta->xpath('wp:meta_value')[0];

            $key = apply_filters('import_term_meta_key', $key, $term_id, $term);
            if (!$key)
                continue;

            $value = maybe_unserialize($value);
            add_term_meta($term_id, wp_slash($key), wp_slash_strings_only($value));

            do_action('import_term_meta', $term_id, $key, $value);
        }
    }

    private function process_posts()
    {
        foreach ($this->xml->xpath('/rss/channel/item') as $post) {
            $this->process_post($post);
        }
    }

    private function process_post($post)
    {
        $post_type = (string) $post->xpath('wp:post_type')[0];
        $post_id = (int) $post->xpath('wp:post_id')[0];
        $post_name = (string) $post->xpath('wp:post_name')[0];

        if (isset($this->processed_posts[$post_id])) {
            return;
        }

        // Check if the post type is an attachment
        if ($post_type === 'attachment') {
            return;
        }

        // Initialize category and taxonomy arrays
        $categories = array();
        $tags = array();
        $other_taxonomies = array();

        // Handle categories and taxonomies
        foreach ($post->category as $cat) {
            $domain = (string) $cat['domain']; // The taxonomy (e.g., "category" or "post_tag")
            $nicename = (string) $cat['nicename']; // The slug of the term (e.g., "corporate")

            // Get the term by slug
            $term = get_term_by('slug', $nicename, $domain);

            if ($term) {
                // Assign categories and tags to the appropriate arrays
                if ($domain === 'category') {
                    $categories[] = $term->term_id;
                } elseif ($domain === 'post_tag') {
                    $tags[] = $term->slug; // For tags, use the slug
                } else {
                    // Handle other custom taxonomies
                    $other_taxonomies[$domain][] = $term->term_id;
                }
            } else {
                // Optionally create term if not found
                $term_data = wp_insert_term((string) $cat, $domain, array('slug' => $nicename));
                if (!is_wp_error($term_data)) {
                    if ($domain === 'category') {
                        $categories[] = $term_data['term_id'];
                    } elseif ($domain === 'post_tag') {
                        $tags[] = $nicename;
                    } else {
                        $other_taxonomies[$domain][] = $term_data['term_id'];
                    }
                } else {
                    $this->log_error("Error creating term '{$nicename}' in domain '{$domain}': " . $term_data->get_error_message());
                }
            }
        }

        // Prepare post data with taxonomies
        $post_data = array(
            'post_title' => (string) $post->title,
            'post_content' => (string) $post->xpath('content:encoded')[0],
            'post_excerpt' => (string) $post->xpath('excerpt:encoded')[0],
            'post_status' => (string) $post->xpath('wp:status')[0],
            'post_type' => $post_type,
            'post_name' => $post_name,
            'post_date' => (string) $post->xpath('wp:post_date')[0],
            'post_date_gmt' => (string) $post->xpath('wp:post_date_gmt')[0],
            'comment_status' => (string) $post->xpath('wp:comment_status')[0],
            'ping_status' => (string) $post->xpath('wp:ping_status')[0],
            'post_parent' => (int) $post->xpath('wp:post_parent')[0],
            'menu_order' => (int) $post->xpath('wp:menu_order')[0],
            'tax_input' => array(
                'category' => $categories, // Assign categories
                'post_tag' => $tags, // Assign tags (using slugs)
            ),
        );

        // Add other custom taxonomies to tax_input if available
        if (!empty($other_taxonomies)) {
            $post_data['tax_input'] = array_merge($post_data['tax_input'], $other_taxonomies);
        }

        // Insert the post
        $new_post_id = wp_insert_post($post_data, true);

        if (!is_wp_error($new_post_id)) {
            $this->processed_posts[$post_id] = $new_post_id;
            
            // Handle postmeta
            foreach ($post->xpath('wp:postmeta') as $meta) {
                $key = (string) $meta->xpath('wp:meta_key')[0];
                $value = (string) $meta->xpath('wp:meta_value')[0];
                update_post_meta($new_post_id, $key, maybe_unserialize($value));
            }
        } else {
            $this->log_error('Error inserting post: ' . $new_post_id->get_error_message());
        }
    }

    private function log_error($message)
    {
        if (true === WP_DEBUG_LOG) {
            error_log($message);
        }
    }
}
