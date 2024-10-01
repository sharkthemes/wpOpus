<?php
/**
 * Plugin Name:       	wpOpus
 * Description:       	Supercharge your WordPress site with wpOpus, featuring custom advanced Gutenberg blocks. Import pre-built templates, use one-click demo setup, and enjoy text-to-speech for audio content. Access unlimited Google Fonts, 1300+ icons, animations, hover effects, responsive visibility, infinite scroll, load more, and masonry layouts. Ideal for all skill levels, wpOpus makes creating dynamic websites easy and intuitive. Start exploring today!
 * Requires at least: 	6.1
 * Requires PHP:      	7.0
 * Version:           	1.0.1
 * Author:            	wpOpus
 * License: 			GNU General Public License v3 or later
 * License URI: 		http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       	wpopus
 *
 * @package           	wpOpus
 * @author 				Shark Themes
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

if (!class_exists('wpOpus')) {
	final class wpOpus
	{

		protected static $instance = null;

		public static function get_instance()
		{
			if (is_null(self::$instance)) {
				self::$instance = new self;
			}
			return self::$instance;
		}

		public function __construct()
		{
			$this->constant();
			$this->core_init();
		}

		public function constant()
		{
			global $wp_version;
			define('WPOPUS_WP_VERSION', $wp_version);
			define('WPOPUS_BASE_PATH', dirname(__FILE__));
			define('WPOPUS_URL_PATH', plugin_dir_url(__FILE__));
			define('WPOPUS_PLUGIN_BASE_PATH', plugin_basename(__FILE__));
			define('WPOPUS_PLUGIN_FILE_PATH', (__FILE__));
			define('WPOPUS_LANDING_PAGE_URL', 'https://wpopus.sharkthemes.com/'); // set the demo home url
			define('WPOPUS_DOCUMENTATION_PAGE_URL', 'https://wpopus.sharkthemes.com/documentation/'); // set the documentation page url
			define('WPOPUS_CONTACT_PAGE_URL', 'https://wpopus.sharkthemes.com/contact/'); // set the contact page url
			define('WPOPUS_PLIGIN_VERSION', 'free'); // set the plugin version pro/free
		}

		public function core_init()
		{
			include_once WPOPUS_BASE_PATH . '/include/core.php';
		}

	}
}

if (!function_exists('wpopus')) {
	function wpopus()
	{
		if (function_exists('wpopus_pro')) {
			return;
		}

		return wpOpus::get_instance();
	}
	wpopus();
}
