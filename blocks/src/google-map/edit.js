import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { 
	Panel,
	PanelBody,
	TextControl,
	RangeControl,
	Button,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';
import { Fragment, useState, useEffect } from '@wordpress/element';

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

	const [mapSrc, setMapSrc] = useState(`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0195483892463!2d-122.4194154846826!3d37.77492917975864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c51e77529%3A0x6765db2c7b77d48a!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1585313331710!5m2!1sen!2sus`);

	const updateMap = () => {
		const baseUrl = 'https://www.google.com/maps/embed?pb=';
		const queryString = `!1m18!1m12!1m3!1d3153.0195483892463!2d-122.4194154846826!3d37.77492917975864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c51e77529%3A0x6765db2c7b77d48a!2s${ encodeURIComponent( attributes.mapLocation ) }!5e0!3m2!1sen!2sus!4v1585313331710!5m2!1sen!2sus`;
		setMapSrc(baseUrl + queryString);
	};

	return (
		<div { ...useBlockProps({ className: `wpopus-google-map` }) }>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={ __( 'Map Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<TextControl
								label={ __( 'Location', 'wpopus' ) }
								autocomplete="off"
								value={ attributes.mapLocation }
								onChange={ (newValue) => {
									setOption('mapLocation', newValue );
								} }
								placeholder={ __( 'Location', 'wpopus' ) }
							/>
							<Button className='button button-primary' onClick={updateMap}>{ __( 'Update Map Location', 'wpopus' ) }</Button>
						</fieldset>

						<br/>
						<fieldset>
							<RangeControl
								label={ __( 'Height (px)', 'wpopus' ) }
								min={200}
								max={1500}
								value={ attributes.mapHeight }
								onChange={(newValue) => {
									setOption('mapHeight', parseInt(newValue) );
								}}
							/>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<div className='wpopus-map-wrapper'
				style= {{
					"--wpopus-map-height": `${ attributes.mapHeight }px`,
				}}
			>
				<iframe
					loading="lazy"
					allowFullScreen
					src={mapSrc}
				></iframe>
			</div>
		</div>
	);
}
