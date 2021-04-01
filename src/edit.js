
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Button,
	Placeholder,
	TextControl,
} from '@wordpress/components';
import {
	RichText,
	BlockIcon,
	useBlockProps,
} from '@wordpress/block-editor';
import './editor.scss';

/**
 * Internal dependencies
 */
import {
	createTable,
	updateSelectedCell,
	isEmptyTableSection,
} from './state';

export default function Edit({ attributes: { list }, attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [initialRowCount, setInitialRowCount] = useState(2);
	const [selectedCell, setSelectedCell] = useState();

	/**
	 * Updates the initial row count used for table creation.
	 *
	 * @param {number} count New initial row count.
	 */
	function onChangeInitialRowCount(count) {
		setInitialRowCount(count);
	}

	/**
	 * Creates a table based on dimensions in local state.
	 *
	 * @param {Object} event Form submit event.
	 */
	function onCreateTable(event) {
		event.preventDefault();

		setAttributes(
			createTable({
				rowCount: parseInt(initialRowCount, 10) || 2,
			})
		);
	}

	/**
	 * Changes the content of the currently selected cell.
	 *
	 * @param {Array} content A RichText content value.
	 */
	function onChange(content) {
		if (!selectedCell) {
			return;
		}

		setAttributes(
			updateSelectedCell(
				attributes,
				selectedCell,
				(cellAttributes) => ({
					...cellAttributes,
					content,
				}),
			)
		);
	}

	const isEmpty = isEmptyTableSection( attributes[ 'list' ] );

	// let beispiel_list = [
	// 	{
	// 		content: __(''),
	// 		tag: 'dt',
	// 		placeholder: __('Term ...')
	// 	},
	// 	{
	// 		content: __(''),
	// 		tag: 'dd',
	// 		placeholder: __('Description ...')
	// 	},
	// 	{
	// 		content: __(''),
	// 		tag: 'dt',
	// 		placeholder: __('Term ...')
	// 	},
	// 	{
	// 		content: __(''),
	// 		tag: 'dd',
	// 		placeholder: __('Description ...')
	// 	},
	// ];

	console.log("attributs", attributes[ 'list' ]);

	return (
		<dl {...blockProps}>
			{ !isEmpty && (
				attributes[ 'list' ].map(
					({ content, tag, placeholder }, rowIndex) => (
						<RichText
							tagName={tag}
							key={rowIndex}
							value={content}
							onChange={onChange}
							unstableOnFocus={() => {
								setSelectedCell({
									sectionName: 'body',
									rowIndex,
									type: 'cell',
								});
							}}
							placeholder={placeholder}
						/>
					)
				)
			)}
			{ isEmpty && (
				<Placeholder
					label={__('Description List')}
					icon={<BlockIcon icon="clipboard" showColors />}
					instructions={__('Insert a description list for sharing data.')}
				>
					<form
						className="blocks-table__placeholder-form"
						onSubmit={onCreateTable}
					>
						<TextControl
							type="number"
							label={__('dt/dd pair count')}
							value={initialRowCount}
							onChange={onChangeInitialRowCount}
							min="1"
							className="blocks-table__placeholder-input"
						/>
						<Button
							className="blocks-table__placeholder-button"
							isPrimary
							type="submit"
						>
							{__('Create a Description List')}
						</Button>
					</form>
				</Placeholder>
			)}
		</dl>
	);
}
