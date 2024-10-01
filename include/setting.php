<?php
/**
 * @package wpOpus
 * @category Setting
 * @author wpOpus
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class WpOpus_Setting
{

    // main menu slug
    public $page_slug = 'wpopus';

    // demo import sub menu slug
    public $demo_page_slug = 'wpopus-demo';
    public $option_group = 'wpopus_options_group';
    public $setting_id = 'wpopus_options';


    public function __construct()
    {
        self::init();
    }

    public function init()
    {
        add_action('admin_menu', array($this, 'add_menu'), 1);
        add_action('admin_init', array($this, 'settings_fields'));
        add_action('admin_head', array($this, 'remove_all_notice'), 10);
    }

    public function add_menu()
    {
        add_menu_page(
            __('wpOpus', 'wpopus'),
            __('wpOpus', 'wpopus'),
            'manage_options',
            $this->page_slug,
            array($this, 'page_callback'),
            'dashicons-screenoptions',
            59
        );

        add_submenu_page(
            $this->page_slug, // parent slug
            __('Demo Import', 'wpopus'), // page title
            __('Demo Import', 'wpopus'), // menu title
            'manage_options', // capability
            $this->demo_page_slug, // menu slug
            array($this, 'demo_page_callback') // callback function
        );

    }

    public function remove_all_notice()
    {
        $current_screen = get_current_screen();

        if (in_array($current_screen->id, array('toplevel_page_wpopus', 'wpopus_page_wpopus-demo'))) {
            remove_all_actions('admin_notices');
            remove_all_actions('all_admin_notices');
        }
    }

    public function page_callback()
    {
        $page_title = get_admin_page_title(); ?>
        <h1><?php echo esc_html($page_title); ?></h1>

        <div class="wpopus-setting-wrapper wrap">
            <div id="wpopus-settings"></div>
        </div><!-- .wrapper -->
        <?php
    }

    public function demo_page_callback()
    {
        $theme_constant = WpOpus_Core::theme_constant();
        $page_title = get_admin_page_title(); ?>
        <h1 class="wpopus-admin-page-title">
            <?php printf('%1$s %2$s %3$s', $page_title, __('For', 'wpopus'), esc_html($theme_constant['theme_name'])); ?>
            <small
                class="wpopus-admin-page-title-author"><?php // printf( '%1$s %2$s', __('By', 'wpopus'), esc_html( $theme_constant['author_name'] ) ); ?></small>
        </h1>

        <div class="wpopus-demo-setting-wrapper wrap">
            <div id="wpopus-demo-import"></div>
        </div>
        <?php
    }

    public function settings_fields()
    {

        /*
         * Register Section
         */
        add_settings_section(
            $this->setting_id,
            '',
            '__return_false',
            $this->page_slug
        );

    }

    public function sanitize_boolean($input)
    {
        return $input ? 1 : 0;
    }

}

new WpOpus_Setting();