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

	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
			<div 
				className="wpopus-progress-bar-item-wrapper"
				style={{
					"--wpopus-progress-bar-item-color": `${ attributes.progressColor }`,
					"--wpopus-progress-bar-item-base-color": `${ attributes.progressBaseColor }`,
					"--wpopus-progress-bar-item-height": `${ attributes.progressHeight }px`,
					"--wpopus-progress-bar-item-value": `${ attributes.progressValue }%`,
				}}
			>
				<span className="wpopus-progress-bar-item-value">{ attributes.progressValue }%</span>
				<span className="wpopus-progress-bar-item" />
			</div>
		</div>
	);
}
