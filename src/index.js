import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';

import './style.scss';

import Edit from './edit';
import save from './save';

import metadata from './../block.json';
const { name } = metadata;

registerBlockType(name, {
    ...metadata,
    description: __(
        'Displays a description list using the dl element consist of a series of term and description pairs (dt, dd).',
        'description-list-block'
    ),
    keywords: [
        __('dl'),
        __('dt'),
        __('dd'),
        __('description'),
        __('definition'),
        __('list'),
        __('dictionary'),
        __('tiptoppress'),
    ],
    example: {
        attributes: {
            list: [{
                    content: __('5.2'),
                    tag: 'dt',
                },
                {
                    content: __('Jaco Pastorius'),
                    tag: 'dd',
                },
                {
                    content: __('5.1'),
                    tag: 'dt',
                },
                {
                    content: __('Betty Carter'),
                    tag: 'dd',
                },
                {
                    content: __('5.0'),
                    tag: 'dt',
                },
                {
                    content: __('Bebo Valdés'),
                    tag: 'dd',
                },
            ],

        },
    },
    styles: [{
            name: 'indent-start-40',
            label: _x('Indent', 'description-list-block'),
            isDefault: true,
        },
        {
            name: 'grid',
            label: __('Grid')
        },

    ],
    edit: Edit,
    save,
});
