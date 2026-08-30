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

/**
 * Reads the items of a list block, together with the items of a nested list.
 *
 * @param {Array} blocks Inner blocks of a list block.
 *
 * @return {Array} List of `{ content, children }` items.
 */
function getListItems( blocks ) {
	return ( blocks || [] )
		.filter( ( block ) => 'core/list-item' === block?.name )
		.map( ( block ) => ( {
			content: String( block.attributes?.content ?? '' ),
			children: ( block.innerBlocks || [] ).reduce(
				( items, inner ) =>
					'core/list' === inner?.name
						? [ ...items, ...getListItems( inner.innerBlocks ) ]
						: items,
				[]
			),
		} ) );
}

/**
 * Reads the items of a list block of the first version, where the items were
 * stored as markup in the `values` attribute.
 *
 * @param {string} values Markup of the list items.
 *
 * @return {Array} List of `{ content, children }` items.
 */
function getLegacyListItems( values ) {
	const body = parseBody( `<ul>${ values }</ul>` );

	if ( ! body ) {
		return [];
	}

	return Array.from( body.querySelectorAll( ':scope > ul > li' ) ).map(
		( item ) => {
			const clone = item.cloneNode( true );
			const nested = Array.from(
				clone.querySelectorAll( ':scope > ul > li, :scope > ol > li' )
			).map( ( child ) => ( {
				content: child.innerHTML.trim(),
				children: [],
			} ) );

			Array.from( clone.querySelectorAll( ':scope > ul, :scope > ol' ) ).forEach(
				( list ) => list.remove()
			);

			return { content: clone.innerHTML.trim(), children: nested };
		}
	);
}

/**
 * Returns the items of a list block, whatever version it is.
 *
 * @param {Object} attributes  Attributes of the list block.
 * @param {Array}  innerBlocks Inner blocks of the list block.
 *
 * @return {Array} List of `{ content, children }` items.
 */
function getItems( attributes, innerBlocks ) {
	const items = getListItems( innerBlocks );

	if ( items.length ) {
		return items;
	}

	return 'string' === typeof attributes?.values
		? getLegacyListItems( attributes.values )
		: [];
}

/**
 * Turns the items of a list block into the `list` attribute of this block.
 *
 * An item holding a nested list becomes a term, the items of the nested list
 * become its descriptions. A list without any nesting alternates instead, so
 * the first item becomes a term, the second one its description and so on.
 *
 * @param {Array} items List items.
 *
 * @return {Array} List of `{ content, tag }` pairs.
 */
function itemsToList( items ) {
	const nested = items.some( ( item ) => item.children.length );

	const list = nested
		? items.reduce( ( pairs, item ) => {
				pairs.push( { content: item.content, tag: 'dt' } );

				if ( ! item.children.length ) {
					pairs.push( { content: '', tag: 'dd' } );
					return pairs;
				}

				item.children.forEach( ( child ) =>
					pairs.push( { content: child.content, tag: 'dd' } )
				);

				return pairs;
		  }, [] )
		: items.map( ( item, index ) => ( {
				content: item.content,
				tag: index % 2 ? 'dd' : 'dt',
		  } ) );

	// The block works with pairs, so a lonely term gets an empty description.
	if ( 'dt' === list[ list.length - 1 ]?.tag ) {
		list.push( { content: '', tag: 'dd' } );
	}

	return list;
}

/**
 * Turns the `list` attribute of this block into list items.
 *
 * A term becomes an item, its descriptions become the items of a nested list.
 *
 * @param {Array} list List of `{ content, tag }` pairs.
 *
 * @return {Array} List item blocks.
 */
function listToItems( list = [] ) {
	const items = [];

	list.forEach( ( { content, tag } ) => {
		const value = String( content ?? '' );

		if ( 'dt' === tag || ! items.length ) {
			items.push( { content: value, children: [] } );
			return;
		}

		items[ items.length - 1 ].children.push( value );
	} );

	return items.map( ( item ) => {
		const children = item.children.filter( ( child ) => child.trim() );

		return createBlock(
			'core/list-item',
			{ content: item.content },
			children.length
				? [
						createBlock(
							'core/list',
							{},
							children.map( ( child ) =>
								createBlock( 'core/list-item', { content: child } )
							)
						),
				  ]
				: []
		);
	} );
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
			// List block -> Description List Block.
			type: 'block',
			blocks: [ 'core/list' ],
			isMatch: ( attributes, block ) =>
				getItems( attributes, block?.innerBlocks ).length > 0,
			transform: ( attributes, innerBlocks ) =>
				createBlock( name, {
					list: itemsToList( getItems( attributes, innerBlocks ) ),
					...( attributes?.anchor ? { anchor: attributes.anchor } : {} ),
				} ),
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
		{
			// Description List Block -> List block.
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( { list, anchor } ) =>
				createBlock(
					'core/list',
					anchor ? { anchor } : {},
					listToItems( list )
				),
		},
	],
};

export default transforms;
