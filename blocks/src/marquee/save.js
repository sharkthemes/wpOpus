import { 
	InnerBlocks, 
	useBlockProps 
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
	const pauseOnHover = attributes.options.pauseOnHover ? "pause-on-hover" : "";

	return (
		<div { ...useBlockProps.save({ className:`wpopus-marquee ${ pauseOnHover }` }) }>
			<marquee scrollamount={ attributes.options.speed } direction={ attributes.options.direction } behavior={ attributes.options.behavior }>
				<div className='wpopus-marquee-items'>
					<InnerBlocks.Content />
				</div>
			</marquee>
	  	</div>
	);
}
