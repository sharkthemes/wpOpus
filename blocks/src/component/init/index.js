/*
 * Components
 * # hover effect
 * # responsive 
 */

import { createElement } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";

function wrapCoverBlockInContainer( element, blockType, attributes ) {
    // skip if element is undefined
    if ( ! element ) {
        return;
    }

    // hover effect types
	const hoverEffect = attributes.hoverEffectType ? attributes.hoverEffectType : '';
    
    // responsive
	const responsive = attributes.responsiveHideOn ? attributes.responsiveHideOn.join(' ') : '';

    // Add custom class name to existing class names
    const newElement = createElement(
        element.type,
        {
            ...element.props,
            className: `${element.props.className || ''} ${hoverEffect} ${responsive}`.trim()
        },
        element.props.children
    );

    return newElement;
}

addFilter(
    'blocks.getSaveElement',
    'my-plugin/wrap-cover-block-in-container',
    wrapCoverBlockInContainer
);