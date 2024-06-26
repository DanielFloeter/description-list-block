
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import clsx from 'clsx';

import metadata from './block.json';

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
        const className = clsx( {
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

const v2 = {
    ...metadata,

	save( { attributes } ) {
        const { 
            list, 
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
        } = attributes;
        const className = clsx( {
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
                            		fontSize:(tag === 'dt' ? termsFontSize : descriptionsFontSize),
                            		color:(tag === 'dt' ? termsColor : descriptionsColor),
                            		marginTop:(tag === 'dt' ? termsMargin?.top : descriptionsMargin?.top),
                            		marginBottom:(tag === 'dt' ? termsMargin?.bottom : descriptionsMargin?.bottom),
                            		marginLeft:(tag === 'dt' ? termsMargin?.left : descriptionsMargin?.left),
                            		marginRight:(tag === 'dt' ? termsMargin?.right : descriptionsMargin?.right),
                            		marginInlineStart:(tag === 'dd' && styleRegular && 0 <= indent ? `${indent}%` : undefined),
                            		paddingTop:(tag === 'dt' ? termsPadding?.top : descriptionsPadding?.top),
                            		paddingBottom:(tag === 'dt' ? termsPadding?.bottom : descriptionsPadding?.bottom),
                            		paddingLeft:(tag === 'dt' ? termsPadding?.left : descriptionsPadding?.left),
                            		paddingRight:(tag === 'dt' ? termsPadding?.right : descriptionsPadding?.right),
                            	}
                            }
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

const v3 = {
    ...metadata,

	save( { attributes } ) {
        const {
            list,
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
        } = attributes;
        const className = clsx({
            [`has-${termsFontSize}-term-font-size`]: termsFontSize,
            [`has-${descriptionsFontSize}-descriptions-font-size`]: descriptionsFontSize,
        });
        const blockProps = useBlockProps.save();
    
        const styleRegular = /is-style-regular/.test(blockProps.className) || ! /is-style-grid/.test(blockProps.className) && ! /is-style-no-bloat/.test(blockProps.className);
    
        const Section = ({ rows }) => {
            if (!rows.length) {
                return null;
            }
    
            return (
                rows.map(
                    ({ content, tag }, rowIndex) => {
                        return (
                            <RichText.Content
                                style={{
                                    ...(tag === 'dt') ? {
                                        '--termsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontSize,
                                        '--termsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsColor,
                                        '--termsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.top,
                                        '--termsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.bottom,
                                        '--termsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.left,
                                        '--termsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.right,
                                        '--termsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.top,
                                        '--termsPaddingBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.bottom,
                                        '--termsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.left,
                                        '--termsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.right,
                                    } : {
                                        '--descriptionsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontSize,
                                        '--descriptionsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsColor,
                                        '--descriptionsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.top,
                                        '--descriptionsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.bottom,
                                        '--descriptionsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.left,
                                        '--descriptionsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.right,
                                        '--descriptionsMarginInlineStart': (styleRegular || /is-style-grid/.test(blockProps.className)) && (0 <= indent ? `${indent}%` : undefined),
                                        '--descriptionsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.top,
                                        '--descriptionsPaddingBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.bottom,
                                        '--descriptionsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.left,
                                        '--descriptionsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.right,
                                    }
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
            <dl {...useBlockProps.save({ className })}
                style={/is-style-grid/.test(blockProps.className) && { '--gridTemplateColumns': `${spacing}% 2fr` }}
            >
                <Section rows={list} />
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
export default [ v3, v2, v1 ];