import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { 
	Panel,
	PanelBody,
	Icon,
	TextControl,
	ToggleControl,
	RangeControl,
	ColorPalette,
	Spinner,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';
import { Fragment, useState, useEffect } from '@wordpress/element';
import { wpOpusGetShapeDividers } from '../utils/get-icons';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(props) {
	const { attributes, setAttributes } = props;

	const [icons, setIcons] = useState([]); // Initialize with empty array

	// icons popup
	const [ isVisible, setIsVisible ] = useState( false );
	const toggleVisible = () => {
		setIsVisible( ( state ) => ! state );
	};

	// config icons
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	function setOption(key, value) {
		setAttributes( { [key]: value } ); 
	}

	function setMetaOption(key, value) {
		setAttributes( { "options": {
			...attributes.options,
			[key]: value
		} } ); 
	}

	useEffect(() => {
		setError(null);

		wpOpusGetShapeDividers()
		.then(data => {
			setIcons(data);
		})
		.catch(error => {
			setError(error);
		})
		.finally(() => {
			setIsLoading(false);
		});

	}, []);

	const ALLOWED_BLOCKS = ['core/cover'];
	const TEMPLATE = [
		['core/cover', {
			lock: {
				remove: true,
				move: true,
			}
		}]
	];
	const blocksProps = useBlockProps({ className: `wpopus-shape-divider-cover` });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		orientation: "horizontal",
		renderAppender: false
	});

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={__('Shape Divider Settings', 'wpopus')} initialOpen={true}>
						{error && <p>{__('Error Fetching Shape Dividers:', 'wpopus')} {error.message}</p>}
						{Array.isArray(icons) && 
							<Fragment>
								<fieldset className='st-toggle-shape-divider-icons' onClick={ toggleVisible }>
									<span>{ __( 'List Shape Dividers', 'wpopus' ) }</span>
									<Icon icon="screenoptions" />	
								</fieldset>

								{ ! isVisible && attributes.shapeDividerValue &&
									<span
										className="st-selected-shape-divider-icon"
										dangerouslySetInnerHTML={{ __html: attributes.shapeDividerValue }}
									/>
								}

								{ isVisible && 
									<Fragment>

										{ isLoading && 
											<h3>{ __( 'Loading Shape Dividers', 'wpopus' )} <Spinner /></h3>
										}

										<div className='st-shape-divider-icons-list'>
											{ ! isLoading && icons.map(icon => (
												<a href="#"
													icon-value={ icon.value.value }
													onClick={ (event) => {
														event.preventDefault();
														setOption('shapeDividerValue', event.currentTarget.getAttribute('icon-value') );
														setOption('shapeDividerName', event.currentTarget.getAttribute('title') );
														setIsVisible(false);
													} }
												>
													<span 
														className={`${icon.value.label}`} 
														dangerouslySetInnerHTML={{ __html: icon.value.value }} 
													/>
												</a>
											))}
										</div> 
									</Fragment>
								}
							</Fragment>
						}
					</PanelBody>

					<PanelBody title={__('Shape Divider Style', 'wpopus')}>
						<fieldset>
							<RangeControl 
								label={ __( 'Height (px)', 'wpopus' ) }
								value={ attributes.options.shapeDividerHeight } 
								min={0}
								max={500}
								onChange={ (newValue) => {
									setMetaOption('shapeDividerHeight', parseInt(newValue) );
								} } 
							/>
						</fieldset>

						<br/>
						<fieldset>
							<RangeControl 
								label={ __( 'Width (%)', 'wpopus' ) }
								value={ attributes.options.shapeDividerWidth } 
								min={100}
								max={300}
								onChange={ (newValue) => {
									setMetaOption('shapeDividerWidth', parseInt(newValue) );
								} } 
							/>
						</fieldset>

						<br/>
						<label className='inspector-control-label'>
							{ __( 'Color', 'wpopus' ) }
							<ColorPalette
								className='wpopus-color-palette'
								clearable={false}
								enableAlpha={false}
								value={ attributes.options.shapeDividerColor }
								onChange={ (newValue) => {
									setMetaOption('shapeDividerColor', newValue );
								} }
							/>
						</label>

						<br/>
						<fieldset>
							<ToggleGroupControl
								label={ __( 'Placement', 'wpopus' ) }
								value={ attributes.options.shapeDividerPlacement }
								isBlock
								onChange={ (newValue) => {
									setMetaOption('shapeDividerPlacement', newValue );
								} }
								>
								<ToggleGroupControlOption value="top-placement" label={ __( 'Top', 'wpopus' ) } />
								<ToggleGroupControlOption value="bottom-placement" label={ __( 'Bottom', 'wpopus' ) } />
							</ToggleGroupControl>
						</fieldset>

						<br/>
						<fieldset>
							<ToggleControl
								label={ __( 'Flip Horizontal', 'wpopus' ) }
								className="wpopus-toggle-control"
								checked={ attributes.options.shapeDividerFlipHorizontal }
								onChange={ (newValue) => {
									setMetaOption('shapeDividerFlipHorizontal', newValue );
								} }
							/>
						</fieldset>

						<br/>
						<fieldset>
							<ToggleControl
								label={ __( 'Flip Vertical', 'wpopus' ) }
								className="wpopus-toggle-control"
								checked={ attributes.options.shapeDividerFlipVertical }
								onChange={ (newValue) => {
									setMetaOption('shapeDividerFlipVertical', newValue );
								} }
							/>
						</fieldset>

					</PanelBody>
				</Panel>
			</InspectorControls>

			{ children }
			
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
