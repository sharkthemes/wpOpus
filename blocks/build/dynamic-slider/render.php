<?php
/**
 * @see https=//github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

$options = $attributes['options'];
$post_data = $attributes['postData'];
$post_style = $attributes['postStyle'];
$style = '
	--wpopus-image-dynamic-slider-image-height: ' . $post_style['imageHeight'] . 'px;
	--wpopus-image-dynamic-slider-overlay-color: ' . $post_style['overlayColor'] . ';
	--wpopus-image-dynamic-slider-category-font: ' . $post_style['categoryFont'] . ';
	--wpopus-image-dynamic-slider-category-color: ' . $post_style['categoryFontColor'] . ';
	--wpopus-image-dynamic-slider-category-font-size: ' . $post_style['categoryFontSize'] . ';
	--wpopus-image-dynamic-slider-category-font-weight: ' . $post_style['categoryFontWeight'] . ';
	--wpopus-image-dynamic-slider-title-font: ' . $post_style['titleFont'] . ';
	--wpopus-image-dynamic-slider-title-color: ' . $post_style['titleFontColor'] . ';
	--wpopus-image-dynamic-slider-title-font-size: ' . $post_style['titleFontSize'] . ';
	--wpopus-image-dynamic-slider-title-font-weight: ' . $post_style['titleFontWeight'] . ';
	--wpopus-image-dynamic-slider-title-margin: ' . $post_style['titleMargin']['top'] . ' 0 ' . $post_style['titleMargin']['bottom'] . ';
	--wpopus-image-dynamic-slider-excerpt-font: ' . $post_style['excerptFont'] . ';
	--wpopus-image-dynamic-slider-excerpt-color: ' . $post_style['excerptFontColor'] . ';
	--wpopus-image-dynamic-slider-excerpt-font-size: ' . $post_style['excerptFontSize'] . ';
	--wpopus-image-dynamic-slider-excerpt-font-weight: ' . $post_style['excerptFontWeight'] . ';
';
?>
<div <?php echo get_block_wrapper_attributes($attributes); ?>>
	<?php
	$swiper_options = [
		'pagination' => $options['pagination'],
		'paginationHeight' => $options['paginationSize']['top'],
		'paginationWidth' => $options['paginationSize']['left'],
		'paginationBorderWidth' => $options['paginationBorder']['width'],
		'paginationBorderStyle' => $options['paginationBorder']['style'],
		'paginationBorderColor' => $options['paginationBorder']['color'],
		'navigation' => $options['navigation'],
		'navigationBgColor' => $options['navigationBgColor'],
		'navigationHeight' => $options['navigationSize']['top'],
		'navigationWidth' => $options['navigationSize']['left'],
		'navigationPaddingTop' => $options['navigationPadding']['top'],
		'navigationPaddingRight' => $options['navigationPadding']['right'],
		'navigationPaddingBottom' => $options['navigationPadding']['bottom'],
		'navigationPaddingLeft' => $options['navigationPadding']['left'],
		'navigationBorderRadius' => $options['navigationBorderRadius'],
		'navigationBorderWidth' => $options['navigationBorder']['width'],
		'navigationBorderStyle' => $options['navigationBorder']['style'],
		'navigationBorderColor' => $options['navigationBorder']['color'],
	];
	$stringigy_swiper_options = wp_json_encode($swiper_options);

	$break_points = [
		'768' => [
			"slidesPerView" => $options['column'] < 2 ? $options['column'] : 2
		],
		'1024' => [
			"slidesPerView" => $options['column']
		]
	];


	$args = array();
	switch ($post_data['contentType']) {

		case 'latest':
			$args = array(
				'post_type' => 'post',
				'posts_per_page' => absint($post_data['postsCount']),
				'ignore_sticky_posts' => true,
			);
			break;

		case 'post':
			$args = array(
				'post_type' => 'post',
				'post__in' => (array) $post_data['postIds'],
				'ignore_sticky_posts' => true,
			);
			break;

		case 'category':
			$args = array(
				'post_type' => 'post',
				'cat' => absint($post_data['category']),
				'ignore_sticky_posts' => true,
			);
			break;

		case 'page':
			$args = array(
				'post_type' => 'page',
				'post__in' => (array) $post_data['pageIds'],
			);
			break;

		default:
			break;

	}

	// start query
	$query = new WP_Query($args);

	if ($query->have_posts()):
		?>
		<div class="wpopus-dynamic-slider-wrapper <?php echo esc_attr($post_style['designLayout']) . " " . esc_attr($post_style['contentAlign']); ?>"
			style="<?php echo esc_attr($style) ?>">
			<swiper-container data-atts=<?php echo esc_attr($stringigy_swiper_options); ?> class="wpopus-dynamic-carousel"
				style=<?php echo '--swiper-navigation-color:' . esc_attr($options['navigationColor']) . ';--swiper-pagination-color:' . esc_attr($options['paginationColor']); ?> rewind='true' loop='true'
				speed=<?php echo esc_attr($options['speed']); ?> slides-per-view=<?php echo ('center-mode' === $options['layout']) ? 2 : 1; ?> space-between=<?php echo ('center-mode' === $options['layout'] || 'column' === $options['layout'] && 1 < $options['column']) ? esc_attr($options['gap']) : 0; ?> 	<?php echo ('column' === $options['layout']) ? 'breakpoints = ' . wp_json_encode($break_points) : false; ?> 	<?php
																	echo $options['autoplay'] ? 'autoplay = "true"' : false;
																	echo $options['autoplay'] ? 'autoplay-pause-on-mouse-enter = "true"' : false;
																	echo $options['autoplay'] ? 'autoplay-delay = "' . esc_attr($options['autoPlayDelay'] * 1000) . '"' : false;
																	echo $options['pagination'] ? 'pagination = "true"' : false;
																	echo ($options['pagination'] && 'bullets' === $options['paginationType']) ? 'pagination-dynamic-bullets = "true"' : false;
																	echo ($options['pagination'] && 'bullets' === $options['paginationType']) ? 'pagination-clickable = "true"' : false;
																	echo $options['pagination'] ? 'pagination-type = "' . esc_attr($options['paginationType']) . '"' : false;
																	echo $options['scrollbar'] ? 'scrollbar = "true"' : false;
																	echo $options['navigation'] ? 'navigation = "true"' : false;
																	?>>
				<?php while ($query->have_posts()):
					$query->the_post(); ?>
					<swiper-slide>

						<?php if (has_post_thumbnail()): ?>
							<img src="<?php the_post_thumbnail_url('full'); ?>"
								alt="<?php the_title_attribute(array('echo' => true)); ?>" />
						<?php endif; ?>

						<div class="overlay"></div>

						<div class="content-wrapper">

							<?php if (in_array($post_data['contentType'], array('post', 'category', 'latest'))): ?>
								<span class="cat-links">
									<?php the_category(', ', '', get_the_ID()); ?>
								</span>
							<?php endif; ?>

							<h3><a href="<?php the_permalink(); ?>">
									<?php the_title(); ?>
								</a></h3>

							<?php if (0 !== $post_data['excerptLength']): ?>
								<p>
									<?php echo esc_html( wp_trim_words(get_the_excerpt(), $post_data['excerptLength'], "...") ); ?>
								</p>
							<?php endif; ?>

						</div><!-- .content-wrapper -->

					</swiper-slide><!-- .swiper-slide -->
				<?php endwhile; ?>

			</swiper-container><!-- .swiper-container -->
		</div><!-- .wpopus-dynamic-slider-wrapper -->

	<?php endif;
	wp_reset_postdata(); ?>
</div>