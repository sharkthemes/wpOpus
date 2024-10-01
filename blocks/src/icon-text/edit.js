import { __ } from '@wordpress/i18n';
import { 
	useInnerBlocksProps,
	useBlockProps
} from '@wordpress/block-editor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit() {

	const ALLOWED_BLOCKS = [ 'wpopus/icon', 'core/paragraph' ];
	const TEMPLATE = [
		[ 'wpopus/icon' ],
		[ 'core/paragraph', {
			content: __( 'Label', 'wpopus' )
		} ]
	];
	const blocksProps = useBlockProps({ className: `wpopus-icon-text` });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: "insert",
		orientation: "horizontal"
	});

	return (
		<div { ...innerBlocksProps }>
			{ children }
		</div>
	);
}
