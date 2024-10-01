import { __ } from "@wordpress/i18n";

const WelcomePage = () => {
	return (
		<div className="tab-content welcome">
			<div className="welcome-wrapper">
				<h2>{__("Welcome to wpOpus Plugin!", "wpopus")}</h2>
				<h3>
					{__(
						"Supercharge your WordPress site with our powerful collection of Gutenberg blocks and features (Limited in Free Version & Full Access in Pro Version):",
						"wpopus",
					)}
				</h3>

				<ul>
					<li>{__("24+ Advanced Custom Gutenberg blocks", "wpopus")}</li>
					<li>{__("Import pre-built templates", "wpopus")}</li>
					<li>{__("One click demo importer for quick setup", "wpopus")}</li>
					<li>{__("Text to speech for Audio Content", "wpopus")}</li>
					<li>{__("Unlimited Google Fonts integration", "wpopus")}</li>
					<li>{__("1300+ aesthetic icons", "wpopus")}</li>
					<li>{__("Eye-catching animations", "wpopus")}</li>
					<li>{__("Smooth hover effects", "wpopus")}</li>
					<li>{__("Responsive visibility options", "wpopus")}</li>
					<li>{__("Infinite Scroll & Load More for Query Posts Block", "wpopus")}</li>
					<li>{__("Masonry layout for Query Posts and Advanced Gallery Blocks", "wpopus")}</li>
				</ul>

				<p>
					{__(
						"wpOpus gives you the tools to create stunning, dynamic websites with ease. Whether you're a beginner or an experienced developer, our intuitive blocks and flexible options will help you bring your vision to life. Dive in and start exploring the possibilities today!",
						"wpopus",
					)}
				</p>
				<p>
					{__(
						"Need more details on any feature? Let us know, and we would be happy to elaborate.",
						"wpopus",
					)}
				</p>

				<div className="meta-links">
					<a href={wpOpus.landing_page_url} target="_blank" rel="nofollow">
						{__("Visit wpOpus Site", "wpopus")}
					</a>
					<a href={wpOpus.documentation_url} target="_blank" rel="nofollow">
						{__("Documentation", "wpopus")}
					</a>
					<a href={wpOpus.contact_url} target="_blank" rel="nofollow">
						{__("Support", "wpopus")}
					</a>
				</div>
			</div>
		</div>
	);
};
export default WelcomePage;
