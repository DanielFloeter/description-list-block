
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {

//console.log("save", attributes);

	const { list } = attributes;

	const Section = ( { rows } ) => {
		if ( ! rows.length ) {
			return null;
		}
		
		return (
			rows.map(
				({ content, tag, placeholder }, rowIndex) => {
					<RichText.Content
					tagName={tag}
					value={content}
					key={rowIndex}
					/>
				}
			)
		);
	};

	return (
		<dl { ...useBlockProps.save() }>
			<Section rows={ list } />
		</dl>
	);
}

