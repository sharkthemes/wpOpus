<?php
/**
 * @package wpOpus
 * @category structure
 * @author wpOpus
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class WpOpus_Structure
{

    public function __construct()
    {
        self::init();
    }

    public function init()
    {
        add_filter('body_class', array($this, 'body_classes'));

        // init preload
        add_action('wp_body_open', array($this, 'preload_init'));

        // init search form
        add_action('wp_footer', array($this, 'header_search_form'));

        // init backtotop
        add_action('wp_footer', array($this, 'backtotop_init'));
    }

    /**
     * add body class
     */
    public function body_classes($classes)
    {
        $classes[] = get_stylesheet();

        // support for frontend
        $classes[] = 'wpopus';

        return $classes;
    }

    /**
     * search form functions
     */
    public function header_search_form()
    { ?>
        <div class="st-search-form">
            <div class="st-search-form-wrapper">
                <form role="search" method="get" class="search-form" action="<?php echo esc_url(home_url('/')); ?>">
                    <label for="s">
                        <span class="screen-reader-text"><?php echo esc_html_x('Search for:', 'label', 'wpopus'); ?></span>
                    </label>
                    <input type="search" class="search-field"
                        placeholder="<?php echo esc_attr_x('Search &hellip;', 'placeholder', 'wpopus'); ?>"
                        value="<?php echo get_search_query(); ?>" name="s" />
                    <button type="submit" class="search-submit">
                        <svg viewBox="0 0 489.713 489.713">
                            <path
                                d="M483.4,454.444l-121.3-121.4c28.7-35.2,46-80,46-128.9c0-112.5-91.5-204.1-204.1-204.1S0,91.644,0,204.144
                                s91.5,204,204.1,204c48.8,0,93.7-17.3,128.9-46l121.3,121.3c8.3,8.3,20.9,8.3,29.2,0S491.8,462.744,483.4,454.444z M40.7,204.144
                                c0-90.1,73.2-163.3,163.3-163.3s163.4,73.3,163.4,163.4s-73.3,163.4-163.4,163.4S40.7,294.244,40.7,204.144z" />
                        </svg>
                        <span class="screen-reader-text"><?php echo esc_html_x('Search', 'submit button', 'wpopus'); ?></span>
                    </button>
                </form>
            </div>
        </div>
    <?php }

    /**
     * preload init functions
     */
    public function preload_init()
    {
        $enable_preload = get_option('wpopus_preload_enable', false);
        $image = get_option('wpopus_preload_image', array());

        if (!$enable_preload || empty($image)) {
            return;
        }

        $bg_color = get_option('wpopus_preload_bg_color', '#000000');
        $img_width = get_option('wpopus_preload_image_width', 100);
        ?>
        <div id="wpopus-preload">
            <div class="overlay" style="background-color: <?php echo esc_attr($bg_color); ?>">
            </div>
            <img class="preload-img" style="width: <?php echo absint($img_width); ?>px"
                src="<?php echo esc_url($image['url']); ?>" />
        </div>
        <?php

    }

    /**
     * backtotop init functions
     */
    public function backtotop_init()
    {
        $enable_backtotop = get_option('wpopus_backtotop_enable', false);
        $image = get_option('wpopus_backtotop_image', array());

        if (!$enable_backtotop || empty($image)) {
            return;
        }

        $img_width = get_option('wpopus_backtotop_image_width', 25);
        $padding = get_option('wpopus_backtotop_padding', 0);
        $bg_color = get_option('wpopus_backtotop_bg_color', 'transparent');
        $border = get_option('wpopus_backtotop_border', array());
        $border_radius = get_option('wpopus_backtotop_border_radius', 0);
        ?>
        <div id="wpopus-backtotop"
            style="padding:<?php echo absint($padding); ?>px; background-color: <?php echo esc_attr($bg_color); ?>; border-radius:<?php echo absint($border_radius); ?>px; border: <?php echo esc_attr(isset($border['width']) && $border['width'] ? $border['width'] : 0) . ' ' . esc_attr(isset($border['style']) && $border['style'] ? $border['style'] : 'solid') . ' ' . esc_attr(isset($border['color']) && $border['color'] ? $border['color'] : ''); ?>">
            <img class="backtotop-img" style="width: <?php echo absint($img_width); ?>px"
                src="<?php echo esc_url($image['url']); ?>" />
        </div>
        <?php

    }

}
new WpOpus_Structure();
