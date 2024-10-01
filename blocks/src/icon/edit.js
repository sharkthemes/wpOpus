import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from "@wordpress/block-editor";
import {
	Panel,
	PanelBody,
	Icon,
	TextControl,
	RangeControl,
	Spinner,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { Fragment, useState, useEffect, useMemo } from "@wordpress/element";
import {
	wpOpusGetCustomIcons,
	// wpOpusGetCustomIcon
} from "../utils/get-icons";

import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(props) {
	const { attributes, setAttributes } = props;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const iconStyle = {
		...borderProps.style,
		...colorProps.style,
		...spacingProps.style,
	};

	const [icons, setIcons] = useState([]); // Initialize with empty array

	// icons popup
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	// config icons
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterTerm, setFilterTerm] = useState("");

	function setOption(key, value) {
		setAttributes({ [key]: value });
	}

	useEffect(() => {
		setError(null);

		wpOpusGetCustomIcons()
			.then((data) => {
				setIcons(data);
			})
			.catch((error) => {
				setError(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	const filteredItems = useMemo(() => {
		return icons.filter((icon) => {
			if ("filled" === filterTerm) {
				return (
					!icon.value.label.includes("outline") &&
					!icon.value.label.includes("sharp") &&
					icon.value.label.includes(searchTerm)
				);
			}
			return (
				icon.value.label.includes(filterTerm) &&
				icon.value.label.includes(searchTerm)
			);
		});
	}, [icons, filterTerm, searchTerm]);

	return (
		<div {...useBlockProps()} style={iconStyle}>
			<InspectorControls key="setting">
				<Panel>
					<PanelBody title={__("Icon Settings", "wpopus")} initialOpen={true}>
						{error && (
							<p>
								{__("Error Fetching Icons:", "wpopus")} {error.message}
							</p>
						)}
						{Array.isArray(icons) && (
							<Fragment>
								<fieldset className="st-search-icons">
									<TextControl
										label={__("Select Icon", "wpopus")}
										autocomplete="off"
										value={searchTerm}
										onChange={(newValue) => {
											setSearchTerm(newValue);
										}}
										onClick={(event) => {
											event.preventDefault();
											setIsVisible(true);
										}}
										placeholder={__("Search Icon", "wpopus")}
									/>
									<Icon icon="screenoptions" onClick={toggleVisible} />
								</fieldset>

								{!isVisible && attributes.iconValue && (
									<span
										className="st-selected-icon"
										dangerouslySetInnerHTML={{ __html: attributes.iconValue }}
									/>
								)}

								{isVisible && (
									<Fragment>
										<fieldset>
											<ToggleGroupControl
												value={filterTerm}
												isBlock
												onChange={(newValue) => {
													setFilterTerm(newValue);
												}}
											>
												<ToggleGroupControlOption
													value=""
													label={__("All", "wpopus")}
												/>
												<ToggleGroupControlOption
													value="outline"
													label={__("Outline", "wpopus")}
												/>
												<ToggleGroupControlOption
													value="sharp"
													label={__("Sharp", "wpopus")}
												/>
												<ToggleGroupControlOption
													value="filled"
													label={__("Filled", "wpopus")}
												/>
											</ToggleGroupControl>
										</fieldset>

										{isLoading && (
											<h3>
												{__("Loading Icons", "wpopus")} <Spinner />
											</h3>
										)}

										<div className="st-icons-list">
											{filterTerm === "sharp" || filterTerm === "outline" ? (
												<h3>{__("Only in pro version", "wpopus")}</h3>
											) : (
												!error &&
												!isLoading &&
												filteredItems.map((icon) => (
													<a
														href="#"
														title={icon.value.label}
														icon-value={icon.value.value}
														onClick={(event) => {
															event.preventDefault();
															setOption(
																"iconValue",
																event.currentTarget.getAttribute("icon-value"),
															);
															setOption(
																"iconName",
																event.currentTarget.getAttribute("title"),
															);
															setIsVisible(false);
														}}
													>
														<span
															className={`${icon.value.label}`}
															dangerouslySetInnerHTML={{
																__html: icon.value.value,
															}}
														/>
													</a>
												))
											)}
										</div>
									</Fragment>
								)}
							</Fragment>
						)}
					</PanelBody>

					<PanelBody title={__("Icon Style", "wpopus")}>
						<fieldset>
							<RangeControl
								label={__("Icon Size", "wpopus")}
								value={attributes.iconSize}
								min={10}
								max={300}
								onChange={(newValue) => {
									setOption("iconSize", parseInt(newValue));
								}}
							/>
						</fieldset>
					</PanelBody>
				</Panel>
			</InspectorControls>

			{!attributes.iconValue && <span>{__("Loading Icon..", "wpopus")}</span>}

			<span
				style={{
					height: `${attributes.iconSize}px`,
					width: `${attributes.iconSize}px`,
				}}
				className="wpopus-icon"
				dangerouslySetInnerHTML={{ __html: attributes.iconValue }}
			/>
		</div>
	);
}
