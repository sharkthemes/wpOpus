import { __ } from "@wordpress/i18n";
import {
	Spinner,
	ToggleControl,
	Button,
	ColorPicker,
	__experimentalNumberControl as NumberControl,
	__experimentalBorderControl as BorderControl,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

const BackToTop = () => {
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
	const [backToTopEnabled, setBackToTopEnabled] = useState(false);
	const [backToTopImage, setBackToTopImage] = useState(null);
	const [backToTopImageSize, setBackToTopImageSize] = useState(null);
	const [backToTopPadding, setBackToTopPadding] = useState(null);
	const [backToTopBgColor, setBackToTopBgColor] = useState(null);
	const [backToTopBorder, setBackToTopBorder] = useState(null);
	const [backToTopBorderRadius, setBackToTopBorderRadius] = useState(null);
	const defaultBorder = {
		color: "#000000",
		style: "solid",
		width: "1px",
	};

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
					const backToTopEnable = await setFetchedDataValue(
						"wpopus_backtotop_enable",
					);
					const backToTopImage = await setFetchedDataValue(
						"wpopus_backtotop_image",
					);
					const backToTopImageSize =
						(await setFetchedDataValue("wpopus_backtotop_image_width")) || 25;
					const backToTopPadding =
						(await setFetchedDataValue("wpopus_backtotop_padding")) || 1;
					const backToTopBgColor =
						(await setFetchedDataValue("wpopus_backtotop_bg_color")) ||
						"#000000";
					const backToTopBorder =
						(await setFetchedDataValue("wpopus_backtotop_border")) ||
						defaultBorder;
					const backToTopBorderRadius =
						(await setFetchedDataValue("wpopus_backtotop_border_radius")) || 0;

					setBackToTopEnabled(backToTopEnable);
					setBackToTopImage(backToTopImage);
					setBackToTopImageSize(backToTopImageSize);
					setBackToTopPadding(backToTopPadding);
					setBackToTopBgColor(backToTopBgColor);
					setBackToTopBorder(backToTopBorder);
					setBackToTopBorder(backToTopBorderRadius);
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
				"wpopus_backtotop_enable",
				"wpopus_backtotop_image",
				"wpopus_backtotop_image_width",
				"wpopus_backtotop_bg_color",
				"wpopus_backtotop_padding",
				"wpopus_backtotop_border",
				"wpopus_backtotop_border_radius",
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
					option_value: value ? value : "",
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
			setBackToTopImage(attachment);
			saveOptions("wpopus_backtotop_image", attachment);
		});

		frame.open();
	};

	return (
		<div className="tab-content backToToper">
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
				<table className="wpopus-backToTop-form widefat striped">
					<tbody>
						<tr>
							<td>
								<h3>{__("Enable Back to Top", "wpopus")}</h3>
							</td>
							<td>
								<ToggleControl
									label={
										backToTopEnabled
											? __("Enabled", "wpopus")
											: __("Disabled", "wpopus")
									}
									checked={backToTopEnabled}
									onChange={(newValue) => {
										setBackToTopEnabled(newValue);
										saveOptions("wpopus_backtotop_enable", newValue);
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Select Image", "wpopus")}</h3>
								<p>
									{__("Note: Transparent PNG Image Recommended.", "wpopus")}{" "}
									<a
										href="https://icon-sets.iconify.design/?query=up"
										target="_blank"
										rel="nofollow"
									>
										{__("Click Here")}
									</a>{" "}
									{__(
										"to get icons for back to top. Make sure you download icon in PNG format.",
										"wpopus",
									)}
								</p>
							</td>
							<td>
								<div onClick={openMediaLibrary}>
									{!backToTopImage ? (
										<Button className="is-primary button-primary">
											{__("Upload Image", "wpopus")}
										</Button>
									) : (
										<img
											className="wpopus-media"
											src={backToTopImage.url}
											alt={backToTopImage.alt}
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
										setBackToTopImageSize(newValue);
										saveOptions("wpopus_backtotop_image_width", newValue);
									}}
									min={25}
									max={100}
									value={backToTopImageSize}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Padding (px)", "wpopus")}</h3>
							</td>
							<td>
								<NumberControl
									isShiftStepEnabled={true}
									onChange={(newValue) => {
										setBackToTopPadding(newValue);
										saveOptions("wpopus_backtotop_padding", newValue);
									}}
									min={1}
									max={50}
									value={backToTopPadding}
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
									color={backToTopBgColor}
									onChange={(color) => {
										setBackToTopBgColor(color);
										saveOptions("wpopus_backtotop_bg_color", color);
									}}
									enableAlpha
									defaultValue="#000000"
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Border", "wpopus")}</h3>
							</td>
							<td>
								<BorderControl
									onChange={(newValue) => {
										setBackToTopBorder(newValue);
										saveOptions("wpopus_backtotop_border", newValue);
									}}
									value={backToTopBorder}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<h3>{__("Border Radius (px)", "wpopus")}</h3>
							</td>
							<td>
								<NumberControl
									isShiftStepEnabled={true}
									onChange={(newValue) => {
										setBackToTopBorderRadius(newValue);
										saveOptions("wpopus_backtotop_border_radius", newValue);
									}}
									min={0}
									max={500}
									value={backToTopBorderRadius}
								/>
							</td>
						</tr>
					</tbody>
				</table>
			)}
		</div>
	);
};

export default BackToTop;
