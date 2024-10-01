<?php
/**
 * @package wpOpus
 * @category Core
 * @author wpOpus
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

class WpOpus_Core
{

	public function __construct()
	{
		if (!defined('WPOPUS_USER_CAN')) {
			define('WPOPUS_USER_CAN', false);
		}
		
		if (!defined('WPOPUS_TOKEN')) {
			define('WPOPUS_TOKEN', '');
		}

		self::init();
	}

	public function init()
	{
		$this->register();
		add_action('after_setup_theme', array($this, 'theme_constant'));
		add_action('init', array($this, 'blocks_init'));
		add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_script'));
		add_filter('block_categories_all', array($this, 'register_block_category'), 10, 2);
		add_action('wp_enqueue_scripts', array($this, 'enqueue_script'));
		add_action('enqueue_block_editor_assets', array($this, 'editor_enqueue_scripts'));
		add_action('enqueue_block_editor_assets', array($this, 'components_enqueue_scripts'));
		add_action('enqueue_block_editor_assets', array($this, 'variations_enqueue_scripts'), 10);
	}
	/**
	 * theme constants
	 */
	public static function theme_constant( $args = array() ) {
		$defaults = array(
			'theme_name'	=> 'wpOpus FSE',
			'theme_author'	=> 'Shark Themes',
			'demo_and_template_route_url' => 'https://wpopus.sharkthemes.com',
		);

		$theme_args = wp_parse_args( apply_filters( 'wpopus_theme_constant_filter', $args ), $defaults );
		return $theme_args;
	}

	/**
	 * register functions
	 */
	public function register()
	{
		include_once WPOPUS_BASE_PATH . '/include/breadcrumb.php';
		include_once WPOPUS_BASE_PATH . '/include/routes.php';
		include WPOPUS_BASE_PATH . '/include/function.php';
		include WPOPUS_BASE_PATH . '/include/structure.php';
		include_once WPOPUS_BASE_PATH . '/include/setting.php';
		include_once WPOPUS_BASE_PATH . '/include/demo-import/xml-importer.php';
		include WPOPUS_BASE_PATH . '/include/demo-import/demo-import.php';
	}

	/*
	 * register vendor scripts
	 */
	public function register_vendor_script()
	{
		// swiper css
		wp_register_style('swiper-style', WPOPUS_URL_PATH . 'assets/vendor/swiper/css/swiper-bundle.min.css');

		// swiper slider js
		wp_register_script('swiper-script', WPOPUS_URL_PATH . 'assets/vendor/swiper/js/swiper-element-bundle.min.js', '', '', true);

	}

	/*
	 * enqueue scripts
	 */
	public function enqueue_script()
	{
		self::register_vendor_script();

		// Load style
		wp_enqueue_style('wpopus-style', WPOPUS_URL_PATH . 'assets/css/style.css');

		// Load custom script
		wp_enqueue_script('wpopus-script', WPOPUS_URL_PATH . 'assets/js/custom.js', array('jquery'), '1.0.0', true);

	}

	/*
	 * admin enqueue scripts
	 */
	public function admin_enqueue_script($hook)
	{
		self::register_vendor_script();

		// Load admin setting script
		if ($hook === "toplevel_page_wpopus") {
			// admin settings css
			wp_enqueue_style('wpopus-admin-settings-style', WPOPUS_URL_PATH . 'assets/css/admin-setting.css');

			wp_enqueue_media();

			// settings js
			wp_register_script('wpopus-admin-settings', WPOPUS_URL_PATH . 'blocks/admin/settings/index.js', array('wp-dom-ready', 'wp-element', 'wp-api-fetch', 'wp-components', 'wp-i18n'), '', true);
			wp_localize_script(
				'wpopus-admin-settings',
				'wpOpus',
				array(
					'landing_page_url' => WPOPUS_LANDING_PAGE_URL,
					'documentation_url' => WPOPUS_DOCUMENTATION_PAGE_URL,
					'contact_url' => WPOPUS_CONTACT_PAGE_URL,
					'plugin_version' => WPOPUS_PLIGIN_VERSION,
				)
			);
			wp_enqueue_script('wpopus-admin-settings');
		}

		if ($hook === "wpopus_page_wpopus-demo") {
			// demo admin css
			wp_enqueue_style('wpopus-admin-demo-style', WPOPUS_URL_PATH . 'assets/css/admin-demo.css');

			// demo importer js
			wp_register_script('wpopus-admin-demo-importer', WPOPUS_URL_PATH . 'blocks/admin/demo-import/index.js', array('wp-dom-ready', 'wp-element', 'wp-api-fetch', 'wp-components', 'wp-i18n'), '', true);

			// Generate a nonce and pass it to the script
			$nonce = wp_create_nonce('wpopus_import_demo_nonce');
			$theme_constant = self::theme_constant();
			wp_localize_script(
				'wpopus-admin-demo-importer',
				'wpOpus',
				array(
					'ajax_url' => admin_url('admin-ajax.php'),
					'import_demo_nonce' => $nonce,
					'template_url' => $theme_constant['demo_and_template_route_url'],
					'plugin_version' => WPOPUS_PLIGIN_VERSION,
					'token' => WPOPUS_TOKEN,
					'user_can' => WPOPUS_USER_CAN,
				)
			);
			wp_enqueue_script('wpopus-admin-demo-importer');

		}
	}

	/*
	 * enqueue block editor scripts
	 */
	public function editor_enqueue_scripts()
	{

		self::register_vendor_script();

		// swiper css
		wp_enqueue_style('swiper-style');

		// editor css
		wp_enqueue_style('wpopus-editor-style', WPOPUS_URL_PATH . 'assets/css/editor.css');

		// swiper slider js
		wp_enqueue_script('swiper-script');

	}

	/*
	 * enqueue component scripts
	 */
	public function components_enqueue_scripts()
	{

		// hover effect control js
		wp_enqueue_script('wpopus-hover-effect', WPOPUS_URL_PATH . 'blocks/component/hover-effect/index.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), '', true);

		// responsive control js
		wp_enqueue_script('wpopus-responsive', WPOPUS_URL_PATH . 'blocks/component/responsive/index.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), '', true);

		// init component features
		wp_enqueue_script('wpopus-component-init', WPOPUS_URL_PATH . 'blocks/component/init/index.js', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), '', true);

		// pattern importer
		wp_register_script('wpopus-pattern-importer', WPOPUS_URL_PATH . 'blocks/component/pattern-importer/index.js', array('wp-blocks', 'wp-dom-ready', 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components'), '', true);
		
		$theme_constant = self::theme_constant();
		// pass url for templates and demo routes
		wp_localize_script(
			'wpopus-pattern-importer',
			'wpOpus',
			array(
				'template_url' => $theme_constant['demo_and_template_route_url'],
				'theme_name' => $theme_constant['theme_name'],
				'theme_author' => $theme_constant['theme_author'],
				'plugin_version' => WPOPUS_PLIGIN_VERSION,
				'token' => WPOPUS_TOKEN,
				'user_can' => WPOPUS_USER_CAN,
			)
		);
		wp_enqueue_script('wpopus-pattern-importer');

	}

	/*
	 * enqueue variation scripts
	 */
	public function variations_enqueue_scripts()
	{

		// advanced query loop control js
		wp_enqueue_script('wpopus-advanced-query-loop', WPOPUS_URL_PATH . 'blocks/variation/advanced-query/index.js', array('wp-i18n', 'wp-blocks', 'wp-dom-ready', 'wp-edit-post'), '', true);

	}

	/*
	 * register block categories
	 */
	public function register_block_category($block_categories)
	{
		array_unshift(
			$block_categories,
			array(
				'slug' => 'wpopus',
				'title' => __('wpOpus', 'wpopus')
			)
		);
		return $block_categories;
	}

	/*
	 * register block names
	 */
	public static function get_blocks_names()
	{
		$blocks = array(
			'header-search',
			'breadcrumb',
			'advanced-slider-item',
			'advanced-slider',
			'accordion',
			'accordion-item',
			'advanced-button',
			'icon',
			'icon-picker',
			'icon-text',
			'service',
			'marquee',
			'star-rating',
			'counter',
			'dynamic-slider',
			'progress-bars',
			'progress-bar-item',
			'google-map',
			'shape-divider-cover',
		);

		sort($blocks);
		return $blocks;
	}

	/*
	 * register blocks
	 */
	public function blocks_init()
	{
		foreach (self::get_blocks_names() as $block_name) {
			register_block_type(WPOPUS_BASE_PATH . '/blocks/build/' . $block_name);
		}
	}

}
new WpOpus_Core();
