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

	const TEMPLATE = [
		[ 'core/heading', { 
			content: __( 'Accordion Title', 'wpopus' ),
			level: 3,
            className: 'accordion-heading',
			lock: {
				remove: true,
				move: true,
			}
		} ],
		[ 'core/group', { 
			className: 'accordion-details',
			supports: {
				align: ["full", "wide"]
			},
			lock: {
				remove: true,
				move: true,
			}
			},
			[[ 'core/paragraph', {
				content: __( 'Accordion Description', 'wpopus' )
			} ]]
		]
	];

	return (
		<div { ...useBlockProps({className: "wpopus-accordion-item active"}) }>
			<InnerBlocks
				template={TEMPLATE}
			/>
		</div>
	);
}
