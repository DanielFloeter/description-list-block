
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
	ColorPalette,
	__experimentalBoxControl as BoxControl,
	RangeControl
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
		termsFontSize, 
		descriptionsFontSize,
		termsColor,
		descriptionsColor,
		termsMargin,
		descriptionsMargin,
		termsPadding,
		descriptionsPadding,
		indent,
		spacing,
		style,
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

	const colors = wp.data.select( "core/block-editor" ).getSettings().colors.filter(
		word => word['origin'] !== 'core'
		);

	const selectionStart = wp.data.select( "core/block-editor" ).getBlockSelectionStart();

	const selectionEnd = wp.data.select( "core/block-editor" ).getBlockSelectionEnd();

	const isOneSelected = selectionStart === selectionEnd;

	function findInner(blocks) {
		for (let block of blocks) {
			if(block.name==="description-list-block/description-list" && block.clientId === selectionStart){
				return block;
			}else if(undefined != block.innerBlocks) {
				const inner = findInner(block.innerBlocks);
				if(inner){
					return inner
				}
			}
		}
	}

	setAttributes({ 
		style: findInner(wp.data.select( "core/block-editor" ).getBlocks())?.attributes.className
	});

	return (
		<>
			<InspectorControls>
				{isOneSelected && (
					<PanelBody title={ __( 'Styles' ) }>
						{(undefined === style || 'is-style-regular' === style) && (
							<RangeControl
								label="Indent"
								isShiftStepEnabled={true}
								value={indent}
								onChange={ ( newIndent ) => setAttributes( { indent: newIndent } ) }
								initialPosition={40}
								min={ 0 }
								max={ 100 }
							/>
						)}
						{'is-style-grid' === style && (
							<RangeControl
								label="Spacing"
								isShiftStepEnabled={true}
								value={spacing}
								onChange={ ( newSpacing ) => setAttributes( { spacing: newSpacing } ) }
								initialPosition={33}
								min={ 1 }
								max={ 100 }
							/>
						)}
					</PanelBody>
				)}
				<PanelBody title={ __( 'Defines Term (dt)' ) }>
						<FontSizePicker
							fontSizes={ fontSizes }
							value={ termsFontSize }
							onChange={ (newFontSize) => setAttributes( { termsFontSize: newFontSize } )}
						/>
						<hr />
						<h3>Text Color</h3>
						<ColorPalette
							colors={ colors }
							value={ termsColor }
							onChange={ ( newColor ) => setAttributes( {termsColor: newColor} ) }
							disableAlpha
						/>
						<hr />
						<h3>Margin</h3>
						<BoxControl
							values={ termsMargin }
							onChange={ (value) => {setAttributes({termsMargin: value})} }
							resetValues={ {top: '0px',right: '0px',bottom: '0px',left: '0px'} }
						/>
						<hr />
						<h3>Padding</h3>
						<BoxControl
							values={ termsPadding }
							onChange={ (value) => {setAttributes({termsPadding: value})} }
							resetValues={ {top: '0px',right: '0px',bottom: '0px',left: '0px'} }
						/>
				</PanelBody>
				<PanelBody title={ __( 'Defines Description (dd)' ) }>
					<FontSizePicker
						fontSizes={ fontSizes }
						value={ descriptionsFontSize }
						onChange={ ( newFontSize ) => {
							setAttributes( { descriptionsFontSize: newFontSize } )
						} }
					/> 
					<hr />
					<h3>Text Color</h3>
					<ColorPalette
						colors={ colors }
						value={ descriptionsColor }
						onChange={ ( newColor ) => setAttributes( {descriptionsColor: newColor} ) }
					/>
					<hr />
					<h3>Margin</h3>
					<BoxControl
						values={ descriptionsMargin }
						onChange={ ( value ) => setAttributes( {descriptionsMargin: value} ) }
						resetValues={ {top: '0px',right: '0px',bottom: '0px',left: '0px'} }
					/>
					<hr />
					<h3>Padding</h3>
					<BoxControl
						values={ descriptionsPadding }
						onChange={ ( value ) => setAttributes( {descriptionsPadding: value} ) }
						resetValues={ {top: '0px',right: '0px',bottom: '0px',left: '0px'} }
					/>
				</PanelBody>
			</InspectorControls>
			<dl {...blockProps}
				className={classnames( blockProps.className, {
					[ `has-${ termsFontSize }-term-font-size` ]: termsFontSize,
					[ `has-${ descriptionsFontSize }-descriptions-font-size` ]: descriptionsFontSize,
				} )}
				style={{gridTemplateColumns: (spacing??'33')+'% 2fr'}}
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
								style={
									{
										fontSize:(tag === 'dt' ? termsFontSize : descriptionsFontSize),
										color:(tag === 'dt' ? termsColor : descriptionsColor),
										marginTop:(tag === 'dt' ? termsMargin?.top : descriptionsMargin?.top),
										marginBottom:(tag === 'dt' ? termsMargin?.bottom : descriptionsMargin?.bottom),
										marginLeft:(tag === 'dt' ? termsMargin?.left : descriptionsMargin?.left),
										marginRight:(tag === 'dt' ? termsMargin?.right : descriptionsMargin?.right),
										paddingTop:(tag === 'dt' ? termsPadding?.top : descriptionsPadding?.top),
										paddingBottom:(tag === 'dt' ? termsPadding?.bottom : descriptionsPadding?.bottom),
										paddingLeft:(tag === 'dt' ? termsPadding?.left : descriptionsPadding?.left),
										paddingRight:(tag === 'dt' ? termsPadding?.right : descriptionsPadding?.right),
										marginInlineStart:(tag === 'dd' && 'is-style-grid' !== style && 0 <= indent ? indent+'%' : ''),
									}
								}
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
