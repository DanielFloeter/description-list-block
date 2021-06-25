
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	Button,
	DropdownMenu,
	Placeholder,
	TextControl,
	ToolbarGroup,
	ToolbarItem,
	FontSizePicker,
} from '@wordpress/components';
import {
	tableRowAfter,
	tableRowBefore,
	tableRowDelete,
} from '@wordpress/icons';
import {
	InspectorControls,
	BlockControls,
	RichText,
	BlockIcon,
	useBlockProps,
	RichTextShortcut,
} from '@wordpress/block-editor';
import './editor.scss';
import {
	createDescriptionList,
	updateSelectedCell,
	insertListPair,
	deleteListPair,
	isEmptyDescriptionList,
} from './state';
import classnames from 'classnames';
import { ENTER, SHIFT, UP } from '@wordpress/keycodes';

export default function Edit({ attributes, setAttributes }) {
	const { 
		termFontSize, 
		descriptionsFontSize 
	} = attributes;
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

	function onEnter() { 

		const { sectionName, rowIndex } = selectedCell;
			const tag = rowIndex % 2 ? 'dd' : 'dt';
			switch (tag) {
				case 'dt':
					// setSelectedCell({
					// 	sectionName: 'list',
					// 	rowIndex: rowIndex + 2,
					// 	type: 'cell',
					// });
				break;
				case 'dd':
					const delta = 2;
					const { sectionName, rowIndex } = selectedCell;
					const listPairIndex = rowIndex - (rowIndex % 2);
					const newRowIndex = listPairIndex + delta;
					
					setAttributes(
						insertListPair(attributes, {
							sectionName,
							rowIndex: newRowIndex,
						})
					);

					setSelectedCell({
						sectionName: 'list',
						rowIndex: newRowIndex - 1,
						type: 'cell',
					});
					break;
				}

			// setTimeout( (target) => { 
			// 	jQuery(target).next().focus(); 
			// }, 0, event.target );
	}

	function onUP() {
		onInsertListPair(0);
	}

	function onDown() {
		onInsertListPair(2);
	}

	function onDelete() {
		onDeleteListPair();
	}

	const tableControls = [
		{
			icon: tableRowBefore,
			title: __('Insert before (Cmd/Shift+E)'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairBefore,
		},
		{
			icon: tableRowAfter,
			title: __('Insert after (Cmd/Shift+D)'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairAfter,
		},
		{
			icon: tableRowDelete,
			title: __('Delete selected (Cmd/Shift+Y)'),
			isDisabled: !selectedCell,
			onClick: onDeleteListPair,
		},
	];

	const isEmpty = isEmptyDescriptionList(attributes['list']);

	const fontSizes = [
        {
            name: __( 'Small' ),
            slug: 'small',
            size: 18,
        },
        {
            name: __( 'Normal' ),
            slug: 'normal',
            size: 21,
        },
        {
            name: __( 'Large' ),
            slug: 'large',
            size: 26,
        },
		{
            name: __( 'Huge' ),
            slug: 'huge',
            size: 32,
        },
    ];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Typography' ) }>
					<h2>Terms</h2>
					<FontSizePicker
						fontSizes={ fontSizes }
						value={ termFontSize }
						onChange={ (newFontSize) => setAttributes( { termFontSize: newFontSize } )}
					/>
					 <h2>Descriptions</h2>
					<FontSizePicker
						fontSizes={ fontSizes }
						value={ descriptionsFontSize }
						onChange={ ( newFontSize ) => {
							setAttributes( { descriptionsFontSize: newFontSize } )
						} }
					/> 
				</PanelBody>
			</InspectorControls>
			<dl {...blockProps}
				className={classnames( blockProps.className, {
					[ `has-${ termFontSize }-term-font-size` ]: termFontSize,
					[ `has-${ descriptionsFontSize }-descriptions-font-size` ]: descriptionsFontSize,
				} )}
			>
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
					<>
						<RichTextShortcut
							type="primary"
							character="e"
							onUse={ onUP }
						/>
						<RichTextShortcut
							type="primary"
							character="d"
							onUse={ onDown }
						/>
						<RichTextShortcut
							type="primary"
							character="y"
							onUse={ onDelete }
						/>
						{/* <RichTextShortcut
							type="primary"
							character="ENTER"
							onUse={ onEnter }
						/> */}
					</>
				)}
				{ !isEmpty && (
					attributes['list'].map(
						({ content, tag }, rowIndex) => (
							<RichText
								tagName={tag}
								key={rowIndex}
								style={{fontSize:(tag === 'dt' ? termFontSize : descriptionsFontSize)}}
								value={content}
								onChange={onChange}
								unstableOnFocus={() => {
									setSelectedCell({
										sectionName: 'list',
										rowIndex,
										type: 'cell'
									});
								}}
								multiline='false'
								// onKeyDownCapture={onKeyUp}
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
		</>
	);
}
