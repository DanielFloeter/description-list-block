
/**
 * External dependencies
 */
import { times, get, mapValues, every, pick } from 'lodash';

/**
 * Creates a table state.
 *
 * @param {Object} options
 * @param {number} options.rowCount    Row count for the table to create.
 * @param {string} options.tag  Tag name.
 *
 * @return {Object} New table state.
 */
export function createTable({ rowCount }) {
	return {
		list: times(rowCount * 2, (i) => {
			if( 0 === i % 2 ){
				return ({
					content: '',
					tag: 'dt',
					placeholder: __('Term ...'),
				})
			} else {
				return ({
					content: '',
					tag: 'dd',
					placeholder: __('Description ...'),
				})
			}
		
		}),
	};
}

/**
 * Returns updated cell attributes after applying the `updateCell` function to the selection.
 *
 * @param {Object}   state      The block attributes.
 * @param {Object}   selection  The selection of cells to update.
 * @param {Function} updateCell A function to update the selected cell attributes.
 *
 * @return {Object} New table state including the updated cells.
 */
export function updateSelectedCell(state, selection, updateCell) {
	if (!selection) {
		return state;
	}

	//const tableSections = pick(state, ['head', 'body', 'foot']);
	const tableSections = pick(state, ['list']);
	const {
		sectionName: selectionSectionName,
		rowIndex: selectionRowIndex,
	} = selection;

	
	return mapValues(tableSections, (section, sectionName) => {
		if (selectionSectionName && selectionSectionName !== sectionName) {
			return section;
		}

		return section.map((row, rowIndex) => {
			if (selectionRowIndex && selectionRowIndex !== rowIndex) {
				return row;
			}

			const cellLocation = {
				sectionName,
				rowIndex,
			};

			if (!isCellSelected(cellLocation, selection)) {
				return row;
			}
			
			//console.log("s", row, updateCell(row) );

			return updateCell(row);
			

			// return {
			// 	cells: row.cells.map((cellAttributes, columnIndex) => {
			// 		const cellLocation = {
			// 			sectionName,
			// 			rowIndex,
			// 		};

			// 		if (!isCellSelected(cellLocation, selection)) {
			// 			return cellAttributes;
			// 		}

			// 		return updateCell(cellAttributes);
			// 	}),
			// };
		});
	});
}

/**
 * Returns whether the cell at `cellLocation` is included in the selection `selection`.
 *
 * @param {Object} cellLocation An object containing cell location properties.
 * @param {Object} selection    An object containing selection properties.
 *
 * @return {boolean} True if the cell is selected, false otherwise.
 */
 export function isCellSelected( cellLocation, selection ) {
	if ( ! cellLocation || ! selection ) {
		return false;
	}

	return (
		selection.type === 'cell' &&
		cellLocation.sectionName === selection.sectionName &&
		cellLocation.rowIndex === selection.rowIndex
	);

}

/**
 * Determines whether a list section is empty.
 *
 * @param {Object} section List section state.
 *
 * @return {boolean} True if the list section is empty, false otherwise.
 */
export function isEmptyTableSection(section) {
	return !section || !section.length;
}
