/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
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


			{/* <RichText
				tagName="dt"
				value={attributes.list.term}
				onChange={(term) => setAttributes({ term })}
				placeholder={__('dt (term/key) ...')}
			/>
			<RichText
				tagName="dd"
				value={attributes.list.description}
				onChange={(description) => setAttributes({ description })}
				placeholder={__('dd (description) ...')}
			/> */}
		</dl>
	);
}
