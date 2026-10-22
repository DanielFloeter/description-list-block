import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import transforms from './transforms';

import metadata from './block.json';
const { name } = metadata;

// Fall back to the WordPress core translation when the plugin has none for a string.
addFilter(
    'i18n.gettext_description-list-block',
    'description-list-block/fallback-to-core',
    (translation, text) => (translation === text ? __(text) : translation)
);

registerBlockType(name, {
    ...metadata,
    description: __(
        'Description list (also known as definition list) block for glossaries, FAQs and specs using semantic dl, dt and dd HTML.',
        'description-list-block'
    ),
    keywords: [
        'dl',
        'dt',
        'dd',
        __('description', 'description-list-block'),
        __('definition', 'description-list-block'),
        __('list', 'description-list-block'),
        __('dictionary', 'description-list-block'),
        __('glossary', 'description-list-block'),
        __('faq', 'description-list-block'),
        __('term', 'description-list-block'),
        __('specs', 'description-list-block'),
        'tiptoppress',
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
            name: 'regular',
            label: _x('Indent', 'description-list-block'),
            isDefault: true,
        },
        {
            name: 'grid',
            label: __('Grid')
        },
        {
            name: 'no-bloat',
            label: __('Disable Block CSS')
        },

    ],
    edit: Edit,
    save: Save,
    transforms,
    deprecated,
});
