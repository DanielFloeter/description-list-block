import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import './style.scss';

import Edit from './edit';
import save from './save';

import metadata from './../block.json';
const { name } = metadata;

registerBlockType( name, {
	...metadata,
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
