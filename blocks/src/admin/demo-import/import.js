import { __ } from "@wordpress/i18n";
import { Spinner, Icon } from "@wordpress/components";
import { Fragment, useState, useEffect } from "@wordpress/element";

export default function WpOpusImportDemo({ demoQuery, onDemoDataFetched }) {
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const [hasError, setHasError] = useState(null);

	// root url for api fetch of demo data
	const apiRootUrl = demoQuery.content.replace(/\/$/, "");

	// check if demo version is pro or free
	const pluginVersion = demoQuery.category_slug.includes("pro")
		? "pro"
		: "free";

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

	const getDemoData = async () => {
		setIsLoading(true);

		try {
			const tokenToVerify = generateToken();
			const headers = {
				"Content-Type": "application/json",
				Authorization: `st ${tokenToVerify}`,
				version: pluginVersion,
			};

			const response = await fetch(
				apiRootUrl + "/wp-json/wpopusdemoexport/v1/demo",
				{
					method: "GET",
					headers: headers,
				},
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const responseData = await response.json();
			let demoData = [];

			// Check different response structures
			if (responseData.demoData) {
				if (responseData.demoData.data) {
					demoData = responseData.demoData.data;
				} else {
					demoData = responseData.demoData;
				}
			} else {
				setHasError(__("Invalid response format", "wpopus"));
			}

			if (demoData) {
				onDemoDataFetched(demoData);
				setHasFetched(true);
			} else {
				setHasError(__("No demo data found", "wpopus"));
			}
		} catch (error) {
			setHasError(`${__("Error fetching demo routes:", "wpopus")} ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (pluginVersion !== "pro" && !hasFetched) {
			getDemoData();
		}
	}, [hasFetched]);

	return (
		<Fragment>
			{hasError ? (
				<h3 className="wpopus-loading-demo">{hasError}</h3>
			) : (
				<Fragment>
					{isLoading ? (
						<h3 className="wpopus-loading-demo">
							{__("Preparing Demo Data", "wpopus")} <Spinner />
						</h3>
					) : (
						<h3 className="wpopus-loading-demo">
							{__("Demo Data Prepared", "wpopus")} <Icon icon="yes-alt" />
						</h3>
					)}
				</Fragment>
			)}
		</Fragment>
	);
}
