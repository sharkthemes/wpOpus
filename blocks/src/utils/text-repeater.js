import { __ } from "@wordpress/i18n";
import { TextControl, Button, Flex, FlexItem } from "@wordpress/components";

export default function TextControlRepeater({ label = __( 'Text Field ', 'wpopus' ), buttonLabel = __( 'Add Text Field', 'wpopus' ), texts = "", onChangeTexts }) {
	const values = texts.split("|");

	function onRemoveText(index) {
		const filtered = values.filter((t, i) => index !== i);
		const updated = filtered.join("|");
		onChangeTexts(updated);
	}

	function onChangeText(index, newText) {
		const updated = values.map((text, i) => {
			if ( index === i ) {
				return newText;
			} 
			return text;
		});

		onChangeTexts(updated.join("|"));
	}

	return (
		<Flex direction="column">
			{values.map((text, index) => (
				<FlexItem key={index}>
					<Flex direction="row">
						<FlexItem>
							<TextControl
								label={ label + ( index + 1 ) }
								value={text}
								onChange={(newText) => onChangeText(index, newText)}
							/>
						</FlexItem>
						<FlexItem>
							<Button 
								style={{
									height: "31px",
									width: "31px",
									marginTop: "15px",
									color: "#ffffff",
									backgroundColor: "#ce0c0c",
								}}
								onClick={() => onRemoveText(index)}
							>
								X
							</Button>
						</FlexItem>
					</Flex>
					
					
				</FlexItem>
			))}

			<FlexItem>
				<Button className="is-primary"
					onClick={() => {
						const updated = [...values, label];
						onChangeTexts(updated.join("|"));
					}}
				>
					{ buttonLabel }
				</Button>
			</FlexItem>
		</Flex>
	);
}
