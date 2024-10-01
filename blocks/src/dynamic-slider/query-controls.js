import { __ } from "@wordpress/i18n";
import { useSettings } from '@wordpress/block-editor';
import {
	TabPanel,
	PanelBody,
	SelectControl,
	ColorPalette,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalNumberControl as NumberControl,
	__experimentalBoxControl as BoxControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { useState, Fragment } from "@wordpress/element";
import { getAllPosts, getAllCategories, getAllPages } from "../utils/get-posts";

export default function QueryControls({ attributes, setAttributes }) {
	const [activeTab, setActiveTab] = useState("query");
	const fontFamilies = useSettings('typography.fontFamilies');

	const fontOptions = fontFamilies && fontFamilies[0].theme ? fontFamilies[0].theme.map(font => ({
        label: font.name,
        value: font.name,
    })) : [];

	function setPostData(key, value) {
		setAttributes({
			postData: {
				...attributes.postData,
				[key]: value,
			},
		});
	}

	function setPostStyle(key, value) {
		setAttributes({
			postStyle: {
				...attributes.postStyle,
				[key]: value,
			},
		});
	}

	const [isOptionPostsLoading, setIsOptionPostsLoading] = useState(true);
	const [optionPosts, setOptionPosts] = useState([]);

	const [isOptionCatsLoading, setIsOptionCatssLoading] = useState(true);
	const [optionCats, setOptionCats] = useState([]);

	const [isOptionPagesLoading, setIsOptionPagesLoading] = useState(true);
	const [optionPages, setOptionPages] = useState([]);

	if (isOptionPostsLoading) {
		getAllPosts()
			.then((data) => {
				setOptionPosts(data);
				setIsOptionPostsLoading(false);
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	if (isOptionCatsLoading) {
		getAllCategories()
			.then((data) => {
				setOptionCats(data);
				setIsOptionCatssLoading(false);
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	if (isOptionPagesLoading) {
		getAllPages()
			.then((data) => {
				setOptionPages(data);
				setIsOptionPagesLoading(false);
			})
			.catch((error) => {
				console.log(error.message);
			});
	}

	return (
		<PanelBody title={__("Post Settings", "wpopus")} initialOpen={true}>
			<TabPanel
				className="inner-tab-panel"
				activeClass="is-active"
				tabs={[
					{
						name: "query",
						title: __("Query", "wpopus"),
					},
					{
						name: "style",
						title: __("Style", "wpopus"),
					},
				]}
				initialTabName={activeTab}
				onSelect={(tabName) => setActiveTab(tabName)}
			>
				{(tab) => (
					<Fragment>
						{"query" === activeTab ? (
							<Fragment>
								<fieldset>
									<SelectControl
										label={__("Content Type", "wpopus")}
										value={attributes.postData.contentType}
										options={[
											{ label: __("Latest Posts", "wpopus"), value: "latest" },
											{ label: __("Selective Posts", "wpopus"), value: "post" },
											{
												label: __("Posts by Category", "wpopus"),
												value: "category",
											},
											{ label: __("Selective Pages", "wpopus"), value: "page" },
										]}
										onChange={(newValue) => {
											setPostData("contentType", newValue);
										}}
										__nextHasNoMarginBottom
									/>
								</fieldset>

								<br />
								<fieldset>
									<NumberControl
										label={__("Excerpt Length", "wpopus")}
										labelPosition={"top"}
										max={200}
										min={0}
										spinControls={"custom"}
										value={attributes.postData.excerptLength}
										onChange={(newValue) => {
											setPostData("excerptLength", parseInt(newValue));
										}}
									/>
								</fieldset>
								<br />

								{("latest" === attributes.postData.contentType ||
									"category" === attributes.postData.contentType) && (
									<fieldset>
										<NumberControl
											label={__("Number of Posts", "wpopus")}
											labelPosition={"top"}
											max={20}
											min={1}
											spinControls={"custom"}
											value={attributes.postData.postsCount}
											onChange={(newValue) => {
												setPostData("postsCount", parseInt(newValue));
											}}
										/>
									</fieldset>
								)}

								{isOptionPostsLoading &&
									"post" === attributes.postData.contentType && (
										<p>{__("Loading Posts", "wpopus")}</p>
									)}
								{!isOptionPostsLoading &&
									"post" === attributes.postData.contentType && (
										<fieldset>
											<SelectControl
												label={__("Select Posts", "wpopus")}
												help={__(
													"Note: Press Ctrl/Command key while selecting multiple posts.",
													"wpopus",
												)}
												className="inspector-multiple-select"
												value={attributes.postData.postIds}
												options={optionPosts.map((item) => {
													return {
														label: item.title.rendered,
														value: item.id,
													};
												})}
												onChange={(newValue) => {
													setPostData("postIds", newValue);
												}}
												multiple
												__nextHasNoMarginBottom
											/>
										</fieldset>
									)}

								{isOptionPagesLoading &&
									"page" === attributes.postData.contentType && (
										<p>{__("Loading Pages", "wpopus")}</p>
									)}
								{!isOptionPagesLoading &&
									"page" === attributes.postData.contentType && (
										<fieldset>
											<SelectControl
												label={__("Select Pages", "wpopus")}
												help={__(
													"Note: Press Ctrl/Command key while selecting multiple pages.",
													"wpopus",
												)}
												className="inspector-multiple-select"
												value={attributes.postData.pageIds}
												options={optionPages.map((item) => {
													return {
														label: item.title.rendered,
														value: item.id,
													};
												})}
												onChange={(newValue) => {
													setPostData("pageIds", newValue);
												}}
												multiple
												__nextHasNoMarginBottom
											/>
										</fieldset>
									)}

								{isOptionCatsLoading &&
									"category" === attributes.postData.contentType && (
										<p>{__("Loading Categories", "wpopus")}</p>
									)}

								{!isOptionCatsLoading &&
									"category" === attributes.postData.contentType && (
										<fieldset>
											<SelectControl
												label={__("Select Category", "wpopus")}
												className="inspector-multiple-select"
												value={attributes.postData.category}
												onChange={(newValue) => {
													setPostData("category", newValue);
												}}
												__nextHasNoMarginBottom
											>
												<option>{__("None", "wpopus")}</option>
												{optionCats.map((item) => {
													return <option value={item.id}>{item.name}</option>;
												})}
											</SelectControl>
										</fieldset>
									)}
							</Fragment>
						) : (
							<Fragment>
								<PanelBody
									title={__("General Style", "wpopus")}
									initialOpen={false}
									className="inner-panel-body"
								>
									<br />
									<fieldset>
										<SelectControl
											label={__("Design Layout", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.designLayout}
											options={[
												{
													label: __("Full Banner", "wpopus"),
													value: "full-banner",
												},
												{
													label: __("Left Image Right Content", "wpopus"),
													value: "left-image-right-content",
												},
												{
													label: __("Left Content Right Image", "wpopus"),
													value: "left-content-right-image",
												},
												{
													label: __("Top Image Bottom Content", "wpopus"),
													value: "top-image-bottom-content",
												},
											]}
											onChange={(newValue) => {
												setPostStyle("designLayout", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<NumberControl
											label={__("Image Height (Px)", "wpopus")}
											labelPosition={"top"}
											max={1000}
											min={0}
											spinControls={"custom"}
											value={attributes.postStyle.imageHeight}
											onChange={(newValue) => {
												setPostStyle("imageHeight", parseInt(newValue));
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<ToggleGroupControl
											label={__("Content Alignment", "wpopus")}
											value={attributes.postStyle.contentAlign}
											isBlock
											onChange={(newValue) => {
												setPostStyle("contentAlign", newValue);
											}}
										>
											<ToggleGroupControlOption
												value="content-left"
												label={__("Left", "wpopus")}
											/>
											<ToggleGroupControlOption
												value="content-center"
												label={__("Center", "wpopus")}
											/>
											<ToggleGroupControlOption
												value="content-right"
												label={__("Right", "wpopus")}
											/>
										</ToggleGroupControl>
									</fieldset>

									<br />
									<fieldset>
										<label className="inspector-control-label">
											{__("Content Background Color", "wpopus")}
											<ColorPalette
												className="wpopus-color-palette"
												clearable={true}
												enableAlpha={true}
												value={attributes.postStyle.overlayColor}
												onChange={(newValue) => {
													setPostStyle("overlayColor", newValue);
												}}
											/>
										</label>
									</fieldset>
								</PanelBody>

								<PanelBody
									title={__("Category Style", "wpopus")}
									initialOpen={false}
									className="inner-panel-body"
								>
									<br />
									<fieldset>
										<SelectControl
											label={__("Font Family", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.categoryFont}
											options={fontOptions}
											onChange={(newValue) => {
												setPostStyle("categoryFont", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<UnitControl
											label={__("Font Size", "wpopus")}
											value={attributes.postStyle.categoryFontSize}
											min={0}
											step={0.1}
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.postStyle.categoryFontSize,
												},
												{ value: "em", label: "em", default: 0 },
												{ value: "rem", label: "rem", default: 0 },
											]}
											onChange={(newValue) => {
												setPostStyle("categoryFontSize", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<SelectControl
											label={__("Font Weight", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.categoryFontWeight}
											options={[
												{ label: __("Thin", "wpopus"), value: "100" },
												{
													label: __("Extra Light", "wpopus"),
													value: "200",
												},
												{
													label: __("Light", "wpopus"),
													value: "300",
												},
												{
													label: __("Regular", "wpopus"),
													value: "400",
												},
												{
													label: __("Medium", "wpopus"),
													value: "500",
												},
												{
													label: __("Semi Bold", "wpopus"),
													value: "600",
												},
												{ label: __("Bold", "wpopus"), value: "700" },
												{
													label: __("Extra Bold", "wpopus"),
													value: "800",
												},
												{
													label: __("Black", "wpopus"),
													value: "900",
												},
											]}
											onChange={(newValue) => {
												setPostStyle("categoryFontWeight", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<label className="inspector-control-label">
											{__("Text Color", "wpopus")}
											<ColorPalette
												className="wpopus-color-palette"
												clearable={true}
												enableAlpha={false}
												value={attributes.postStyle.categoryFontColor}
												onChange={(newValue) => {
													setPostStyle("categoryFontColor", newValue);
												}}
											/>
										</label>
									</fieldset>
								</PanelBody>

								<PanelBody
									title={__("Title Style", "wpopus")}
									initialOpen={false}
									className="inner-panel-body"
								>
									<br />
									<fieldset>
										<SelectControl
											label={__("Font Family", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.titleFont}
											options={fontOptions}
											onChange={(newValue) => {
												setPostStyle("titleFont", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<UnitControl
											label={__("Font Size", "wpopus")}
											value={attributes.postStyle.titleFontSize}
											min={0}
											step={0.1}
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.postStyle.titleFontSize,
												},
												{ value: "em", label: "em", default: 0 },
												{ value: "rem", label: "rem", default: 0 },
											]}
											onChange={(newValue) => {
												setPostStyle("titleFontSize", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<SelectControl
											label={__("Font Weight", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.titleFontWeight}
											options={[
												{ label: __("Thin", "wpopus"), value: "100" },
												{
													label: __("Extra Light", "wpopus"),
													value: "200",
												},
												{
													label: __("Light", "wpopus"),
													value: "300",
												},
												{
													label: __("Regular", "wpopus"),
													value: "400",
												},
												{
													label: __("Medium", "wpopus"),
													value: "500",
												},
												{
													label: __("Semi Bold", "wpopus"),
													value: "600",
												},
												{ label: __("Bold", "wpopus"), value: "700" },
												{
													label: __("Extra Bold", "wpopus"),
													value: "800",
												},
												{
													label: __("Black", "wpopus"),
													value: "900",
												},
											]}
											onChange={(newValue) => {
												setPostStyle("titleFontWeight", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<BoxControl
											label={__("Margin", "wpopus")}
											values={attributes.postStyle.titleMargin}
											splitOnAxis={true}
											sides="vertical"
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.postStyle.titleMargin,
												},
											]}
											onChange={(newValue) => {
												setPostStyle("titleMargin", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<label className="inspector-control-label">
											{__("Text Color", "wpopus")}
											<ColorPalette
												className="wpopus-color-palette"
												clearable={true}
												enableAlpha={false}
												value={attributes.postStyle.titleFontColor}
												onChange={(newValue) => {
													setPostStyle("titleFontColor", newValue);
												}}
											/>
										</label>
									</fieldset>
								</PanelBody>

								<PanelBody
									title={__("Excerpt Style", "wpopus")}
									initialOpen={false}
									className="inner-panel-body"
								>
									<br />
									<fieldset>
										<SelectControl
											label={__("Font Family", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.excerptFont}
											options={fontOptions}
											onChange={(newValue) => {
												setPostStyle("excerptFont", newValue);
											}}
										/>
									</fieldset>
									
									<br />
									<fieldset>
										<UnitControl
											label={__("Font Size", "wpopus")}
											value={attributes.postStyle.excerptFontSize}
											min={0}
											step={0.1}
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.postStyle.excerptFontSize,
												},
												{ value: "em", label: "em", default: 0 },
												{ value: "rem", label: "rem", default: 0 },
											]}
											onChange={(newValue) => {
												setPostStyle("excerptFontSize", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<SelectControl
											label={__("Font Weight", "wpopus")}
											labelPosition={"top"}
											value={attributes.postStyle.excerptFontWeight}
											options={[
												{ label: __("Thin", "wpopus"), value: "100" },
												{
													label: __("Extra Light", "wpopus"),
													value: "200",
												},
												{
													label: __("Light", "wpopus"),
													value: "300",
												},
												{
													label: __("Regular", "wpopus"),
													value: "400",
												},
												{
													label: __("Medium", "wpopus"),
													value: "500",
												},
												{
													label: __("Semi Bold", "wpopus"),
													value: "600",
												},
												{ label: __("Bold", "wpopus"), value: "700" },
												{
													label: __("Extra Bold", "wpopus"),
													value: "800",
												},
												{
													label: __("Black", "wpopus"),
													value: "900",
												},
											]}
											onChange={(newValue) => {
												setPostStyle("excerptFontWeight", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<label className="inspector-control-label">
											{__("Text Color", "wpopus")}
											<ColorPalette
												className="wpopus-color-palette"
												clearable={true}
												enableAlpha={false}
												value={attributes.postStyle.excerptFontColor}
												onChange={(newValue) => {
													setPostStyle("excerptFontColor", newValue);
												}}
											/>
										</label>
									</fieldset>
								</PanelBody>
							</Fragment>
						)}
					</Fragment>
				)}
			</TabPanel>
		</PanelBody>
	);
}
