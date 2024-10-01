import { __ } from "@wordpress/i18n";
import {
	InspectorControls
} from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";
import {
	Panel,
	PanelBody,
	SelectControl,
	ToggleControl,
	ColorPalette,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalNumberControl as NumberControl,
	__experimentalBoxControl as BoxControl,
	__experimentalBorderControl as BorderControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";

export default function Controls({ attributes, setAttributes }) {
	function setMetaOption(key, value) {
		setAttributes({
			options: {
				...attributes.options,
				[key]: value,
			},
		});
	}

	return (
		<InspectorControls key="setting">
			<Panel>
				<PanelBody title={__("Slide Settings", "wpopus")} initialOpen={true}>
					<fieldset>
						<NumberControl
							label={__("Slide Transition Time", "wpopus")}
							labelPosition={"top"}
							step={100}
							max={2000}
							min={100}
							spinControls={"custom"}
							value={attributes.options.speed}
							onChange={(newValue) => {
								setMetaOption("speed", parseInt(newValue));
							}}
						/>
					</fieldset>

					<hr />

					{/* auto play settings */}
					<fieldset>
						<ToggleControl
							label={__("Auto Play", "wpopus")}
							checked={attributes.options.autoplay}
							onChange={(newValue) => {
								setMetaOption("autoplay", newValue);
							}}
						/>
					</fieldset>

					{attributes.options.autoplay && (
						<Fragment>
							<br />
							<fieldset>
								<NumberControl
									label={__("Auto Play Delay in Seconds", "wpopus")}
									labelPosition={"top"}
									step={1}
									max={15}
									min={0}
									spinControls={"custom"}
									value={attributes.options.autoPlayDelay}
									onChange={(newValue) => {
										setMetaOption("autoPlayDelay", newValue);
									}}
								/>
							</fieldset>
						</Fragment>
					)}
				</PanelBody>

				{/* pagination */}
				<PanelBody
					title={__("Pagination Settings", "wpopus")}
					initialOpen={false}
				>
					<fieldset>
						<ToggleControl
							label={__("Enable Pagination", "wpopus")}
							checked={attributes.options.pagination}
							onChange={(newValue) => {
								setMetaOption("pagination", newValue);
							}}
						/>
					</fieldset>

					{attributes.options.pagination && (
						<Fragment>
							<br />
							<fieldset>
								<ToggleGroupControl
									label={__("Pagination Type", "wpopus")}
									help={__(
										"Note: To see the change please disable pagination and enable it again.",
										"wpopus",
									)}
									value={attributes.options.paginationType}
									isBlock
									onChange={(newValue) => {
										setMetaOption("paginationType", newValue);
									}}
								>
									<ToggleGroupControlOption
										value="bullets"
										label={__("Bullets", "wpopus")}
									/>
									<ToggleGroupControlOption
										value="fraction"
										label={__("Fraction", "wpopus")}
									/>
								</ToggleGroupControl>
							</fieldset>

							{"bullets" == attributes.options.paginationType && (
								<Fragment>
									<br />
									<fieldset>
										<BoxControl
											label={__("Dots Size", "wpopus")}
											values={attributes.options.paginationSize}
											splitOnAxis={true}
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.options.paginationSize,
												},
											]}
											onChange={(newValue) => {
												setMetaOption("paginationSize", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<BorderControl
											label={__("Dots Border", "wpopus")}
											value={attributes.options.paginationBorder}
											disableUnits={true}
											enableStyle={false}
											onChange={(newValue) => {
												setMetaOption("paginationBorder", newValue);
											}}
										/>
									</fieldset>
								</Fragment>
							)}

							{"fraction" == attributes.options.paginationType && (
								<Fragment>
									<br />
									<fieldset>
										<UnitControl
											label={__("Font Size", "wpopus")}
											value={attributes.options.paginationFractionSize}
											min={0}
											step={0.1}
											units={[
												{
													value: "px",
													label: "px",
													default: attributes.options.paginationFractionSize,
												},
												{ value: "em", label: "em", default: 0 },
												{ value: "rem", label: "rem", default: 0 },
											]}
											onChange={(newValue) => {
												setMetaOption("paginationFractionSize", newValue);
											}}
										/>
									</fieldset>

									<br />
									<fieldset>
										<SelectControl
											label={__("Font Weight", "wpopus")}
											labelPosition={"top"}
											value={attributes.options.paginationFractionWeight}
											options={[
												{ label: __("Thin", "wpopus"), value: "100" },
												{ label: __("Extra Light", "wpopus"), value: "200" },
												{ label: __("Light", "wpopus"), value: "300" },
												{ label: __("Regular", "wpopus"), value: "400" },
												{ label: __("Medium", "wpopus"), value: "500" },
												{ label: __("Semi Bold", "wpopus"), value: "600" },
												{ label: __("Bold", "wpopus"), value: "700" },
												{ label: __("Extra Bold", "wpopus"), value: "800" },
												{ label: __("Black", "wpopus"), value: "900" },
											]}
											onChange={(newValue) => {
												setMetaOption("paginationFractionWeight", newValue);
											}}
										/>
									</fieldset>
								</Fragment>
							)}

							<br />
							<label className="inspector-control-label">
								{__("Pagination Color", "wpopus")}
								<ColorPalette
									className="wpopus-color-palette"
									clearable={false}
									enableAlpha={false}
									value={attributes.options.paginationColor}
									onChange={(newValue) => {
										setMetaOption("paginationColor", newValue);
									}}
								/>
							</label>
						</Fragment>
					)}
				</PanelBody>

				{/* navigation settings */}
				<PanelBody
					title={__("Navigation Settings", "wpopus")}
					initialOpen={false}
				>
					<fieldset>
						<ToggleControl
							label={__("Enable Navigation", "wpopus")}
							checked={attributes.options.navigation}
							onChange={(newValue) => {
								setMetaOption("navigation", newValue);
							}}
						/>
					</fieldset>

					{attributes.options.navigation && (
						<Fragment>
							<br />
							<fieldset>
								<BoxControl
									label={__("Arrow Control Size", "wpopus")}
									values={attributes.options.navigationSize}
									splitOnAxis={true}
									units={[
										{
											value: "px",
											label: "px",
											default: attributes.options.navigationSize,
										},
									]}
									onChange={(newValue) => {
										setMetaOption("navigationSize", newValue);
									}}
								/>
							</fieldset>

							<br />
							<fieldset>
								<BoxControl
									label={__("Arrow Control Padding", "wpopus")}
									values={attributes.options.navigationPadding}
									units={[
										{
											value: "px",
											label: "px",
											default: attributes.options.navigationPadding,
										},
									]}
									onChange={(newValue) => {
										setMetaOption("navigationPadding", newValue);
									}}
								/>
							</fieldset>

							<br />
							<fieldset>
								<BorderControl
									label={__("Arrow Control Border", "wpopus")}
									value={attributes.options.navigationBorder}
									disableUnits={true}
									enableStyle={false}
									onChange={(newValue) => {
										setMetaOption("navigationBorder", newValue);
									}}
								/>
							</fieldset>

							<br />
							<fieldset>
								<UnitControl
									label={__("Arrow Control Border Radius", "wpopus")}
									value={attributes.options.navigationBorderRadius}
									min={0}
									units={[
										{
											value: "px",
											label: "px",
											default: attributes.options.navigationBorderRadius,
										},
										{ value: "%", label: "%", default: 0 },
									]}
									onChange={(newValue) => {
										setMetaOption("navigationBorderRadius", newValue);
									}}
								/>
							</fieldset>

							<br />
							<label className="inspector-control-label">
								{__("Arrow Control Color", "wpopus")}
								<ColorPalette
									className="wpopus-color-palette"
									clearable={false}
									enableAlpha={false}
									value={attributes.options.navigationColor}
									onChange={(newValue) => {
										setMetaOption("navigationColor", newValue);
									}}
								/>
							</label>

							<br />
							<label className="inspector-control-label">
								{__("Arrow Control Background Color", "wpopus")}
								<ColorPalette
									className="wpopus-color-palette"
									clearable={false}
									enableAlpha={true}
									value={attributes.options.navigationBgColor}
									onChange={(newValue) => {
										setMetaOption("navigationBgColor", newValue);
									}}
								/>
							</label>
						</Fragment>
					)}
				</PanelBody>
			</Panel>
		</InspectorControls>
	);
}
