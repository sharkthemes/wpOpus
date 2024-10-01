import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
	useInnerBlocksProps,
	BlockControls,
} from '@wordpress/block-editor';
import SingleBlockTypeAppender from '../utils/appender';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(props) {
	const { clientId } = props;

	const ALLOWED_BLOCKS = ['wpopus/progress-bar-item'];
	const TEMPLATE = [['wpopus/progress-bar-item']];
	const blocksProps = useBlockProps({ className: `wpopus-progress-bars` });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
	});

	return (
		<div { ...innerBlocksProps } >
			{ children }

			<BlockControls>
				<SingleBlockTypeAppender
					isPrimary
					buttonText={ __("Add New Bar", "wpopus") }
					allowedBlock="wpopus/progress-bar-item"
					clientId={ clientId }
					/>
			</BlockControls>
		</div>
	);
}
