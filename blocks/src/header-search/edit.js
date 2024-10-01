import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import { 
    Panel,
    PanelBody,
	ColorPalette,
    Icon,
    __experimentalNumberControl as NumberControl 
} from '@wordpress/components';

export default function Edit(props) {
	const { attributes, setAttributes } = props;

	function setOption(key, value) {
        setAttributes( { [key]: value } ); 
    }

	return (
		<div { ...useBlockProps() }>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={ __( 'WpOpus Header Search Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<NumberControl
								label={ __( 'Size (px)', 'wpopus' ) }
								labelPosition={ 'top' }
								step={ 1 }
								min={ 0 }
								max={ 50 }
								spinControls={ 'custom' }
								value={ attributes.size }
								onChange={ (newValue) => {
									setOption('size', parseInt( newValue ) );
								} }
								/>
						</fieldset>
						
						<hr/>

						<fieldset>
							<NumberControl
								label={ __( 'Margin Left (px)', 'wpopus' ) }
								labelPosition={ 'top' }
								step={ 1 }
								min={ 0 }
								max={ 100 }
								spinControls={ 'custom' }
								value={ attributes.leftMargin }
								onChange={ (newValue) => {
									setOption('leftMargin', parseInt( newValue ) );
								} }
								/>
						</fieldset>

						<hr/>

						<fieldset>
							<NumberControl
								label={ __( 'Margin Right (px)', 'wpopus' ) }
								labelPosition={ 'top' }
								step={ 1 }
								min={ 0 }
								max={ 100 }
								spinControls={ 'custom' }
								value={ attributes.rightMargin }
								onChange={ (newValue) => {
									setOption('rightMargin', parseInt( newValue ) );
								} }
								/>
						</fieldset>

						<hr/>

						<fieldset>
							<label className='inspector-control-label'>
								{ __( 'Icon Color', 'wpopus' ) }
								<ColorPalette
									className='wpopus-color-palette'
									clearable={false}
									enableAlpha={false}
									value={ attributes.color }
									onChange={ (newValue) => {
										setOption('color', newValue );
									} }
								/>
							</label>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<Icon
                    width={ attributes.size }
                    height={ attributes.size }
                    style={
                        { 
                             marginLeft:`${attributes.leftMargin}px`,
                             marginRight:`${attributes.rightMargin}px`,
                             fill: attributes.color
                         }
                     }
                    icon={
                        <svg id="icon-search" viewBox="0 0 489.713 489.713">
                            <path d="M483.4,454.444l-121.3-121.4c28.7-35.2,46-80,46-128.9c0-112.5-91.5-204.1-204.1-204.1S0,91.644,0,204.144
                                s91.5,204,204.1,204c48.8,0,93.7-17.3,128.9-46l121.3,121.3c8.3,8.3,20.9,8.3,29.2,0S491.8,462.744,483.4,454.444z M40.7,204.144
                                c0-90.1,73.2-163.3,163.3-163.3s163.4,73.3,163.4,163.4s-73.3,163.4-163.4,163.4S40.7,294.244,40.7,204.144z"/>
                        </svg>
                    }
                />
		</div>
	);
}
