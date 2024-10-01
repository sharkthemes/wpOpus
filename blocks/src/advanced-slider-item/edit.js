import { __ } from '@wordpress/i18n';
import { 
	InnerBlocks,
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

	const ALLOWED_BLOCKS = ['core/cover'];
	const TEMPLATE = [['core/cover']];

	return (
		<swiper-slide {...useBlockProps()}>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				template={TEMPLATE}
				/>
		</swiper-slide>
	);
}
