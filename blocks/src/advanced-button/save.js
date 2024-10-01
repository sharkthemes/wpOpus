import { 
	useBlockProps,
	RichText
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

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
		<button { ...useBlockProps.save({ className: `wpopus-advanced-button ${ attributes.options.buttonIconPosition }` }) }>
			{ attributes.buttonUrl ?
				( 
					<a 
						href={ attributes.buttonUrl }
						target={ attributes.options.buttonLinkNewTab ? "_blank" : false }
						rel={ attributes.options.buttonLinkNewTab ? "noopener noreferrer" : false }
					>
						<RichText.Content tagName="span" value={ attributes.buttonContent } />
						<span
							style={{ 
								"--wpopus-advanced-button-icon-size": `${ attributes.options.buttonIconSize }px`,
								"--wpopus-advanced-button-icon-gap": `${ attributes.options.buttonIconGap }px`,
							}}
							className="wpopus-icon"
							dangerouslySetInnerHTML={{ __html: attributes.buttonIcon }}
						/>
					</a> 
				) : (
					<Fragment>
						<RichText.Content tagName="span" value={ attributes.buttonContent } />
						<span
							style={{ 
								"--wpopus-advanced-button-icon-size": `${ attributes.options.buttonIconSize }px`,
								"--wpopus-advanced-button-icon-gap": `${ attributes.options.buttonIconGap }px`,
							}}
							className="wpopus-icon"
							dangerouslySetInnerHTML={{ __html: attributes.buttonIcon }}
						/>
					</Fragment>
				)
			}
		</button>
	);
}
