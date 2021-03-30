
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();

	// const { list } = attributes;
	let { list } = {list: [
		{
			content: __( '' ),
			tag: 'dt',
			placeholder: __('Term ...')
		},
		{
			content: __( '' ),
			tag: 'dd',
			placeholder: __('Description ...')
		},
		{
			content: __( '' ),
			tag: 'dt',
			placeholder: __('Term ...')
		},
		{
			content: __( '' ),
			tag: 'dd',
			placeholder: __('Description ...')
		},
	]};

	return (
		<dl {...blockProps}>
			{list.map(({ content, tag, placeholder }, index) => (
				<RichText
					tagName={tag}
					value={content}
					onChange={(term) => setAttributes({ term })}
					placeholder={placeholder}
				/>
			)
			)}
		</dl>
	);
}
