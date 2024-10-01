import { 
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles
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
	const borderProps = getBorderClassesAndStyles( attributes );
	const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );

	const iconStyle = {
		...borderProps.style,
		...colorProps.style,
		...spacingProps.style,
	};

	return (
		<div { ...useBlockProps.save() }
			style={ iconStyle }
		>
			{ attributes.iconUrl ?
				(
					<a 
						href={ attributes.iconUrl }
						target={ attributes.options.iconLinkNewTab ? "_blank" : false }
						rel={ attributes.options.iconLinkNewTab ? "noopener noreferrer" : false }
					>
						<span
							style={
								{ 
									height:`${ attributes.options.iconSize}px`,
									width:`${ attributes.options.iconSize}px`,
								}
							}
							className="wpopus-icon"
							dangerouslySetInnerHTML={{ __html: attributes.iconValue }}
						/>
					</a>
				) : (
					<span
						style={
							{ 
								height:`${ attributes.options.iconSize}px`,
								width:`${ attributes.options.iconSize}px`,
							}
						}
						className="wpopus-icon"
						dangerouslySetInnerHTML={{ __html: attributes.iconValue }}
					/>
				)
			}
				
		</div>
	);
}
