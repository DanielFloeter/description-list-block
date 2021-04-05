
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
			if (0 === i % 2) {
				return ({
					content: '',
					tag: 'dt',
				})
			} else {
				return ({
					content: '',
					tag: 'dd',
				})
			}

		}),
	};
}

/**
 * Returns the first row in the table.
 *
 * @param {Object} state Current table state.
 *
 * @return {Object} The first table row.
 */
export function getFirstRow(state) {
	if (!isEmptyDescriptionList(state.list)) {
		return state.list[0];
	}
}

/**
 * Inserts a row in the table state.
 *
 * @param {Object} state               Current table state.
 * @param {Object} options
 * @param {string} options.sectionName Section in which to insert the row.
 * @param {number} options.rowIndex    Row index at which to insert the row.
 *
 * @return {Object} New table state.
 */
export function insertRow(state, { sectionName, rowIndex }) {

	return {
		list: [
			...state[sectionName].slice(0, rowIndex),
			{
				content: '',
				tag: 'dt',
			},
			{
				content: '',
				tag: 'dd',
			},
			...state[sectionName].slice(rowIndex),],
	};
}

/**
 * Deletes a row from the table state.
 *
 * @param {Object} state               Current table state.
 * @param {Object} options
 * @param {string} options.sectionName Section in which to delete the row.
 * @param {number} options.rowIndex    Row index to delete.
 *
 * @return {Object} New table state.
 */
 export function deleteRow( state, { sectionName, rowIndex } ) {
	const listPairIndex = rowIndex % 2 ? rowIndex - 1 : rowIndex + 1;

	return {
		[ sectionName ]: state[ sectionName ].filter(
			( row, index ) => { return index !== rowIndex && index !== listPairIndex; }
		),
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

			return updateCell(row);
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
export function isCellSelected(cellLocation, selection) {
	if (!cellLocation || !selection) {
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
export function isEmptyDescriptionList(section) {
	return !section || !section.length;
}

