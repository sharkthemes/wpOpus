/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InnerBlocks
} from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save(props) {
	const { attributes } = props;

	const swiperOptions = {
		pagination: attributes.options.pagination,
		paginationType: attributes.options.paginationType,
		paginationHeight: attributes.options.paginationSize.top,
		paginationWidth: attributes.options.paginationSize.left,
		paginationBorder: `${attributes.options.paginationBorder.width} ${attributes.options.paginationBorder.style} ${attributes.options.paginationBorder.color}`,
		paginationFractionFontSize: attributes.options.paginationFractionSize,
		paginationFractionFontWeight: attributes.options.paginationFractionWeight,
		navigation: attributes.options.navigation,
		navigationBgColor: attributes.options.navigationBgColor,
		navigationHeight: attributes.options.navigationSize.top,
		navigationWidth: attributes.options.navigationSize.left,
		navigationPadding: `${attributes.options.navigationPadding.top} ${attributes.options.navigationPadding.right} ${attributes.options.navigationPadding.bottom} ${attributes.options.navigationPadding.left}`,
		navigationBorderRadius: attributes.options.navigationBorderRadius,
		navigationBorder: `${attributes.options.navigationBorder.width} ${attributes.options.navigationBorder.style} ${attributes.options.navigationBorder.color}`,
	};

	const stringifiedSwiperOptions = JSON.stringify(swiperOptions);

	const swiperConfig = {
		"rewind": 'true',
		"auto-height": 'true',
		"speed": attributes.options.speed,
		"loop": 'true',
		"autoplay": attributes.options.autoplay ? 'true' : false,
		"autoplay-pause-on-mouse-enter": attributes.options.autoplay ? 'true' : false,
		"autoplay-delay": attributes.options.autoplay ? attributes.options.autoPlayDelay * 1000 : false,
		"slides-per-view": 1,
		"pagination": attributes.options.pagination ? 'true' : false,
		"pagination-dynamic-bullets": attributes.options.pagination && attributes.options.paginationType === 'bullets' ? 'true' : false,
		"pagination-clickable": attributes.options.pagination && attributes.options.paginationType === 'bullets' ? 'true' : false,
		"pagination-type": attributes.options.pagination ? attributes.options.paginationType : false,
		"scrollbar": false,
		"effect": 'linear',
		"navigation": attributes.options.navigation ? 'true' : false,
	};

	const filteredSwiperConfig = Object.fromEntries(
		Object.entries(swiperConfig).filter(([key, value]) => value !== false)
	);

	return (
		<div { ...useBlockProps.save() }>
			<div id={attributes.carouselID} className='wpopus-advanced-carousel-wrapper'>
				<swiper-container 
					data-atts={stringifiedSwiperOptions}
					className="wpopus-carousel"
					{...filteredSwiperConfig}
					style={{
						"--swiper-navigation-color": attributes.options.navigationColor,
						"--swiper-pagination-color": attributes.options.paginationColor,
					}}
				>
					<InnerBlocks.Content />
				</swiper-container>
			</div>
		</div>
	);
}
