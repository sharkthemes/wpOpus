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
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';

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
	const counterRef = useRef(null);

	function setOption(key, value) {
		setAttributes( { [key]: value } ); 
	}

	useEffect( () => {
		wp.domReady(() => {
			const blockElement = counterRef.current;
			if ( ! blockElement ) {
				return;
			}

			let start = blockElement.getAttribute('data-count-start')
			let end = blockElement.getAttribute('data-count-end')
			let speed = blockElement.getAttribute('data-speed')
		
			setInterval(function() {
				start++;
				if(start > end) {
					return false;
				}
				blockElement.innerText = start;
		
			}, speed)
		});
	}, [attributes.countValue, attributes.speed] );

	return (
		<p { ...useBlockProps() }>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={ __( 'Counter Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<NumberControl
								label={ __( 'Counter Value', 'wpopus' ) }
								labelPosition={ 'top' }
								min={1}
								spinControls={ 'custom' }
								value={ attributes.countValue }
								onChange={(newValue) => {
									setOption('countValue', parseInt(newValue) );
								}}
							/>
						</fieldset>

						<br/>
						<fieldset>
							<NumberControl
								label={ __( 'Count Start From', 'wpopus' ) }
								labelPosition={ 'top' }
								min={1}
								spinControls={ 'custom' }
								value={ attributes.countStart }
								onChange={(newValue) => {
									setOption('countStart', parseInt(newValue) );
								}}
							/>
						</fieldset>

						<br/>
						<fieldset>
							<RangeControl 
								label={ __( 'Speed', 'wpopus' ) }
								help={ __( 'Lower value counts faster', 'wpopus' ) }
								value={ attributes.speed } 
								min={10}
								max={100}
								step={5}
								onChange={ (newValue) => {
									setOption('speed', parseInt(newValue) );
								} } 
							/>
						</fieldset>

						<br/>
						<fieldset>
							<TextControl
								label={ __( 'Suffix', 'wpopus' )}
								autocomplete="off"
								value={attributes.suffix}
								onChange={ (newValue) => {
									setOption('suffix', newValue );
								} }
								placeholder={ __( '+', 'wpopus' ) }
							/>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<span ref={counterRef} className="wpopus-counter" data-count-start={attributes.countStart} data-count-end={attributes.countValue} data-speed={attributes.speed}></span>
			{attributes.suffix}
		</p>
	);
}
