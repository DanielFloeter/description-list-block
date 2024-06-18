
import './editor.scss';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	Button,
	DropdownMenu,
	Placeholder,
	TextControl,
	ToolbarGroup,
	ToolbarItem,
	FontSizePicker,
	ColorPalette,
	__experimentalBoxControl,
	BoxControl as stableBoxControl,
	RangeControl,
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
} from '@wordpress/block-editor';
import {
	createDescriptionList,
	updateSelectedCell,
	insertListPair,
	deleteListPair,
	isEmptyDescriptionList,
} from './state';
import clsx from 'clsx';
import { ENTER, SHIFT, UP } from '@wordpress/keycodes';
import FontAppearanceControl from './font-appearance-control';

export const BoxControl = __experimentalBoxControl || stableBoxControl;

export default function Edit({ attributes, setAttributes }) {
	const {
		termsFontStyle,
        termsFontWeight,
        descriptionsFontStyle,
        descriptionsFontWeight,
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
		horizontal,
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
			title: __('Insert before'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairBefore,
		},
		{
			icon: tableRowAfter,
			title: __('Insert after'),
			isDisabled: !selectedCell,
			onClick: onInsertListPairAfter,
		},
		{
			icon: tableRowDelete,
			title: __('Delete selected'),
			isDisabled: !selectedCell,
			onClick: onDeleteListPair,
		},
	];

	const isEmpty = isEmptyDescriptionList(attributes['list']);

	const fontSizes = [
		{
			name: __('Small'),
			slug: 'small',
			size: '18px',
		},
		{
			name: __('Normal'),
			slug: 'normal',
			size: '21px',
		},
		{
			name: __('Large'),
			slug: 'large',
			size: '26px',
		},
		{
			name: __('Huge'),
			slug: 'huge',
			size: '32px',
		},
	];

	const colors = wp.data.select("core/block-editor").getSettings().colors.filter(
		word => word['origin'] !== 'core'
	);

	const setTermsFontAppearance = ( {
		fontStyle: newFontStyle,
		fontWeight: newFontWeight,
	} ) => {
		setAttributes( {
			termsFontStyle: newFontStyle || undefined,
			termsFontWeight: newFontWeight || undefined,
		} );
	};

	const setDescriptionsFontAppearance = ( {
		fontStyle: newFontStyle,
		fontWeight: newFontWeight,
	} ) => {
		setAttributes( {
			descriptionsFontStyle: newFontStyle || undefined,
			descriptionsFontWeight: newFontWeight || undefined,
		} );
	};

	const selectionStart = wp.data.select("core/block-editor").getBlockSelectionStart();

	const selectionEnd = wp.data.select("core/block-editor").getBlockSelectionEnd();

	const isOneSelected = selectionStart === selectionEnd;

	const styleRegular = /is-style-regular/.test(blockProps.className) || ! /is-style-grid/.test(blockProps.className) && ! /is-style-no-bloat/.test(blockProps.className);

	return (
		<>
			{(styleRegular || /is-style-grid/.test(blockProps.className)) && (
				<InspectorControls>
					{isOneSelected && (
						<PanelBody title={__('Settings')}>
							{(styleRegular) && (
								<RangeControl
									label="Indent"
									isShiftStepEnabled={true}
									value={indent}
									onChange={(newIndent) => setAttributes({ indent: newIndent })}
									initialPosition={10}
									min={0}
									max={100}
								/>
							)}
							{/is-style-grid/.test(blockProps.className) && (
								<RangeControl
									label="Spacing"
									isShiftStepEnabled={true}
									value={spacing}
									onChange={(newSpacing) => setAttributes({ spacing: newSpacing })}
									initialPosition={30}
									min={1}
									max={100}
								/>
							)}
							<RangeControl
								allowReset={true}
								label="Horizontal"
								isShiftStepEnabled={true}
								value={horizontal}
								onChange={ ( newHorizontal ) => setAttributes( { horizontal: newHorizontal } ) }
								initialPosition={0}
								min={ 0 }
								max={ 100 }
							/>
						</PanelBody>
					)}
					<PanelBody title={__('Term')}>
						<FontSizePicker
							fontSizes={fontSizes}
							value={termsFontSize}
							onChange={(newFontSize) => setAttributes({ termsFontSize: newFontSize })}
						/>
						<FontAppearanceControl
							value={ { fontStyle: termsFontStyle, fontWeight: termsFontWeight } }
							onChange={ setTermsFontAppearance }
							hasFontStyles={ true }
							hasFontWeights={ true }
						/>
						<PanelRow>Color</PanelRow>
						<ColorPalette
							colors={colors}
							value={termsColor}
							onChange={(newColor) => setAttributes({ termsColor: newColor })}
							disableAlpha
						/>
						{/* <hr />
						<h3>Margin</h3>
						<BoxControl
							values={termsMargin}
							onChange={(value) => { setAttributes({ termsMargin: value }) }}
							resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }}
						/>
						<hr />
						<h3>Padding</h3>
						<BoxControl
							values={termsPadding}
							onChange={(value) => { setAttributes({ termsPadding: value }) }}
							resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }}
						/> */}
					</PanelBody>
					<PanelBody title={__('Description')}>
						<FontSizePicker
							fontSizes={fontSizes}
							value={descriptionsFontSize}
							onChange={(newFontSize) => {
								setAttributes({ descriptionsFontSize: newFontSize })
							}}
						/>
						<FontAppearanceControl
							value={ { fontStyle: descriptionsFontStyle, fontWeight: descriptionsFontWeight } }
							onChange={ setDescriptionsFontAppearance }
							hasFontStyles={ true }
							hasFontWeights={ true }
						/>
						<PanelRow>Color</PanelRow>
						<ColorPalette
							colors={colors}
							value={descriptionsColor}
							onChange={(newColor) => setAttributes({ descriptionsColor: newColor })}
						/>
						{/* <hr />
						<h3>Margin</h3>
						<BoxControl
							values={descriptionsMargin}
							onChange={(value) => setAttributes({ descriptionsMargin: value })}
							resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }}
						/>
						<hr />
						<h3>Padding</h3>
						<BoxControl
							values={descriptionsPadding}
							onChange={(value) => setAttributes({ descriptionsPadding: value })}
							resetValues={{ top: '0px', right: '0px', bottom: '0px', left: '0px' }}
						/> */}
					</PanelBody>
				</InspectorControls>
			)}
			<dl {...blockProps}
				className={clsx(blockProps.className, {
					[`has-${termsFontSize}-term-font-size`]: termsFontSize,
					[`has-${descriptionsFontSize}-descriptions-font-size`]: descriptionsFontSize,
				})}
				style={{ ...(/is-style-grid/.test(blockProps.className)) && { '--gridTemplateColumns': `${spacing}% 2fr` } }}
			>
				{!isEmpty && (
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
				{/* { !isEmpty && (
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
						<RichTextShortcut
							type="primary"
							character="ENTER"
							onUse={ onEnter }
						/>
					</>
				)} */}
				{!isEmpty && (
					attributes['list'].map(
						({ content, tag }, rowIndex) => (
							<RichText
								tagName={tag}
								key={rowIndex}
								style={{
									...(tag === 'dt') ? {
										'--termsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontStyle,
										'--termsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontWeight,
										'--termsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontSize,
										'--termsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsColor,
										'--termsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.top,
										'--termsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.bottom,
										'--termsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.left,
										'--termsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.right,
										'--termsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.top,
										'--termsPaddingBottom': (/is-style-grid/.test(blockProps.className)) && `${horizontal}px`,
										'--termsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.left,
										'--termsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.right,
									} : {
										'--descriptionsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontStyle,
										'--descriptionsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontWeight,
										'--descriptionsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontSize,
										'--descriptionsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsColor,
										'--descriptionsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.top,
										'--descriptionsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.bottom,
										'--descriptionsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.left,
										'--descriptionsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.right,
										'--descriptionsMarginInlineStart': (styleRegular || /is-style-grid/.test(blockProps.className)) && (0 <= indent ? `${indent}%` : undefined),
										'--descriptionsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.top,
										'--descriptionsPaddingBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && `${horizontal}px`,
										'--descriptionsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.left,
										'--descriptionsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.right,
									}
								}}
								value={content}
								onChange={onChange}
								onFocus={() => {
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
				{isEmpty && (
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
