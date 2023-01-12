
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

import metadata from './../block.json';

const v1 = {
    ...metadata,

	save( { attributes } ) {
        const { 
            list, 
            termsFontSize, 
            descriptionsFontSize, 
            termsPadding,
            descriptionsPadding,
            spacing,
        } = attributes;
        const className = classnames( {
            [ `has-${ termsFontSize }-term-font-size` ]: termsFontSize,
            [ `has-${ descriptionsFontSize }-descriptions-font-size` ]: descriptionsFontSize,
        } );
        const blockProps = useBlockProps.save();
    
        const styleRegular = /is-style-regular/.test( blockProps.className ) || ! /is-style-grid/.test( blockProps.className ) && ! /is-style-no-bloat/.test( blockProps.className );
    
        const Section = ( { rows } ) => {
            if ( ! rows.length ) {
                return null;
            }
    
            return (
                rows.map(
                    ({ content, tag }, rowIndex) => {
                        return(
                        <RichText.Content
                            style={ ( styleRegular || /is-style-grid/.test( blockProps.className ) ) && {
                                    paddingTop:(tag === 'dt' ? termsPadding?.top : descriptionsPadding?.top),
                                    paddingBottom:(tag === 'dt' ? termsPadding?.bottom : descriptionsPadding?.bottom),
                                    paddingLeft:(tag === 'dt' ? termsPadding?.left : descriptionsPadding?.left),
                                    paddingRight:(tag === 'dt' ? termsPadding?.right : descriptionsPadding?.right),
                                }}
                            tagName={tag}
                            value={content}
                            key={rowIndex}
                        />
                        );
                    }
                )
            );
        };
    
        return (
            <dl { ...useBlockProps.save( { className } ) }
                style={/is-style-grid/.test( blockProps.className ) && {gridTemplateColumns: `${spacing}% 2fr`}}
            >
                <Section rows={ list } />
            </dl>
        );
    }
};


/**
 * New deprecations need to be placed first
 * for them to have higher priority.
 *
 * Old deprecations may need to be updated as well.
 *
 * See block-deprecation.md
 */
export default [ v1 ];