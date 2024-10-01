import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
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
            'wpopus/advanced-query',
			'wpopus/image-hotspot-item',
			'wpopus/accordion-item',
			'wpopus/advanced-slider-item',
            'wpopus/dynamic-slider'
		];

		if ( excludeBlocks.includes( name ) ) {
			return (
                <BlockEdit { ...props } />
            )
		}

        function setOption(key, value) {
            setAttributes( { [key]: value } ); 
        }

        const options = [
            { label: __( 'Hide on Desktop', 'wpopus' ), value: 'wpopus-hide-on-desktop' },
            { label: __( 'Hide on Tablet', 'wpopus' ), value: 'wpopus-hide-on-tablet' },
            { label: __( 'Hide on Mobile', 'wpopus' ), value: 'wpopus-hide-on-mobile' },
        ];

        const handleCheckboxChange = (optionValue) => {
            const newSelectedOptions = attributes.responsiveHideOn.includes(optionValue)
                ? attributes.responsiveHideOn.filter((value) => value !== optionValue)
                : [...attributes.responsiveHideOn, optionValue];

                setOption( 'responsiveHideOn', newSelectedOptions );
        };

        return (
            <Fragment>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody
                        title={ __( 'Responsive', 'wpopus' ) }
                        initialOpen={ false }
                    >
                        <p className='wpopus-help'>
                            { __( 'Note: Responsive will only work in the frontend.', 'wpopus' ) }
                        </p>

                        {options.map((option) => (
                            <fieldset>
                                <CheckboxControl
                                    key={option.value}
                                    label={option.label}
                                    checked={attributes.responsiveHideOn.includes(option.value)}
                                    onChange={() => handleCheckboxChange(option.value)}
                                />
                            </fieldset>
                        ))}

                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
 }, 'withInspectorControls' );