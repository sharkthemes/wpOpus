import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    SelectControl,
    RangeControl,
    CheckboxControl
} from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

export default createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const {
            attributes,
            setAttributes,
            name
        } = props;

        const excludeBlocks = [
            'core/query',
			'wpopus/image-hotspot-item',
			'wpopus/accordion-item',
			'wpopus/advanced-slider-item',
            'wpopus/dynamic-slider',
            'wpopus/flip-card',
		];

		if ( excludeBlocks.includes( name ) ) {
			return (
                <BlockEdit { ...props } />
            )
		}

        function setOption(key, value) {
            setAttributes( { [key]: value } ); 
        }

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Hover Effect', 'wpopus' ) }
                        initialOpen={ false }
                    >
                        <p className='wpopus-help'>
                            { __( 'Note: Hover Effect will only work in the frontend.', 'wpopus' ) }
                        </p>

                        <fieldset>
                            <SelectControl
                                label={  __( 'Select Hover Effect', 'wpopus' ) }
                                value={ attributes.hoverEffectType }
                                options={ [
                                    { label: __( 'None', 'wpopus' ), value: '' },
                                    { label: __( 'Slide Up', 'wpopus' ), value: 'wpopus-hover-slide-up' },
                                    { label: __( 'Slide Down', 'wpopus' ), value: 'wpopus-hover-slide-down' },
                                    { label: __( 'Slide Right', 'wpopus' ), value: 'wpopus-hover-slide-right' },
                                    { label: __( 'Slide Left', 'wpopus' ), value: 'wpopus-hover-slide-left' },
                                    { label: __( 'Zoom In', 'wpopus' ), value: 'wpopus-hover-zoom-in' },
                                    { label: __( 'Zoom Out', 'wpopus' ), value: 'wpopus-hover-zoom-out' },
                                    { label: __( 'Twirl Right', 'wpopus' ), value: 'wpopus-hover-twirl-right' },
                                    { label: __( 'Twirl Left', 'wpopus' ), value: 'wpopus-hover-twirl-left' },
                                ] }
                                onChange={ (newValue) => {
                                    setOption( 'hoverEffectType', newValue ); 
                                } }
                            />
                        </fieldset>

                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
 }, 'withInspectorControls' );
 