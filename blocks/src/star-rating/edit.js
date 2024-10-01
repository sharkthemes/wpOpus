import { __ } from '@wordpress/i18n';
import { 
	useBlockProps,
	InspectorControls
} from '@wordpress/block-editor';
import { 
	Panel,
	PanelBody,
	RangeControl,
	ColorPalette,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';

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

	function setOption(key, value) {
		setAttributes( { [key]: value } ); 
	}

	function setMetaOption(key, value) {
		setAttributes( { "options": {
			...attributes.options,
			[key]: value
		} } ); 
	}

	return (
		<div { ...useBlockProps({ className: 'wpopus-star-rating' }) }>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={__('Star Rating Settings', 'wpopus')} initialOpen={true}>

						<fieldset>
							<RangeControl 
								label={ __( 'Star Rating', 'wpopus' ) }
								value={ attributes.rating } 
								min={0}
								max={5}
								step={0.1}
								onChange={ (newValue) => {
									setOption( 'rating', parseFloat( newValue ) );
								} } 
							/>
						</fieldset>

						<br/>
						<fieldset>
							<ToggleGroupControl 
								label={ __( 'Star Layout', 'wpopus' ) }
								value={ attributes.options.layout }
								isBlock
								onChange={ (newValue) => {
									setMetaOption( 'layout', newValue );
								} }
								>
								<ToggleGroupControlOption value="★★★★★" label={ __( 'Filled', 'wpopus' ) } />
								<ToggleGroupControlOption value="☆☆☆☆☆" label={ __( 'Outline', 'wpopus' ) } />
							</ToggleGroupControl>
						</fieldset>

						<br/>
						<fieldset>
							<RangeControl 
								label={ __( 'Star Size', 'wpopus' ) }
								value={ attributes.options.size } 
								min={10}
								max={100}
								onChange={ (newValue) => {
									setMetaOption( 'size', newValue );
								} } 
							/>
						</fieldset>

						<br/>
						<label className='inspector-control-label'>
							{ __( 'Star Base Color', 'wpopus' ) }
							<ColorPalette
								className='wpopus-color-palette'
								clearable={false}
								enableAlpha={false}
								value={ attributes.options.baseColor }
								onChange={ (newValue) => {
									setMetaOption('baseColor', newValue );
								} }
							/>
						</label>

						<br/>
						<label className='inspector-control-label'>
							{ __( 'Star Highlight Color', 'wpopus' ) }
							<ColorPalette
								className='wpopus-color-palette'
								clearable={false}
								enableAlpha={false}
								value={ attributes.options.highlightColor }
								onChange={ (newValue) => {
									setMetaOption('highlightColor', newValue );
								} }
							/>
						</label>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<div 
				className='star-rating' 
				style={{ 
					"--wpopus-rating": `${attributes.rating}`,
					"--wpopus-star-content": `"${attributes.options.layout}"`,
					"--wpopus-star-size": `${attributes.options.size}px`,
					"--wpopus-star-basecolor": `${attributes.options.baseColor}`,
					"--wpopus-star-highlightcolor": `${attributes.options.highlightColor}`
				}} 
				title={ __( 'Rating is 2.3 out of 5.', 'wpopus' ) }
			/>
		</div>
	);
}
