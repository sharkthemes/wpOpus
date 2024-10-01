import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import { useState, useEffect, useRef } from '@wordpress/element';
import { v4 as uuidv4 } from 'uuid';
import SingleBlockTypeAppender from '../utils/appender';
import Controls from './controls';

export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;
	// count
	const [slideList, setSlideList] = useState(1);
	
	// ref for slider div
	const sliderRef = useRef(null);

	if ( ! attributes.carouselID ) {
		const carouselID = 'wpopus-advanced-slider-' + uuidv4();
		setAttributes({ carouselID }); 
	}

	const ALLOWED_BLOCKS = ['wpopus/advanced-slider-item'];
	const TEMPLATE = [['wpopus/advanced-slider-item']];
	const blocksProps = useBlockProps();
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		orientation: "horizontal"
	});

	
	useEffect( () => {
		wp.domReady(() => {
			const blockElement = document.querySelector(`[block-id="${attributes.carouselID}"]`);
			if ( blockElement ) {
				const slideElement = blockElement.querySelectorAll('swiper-slide');
				
				// Access shadow DOM  
				const shadow = blockElement.querySelector('swiper-container').shadowRoot;
				if (shadow) {
					if ( attributes.options.pagination ) {
						if ( "bullets" == attributes.options.paginationType ) {
							const paginationDots = shadow.querySelectorAll('.swiper-pagination-bullet');
							if ( paginationDots ) {
								// Loop through each bullet 
								Array.from(paginationDots).forEach(dot => {
									dot.style.height = attributes.options.paginationSize.top; 
									dot.style.width = attributes.options.paginationSize.left; 
									dot.style.borderRadius = attributes.options.paginationSize.top; 
									dot.style.border = `${attributes.options.paginationBorder.width} ${attributes.options.paginationBorder.style} ${attributes.options.paginationBorder.color}`; 
								});
							}
						} 
						else if ( "fraction" == attributes.options.paginationType ) {
							const paginationFraction = shadow.querySelector('.swiper-pagination-fraction');
							if ( paginationFraction && 'undefined' != paginationFraction ) {
								paginationFraction.style.color = attributes.options.paginationColor;
								paginationFraction.style.fontSize = attributes.options.paginationFractionSize;
								paginationFraction.style.fontWeight = attributes.options.paginationFractionWeight;
							}
						}
					}
					
					if ( attributes.options.navigation ) {
						const navigationControls = shadow.querySelectorAll('.swiper-button-prev, .swiper-button-next');
						if ( navigationControls ) {
							Array.from(navigationControls).forEach(control => {
								control.style.boxSizing = 'border-box'; 
								control.style.backgroundColor = attributes.options.navigationBgColor;
								control.style.height = attributes.options.navigationSize.top; 
								control.style.width = attributes.options.navigationSize.left; 
								control.style.padding = `${attributes.options.navigationPadding.top} ${attributes.options.navigationPadding.right} ${attributes.options.navigationPadding.bottom} ${attributes.options.navigationPadding.left}`; 
								control.style.borderRadius = attributes.options.navigationBorderRadius;
								control.style.border = `${attributes.options.navigationBorder.width} ${attributes.options.navigationBorder.style} ${attributes.options.navigationBorder.color}`; 
							});
						}
					}
				}

				if ( slideElement && slideElement.length != slideList ) {
					sliderRef.current.swiper.update(); 
					setSlideList(slideElement.length);
				}
				
			}
		});

	}, [ innerBlocksProps ] );

	return (
		<div {...innerBlocksProps}>

			<Controls attributes={attributes} setAttributes={setAttributes} />

			<div block-id={attributes.carouselID} className='wpopus-advanced-carousel-wrapper'>
				<swiper-container ref={sliderRef}
					rewind = {true}
					speed = {attributes.options.speed}
					slides-per-view = {1}
					pagination = {attributes.options.pagination} 
					pagination-dynamic-bullets = {attributes.options.pagination && ( "bullets" == attributes.options.paginationType ) ? true : false} 
					pagination-clickable = {attributes.options.pagination && ( "bullets" == attributes.options.paginationType ) ? true : false} 
					pagination-type = {attributes.options.paginationType}
					navigation = {attributes.options.navigation} 
					style= {{
						"--swiper-navigation-color": `${attributes.options.navigationColor}`,
						"--swiper-pagination-color": `${attributes.options.paginationColor}`,
					}}
				>
					{ children }
				</swiper-container>
			</div>


			<BlockControls>
				<SingleBlockTypeAppender
					isPrimary
					buttonText={ __( 'Add Slide', 'wpopus' ) }
					allowedBlock="wpopus/advanced-slider-item"
					clientId={ clientId }
					/>
			</BlockControls>
		</div>
	);
}
