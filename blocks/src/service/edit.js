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
		[ 'core/group', { 
			className: 'wpopus-service-wrapper',
			lock: {
				remove: true,
				move: true,
			}
			},
			[
				[ 'wpopus/icon-picker' ],
				[ 'core/group', { 
					lock: {
						remove: true,
						move: true,
					}
					},
					[
						[ 'core/heading', { 
							content: __( 'Service Title', 'wpopus' ),
							level: 3,
						} ],
						[ 'core/paragraph', {
							content: __( 'Service Description', 'wpopus' )
						} ]
					]
				]
			]
		]
	];

	return (
		<div { ...useBlockProps({ className: "wpopus-service" }) }>
			<InnerBlocks
				template={TEMPLATE}
			/>
		</div>
	);
}
