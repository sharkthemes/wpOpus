import { 
	InnerBlocks,
	useBlockProps
} from '@wordpress/block-editor';
// import { useDispatch, useSelect } from '@wordpress/data';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save() {

	return (
		<div { ...useBlockProps.save({ className: "wpopus-icon-text" }) }>
			<InnerBlocks.Content />
		</div>
	);
}
