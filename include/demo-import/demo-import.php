<?php
/**
 * @package wpOpus
 * @category Demo Import Ajax
 * Author: wpOpus
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class WpOpus_Demo_Import
{
    public function __construct()
    {
        add_action('wp_ajax_wpopus_import_demo', array($this, 'import_demo_data'));
    }

    private function activate_imported_plugins($plugins = array())
    {
        if (empty($plugins)) {
            return;
        }

        include_once ABSPATH . 'wp-admin/includes/plugin.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

        foreach ($plugins as $plugin) {
            if (!is_plugin_active($plugin) && !file_exists(WP_PLUGIN_DIR . '/' . $plugin)) {
                $plugin_slug = dirname($plugin);

                $api = plugins_api(
                    'plugin_information',
                    array(
                        'slug' => $plugin_slug,
                        'fields' => array('sections' => false),
                    )
                );

                if (is_wp_error($api)) {
                    wp_send_json_error(
                        array(
                            'slug' => $plugin_slug,
                            'errorCode' => $api->get_error_code(),
                            'errorMessage' => $api->get_error_message(),
                        )
                    );
                }

                $skin = new WP_Ajax_Upgrader_Skin();
                $upgrader = new Plugin_Upgrader($skin);
                ob_start();
                $result = $upgrader->install($api->download_link);
                $install_log = ob_get_clean();

                if (is_wp_error($result)) {
                    wp_send_json_error(
                        array(
                            'slug' => $plugin_slug,
                            'errorCode' => $result->get_error_code(),
                            'errorMessage' => $result->get_error_message(),
                        )
                    );
                } elseif (is_wp_error($skin->result)) {
                    wp_send_json_error(
                        array(
                            'slug' => $plugin_slug,
                            'errorCode' => $skin->result->get_error_code(),
                            'errorMessage' => $skin->result->get_error_message(),
                        )
                    );
                } elseif ($skin->get_errors()->has_errors()) {
                    wp_send_json_error(
                        array(
                            'slug' => $plugin_slug,
                            'errorMessage' => $skin->get_error_messages(),
                        )
                    );
                }

                // Plugin installation successful, attempt activation
                $activate_result = activate_plugin($plugin);
                if (is_wp_error($activate_result)) {
                    wp_send_json_error(
                        array(
                            'slug' => $plugin_slug,
                            'errorCode' => $activate_result->get_error_code(),
                            'errorMessage' => $activate_result->get_error_message(),
                        )
                    );
                }
            } elseif (!is_plugin_active($plugin)) {
                $activate_result = activate_plugin($plugin);
                if (is_wp_error($activate_result)) {
                    wp_send_json_error(
                        array(
                            'slug' => dirname($plugin),
                            'errorCode' => $activate_result->get_error_code(),
                            'errorMessage' => $activate_result->get_error_message(),
                        )
                    );
                }
            }
        }
    }


    public function theme_setup()
    {
        // Set static homepage
        $homepage = get_posts(array('title' => 'Home', 'post_type' => 'page', 'posts_per_page' => 1, 'orderby' => 'ID'));
        if ($homepage) {
            update_option('page_on_front', $homepage[0]->ID);
            update_option('show_on_front', 'page');
        }

        // Set static blog page
        $blogpage = get_posts(array('title' => 'Blog', 'post_type' => 'page', 'posts_per_page' => 1, 'orderby' => 'ID'));
        if ($blogpage) {
            update_option('page_for_posts', $blogpage[0]->ID);
            update_option('show_on_front', 'page');
        }

        // Get theme info
        $current_theme = wp_get_theme();
        $text_domain = $current_theme->get('TextDomain');

        // Set theme in term
        $name_term = get_term_by('slug', $text_domain, 'wp_theme');
        if (!$name_term) {
            wp_insert_term($text_domain, 'wp_theme', array('slug' => $text_domain));
        }

        // Set header in term
        $header_term = get_term_by('slug', 'header', 'wp_template_part_area');
        if (!$header_term) {
            wp_insert_term('header', 'wp_template_part_area', array('slug' => 'header'));
        }

        // Set footer in term
        $footer_term = get_term_by('slug', 'footer', 'wp_template_part_area');
        if (!$footer_term) {
            wp_insert_term('footer', 'wp_template_part_area', array('slug' => 'footer'));
        }

        // Set header in site
        $header = get_posts(array('title' => 'Header', 'post_type' => 'wp_template_part', 'posts_per_page' => 1, 'orderby' => 'ID'));
        $header_term = get_term_by('slug', 'header', 'wp_template_part_area');
        if ($header) {
            wp_set_object_terms($header[0]->ID, $text_domain, 'wp_theme');
            wp_set_object_terms($header[0]->ID, $header_term->term_id, 'wp_template_part_area');
        }

        // Set footer in site
        $footer = get_posts(array('title' => 'Footer', 'post_type' => 'wp_template_part', 'posts_per_page' => 1, 'orderby' => 'ID'));
        $footer_term = get_term_by('slug', 'footer', 'wp_template_part_area');
        if ($footer) {
            wp_set_object_terms($footer[0]->ID, $text_domain, 'wp_theme');
            wp_set_object_terms($footer[0]->ID, $footer_term->term_id, 'wp_template_part_area');
        }

        /**
         * setup templates
         */
        $wp_templates = get_posts(array('post_type' => 'wp_template', 'posts_per_page' => -1, 'orderby' => 'ID'));

        if ($wp_templates) {
            // Initialize an associative array to store the highest ID post for each title
            $highest_id_posts = array();

            // Loop through the posts and store the highest ID post for each title
            foreach ($wp_templates as $wp_template) {
                $title = $wp_template->post_title;
                if (!isset($highest_id_posts[$title]) || $wp_template->ID > $highest_id_posts[$title]->ID) {
                    $highest_id_posts[$title] = $wp_template;
                }
            }

            // Set single posts page in site
            if (isset($highest_id_posts['Single Posts'])) {
                wp_set_object_terms($highest_id_posts['Single Posts']->ID, $text_domain, 'wp_theme');
            }

            // Set single left sidebar posts page in site
            if (isset($highest_id_posts['Single Post Left Sidebar'])) {
                wp_set_object_terms($highest_id_posts['Single Post Left Sidebar']->ID, $text_domain, 'wp_theme');
            }

            // Set single right sidebar posts page in site
            if (isset($highest_id_posts['Single Post Right Sidebar'])) {
                wp_set_object_terms($highest_id_posts['Single Post Right Sidebar']->ID, $text_domain, 'wp_theme');
            }

            // Set static page in site
            if (isset($highest_id_posts['Pages'])) {
                wp_set_object_terms($highest_id_posts['Pages']->ID, $text_domain, 'wp_theme');
            }

            // Set page left sidebar static page in site
            if (isset($highest_id_posts['Page Left Sidebar'])) {
                wp_set_object_terms($highest_id_posts['Page Left Sidebar']->ID, $text_domain, 'wp_theme');
            }

            // Set page right sidebar static page in site
            if (isset($highest_id_posts['Page Right Sidebar'])) {
                wp_set_object_terms($highest_id_posts['Page Right Sidebar']->ID, $text_domain, 'wp_theme');
            }

            // Set page no title / featured image static page in site
            if (isset($highest_id_posts['Page (No Title / Featured Image)'])) {
                wp_set_object_terms($highest_id_posts['Page (No Title / Featured Image)']->ID, $text_domain, 'wp_theme');
            }

            // Set page 404 in site
            if (isset($highest_id_posts['Page: 404'])) {
                wp_set_object_terms($highest_id_posts['Page: 404']->ID, $text_domain, 'wp_theme');
            }

            // Set archive page in site
            if (isset($highest_id_posts['All Archives'])) {
                wp_set_object_terms($highest_id_posts['All Archives']->ID, $text_domain, 'wp_theme');
            }

            // Set index in site
            if (isset($highest_id_posts['Index'])) {
                wp_set_object_terms($highest_id_posts['Index']->ID, $text_domain, 'wp_theme');
            }

            // Set blog listing in site
            if (isset($highest_id_posts['Blog Listing'])) {
                wp_set_object_terms($highest_id_posts['Blog Listing']->ID, $text_domain, 'wp_theme');
            }

            // Set search results page in site
            if (isset($highest_id_posts['Search Results'])) {
                wp_set_object_terms($highest_id_posts['Search Results']->ID, $text_domain, 'wp_theme');
            }

            /**
             * WooCommerce
             */
            // Set single product in site
            if (isset($highest_id_posts['Single Product'])) {
                wp_set_object_terms($highest_id_posts['Single Product']->ID, $text_domain, 'wp_theme');
            }

            // Set product search result in site
            if (isset($highest_id_posts['Products Search Result'])) {
                wp_set_object_terms($highest_id_posts['Products Search Result']->ID, $text_domain, 'wp_theme');
            }

            // Set product tag page in site
            if (isset($highest_id_posts['Products by Tag'])) {
                wp_set_object_terms($highest_id_posts['Products by Tag']->ID, $text_domain, 'wp_theme');
            }

            // Set product category page in site
            if (isset($highest_id_posts['Products by Category'])) {
                wp_set_object_terms($highest_id_posts['Products by Category']->ID, $text_domain, 'wp_theme');
            }

            // Set product archive page in site
            if (isset($highest_id_posts['Product Catalog'])) {
                wp_set_object_terms($highest_id_posts['Product Catalog']->ID, $text_domain, 'wp_theme');
            }
        }
    }

    public function import_demo_data()
    {
        // Load the WordPress Importer
        if (!defined('WP_LOAD_IMPORTERS')) {
            define('WP_LOAD_IMPORTERS', true);
        }

        if (!is_user_logged_in()) {
            wp_send_json_error(__('User not logged in', 'wpopus'));
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('User does not have sufficient permissions', 'wpopus'));
            return;
        }

        // Check nonce in headers
        $nonce = isset($_SERVER['HTTP_X_WP_NONCE']) ? sanitize_text_field($_SERVER['HTTP_X_WP_NONCE']) : '';
        if (!wp_verify_nonce($nonce, 'wpopus_import_demo_nonce')) {
            wp_send_json_error(__('Invalid nonce', 'wpopus'));
            return;
        }

        // Increase memory limit for larger imports
        ini_set('max_execution_time', 300); // 5 minutes
        ini_set('memory_limit', '256M');

        // Get the demo data from the request body
        $raw_request_body = file_get_contents('php://input');
        $demo_data = json_decode($raw_request_body, true);

        if (empty($demo_data) || !isset($demo_data['demoData'])) {
            wp_send_json_error(__('No demo data found', 'wpopus'));
            return;
        }

        // save current demo route
        $saved_demo_url = get_option('wpopus_recent_demo_url');
        $demo_url = $demo_data['demoRoute'][0]['content'];
        if ($saved_demo_url == $demo_url) {
            wp_send_json_error(__('This demo is already imported.', 'wpopus'));
            return;
        }
        update_option('wpopus_recent_demo_url', esc_url_raw($demo_url));

        $xml_data = $demo_data['demoData']['all_content'];
        if ($xml_data === false) {
            wp_send_json_error(__('Invalid XML data', 'wpopus'));
            return;
        }

        // Activate imported plugins
        if (!empty($demo_data['demoData']['active_plugins'])) {
            $this->activate_imported_plugins($demo_data['demoData']['active_plugins']);
        }

        $importer = new WpOpus_XML_Importer($xml_data);
        $result = $importer->import();

        // Setup theme
        $this->theme_setup();

        if (is_wp_error($result)) {
            wp_send_json_error(__('Error importing demo data', 'wpopus'));
        } else {
            wp_send_json_success(__('Demo data imported successfully', 'wpopus'));
        }
    }
}

new WpOpus_Demo_Import();
