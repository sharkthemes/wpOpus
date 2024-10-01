import { __ } from "@wordpress/i18n";
import { TabPanel } from "@wordpress/components";
import { render, Fragment } from "@wordpress/element";
import WelcomePage from "./welcome";
import PreLoader from "./preloader";
import BackToTop from "./backtotop";

const WpOpusAdminSettings = () => {
	return (
		<TabPanel
			className="wpopus-tab-panel"
			activeClass="active-tab"
			tabs={[
				{
					name: "welcome",
					title: __("Welcome", "wpopus"),
					className: "welcome-tab",
				},
				{
					name: "preloader",
					title: __("PreLoader", "wpopus"),
					className: "preloader-tab",
				},
				{
					name: "backtotop",
					title: __("Back to Top", "wpopus"),
					className: "backtotop-tab",
				},
			]}
		>
			{(tab) => (
				<div className="wpopus-setting-wrapper wrap">
					{"welcome" === tab.name && (
						<Fragment>
							<WelcomePage />
						</Fragment>
					)}

					{"preloader" === tab.name && (
						<Fragment>
							<PreLoader />
						</Fragment>
					)}

					{"backtotop" === tab.name && (
						<Fragment>
							<BackToTop />
						</Fragment>
					)}
				</div>
			)}
		</TabPanel>
	);
};

document.addEventListener("DOMContentLoaded", function () {
	if (document.getElementById("wpopus-settings")) {
		render(<WpOpusAdminSettings />, document.getElementById("wpopus-settings"));
	}
});
