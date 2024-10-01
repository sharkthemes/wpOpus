import { addFilter } from "@wordpress/hooks";
import withInspectorControls from './responsiveInspectorControls';

// register responsive
addFilter(
	"blocks.registerBlockType",
	"wpopus/responsive",
	(settings) => {
		const { attributes } = settings;

		return {
			...settings,
			attributes: {
				...attributes,
				responsiveHideOn: {
					type: "array",
					default: []
				}
			},
		};
	},
);

addFilter(
	"editor.BlockEdit",
	"wpopus/responsive",
	withInspectorControls,
);
