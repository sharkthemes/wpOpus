import { __ } from "@wordpress/i18n";
import {
	useInnerBlocksProps,
	useBlockProps,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	Panel,
	PanelBody,
	ColorPalette,
	RangeControl,
} from "@wordpress/components";

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

	const ALLOWED_BLOCKS = ['core/heading'];
	const TEMPLATE = [
		[ 'core/heading', { 
			content: __( 'Progress Bar Title', 'wpopus' ),
			level: 5,
			className: "wpopus-progress-bar-item-title"
		} ]
	];

	const blocksProps = useBlockProps();
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		templateLock: "all"
	});

	function setOption(key, value) {
		setAttributes({ [key]: value });
	}

	return (
		<div { ...innerBlocksProps }>
			<InspectorControls>
				<Panel key="setting">
					<PanelBody title={ __( 'Progress Bar Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<RangeControl 
								label={ __( "Value in Percent", "wpopus" ) }
								value={ attributes.progressValue }
								min={0}
								max={100}
								onChange={ (newValue) => {
									setOption( 'progressValue', parseInt(newValue) )
								} }
							/>
						</fieldset>

						<br/>
						<fieldset>
							<RangeControl 
								label={ __( "Bar Height", "wpopus" ) }
								value={ attributes.progressHeight }
								min={0}
								max={100}
								onChange={ (newValue) => {
									setOption( 'progressHeight', parseInt(newValue) )
								} }
							/>
						</fieldset>

						<br/>
						<label className='inspector-control-label'>
							{ __( 'Bar Color', 'wpopus' ) }
							<ColorPalette
								className='wpopus-color-palette'
								clearable={false}
								enableAlpha={false}
								value={ attributes.progressColor }
								onChange={ (newValue) => {
									setOption('progressColor', newValue );
								} }
							/>
						</label>
						
						<br/>
						<label className='inspector-control-label'>
							{ __( 'Base Color', 'wpopus' ) }
							<ColorPalette
								className='wpopus-color-palette'
								clearable={false}
								enableAlpha={true}
								value={ attributes.progressBaseColor }
								onChange={ (newValue) => {
									setOption('progressBaseColor', newValue );
								} }
							/>
						</label>
					</PanelBody>
				</Panel>
			</InspectorControls>

			{ children }
			<div 
				className="wpopus-progress-bar-item-wrapper"
				style={{
					"--wpopus-progress-bar-item-color": `${ attributes.progressColor }`,
					"--wpopus-progress-bar-item-base-color": `${ attributes.progressBaseColor }`,
					"--wpopus-progress-bar-item-height": `${ attributes.progressHeight }px`,
					"--wpopus-progress-bar-item-value": `${ attributes.progressValue }%`,
				}}
			>
				<span className="wpopus-progress-bar-item-value">{ attributes.progressValue }%</span>
				<span className="wpopus-progress-bar-item" />
			</div>

		</div>
	);
}
