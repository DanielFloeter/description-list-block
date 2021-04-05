
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Button,
	DropdownMenu,
	Placeholder,
	TextControl,
	ToolbarGroup,
	ToolbarItem,
} from '@wordpress/components';
import {
	tableRowAfter,
	tableRowBefore,
	tableRowDelete,
} from '@wordpress/icons';
import {
	BlockControls,
	RichText,
	BlockIcon,
	useBlockProps,
} from '@wordpress/block-editor';
import './editor.scss';
import {
	createTable,
	updateSelectedCell,
	insertRow,
	deleteRow,
	isEmptyDescriptionList,
} from './state';


export default function Edit({ attributes: { list }, attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const [initialRowCount, setInitialRowCount] = useState(2);
	const [selectedCell, setSelectedCell] = useState();
	const placeholder = {
		dt: __('Term ...'),
		dd: __('Description ...'),
	};

	/**
	 * Updates the initial row count used for table creation.
	 *
	 * @param {number} count New initial row count.
	 */
	function onChangeInitialRowCount(count) {
		setInitialRowCount(count);
	}


	/**
	 * Inserts a row at the currently selected row index, plus `delta`.
	 *
	 * @param {number} delta Offset for selected row index at which to insert.
	 */
	function onInsertRow(delta) {
		if (!selectedCell) {
			return;
		}

		const { sectionName, rowIndex } = selectedCell;
		const listPairIndex = rowIndex - (rowIndex % 2);
		const newRowIndex = listPairIndex + delta;

		setAttributes(
			insertRow(attributes, {
				sectionName,
				rowIndex: newRowIndex,
			})
		);
		// Select the first cell of the new row
		setSelectedCell({
			sectionName,
			rowIndex: newRowIndex,
			type: 'cell',
		});
	}

	/**
	 * Inserts a row before the currently selected row.
	 */
	function onInsertRowBefore() {
		onInsertRow(0);
	}

	/**
	 * Inserts a row after the currently selected row.
	 */
	function onInsertRowAfter() {
		onInsertRow(2);
	}

	/**
	 * Deletes the currently selected row.
	 */
	function onDeleteRow() {
		if (!selectedCell) {
			return;
		}

		const { sectionName, rowIndex } = selectedCell;

		setSelectedCell();
		setAttributes(deleteRow(attributes, { sectionName, rowIndex }));
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

	const tableControls = [
		{
			icon: tableRowBefore,
			title: __('Insert list pair before'),
			isDisabled: !selectedCell,
			onClick: onInsertRowBefore,
		},
		{
			icon: tableRowAfter,
			title: __('Insert list pair after'),
			isDisabled: !selectedCell,
			onClick: onInsertRowAfter,
		},
		{
			icon: tableRowDelete,
			title: __('Delete list pair'),
			isDisabled: !selectedCell,
			onClick: onDeleteRow,
		},
	];

	const isEmpty = isEmptyDescriptionList(attributes['list']);

	return (
		<dl {...blockProps}>

			{ !isEmpty && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarItem>
							{(toggleProps) => (
								<DropdownMenu
									hasArrowIndicator
									icon={"welcome-add-page"}
									toggleProps={toggleProps}
									label={__('Edit table')}
									controls={tableControls}
								/>
							)}
						</ToolbarItem>
					</ToolbarGroup>
				</BlockControls>
			)}


			{ !isEmpty && (
				attributes['list'].map(
					({ content, tag }, rowIndex) => (
						<RichText
							tagName={tag}
							key={rowIndex}
							value={content}
							onChange={onChange}
							unstableOnFocus={() => {
								setSelectedCell({
									sectionName: 'list',
									rowIndex,
									type: 'cell',
								});
							}}
							placeholder={placeholder[tag]}
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
