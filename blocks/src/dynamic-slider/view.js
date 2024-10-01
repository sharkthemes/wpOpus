/**
 * Use this file for JavaScript code that you want to run in the front-end 
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any 
 * JavaScript running in the front-end, then you should delete this file and remove 
 * the `viewScript` property from `block.json`. 
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

document.addEventListener('DOMContentLoaded', function () {

    const blockElement = document.querySelectorAll('.wpopus-dynamic-carousel');
        if ( !blockElement ) {
            return;
        };

    function swiperOptionUpdate(element) {
        const options = JSON.parse(element.getAttribute('data-atts'));
        const slideElement = element.querySelectorAll('swiper-slide');
        const shadow = element.shadowRoot;

        

        if ( slideElement && 'center-mode' == options.layout ) {
            Array.from(slideElement).forEach(slide => {
                slide.style.opacity = options.inactiveOpacity;
                slide.style.transform = `scaleY( ${options.inactiveScale} )`;
            });
        }

        if ( options.pagination ) {
            if ( 'bullets' == options.paginationType ) {
                const paginationDots = shadow.querySelectorAll('.swiper-pagination-bullet');
                paginationDots.forEach(dot => {
                    dot.style.backgroundColor = options.paginationColor;
                    dot.style.height = options.paginationHeight;
                    dot.style.width = options.paginationWidth;
                    dot.style.borderRadius = options.paginationHeight;
                    dot.style.border = `${options.paginationBorderWidth} ${options.paginationBorderStyle} ${options.paginationBorderColor}`;
                });
            }
            else if ( 'fraction' == options.paginationType ) {
                const paginationFraction = shadow.querySelectorAll('.swiper-pagination-fraction');
                paginationFraction.forEach(fraction => {
                    fraction.style.color = options.paginationColor;
                    fraction.style.fontSize = options.paginationFractionFontSize;
                    fraction.style.fontWeight = options.paginationFractionFontWeight;
                });
            }
        }

        if ( navigation ) {
            const navigationControls = shadow.querySelectorAll('.swiper-button-prev, .swiper-button-next');
            if ( navigationControls ) {
                Array.from(navigationControls).forEach(control => {
                    control.style.boxSizing = 'border-box'; 
                    control.style.color = options.navigationColor;
                    control.style.backgroundColor = options.navigationBgColor;
                    control.style.height = options.navigationHeight; 
                    control.style.width = options.navigationWidth; 
                    control.style.padding = `${options.navigationPaddingTop} ${options.navigationPaddingRight} ${options.navigationPaddingBottom} ${options.navigationPaddingLeft}`; 
                    control.style.border = `${options.navigationBorderWidth} ${options.navigationBorderStyle} ${options.navigationBorderColor}`;
                    control.style.borderRadius = options.navigationBorderRadius;
                });
            }
        }
    }
    
    blockElement.forEach(element => {
        swiperOptionUpdate(element);

        element.addEventListener('swiperbreakpoint', (e) => {
            swiperOptionUpdate(element);
            // console.log(e.detail);
            // console.log('breakpoint changed');
        });
    });
    
   
});


