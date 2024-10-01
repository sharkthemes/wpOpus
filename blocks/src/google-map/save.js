/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
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

	const queryString = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195483892463!2d-122.4194154846826!3d37.77492917975864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c51e77529%3A0x6765db2c7b77d48a!2s${ encodeURIComponent( attributes.mapLocation ) }!5e0!3m2!1sen!2sus!4v1585313331710!5m2!1sen!2sus`;

	return (
		<div { ...useBlockProps.save({ className: `wpopus-google-map` }) }>
			<div className='wpopus-map-wrapper'
				style= {{
					"--wpopus-map-height": `${ attributes.mapHeight }px`,
				}}
			>
				<iframe
					loading="lazy"
					allowFullScreen
					src={ queryString }
				></iframe>
			</div>
		</div>
	);
}
