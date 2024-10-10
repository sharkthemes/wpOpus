import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { useState, useEffect, useRef } from "@wordpress/element";
import { v4 as uuidv4 } from "uuid";
import Controls from "./controls";
import {
	getAllPosts,
	getPostsByCategory,
	getPostsByIds,
	getPagesByIds,
} from "../utils/get-posts";
import TrimText from "../utils/trim-content";
import { FeaturedImage, FeaturedCategories } from "./featured-meta";

import "./editor.scss";

export default function Edit(props) {
	const { attributes, setAttributes } = props;

	// ref for slider div
	const sliderRef = useRef(null);
	const [count, setCount] = useState(attributes.options.postsCount);

	// is loading
	const [isLoading, setIsLoading] = useState(true);

	if (!attributes.slideID) {
		const slideID = "wpopus-dynamic-slider-" + uuidv4();
		setAttributes({ slideID });
	}

	useEffect(() => {
		setIsLoading(true);
		setAttributes({ apiData: [] });

		if ("latest" === attributes.postData.contentType) {
			getAllPosts(attributes.postData.postsCount)
				.then((data) => {
					setAttributes({ apiData: data });
					setIsLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		if ("post" === attributes.postData.contentType) {
			getPostsByIds(attributes.postData.postIds)
				.then((data) => {
					setAttributes({ apiData: data });
					setIsLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		if ("page" === attributes.postData.contentType) {
			getPagesByIds(attributes.postData.pageIds)
				.then((data) => {
					setAttributes({ apiData: data });
					setIsLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}

		if ("category" === attributes.postData.contentType) {
			getPostsByCategory(
				attributes.postData.category,
				attributes.postData.postsCount,
			)
				.then((data) => {
					setAttributes({ apiData: data });
					setIsLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [attributes.postData]);

	useEffect(() => {
		if (!isLoading) {
			wp.domReady(() => {
				const blockElement = document.querySelector(
					`[block-id="${attributes.slideID}"]`,
				);
				if (blockElement) {
					const slideElement = blockElement.querySelectorAll("swiper-slide");
					if (slideElement) {
						Array.from(slideElement).forEach((slide) => {
							slide.style.opacity = 1;
							slide.style.transform = 1;
						});
					}
					// Access shadow DOM
					const shadow =
						blockElement.querySelector("swiper-container").shadowRoot;
					if (shadow) {
						if (attributes.options.pagination) {
							const paginationDots = shadow.querySelectorAll(
								".swiper-pagination-bullet",
							);
							if (paginationDots) {
								// Loop through each bullet
								Array.from(paginationDots).forEach((dot) => {
									dot.style.height = attributes.options.paginationSize.top;
									dot.style.width = attributes.options.paginationSize.left;
									dot.style.borderRadius =
										attributes.options.paginationSize.top;
									dot.style.border = `${attributes.options.paginationBorder.width} ${attributes.options.paginationBorder.style} ${attributes.options.paginationBorder.color}`;
								});
							}
						}

						if (attributes.options.navigation) {
							const navigationControls = shadow.querySelectorAll(
								".swiper-button-prev, .swiper-button-next",
							);
							if (navigationControls) {
								Array.from(navigationControls).forEach((control) => {
									control.style.boxSizing = "border-box";
									control.style.backgroundColor =
										attributes.options.navigationBgColor;
									control.style.height = attributes.options.navigationSize.top;
									control.style.width = attributes.options.navigationSize.left;
									control.style.padding = `${attributes.options.navigationPadding.top} ${attributes.options.navigationPadding.right} ${attributes.options.navigationPadding.bottom} ${attributes.options.navigationPadding.left}`;
									control.style.borderRadius =
										attributes.options.navigationBorderRadius;
									control.style.border = `${attributes.options.navigationBorder.width} ${attributes.options.navigationBorder.style} ${attributes.options.navigationBorder.color}`;
								});
							}
						}
					}
				}
			});
		}

	}, [attributes.options, isLoading]);

	useEffect( () => {
		if (count != attributes.options.postsCount) {
			sliderRef.current.swiper.update();
			setCount(attributes.options.postsCount);
		}
	}, [count] )

	const postStyle = {
		"--wpopus-image-dynamic-slider-image-height": `${attributes.postStyle.imageHeight}px`,
		"--wpopus-image-dynamic-slider-overlay-color": `${attributes.postStyle.overlayColor}`,
		"--wpopus-image-dynamic-slider-category-font": `${attributes.postStyle.categoryFont}`,
		"--wpopus-image-dynamic-slider-category-color": `${attributes.postStyle.categoryFontColor}`,
		"--wpopus-image-dynamic-slider-category-font-size": `${attributes.postStyle.categoryFontSize}`,
		"--wpopus-image-dynamic-slider-category-font-weight": `${attributes.postStyle.categoryFontWeight}`,
		"--wpopus-image-dynamic-slider-title-font": `${attributes.postStyle.titleFont}`,
		"--wpopus-image-dynamic-slider-title-color": `${attributes.postStyle.titleFontColor}`,
		"--wpopus-image-dynamic-slider-title-font-size": `${attributes.postStyle.titleFontSize}`,
		"--wpopus-image-dynamic-slider-title-font-weight": `${attributes.postStyle.titleFontWeight}`,
		"--wpopus-image-dynamic-slider-title-margin": `${attributes.postStyle.titleMargin.top} 0 ${attributes.postStyle.titleMargin.bottom}`,
		"--wpopus-image-dynamic-slider-excerpt-font": `${attributes.postStyle.excerptFont}`,
		"--wpopus-image-dynamic-slider-excerpt-color": `${attributes.postStyle.excerptFontColor}`,
		"--wpopus-image-dynamic-slider-excerpt-font-size": `${attributes.postStyle.excerptFontSize}`,
		"--wpopus-image-dynamic-slider-excerpt-font-weight": `${attributes.postStyle.excerptFontWeight}`,
	};

	return (
		<div
			block-id={attributes.slideID}
			{ ...useBlockProps() }
		>
			<Controls attributes={attributes} setAttributes={setAttributes} />

			<div
				className={`wpopus-dynamic-slider-wrapper ${attributes.postStyle.designLayout} ${attributes.postStyle.contentAlign}`}
				style={{ ...postStyle }}
			>
				<swiper-container
					ref={sliderRef}
					rewind={true}
					speed={attributes.options.speed}
					slides-per-view={attributes.options.column}
					space-between={
						1 < attributes.options.column 
							? attributes.options.gap
							: 0
					}
					pagination={attributes.options.pagination}
					pagination-dynamic-bullets={
						attributes.options.pagination &&
						"bullets" == attributes.options.paginationType
							? true
							: false
					}
					pagination-clickable={
						attributes.options.pagination
							? true
							: false
					}
					scrollbar={attributes.options.scrollbar}
					navigation={attributes.options.navigation}
					style={{
						"--swiper-navigation-color": `${attributes.options.navigationColor}`,
						"--swiper-pagination-color": `${attributes.options.paginationColor}`,
					}}
				>
					{isLoading && __("Loading...", "wpopus")}
					{!isLoading &&
						!attributes.apiData &&
						__("Nothing to Show", "wpopus")}
					{!isLoading &&
						attributes.apiData?.map((post) => {
							return (
								<swiper-slide key={post.id}>
									{post.featured_media != 0 && (
										<FeaturedImage
											imageId={post.featured_media}
											altText={post.title.rendered}
										/>
									)}
									<div className="overlay"></div>
									<div className="content-wrapper">
										{post.categories &&
											"page" !== attributes.postData.contentType && (
												<span className="cat-links">
													<FeaturedCategories catIds={post.categories} />
												</span>
											)}
										<h3>
											<a href={post.link}>{post.title.rendered}</a>
										</h3>
										<TrimText
											text={post.excerpt.rendered}
											count={attributes.postData.excerptLength}
										/>
									</div>
								</swiper-slide>
							);
						})}
				</swiper-container>
			</div>
		</div>
	);
}
