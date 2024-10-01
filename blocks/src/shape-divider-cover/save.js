import { 
    useBlockProps,
	InnerBlocks,
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
		<div { ...useBlockProps.save({ className: `wpopus-shape-divider-cover` }) }>

			<InnerBlocks.Content />

			<span
				style={{
					"--wpopus-shape-divider-height": `${attributes.options.shapeDividerHeight}px`,
					"--wpopus-shape-divider-width": `${attributes.options.shapeDividerWidth}%`,
					"--wpopus-shape-divider-color": `${attributes.options.shapeDividerColor}`,
				}}
				className={ `wpopus-icon ${ attributes.options.shapeDividerFlipVertical ? 'flip-vertical' : '' } ${ attributes.options.shapeDividerFlipHorizontal ? 'flip-horizontal' : '' } ${ attributes.options.shapeDividerPlacement }` }
				dangerouslySetInnerHTML={{ __html: attributes.shapeDividerValue }}
			/>
		</div>
	);
}
