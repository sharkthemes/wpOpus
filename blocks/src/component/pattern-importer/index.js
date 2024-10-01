import { __ } from "@wordpress/i18n";
import { registerPlugin } from "@wordpress/plugins";
import { __experimentalMainDashboardButton as MainDashboardButton } from "@wordpress/edit-post";
import { Button, Modal, Spinner } from "@wordpress/components";
import {
	Fragment,
	useState,
	useEffect,
	useRef,
	memo,
} from "@wordpress/element";
import { parse } from "@wordpress/blocks";
import { dispatch } from "@wordpress/data";

const WpOpusTemplateShowcase = memo(() => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [templates, setTemplates] = useState(null);
	const [hasFetched, setHasFetched] = useState(false);
	const [selectedTemplateType, setSelectedTemplateType] = useState("template");
	const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("");
	const [selectedTemplateVersion, setSelectedTemplateVersion] = useState("");
	const [selectedBlockCategory, setSelectedBlockCategory] = useState("");
	const [hasError, setHasError] = useState(null);
	const buttonRef = useRef();
	const [fetchedData, setFetchedData] = useState([]);
	const [fetchStatus, setFetchStatus] = useState({
		ok: false,
		error: null,
		loading: false,
	});
	const [favouriteTemplates, setFavouriteTemplates] = useState([]);

	// root url for api fetch
	const apiRootUrl = wpOpus.template_url.replace(/\/$/, "");
	const pluginVersion = wpOpus.plugin_version; // pro or free version
	const userCan = wpOpus.user_can;
	const themeName = wpOpus.theme_name;
	const themeAuthor = wpOpus.theme_author;

	const generateToken = () => {
		const randomIndex = Math.floor(11 * Math.random());
		let generatedToken = "";

		for (let i = 0; i < 13; i++) {
			generatedToken +=
				i === randomIndex
					? "wpOpus"
					: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
							Math.floor(52 * Math.random())
					  ];
		}

		return generatedToken;
	};

	const getTemplates = async () => {
		setIsLoading(true);

		try {
			const tokenToVerify = generateToken();
			const headers = {
				"Content-Type": "application/json",
				Authorization: `st ${tokenToVerify}`,
			};

			const response = await fetch(
				apiRootUrl + "/wp-json/wpopuspatternexport/v1/templates",
				{
					method: "GET",
					headers: headers,
				},
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const responseData = await response.json();
			let templatesData = [];

			// Check different response structures
			if (responseData.templates) {
				if (responseData.templates.data) {
					templatesData = responseData.templates.data;
				} else {
					templatesData = responseData.templates;
				}
			} else {
				setHasError(__("Invalid response format", "wpopus"));
			}

			if (templatesData) {
				setTemplates(templatesData);
				setHasFetched(true);
			} else {
				setHasError(__("No templates found", "wpopus"));
			}
		} catch (error) {
			setHasError(`${__("Error fetching templates:", "wpopus")} ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (pluginVersion !== "pro" && isVisible && !hasFetched) {
			getTemplates();
		}
	}, [isVisible, hasFetched]);

	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	const handleCategoryChange = (category) => {
		if ("template" == selectedTemplateType) {
			setSelectedTemplateCategory(category);
		} else {
			setSelectedBlockCategory(category);
		}
	};

	const handleTemplateTypeChange = (templateType) => {
		setSelectedTemplateType(templateType);
	};

	const handleTemplateVersionChange = (templateVersion) => {
		setSelectedTemplateVersion(templateVersion);
	};

	const handleTemplateClick = (template) => {
		try {
			const blocks = parse(template.content);
			dispatch("core/block-editor").insertBlocks(blocks);
			setIsVisible(false);
		} catch (error) {
			setHasError(`${__("Error fetching templates:", "wpopus")} ${error}`);
		}
	};

	const filteredTemplates =
		templates && templates.data
			? templates.data.filter((template) => {
				if ("template" == selectedTemplateType) {
					if ( "fav" == selectedTemplateVersion ) {
						return (
							template.category_slug.includes(selectedTemplateType) &&
							template.category_slug.includes(selectedTemplateCategory) &&
							favouriteTemplates.includes(template.id)
						);
					}
					return (
						template.category_slug.includes(selectedTemplateType) &&
						template.category_slug.includes(selectedTemplateCategory) &&
						template.category_slug.includes(selectedTemplateVersion)
					);
				} else {
					if ( "fav" == selectedTemplateVersion ) {
						return (
							template.category_slug.includes(selectedTemplateType) &&
							template.category_slug.includes(selectedBlockCategory) &&
							favouriteTemplates.includes(template.id)
						);
					}
					return (
						template.category_slug.includes(selectedTemplateType) &&
						template.category_slug.includes(selectedBlockCategory) &&
						template.category_slug.includes(selectedTemplateVersion)
					);
				}
			  })
			: [];

	const templateTypes = templates ? templates.template_type : [];
	const templateVersion = templates ? templates.template_version : [];
	const templateCategories = templates ? templates.template_category : [];
	const blockCategories = templates ? templates.block_category : [];

	let filterCategories = ("template" == selectedTemplateType) ? templateCategories : blockCategories;

	// favourite templates
	useEffect(() => {
		// Fetch saved options when component mounts
		fetchSavedOptions();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setFetchStatus({ ...fetchStatus, loading: true });
			// set fetched data in state
			if (fetchedData.length > 0) {
				try {
					const getGavouriteTemplate =
						(await setFetchedDataValue("wpopus_favourite_templates")) || [];
					setFavouriteTemplates(getGavouriteTemplate);
				} finally {
					setFetchStatus({ ok: true, error: null, loading: false });
				}
			}
		};

		fetchData();
	}, [fetchedData]);

	const fetchSavedOptions = async () => {
		setFetchStatus({ ...fetchStatus, loading: true });
		try {
			const optionNames = ["wpopus_favourite_templates"];
			const url = `/wpopus/v1/getoptions?option_names=${encodeURIComponent(
				JSON.stringify(optionNames),
			)}`;

			const response = await wp.apiFetch({ path: url });

			if (Array.isArray(response)) {
				setFetchedData(response);
				setFetchStatus({ ok: true, error: null, loading: false });
			} else {
				setFetchStatus({
					ok: false,
					error: __("Invalid response format", "wpopus"),
					loading: false,
				});
			}
		} catch (error) {
			setFetchStatus({
				ok: false,
				error: __("An error occurred while fetching options", "wpopus"),
				loading: false,
			});
		}
	};

	// function to set fetched data in state
	const setFetchedDataValue = (optionName) => {
		if (fetchedData) {
			const getIndex = fetchedData.findIndex(
				(item) => item.name === optionName,
			);
			if (getIndex !== -1) {
				return fetchedData[getIndex].value;
			}
		}
		return false;
	};

	const saveOptions = async (optionName, value) => {
		try {
			await wp.apiFetch({
				path: "/wpopus/v1/updateoption",
				method: "POST",
				data: {
					option_name: optionName,
					option_value: value ? value : "",
				},
			});
		} catch (error) {
			setHasError(__("An error occurred while saving option", "wpopus"));
			console.error("Error saving options:", error);
		}
	};

	return (
		<Fragment>
			<Button
				ref={buttonRef}
				onClick={toggleVisible}
				icon="screenoptions"
				className="wpopus-pattern-importer is-primary"
			>
				{__("wpOpus Templates", "wpopus")}
			</Button>

			{isVisible && (
				<Modal
					title={`${themeName} ${__("Templates", "wpopus")}`}
					className={`wpopus-templates ${pluginVersion}`}
					onRequestClose={() => setIsVisible(false)}
				>
					{hasError ? (
						<h3 className="wpopus-loading-templates">{hasError}</h3>
					) : (
						<Fragment>
							{isLoading ? (
								<h3 className="wpopus-loading-templates">
									{__("Loading Templates", "wpopus")} <Spinner />
								</h3>
							) : (
								<div className="wpopus-template-listing-wrapper">
									<div className="wpopus-template-main-filter">
										<ul className="template-types">
											{templateTypes &&
												templateTypes.map((templateType) => (
													<li
														className={`${templateType.slug} ${
															templateType.slug == selectedTemplateType
																? "active"
																: ""
														}`}
														key={templateType.slug}
														onClick={() =>
															handleTemplateTypeChange(templateType.slug)
														}
													>
														{templateType.name}
													</li>
												))}
										</ul>

										<ul className="template-version">
											<li
												className={`${
													"" == selectedTemplateVersion ? "active" : ""
												}`}
												onClick={() => handleTemplateVersionChange("")}
											>
												{__("All", "wpopus")}
											</li>
											<li
												className={`fav ${
													"fav" == selectedTemplateVersion ? "active" : ""
												}`}
												onClick={() => handleTemplateVersionChange("fav")}
											>
												{__("Favourite", "wpopus")}
											</li>
											{templateVersion &&
												templateVersion.map((version) => (
													<li
														className={`${version.slug} ${
															version.slug == selectedTemplateVersion
																? "active"
																: ""
														}`}
														key={version.slug}
														onClick={() =>
															handleTemplateVersionChange(version.slug)
														}
													>
														{version.name}
													</li>
												))}
										</ul>
									</div>

									<div className="wpopus-template-showcase">
										<div className="wpopus-category-list-wrapper">
											<ul className="category-list">
												<li
													className={`${
														"template" == selectedTemplateType
															? "" == selectedTemplateCategory
																? "active"
																: ""
															: "" == selectedBlockCategory
															? "active"
															: ""
													}`}
													onClick={() => handleCategoryChange("")}
												>
													{__("All Categories", "wpopus")}
												</li>
												{filterCategories &&
													filterCategories.map((category) => (
														<li
															className={`${category.slug} ${
																"template" == selectedTemplateType
																	? category.slug == selectedTemplateCategory
																		? "active"
																		: ""
																	: category.slug == selectedBlockCategory
																	? "active"
																	: ""
															}`}
															key={category.slug}
															onClick={() =>
																handleCategoryChange(category.slug)
															}
														>
															{category.name}
														</li>
													))}
											</ul>
										</div>

										<div className="wpopus-patterns-container">
											{filteredTemplates.length > 0 ? (
												<div className="wpopus-patterns-wrapper">
													<ul>
														{filteredTemplates.map((template, index) => (
															<li
																key={index}
																className={`template-item ${template.category_slug} ${favouriteTemplates.includes(template.id) ? "fav" : ""}`}
															>
																<div className="template-item-wrapper">
																	<img src={template.featured_image} />
																	<div className="template-details">
																		<h4>{template.title}</h4>
																		<div className="template-meta">
																			<a
																				href={template.link}
																				className="button button-secondary"
																				target="_blank"
																				rel="nofollow"
																			>
																				{__("Demo", "wpopus")}
																			</a>
																			{template.category_slug.includes(
																				"free",
																			) ? (
																				<a
																					className="button button-primary"
																					href="#."
																					onClick={(e) => {
																						e.preventDefault();
																						handleTemplateClick(template);
																					}}
																				>
																					{__("Insert", "wpopus")}
																				</a>
																			) : null}
																		</div>
																		<div
																			className={`wpopus-favourite-svg ${
																				favouriteTemplates.includes(template.id)
																					? "fav"
																					: ""
																			}`}
																			onClick={() => {
																				const updatedFavourites =
																					favouriteTemplates.includes(
																						template.id,
																					)
																						? favouriteTemplates.filter(
																								(id) => id !== template.id,
																						  ) // Remove if already in favourites
																						: [
																								...favouriteTemplates,
																								template.id,
																						  ]; // Add if not in favourites

																				setFavouriteTemplates(
																					updatedFavourites,
																				);
																				saveOptions(
																					"wpopus_favourite_templates",
																					updatedFavourites,
																				);
																			}}
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				viewBox="0 0 24 24"
																			>
																				<path d="M20.8 4.6a5.8 5.8 0 0 0-8.4 0L12 5l-.4-.4a5.8 5.8 0 1 0-8.4 8.4L12 21l8.8-8.8a5.8 5.8 0 0 0 0-8.4z"></path>
																			</svg>
																		</div>
																	</div>
																</div>
															</li>
														))}
													</ul>
												</div>
											) : (
												<p>
													{__(
														"No templates available for the selected category.",
														"wpopus",
													)}
												</p>
											)}
										</div>
									</div>
								</div>
							)}
						</Fragment>
					)}
				</Modal>
			)}
		</Fragment>
	);
});

const WpOpusToolbarButtonSlot = () => (
	<MainDashboardButton>
		<WpOpusTemplateShowcase />
	</MainDashboardButton>
);

registerPlugin("wpopus-pattern-import-button", {
	render: WpOpusToolbarButtonSlot,
});
