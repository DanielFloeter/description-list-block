
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();

	return (
		<dl {...blockProps} >
			<RichText.Content
				tagName="dt"
				value={attributes.list.term}
			/>
			<RichText.Content
				tagName="dd"
				value={attributes.list.description}
			/>
		</dl>
	);
}
