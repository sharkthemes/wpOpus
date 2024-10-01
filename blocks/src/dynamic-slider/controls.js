import { __ } from "@wordpress/i18n";
import {
	InspectorControls,
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
import QueryControls from "./query-controls";

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
				<QueryControls attributes={attributes} setAttributes={setAttributes} />

				<PanelBody title={__("Slide Settings", "wpopus")} initialOpen={false}>
					<br />
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

					<hr />

					<br />
					<fieldset>
						<NumberControl
							label={__("Slides Per View", "wpopus")}
							labelPosition={"top"}
							step={1}
							max={10}
							min={1}
							spinControls={"custom"}
							value={attributes.options.column}
							onChange={(newValue) => {
								setMetaOption("column", parseInt(newValue));
							}}
						/>
					</fieldset>

					<br />
					<fieldset>
						<NumberControl
							label={__("Space Between", "wpopus")}
							labelPosition={"top"}
							step={1}
							max={100}
							min={0}
							spinControls={"custom"}
							value={attributes.options.gap}
							onChange={(newValue) => {
								setMetaOption("gap", newValue);
							}}
						/>
					</fieldset>
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

							<br />
							<fieldset>
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
							</fieldset>
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
