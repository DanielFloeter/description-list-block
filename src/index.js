
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

import metadata from './../block.json';
const { name } = metadata;

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

registerBlockType( name, {
	...metadata,
	apiVersion: 2,
	description: __(
        'Displays a description list using the dl element consist of a series of term and description pairs (dt, dd).',
        'description-list-block'
    ),
    keywords: [
        __('definition'),
        __('dl'),
        __('dt'),
        __('dd'),
        __('tiptoppress'),
    ],
	example: {
        attributes: {
			list: [
				{
					content: __( 'Version' ),
					tag: 'dt',
				},
				{
					content: __( 'Jazz Musician' ),
					tag: 'dd',
				},
				{
					content: __( 'Release Date' ),
					tag: 'dt',
				},
			],

		},
    },
	edit: Edit,
	save,
} );
