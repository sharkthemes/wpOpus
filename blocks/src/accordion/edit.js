import { __ } from '@wordpress/i18n';
import { 
    useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import { 
	Panel,
    PanelBody,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import SingleBlockTypeAppender from '../utils/appender';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const ALLOWED_BLOCKS = ['wpopus/accordion-item'];
	const TEMPLATE = [['wpopus/accordion-item']];
	const blocksProps = useBlockProps({ className: `wpopus-accordion ${attributes.options.iconPlacement}` });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
	});

	function setMetaOption(key, value) {
        setAttributes( { "options": {
            ...attributes.options,
            [key]: value
        } } ); 
    }

	const accordion = useRef(0);

	useEffect( () => {
		const blockElement = accordion.current;
		if ( ! blockElement ) {
			return;
		}

		const accordionItems = blockElement.querySelectorAll('.wpopus-accordion-item');
		if (accordionItems.length > 0) {
			accordionItems.forEach((item) => {
				const heading = item.querySelector('.accordion-heading');
				if (heading) {
					heading.addEventListener('click', function() {
						// Remove 'active' class from all accordion items
						accordionItems.forEach(item => item.classList.remove("active"));
						// Toggle 'active' class on the clicked accordion item
						item.classList.toggle("active");
					});
				}
			});
		}

	}, [blocksProps, children] );

	return (
		<div {...innerBlocksProps}>
			<div 
				ref={ accordion }
				className='wpopus-accordion-wrapper'
				style={{
					"--wpopus-accordion-item-gap": `${attributes.options.gap}px`
				}}
			>
				{ children }
			</div>

			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={ __( 'Accordion Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<ToggleGroupControl 
								label={ __( 'Icon Placement', 'wpopus' ) }
								value={ attributes.options.iconPlacement }
								isBlock
								onChange={ (newValue) => {
									setMetaOption('iconPlacement', newValue );
								} }
								>
								<ToggleGroupControlOption value="left-icon" label={ __( 'Left', 'wpopus' ) } />
								<ToggleGroupControlOption value="right-icon" label={ __( 'Right', 'wpopus' ) } />
							</ToggleGroupControl>
						</fieldset>

						<br/>
						<fieldset>
							<NumberControl
								label={ __( 'Accordion Items Gap', 'wpopus' ) }
								labelPosition={ 'top' }
								step={ 1 }
								max={100}
								min={0}
								spinControls={ 'custom' }
								value={ attributes.options.gap }
								onChange={(newValue) => {
									setMetaOption('gap', newValue);
								}}
							/>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>

			<BlockControls>
				<SingleBlockTypeAppender
					isPrimary
					buttonText={ __( 'Add New Accordion Item', 'wpopus' ) }
					allowedBlock="wpopus/accordion-item"
					clientId={ clientId }
					/>
			</BlockControls>
		</div>
	);
}
