import { __ } from "@wordpress/i18n";
import {
	Spinner,
	ToggleControl,
	Button,
	ColorPicker,
	__experimentalNumberControl as NumberControl,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

const PreLoader = () => {
	const [fetchedData, setFetchedData] = useState([]);
	const [fetchStatus, setFetchStatus] = useState({
		ok: false,
		error: null,
		loading: false,
	});
	const [saveStatus, setSaveStatus] = useState({
		ok: false,
		error: null,
		loading: false,
	});

	// options state
	const [preloadEnabled, setPreloadEnabled] = useState(false);
	const [preloadImage, setPreloadImage] = useState(null);
	const [preloadImageSize, setPreloadImageSize] = useState(null);
	const [preloadBgColor, setPreloadBgColor] = useState(null);

	useEffect(() => {
		// Fetch saved options when component mounts
		fetchSavedOptions();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setFetchStatus({ ...fetchStatus, loading: true });
			// Set fetched data in state
			if (fetchedData.length > 0) {
				try {
					const preloadEnabled = await setFetchedDataValue(
						"wpopus_preload_enable",
					);
					const preloadImage = await setFetchedDataValue(
						"wpopus_preload_image",
					);
					const preloadImageSize =
						(await setFetchedDataValue("wpopus_preload_image_width")) || 100;
					const preloadBgColor =
						(await setFetchedDataValue("wpopus_preload_bg_color")) || "#000000";

					setPreloadEnabled(preloadEnabled);
					setPreloadImage(preloadImage);
					setPreloadImageSize(preloadImageSize);
					setPreloadBgColor(preloadBgColor);
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
			const optionNames = [
				"wpopus_preload_enable",
				"wpopus_preload_image",
				"wpopus_preload_image_width",
				"wpopus_preload_bg_color",
			];
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
		setSaveStatus({ ok: false, error: null, loading: true });
		try {
			const response = await wp.apiFetch({
				path: "/wpopus/v1/updateoption",
				method: "POST",
				data: {
					option_name: optionName,
					option_value: value || "",
				},
			});

			if (response) {
				setSaveStatus({ ok: true, error: null, loading: false });
			} else {
				setSaveStatus({
					ok: false,
					error: __("Failed to save option", "wpopus"),
					loading: false,
				});
			}
		} catch (error) {
			console.error("Error saving options:", error);
			setSaveStatus({
				ok: false,
				error: __("An error occurred while saving option", "wpopus"),
				loading: false,
			});
		}
	};

	const openMediaLibrary = () => {
		const frame = wp.media({
			title: __("Select or Upload Media", "wpopus"),
			button: {
				text: __("Use this media", "wpopus"),
			},
			multiple: false,
		});

		frame.on("select", () => {
			const attachment = frame.state().get("selection").first().toJSON();
			setPreloadImage(attachment);
			saveOptions("wpopus_preload_image", attachment);
		});

		frame.open();
	};

	return (
		<div className="tab-content preloader">
			<div className="wpopus-setting-notice">
				{fetchStatus.loading && (
					<h4 className="loading-message wpopus-show-message">
						{__("Loading Settings", "wpopus")} <Spinner />
					</h4>
				)}
				{fetchStatus.error && (
					<h4 className="error-message wpopus-show-message">
						{__("Error fetching settings:", "wpopus")} {fetchStatus.error}
					</h4>
				)}
				{saveStatus.loading && (
					<h4 className="loading-message wpopus-show-message">
						{__("Saving setting", "wpopus")} <Spinner />
					</h4>
				)}
				{saveStatus.ok && (
					<h4 className="success-message wpopus-show-message">
						{__("Settings saved successfully!", "wpopus")}
					</h4>
				)}
			</div>
			{!fetchStatus.loading && (
				<table className="wpopus-preload-form widefat striped">
					<tbody>
						<tr>
							<td>
								<h3>{__("Enable PreLoader", "wpopus")}</h3>
							</td>
							<td>
								<ToggleControl
									label={
										preloadEnabled
											? __("Enabled", "wpopus")
											: __("Disabled", "wpopus")
									}
									checked={preloadEnabled}
									onChange={(newValue) => {
										setPreloadEnabled(newValue);
										saveOptions("wpopus_preload_enable", newValue);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Select Image", "wpopus")}</h3>
								<p>
									{__("Note: Transparent GIF Image Recommended.", "wpopus")}{" "}
									<a href="https://loading.io/" target="_blank" rel="nofollow">
										{__("Click Here")}
									</a>{" "}
									{__("to get GIF preloader images.", "wpopus")}
								</p>
							</td>
							<td>
								<div onClick={openMediaLibrary}>
									{!preloadImage ? (
										<Button className="is-primary button-primary">
											{__("Upload Image", "wpopus")}
										</Button>
									) : (
										<img
											className="wpopus-media"
											src={preloadImage.url}
											alt={preloadImage.alt}
										/>
									)}
								</div>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Image Width (px)", "wpopus")}</h3>
							</td>
							<td>
								<NumberControl
									isShiftStepEnabled={true}
									onChange={(newValue) => {
										setPreloadImageSize(newValue);
										saveOptions("wpopus_preload_image_width", newValue);
									}}
									min={50}
									max={500}
									value={preloadImageSize}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Background Color", "wpopus")}</h3>
							</td>
							<td>
								<ColorPicker
									className="wpopus-color-palette"
									color={preloadBgColor}
									onChange={(color) => {
										setPreloadBgColor(color);
										saveOptions("wpopus_preload_bg_color", color);
									}}
									enableAlpha
									defaultValue="#000000"
								/>
							</td>
						</tr>
					</tbody>
				</table>
			)}
		</div>
	);
};

export default PreLoader;
