import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

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

	return (
		<div { ...useBlockProps.save({ className: 'wpopus-star-rating' }) }>
			<div 
				className='star-rating' 
				style={{ 
					"--wpopus-rating": `${attributes.rating}`,
					"--wpopus-star-content": `"${attributes.options.layout}"`,
					"--wpopus-star-size": `${attributes.options.size}px`,
					"--wpopus-star-basecolor": `${attributes.options.baseColor}`,
					"--wpopus-star-highlightcolor": `${attributes.options.highlightColor}`
				}} 
				title={ __( 'Rating is 2.3 out of 5.', 'wpopus' ) }
			/>
		</div>
	);
}
