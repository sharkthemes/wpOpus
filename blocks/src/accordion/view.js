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

    const blockElement = document.querySelectorAll('.wpopus-accordion');
        if ( !blockElement ) return;

    blockElement.forEach(element => {
        const accordionItems = element.querySelectorAll('.wpopus-accordion-item');
		if (accordionItems.length > 0) {
			accordionItems.forEach((item, index) => {
                if ( 0 === index ) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }

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
    });
    
});
