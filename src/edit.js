
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
	createDescriptionList,
	updateSelectedCell,
	insertListPair,
	deleteListPair,
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
	 * Updates the initial row count used for description list creation.
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
	function onInsertListPair(delta) {
		if (!selectedCell) {
			return;
		}

		const { sectionName, rowIndex } = selectedCell;
		const listPairIndex = rowIndex - (rowIndex % 2);
		const newRowIndex = listPairIndex + delta;

		setAttributes(
			insertListPair(attributes, {
				sectionName,
				rowIndex: newRowIndex,
			})
		);
		// Select the description list pair
		setSelectedCell({
			sectionName,
			rowIndex: newRowIndex,
			type: 'cell',
		});
	}

	/**
	 * Inserts a row before the currently selected row.
	 */
	function onInsertListPairBefore() {
		onInsertListPair(0);
	}

	/**
	 * Inserts a row after the currently selected row.
	 */
	function onInsertListPairAfter() {
		onInsertListPair(2);
	}

	/**
	 * Deletes the currently selected row.
	 */
	function onDeleteListPair() {
		if (!selectedCell) {
			return;
		}

		const { sectionName, rowIndex } = selectedCell;

		setSelectedCell();
		setAttributes(deleteListPair(attributes, { sectionName, rowIndex }));
	}


	/**
	 * Creates a description list based on dimensions in local state.
	 *
	 * @param {Object} event Form submit event.
	 */
	function onCreateDescriptionList(event) {
		event.preventDefault();

		setAttributes(
			createDescriptionList({
				rowCount: parseInt(initialRowCount, 10) || 2,
			})
		);
	}

	/**
	 * Changes the content of the currently selected element.
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
			title: __('Insert List pair before'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairBefore,
		},
		{
			icon: tableRowAfter,
			title: __('Insert List pair after'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairAfter,
		},
		{
			icon: tableRowDelete,
			title: __('Delete List pair'),
			isDisabled: !selectedCell,
			onClick: onDeleteListPair,
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
									label={__('Edit description list')}
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
						onSubmit={onCreateDescriptionList}
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
