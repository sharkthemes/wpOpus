import { __ } from "@wordpress/i18n";
import { Spinner, Icon } from "@wordpress/components";
import { Fragment, useState, useEffect } from "@wordpress/element";

const InsertDemoData = (data, route) => {
	const [isLoading, setIsLoading] = useState(false);
	const [importDataSuccess, setImportDataSuccess] = useState(false);
	const [hasError, setHasError] = useState(false);

	const installDemo = async (data) => {
		try {
			setIsLoading(true);

			const response = await fetch(
				wpOpus.ajax_url + "?action=wpopus_import_demo",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-WP-Nonce": wpOpus.import_demo_nonce,
					},
					body: JSON.stringify({
						demoData: data.data,
						demoRoute: data.route,
					}),
				},
			);

			// Log the raw response
			const rawResponse = await response.text();

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const resultDataImport = JSON.parse(rawResponse); // Use JSON.parse to catch any invalid JSON issues
			if (resultDataImport.success) {
				setImportDataSuccess(resultDataImport.data);
			} else {
				setHasError(resultDataImport.data);
			}
		} catch (error) {
			setHasError(`${__("Error importing demo data:", "wpopus")} ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		installDemo(data);
	}, []);

	return (
		<Fragment>
			{hasError ? (
				<h3 className="wpopus-loading-demo">{hasError}</h3>
			) : (
				<Fragment>
					{isLoading ? (
						<Fragment>
							<h3 className="wpopus-loading-demo">
								{__("Importing demo data", "wpopus")} <Spinner />
							</h3>
							{ Object.keys(data.data.active_plugins).length > 0 && 
								<h3 className="wpopus-loading-demo">
									{__("Importing recommended plugins", "wpopus")} <Spinner />
								</h3>
							}
						</Fragment>
					) : (
						<Fragment>
							<h3 className="wpopus-loading-demo">
								{__("Demo data imported", "wpopus")} <Icon icon="yes-alt" />
							</h3>
							{ Object.keys(data.data.active_plugins).length > 0 &&
								<h3 className="wpopus-loading-demo">
									{__("Recommended plugins installed", "wpopus")} <Icon icon="yes-alt" />
								</h3>
							}
							<h3 className="wpopus-loading-demo">
								{importDataSuccess} <Icon icon="yes-alt" />
							</h3>
						</Fragment>
					)}
				</Fragment>
			)}
		</Fragment>
	);
};

export default InsertDemoData;
