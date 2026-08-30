/**
 * Block transforms.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
 */

import { createBlock } from '@wordpress/blocks';

import metadata from './block.json';

const { name } = metadata;

/**
 * Selector for the term/description elements of a description list.
 * Covers both the plain and the `<div>` wrapped HTML5 variant, while
 * ignoring the elements of a nested description list.
 */
const ROW_SELECTOR = ':scope > dt, :scope > dd, :scope > div > dt, :scope > div > dd';

/**
 * Reads the markup of a Custom HTML block.
 *
 * Up to WordPress 6.x the markup is stored in the `content` attribute. Since
 * WordPress 7.0 the attribute has no source anymore (`role: "local"`) and the
 * markup only lives in the block itself, so the block object is used as a
 * fallback.
 *
 * @param {Object} attributes Attributes of the Custom HTML block.
 * @param {Object} block      The Custom HTML block.
 *
 * @return {string} Markup of the Custom HTML block.
 */
function getSourceHTML( attributes, block ) {
	if ( 'string' === typeof attributes?.content ) {
		return attributes.content;
	}

	if ( Array.isArray( block?.innerContent ) ) {
		return block.innerContent
			.filter( ( part ) => 'string' === typeof part )
			.join( '' );
	}

	if ( 'string' === typeof block?.originalContent ) {
		return block.originalContent;
	}

	return '';
}

/**
 * Tells whether a node is a `<dl>` element holding at least one term or
 * description.
 *
 * @param {Node} node Node to check.
 *
 * @return {boolean} True when the node can be turned into this block.
 */
export function isDescriptionList( node ) {
	return (
		!! node &&
		'DL' === node.nodeName &&
		!! node.querySelector( 'dt, dd' )
	);
}

/**
 * Returns the description lists of a node that are not nested in another
 * description list.
 *
 * @param {Element} element Element to search in.
 *
 * @return {Array} Description list elements.
 */
function getDescriptionLists( element ) {
	return Array.from( element.querySelectorAll( 'dl' ) ).filter(
		( dl ) =>
			isDescriptionList( dl ) && ! dl.parentElement?.closest( 'dl' )
	);
}

/**
 * Turns a `<dl>` element into the `list` attribute of this block.
 *
 * @param {Element} dl Description list element.
 *
 * @return {Array} List of `{ content, tag }` pairs.
 */
export function getListFromNode( dl ) {
	return Array.from( dl.querySelectorAll( ROW_SELECTOR ) ).map( ( node ) => ( {
		content: node.innerHTML.trim(),
		tag: node.nodeName.toLowerCase(),
	} ) );
}

/**
 * Creates this block out of a `<dl>` element.
 *
 * @param {Element} dl Description list element.
 *
 * @return {Object} Block instance.
 */
function createDescriptionListBlock( dl ) {
	return createBlock( name, {
		list: getListFromNode( dl ),
		...( dl.id ? { anchor: dl.id } : {} ),
	} );
}

/**
 * Parses an HTML string into a document body.
 *
 * @param {string} html HTML string.
 *
 * @return {?HTMLElement} Body element, or null when parsing is not possible.
 */
function parseBody( html ) {
	if ( 'string' !== typeof html || ! html.trim() ) {
		return null;
	}

	if ( 'undefined' === typeof window || ! window.DOMParser ) {
		return null;
	}

	return new window.DOMParser().parseFromString( html, 'text/html' ).body;
}

/**
 * Tells whether markup holds at least one description list.
 *
 * @param {string} html Markup to check.
 *
 * @return {boolean} True when the markup can be transformed.
 */
function hasDescriptionList( html ) {
	const body = parseBody( html );

	return !! body && getDescriptionLists( body ).length > 0;
}

/**
 * Splits the markup of a Custom HTML block into description list blocks and
 * Custom HTML blocks, keeping the order and everything that is not a
 * description list.
 *
 * @param {string} html Markup of the Custom HTML block.
 *
 * @return {Array} List of block instances.
 */
function splitHTML( html ) {
	const body = parseBody( html );

	if ( ! body ) {
		return [];
	}

	const blocks = [];
	let rest = '';

	const flush = () => {
		if ( rest.trim() ) {
			blocks.push( createBlock( 'core/html', { content: rest.trim() } ) );
		}
		rest = '';
	};

	Array.from( body.childNodes ).forEach( ( node ) => {
		// A description list of its own becomes a block.
		if ( isDescriptionList( node ) ) {
			flush();
			blocks.push( createDescriptionListBlock( node ) );
			return;
		}

		const nested =
			node.nodeType === node.ELEMENT_NODE
				? getDescriptionLists( node )
				: [];

		// A wrapper holding description lists is kept without them, the
		// lists themselves follow as blocks.
		if ( nested.length ) {
			flush();

			const wrapper = node.cloneNode( true );
			getDescriptionLists( wrapper ).forEach( ( dl ) => dl.remove() );

			if ( wrapper.textContent.trim() || wrapper.querySelector( '*' ) ) {
				blocks.push(
					createBlock( 'core/html', {
						content: wrapper.outerHTML,
					} )
				);
			}

			nested.forEach( ( dl ) =>
				blocks.push( createDescriptionListBlock( dl ) )
			);
			return;
		}

		rest +=
			node.nodeType === node.ELEMENT_NODE
				? node.outerHTML
				: node.textContent;
	} );

	flush();

	return blocks;
}

/**
 * Serializes the `list` attribute back into `<dl>` markup.
 *
 * @param {Object} attributes Block attributes.
 *
 * @return {string} Description list markup.
 */
function toHTML( { list = [], anchor } ) {
	const rows = list
		.map(
			( { content, tag } ) =>
				`\t<${ tag }>${ String( content ?? '' ) }</${ tag }>`
		)
		.join( '\n' );

	return `<dl${ anchor ? ` id="${ anchor }"` : '' }>\n${ rows }\n</dl>`;
}

const transforms = {
	from: [
		{
			// Custom HTML block -> Description List Block.
			type: 'block',
			blocks: [ 'core/html' ],
			// A lower number means a higher precedence, the default is 10.
			priority: 5,
			isMatch: ( attributes, block ) =>
				hasDescriptionList( getSourceHTML( attributes, block ) ),
			// The whole block is needed, because since WordPress 7.0 the
			// markup of the Custom HTML block is no longer an attribute.
			__experimentalConvert: ( block ) =>
				splitHTML( getSourceHTML( block?.attributes, block ) ),
			transform: ( attributes ) =>
				splitHTML( getSourceHTML( attributes ) ),
		},
		{
			// Pasted `<dl>` markup -> Description List Block.
			type: 'raw',
			isMatch: isDescriptionList,
			transform: createDescriptionListBlock,
			schema: {
				dl: {
					attributes: [ 'id' ],
					children: {
						dt: { children: '*' },
						dd: { children: '*' },
						div: {
							children: {
								dt: { children: '*' },
								dd: { children: '*' },
							},
						},
					},
				},
			},
		},
	],
	to: [
		{
			// Description List Block -> Custom HTML block.
			type: 'block',
			blocks: [ 'core/html' ],
			transform: ( attributes ) =>
				createBlock( 'core/html', { content: toHTML( attributes ) } ),
		},
	],
};

export default transforms;
