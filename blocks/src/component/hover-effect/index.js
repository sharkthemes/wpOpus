import { addFilter } from "@wordpress/hooks";
import withInspectorControls from './hoverEffectInspectorControls';

// register hoverEffect
addFilter(
	"blocks.registerBlockType",
	"wpopus/hoverEffect",
	(settings) => {
		const { attributes } = settings;

		return {
			...settings,
			attributes: {
				...attributes,
				hoverEffectType: {
					type: "string"
				}
			},
		};
	},
);

addFilter(
	"editor.BlockEdit",
	"wpopus/hoverEffect",
	withInspectorControls,
);
