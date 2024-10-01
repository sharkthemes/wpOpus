import { __ } from "@wordpress/i18n";
import { Modal, Spinner } from "@wordpress/components";
import {
	render,
	Fragment,
	useState,
	useEffect,
	memo,
} from "@wordpress/element";
import WpOpusImportDemo from "./import";
import InsertDemoData from "./insert-demo";

const WpOpusDemoImporter = memo(() => {
	const [isLoading, setIsLoading] = useState(false);
	const [savedDemoRoute, setSavedDemoRoute] = useState([]);
	const [demoRoutes, setDemoRoutes] = useState([]);
	const [hasFetched, setHasFetched] = useState(false);
	const [selectedDemo, setSelectedDemo] = useState(false);
	const [selectedDemoVersion, setSelectedDemoVersion] = useState("");
	const [selectedDemoCategory, setSelectedDemoCategory] = useState("");
	const [demoData, setDemoData] = useState("");
	const [modalOpen, setModalOpen] = useState(null);
	const [hasError, setHasError] = useState(null);
	const [pluginList, setPluginList] = useState(null);
	const [selectedPlugins, setSelectedPlugins] = useState([]);
	const [pluginsConfirmed, setPluginsConfirmed] = useState(false);

	// root url for api fetch of demo route
	const apiRootUrl = wpOpus.template_url.replace(/\/$/, "");
	const userCan = wpOpus.user_can;

	const fetchSavedDemoRoute = async () => {
		try {
			const optionNames = ["wpopus_recent_demo_url"];
			const url = `/wpopus/v1/getoptions?option_names=${encodeURIComponent(
				JSON.stringify(optionNames),
			)}`;

			const response = await wp.apiFetch({ path: url });

			if (Array.isArray(response)) {
				response.map((data) => {
					setSavedDemoRoute(data.value);
				});
			}
		} catch (error) {
			setHasError(__("Failed to check demo.", "wpopus"));
		}
	};

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

	const getDemoRoutes = async () => {
		setIsLoading(true);

		try {
			const tokenToVerify = generateToken();
			const response = await fetch(
				apiRootUrl + "/wp-json/wpopuspatternexport/v1/demoroute",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `st ${tokenToVerify}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const responseData = await response.json();
			let demoRoutesData = [];

			// Check different response structures
			if (responseData.templates) {
				if (responseData.templates.data) {
					demoRoutesData = responseData.templates.data;
				} else {
					demoRoutesData = responseData.templates;
				}
			} else {
				setHasError(__("Invalid response format", "wpopus"));
			}

			if (demoRoutesData) {
				setDemoRoutes(demoRoutesData);
				setHasFetched(true);
			} else {
				setHasError(__("No demo routes found", "wpopus"));
			}
		} catch (error) {
			setHasError(`${__("Error fetching demo routes:", "wpopus")} ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSavedDemoRoute();
		if (!hasFetched) {
			getDemoRoutes();
		}
	}, [hasFetched]);

	const handleDemoCategoryChange = (category) => {
		setSelectedDemoCategory(category);
	};

	const handleDemoVersionChange = (version) => {
		setSelectedDemoVersion(version);
	};

	const handleDemoClick = (demo) => {
		if (savedDemoRoute === demo.content) {
			setHasError(__("This demo has already been imported", "wpopus"));
		}
		setModalOpen(true);
		setSelectedDemo(demo);
	};

	const handleDemoDataFetched = (data) => {
		setDemoData(data);
		setPluginList(data.active_plugins);
	};

	const filteredDemoRoutes =
		demoRoutes && demoRoutes.data
			? demoRoutes.data.filter((demo) => {
					return (
						demo.category_slug.includes(selectedDemoCategory) &&
						demo.category_slug.includes(selectedDemoVersion)
					);
			  })
			: [];

	const demoRoutesVersions = demoRoutes ? demoRoutes.demo_version : [];
	const demoRoutesCategories = demoRoutes ? demoRoutes.demo_category : [];

	// Handle plugins checkbox change
	const handleCheckboxChange = (pluginPath) => {
		const updatedPlugins = selectedPlugins.includes(pluginPath)
			? selectedPlugins.filter((p) => p !== pluginPath)
			: [...selectedPlugins, pluginPath];

		setSelectedPlugins(updatedPlugins);
		// Update the global demoData.active_plugins array with the new value
		demoData.active_plugins = updatedPlugins;
	};

	const formatPluginName = (pluginPath) => {
		// Extract the plugin slug by removing the directory and file extension
		const pluginSlug = pluginPath.split("/")[0];

		// Replace hyphens with spaces and capitalize each word
		return pluginSlug
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const confirmPlugins = () => {
		if (selectedPlugins.length === 0) {
			demoData.active_plugins = {};
		}

		setPluginsConfirmed(true);
	};

	useEffect(() => {
		if (pluginList && Object.keys(pluginList).length === 0) {
			setPluginsConfirmed(true);
		}
	}, [pluginList]);

	return (
		<Fragment>
			{isLoading ? (
				<h3 className="wpopus-loading-demo">
					{__("Loading Demo", "wpopus")} <Spinner />
				</h3>
			) : (
				<div className="wpopus-demo-listing-wrapper">
					<div className="wpopus-demo-main-filter">
						<ul className="demo-version">
							<li
								className={`${"" == selectedDemoVersion ? "active" : ""}`}
								onClick={() => handleDemoVersionChange("")}
							>
								{__("All", "wpopus")}
							</li>
							{demoRoutesVersions &&
								demoRoutesVersions.map((version) => (
									<li
										className={`${version.slug} ${
											version.slug == selectedDemoVersion ? "active" : ""
										}`}
										key={version.slug}
										onClick={() => handleDemoVersionChange(version.slug)}
									>
										{version.name}
									</li>
								))}
						</ul>
					</div>

					<div className="wpopus-demo-showcase">
						<div className="wpopus-category-list-wrapper">
							<ul className="category-list">
								<li
									className={`${"" == selectedDemoCategory ? "active" : ""}`}
									onClick={() => handleDemoCategoryChange("")}
								>
									{__("All Categories", "wpopus")}
								</li>
								{demoRoutesCategories &&
									demoRoutesCategories.map((category) => (
										<li
											className={`${category.slug} ${
												category.slug == selectedDemoCategory ? "active" : ""
											}`}
											key={category.slug}
											onClick={() => handleDemoCategoryChange(category.slug)}
										>
											{category.name}
										</li>
									))}
							</ul>
						</div>

						<div className="wpopus-demo-container">
							{filteredDemoRoutes.length > 0 ? (
								<div className="wpopus-demo-wrapper">
									<ul>
										{filteredDemoRoutes.map((demo, index) => (
											<li
												key={index}
												className={`demo-item ${demo.category_slug}`}
											>
												<div className="demo-item-wrapper">
													<img src={demo.featured_image} />

													<div className="demo-footer">
														<h4>{demo.title}</h4>
														<div className="meta-data">
															<a
																className="button button-secondary"
																href={demo.content}
																target="_blank"
															>
																{__("Demo", "wpopus")}
															</a>
															{demo.category_slug.includes("free") ? (
																<a
																	className="button button-primary"
																	href="#."
																	onClick={(e) => {
																		e.preventDefault();
																		handleDemoClick(demo);
																	}}
																>
																	{__("Import", "wpopus")}
																</a>
															) : null}
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
										"No demos available for the selected category.",
										"wpopus",
									)}
								</p>
							)}
						</div>
					</div>

					{modalOpen && selectedDemo && (
						<Modal onRequestClose={() => setModalOpen(false)}>
							{!hasError && selectedDemo ? (
								<Fragment>
									<WpOpusImportDemo
										demoQuery={selectedDemo}
										onDemoDataFetched={handleDemoDataFetched}
									/>

									{demoData &&
									!pluginsConfirmed &&
									pluginList &&
									Object.keys(pluginList).length > 0 && (
										<div className="wpopus-select-plugins">
											<h3 className="wpopus-loading-demo">
												{__(
													"Select Plugins to Install: Recommended for Demo",
													"wpopus",
												)}
											</h3>

											{Object.entries(pluginList).map(
												([key, pluginPath], index) => (
													<label key={index}>
														<input
															type="checkbox"
															checked={selectedPlugins.includes(pluginPath)}
															onChange={() =>
																handleCheckboxChange(pluginPath)
															}
														/>
														{formatPluginName(pluginPath)}
													</label>
												),
											)}
											<button
												className="button button-primary"
												onClick={() => confirmPlugins()}
											>
												{__("Confirm", "wpopus")}
											</button>
										</div>
									)}

									{demoData && pluginsConfirmed && (
										<InsertDemoData data={demoData} route={demoRoutes.data} />
									)}
								</Fragment>
							) : (
								<h3 className="wpopus-loading-demo">{hasError}</h3>
							)}
						</Modal>
					)}
				</div>
			)}
		</Fragment>
	);
});

document.addEventListener("DOMContentLoaded", function () {
	if (document.getElementById("wpopus-demo-import")) {
		render(
			<WpOpusDemoImporter />,
			document.getElementById("wpopus-demo-import"),
		);
	}
});
