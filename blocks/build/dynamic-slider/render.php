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
    --wpopus-image-dynamic-slider-image-height: ' . esc_attr($post_style['imageHeight']) . 'px;
    --wpopus-image-dynamic-slider-overlay-color: ' . esc_attr($post_style['overlayColor']) . ';
    --wpopus-image-dynamic-slider-category-font: ' . esc_attr($post_style['categoryFont']) . ';
    --wpopus-image-dynamic-slider-category-color: ' . esc_attr($post_style['categoryFontColor']) . ';
    --wpopus-image-dynamic-slider-category-font-size: ' . esc_attr($post_style['categoryFontSize']) . ';
    --wpopus-image-dynamic-slider-category-font-weight: ' . esc_attr($post_style['categoryFontWeight']) . ';
    --wpopus-image-dynamic-slider-title-font: ' . esc_attr($post_style['titleFont']) . ';
    --wpopus-image-dynamic-slider-title-color: ' . esc_attr($post_style['titleFontColor']) . ';
    --wpopus-image-dynamic-slider-title-font-size: ' . esc_attr($post_style['titleFontSize']) . ';
    --wpopus-image-dynamic-slider-title-font-weight: ' . esc_attr($post_style['titleFontWeight']) . ';
    --wpopus-image-dynamic-slider-title-margin: ' . esc_attr($post_style['titleMargin']['top']) . ' 0 ' . esc_attr($post_style['titleMargin']['bottom']) . ';
    --wpopus-image-dynamic-slider-excerpt-font: ' . esc_attr($post_style['excerptFont']) . ';
    --wpopus-image-dynamic-slider-excerpt-color: ' . esc_attr($post_style['excerptFontColor']) . ';
    --wpopus-image-dynamic-slider-excerpt-font-size: ' . esc_attr($post_style['excerptFontSize']) . ';
    --wpopus-image-dynamic-slider-excerpt-font-weight: ' . esc_attr($post_style['excerptFontWeight']) . ';
';

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

$stringify_swiper_options = wp_json_encode($swiper_options);

$break_points = [
	'768' => [
		"slidesPerView" => $options['column'] < 2 ? $options['column'] : 2
	],
	'1024' => [
		"slidesPerView" => $options['column']
	]
];

// Autoplay attributes
$autoplay_attributes = '';
if ($options['autoplay']) {
	$autoplay_attributes = 'autoplay=true autoplay-pause-on-mouse-enter=true autoplay-delay=' . esc_attr($options['autoPlayDelay'] * 1000);
}

// Swiper attributes for pagination and navigation
$swiper_attributes = '';
if ($options['pagination']) {
	$swiper_attributes .= 'pagination=true pagination-dynamic-bullets=true pagination-clickable=true pagination-type=bullets ';
}
if ($options['navigation']) {
	$swiper_attributes .= 'navigation=true ';
}

// Query args based on content type
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

if ($query->have_posts()): ?>
	<div <?php echo get_block_wrapper_attributes(); ?>>
		<div class="wpopus-dynamic-slider-wrapper <?php echo esc_attr($post_style['designLayout']) . " " . esc_attr($post_style['contentAlign']); ?>"
			style="<?php echo esc_attr($style); ?>">
			<swiper-container data-atts="<?php echo esc_attr($stringify_swiper_options); ?>" class="wpopus-dynamic-carousel"
				style="<?php echo '--swiper-navigation-color:' . esc_attr($options['navigationColor']) . '; --swiper-pagination-color:' . esc_attr($options['paginationColor']); ?>"
				rewind="true" loop="true" speed="<?php echo esc_attr($options['speed']); ?>"
				slides-per-view="<?php echo esc_attr($options['column']); ?>"
				space-between="<?php echo (1 < $options['column']) ? esc_attr($options['gap']) : 0; ?>"
				breakpoints='<?php echo wp_json_encode($break_points); ?>' <?php echo esc_attr($autoplay_attributes); ?>
				<?php echo esc_attr($swiper_attributes); ?>>
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
									<?php echo esc_html(wp_trim_words(get_the_excerpt(), $post_data['excerptLength'], "...")); ?>
								</p>
							<?php endif; ?>
						</div><!-- .content-wrapper -->
					</swiper-slide><!-- .swiper-slide -->
				<?php endwhile; ?>
			</swiper-container><!-- .swiper-container -->
		</div><!-- .wpopus-dynamic-slider-wrapper -->
	</div>
<?php endif;
wp_reset_postdata(); ?>
</div>