<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

 if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php 
		$args = array(
		'show_on_front'   => false,
		'show_browse'     => false,
		'container'	=> 'div',
		'list_tag'	=> 'div',
		'item_tag'	=> 'span',
		);

		$output = wpopus_breadcrumb_trail( $args );
		echo wp_kses_post( $output );
	?>
</div>
