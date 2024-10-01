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
	const counter = document.querySelectorAll(".wpopus-counter")

	if ( ! counter ) {
		return
	}

	Array.from(counter).forEach( (values) => {
	var start = values.getAttribute('data-count-start');
	var end = values.getAttribute('data-count-end');
	var speed = values.getAttribute('data-speed');

	setInterval(function() {
		start++;
		if(start > end) {
			return false;
		}
		values.innerText = start;

		}, speed)
	});
	
} );