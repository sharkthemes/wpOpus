import { __ } from '@wordpress/i18n';
import { 
	useInnerBlocksProps,
	useBlockProps,
	BlockControls,
	InspectorControls
} from '@wordpress/block-editor';
import { 
	Panel,
    PanelBody,
	Icon,
	ToolbarGroup, 
	ToolbarButton,
	ToggleControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useState, useEffect, useRef } from '@wordpress/element';

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
			content: __( 'Marquee Title', 'wpopus' ),
			level: 3,
			lock: {
				remove: true,
				move: true,
			}
		} ]
	];

	const blocksProps = useBlockProps({ className: `wpopus-marquee` });
	const { children, ...innerBlocksProps } = useInnerBlocksProps(blocksProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
		orientation: "horizontal"
	});

	const marqueeRef = useRef(null);
	const [isStopped, setIsStopped] = useState(true);
	const toggleStopped = () => {
		setIsStopped( ( state ) => ! state );
	};

	function setOption(key, value) {
        setAttributes( { "options": {
            ...attributes.options,
            [key]: value
        } } ); 
    }
		
	useEffect( () => {
		if ( isStopped ) {
			marqueeRef.current.stop();
		} else {
			marqueeRef.current.start();
		}
	}, [isStopped] );

	return (
		<div { ...innerBlocksProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton>
						{ isStopped &&
							<Icon title={ __( 'Start Marquee', 'wpopus' ) } icon="controls-play" onClick={ toggleStopped } />	
						}

						{ ! isStopped &&
							<Icon title={ __( 'Pause Marquee', 'wpopus' ) } icon="controls-pause" onClick={ toggleStopped } />	
						}
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={ __( 'Marquee Settings', 'wpopus' ) } initialOpen={ true }>
						<fieldset>
							<ToggleControl
								label={ __( 'Stop on Hover', 'wpopus' ) }
								help={ __( 'It only works in frontend.', 'wpopus' ) }
								checked={ attributes.options.pauseOnHover }
								onChange={ (newValue) => {
									setOption('pauseOnHover', newValue );
								} }
							/>
						</fieldset>

						<br/>
						<fieldset>
							<ToggleGroupControl 
								label={ __( 'Direction', 'wpopus' ) }
								value={ attributes.options.direction }
								isBlock
								onChange={ (newValue) => {
									setOption('direction', newValue );
								} }
								>
								<ToggleGroupControlOption value="left" label={ __( 'Left', 'wpopus' ) } />
								<ToggleGroupControlOption value="right" label={ __( 'Right', 'wpopus' ) } />
								<ToggleGroupControlOption value="up" label={ __( 'Up', 'wpopus' ) } />
								<ToggleGroupControlOption value="down" label={ __( 'Down', 'wpopus' ) } />
							</ToggleGroupControl>
						</fieldset>

						<br/>
						<fieldset>
							<ToggleGroupControl 
								label={ __( 'Behavior', 'wpopus' ) }
								value={ attributes.options.behavior }
								isBlock
								onChange={ (newValue) => {
									setOption('behavior', newValue );
								} }
								>
								<ToggleGroupControlOption value="scroll" label={ __( 'Scroll', 'wpopus' ) } />
								<ToggleGroupControlOption value="alternate" label={ __( 'Alternate', 'wpopus' ) } />
							</ToggleGroupControl>
						</fieldset>

						<br/>
						<fieldset>
							<NumberControl
								label={ __( 'Speed', 'wpopus' ) }
								labelPosition={ 'top' }
								step={ 1 }
								max={50}
								min={0}
								spinControls={ 'custom' }
								value={ attributes.options.speed }
								onChange={(newValue) => {
									setOption('speed', newValue);
								}}
							/>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>
			
			<marquee ref={marqueeRef} scrollamount={ attributes.options.speed } direction={ attributes.options.direction } behavior={ attributes.options.behavior }>
				<div className='wpopus-marquee-items'>
					{ children }
				</div>
			</marquee>
	  	</div>
	);
}
