
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();

	const { list } = attributes;

	return (
		<dl {...blockProps} >
			<RichText.Content
				tagName="dt"
				value={list.term}
			/>
			<RichText.Content
				tagName="dd"
				value={list.description}
			/>
		</dl>
	);
}
