<?php
/**
 * @package wpOpus
 * @category API Routes
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

class WpOpus_Routes
{
	protected $namespace = 'wpopus/v1';
	protected $base1 = 'icons'; // get list of icons
	protected $base2 = 'icon'; // get single icon
	protected $base3 = 'shapedividers'; // get list of svg borders
	protected $base5 = 'updateoption'; // update setting option
	protected $base6 = 'getoptions'; // get setting options

	public function __construct()
	{
		$this->init();
	}

	public function init()
	{
		add_action('rest_api_init', array($this, 'register_routes'));
	}

	public function register_routes()
	{
		register_rest_route($this->namespace, '/' . $this->base1, array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array($this, 'get_ionicons_svg'),
				'permission_callback' => '__return_true',
			)
		)
		);

		register_rest_route($this->namespace, '/' . $this->base2 . '/(?P<file_name>[a-zA-Z0-9-]+)', array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array($this, 'get_single_ionicon_svg'),
				'permission_callback' => '__return_true'
			)
		)
		);

		register_rest_route($this->namespace, '/' . $this->base3, array(
			array(
				'methods' => WP_REST_Server::READABLE,
				'callback' => array($this, 'get_shape_dividers_svg'),
				'permission_callback' => '__return_true',
			)
		)
		);

		register_rest_route($this->namespace, '/' . $this->base5, array(
			'methods' => 'POST',
			'callback' => array($this, 'update_setting_option'),
			'permission_callback' => function () {
				return current_user_can('manage_options'); // Adjust capability as needed
			}
		)
		);

		register_rest_route($this->namespace, '/' . $this->base6, array(
			'methods' => WP_REST_Server::READABLE,
			'callback' => array($this, 'get_setting_options'),
			'permission_callback' => function () {
				return current_user_can('manage_options'); // Adjust capability as needed
			}
		));
	}

	// get list of icons
	public function get_ionicons_svg()
	{
		$svg_dir = WPOPUS_BASE_PATH . '/assets/vendor/ionicons';
		$icons = array();
		$files = scandir($svg_dir);
		foreach ($files as $file) {
			$filePath = $svg_dir . '/' . $file;
			if (is_file($filePath)) {
				$icons[] = [
					'label' => pathinfo($file, PATHINFO_FILENAME),
					'value' => file_get_contents($filePath)
				];
			}
		}

		return new WP_REST_Response($icons, 200);
	}

	// get single icon
	public function get_single_ionicon_svg(WP_REST_Request $request)
	{
		$file_name = $request->get_param('file_name');
		$svg = WPOPUS_BASE_PATH . '/assets/vendor/ionicons/' . sanitize_file_name($file_name) . '.svg';
		if (is_file($svg)) {
			$svg_data = file_get_contents($svg);
			return new WP_REST_Response($svg_data, 200);
		}

		return new WP_REST_Response(
			array(
				'valid' => false,
				'error' => __("SVG not found!", 'wpopus')
			),
			404
		);
	}

	// get list of svg shape dividers
	public function get_shape_dividers_svg()
	{
		$svg_dir = WPOPUS_BASE_PATH . '/assets/shape-divider';
		$shapes = array();
		$files = scandir($svg_dir);
		foreach ($files as $file) {
			$filePath = $svg_dir . '/' . $file;
			if (is_file($filePath)) {
				$shapes[] = [
					'label' => pathinfo($file, PATHINFO_FILENAME),
					'value' => file_get_contents($filePath)
				];
			}
		}

		return new WP_REST_Response($shapes, 200);
	}

	// update setting options
	public function update_setting_option(WP_REST_Request $request) {
		$option_name = $request->get_param('option_name');
		$option_value = $request->get_param('option_value');
	
		if (empty($option_name) || $option_value === null) {
			return new WP_Error('missing_parameters', __('Option name and value are required', 'wpopus'), array('status' => 400));
		}
	
		$result = update_option($option_name, $option_value);
	
		if ($result === false) {
			return new WP_Error('update_failed', __('Failed to update option', 'wpopus'), array('status' => 500));
		}
	
		return new WP_REST_Response($result, 200);
	}
	

	// get setting options
	public function get_setting_options(WP_REST_Request $request) {
		$option_names = $request->get_param('option_names');
		$option_names = json_decode($option_names);

		if (empty($option_names)) {
			return new WP_Error('invalid_option_names', __('Invalid option names format', 'wpopus'), array('status' => 400));
		}
	
		$return_data = array();
		foreach ($option_names as $option_name) {
			$data['name'] = $option_name;
			$data['value'] = get_option($option_name, '');
			array_push( $return_data, $data );
		}
	
		return new WP_REST_Response($return_data, 200);
	}
	

}

new WpOpus_Routes();
