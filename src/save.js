
import './style.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import clsx from 'clsx';

import metadata from './block.json';

/**
 * Attribute defaults. They are mirrored by the fallbacks of the CSS custom
 * properties in style.scss.
 */
const DEFAULTS = {
	termsMargin: metadata.attributes.termsMargin.default,
	descriptionsMargin: metadata.attributes.descriptionsMargin.default,
	termsPadding: metadata.attributes.termsPadding.default,
	descriptionsPadding: metadata.attributes.descriptionsPadding.default,
	indent: metadata.attributes.indent.default,
	spacing: metadata.attributes.spacing.default,
	horizontal: metadata.attributes.horizontal.default,
};

/**
 * Removes empty values from a style object.
 *
 * Conditional expressions like `condition && value` evaluate to the boolean
 * `false` when the condition is not met. The WordPress element serializer only
 * skips `null` and `undefined`, so such a value would be written to the saved
 * markup as `--someProperty:false`. Filtering keeps the markup clean.
 *
 * @param {Object} vars Style object, possibly containing empty values.
 * @return {Object} Style object without empty values.
 */
const cssVars = (vars) =>
	Object.fromEntries(
		Object.entries(vars).filter(
			([, value]) =>
				value !== undefined &&
				value !== null &&
				value !== false &&
				value !== ''
		)
	);

/**
 * Drops a value that equals the attribute default. The default is carried by
 * the fallback of the CSS custom property, so it does not have to be repeated
 * in the saved markup.
 *
 * @param {*} value        Current value.
 * @param {*} defaultValue Attribute default.
 * @return {*} The value, or `undefined` when it is the default.
 */
const unlessDefault = (value, defaultValue) =>
	value === defaultValue ? undefined : value;

export default function save({ attributes }) {
	const {
		termsFontStyle,
        termsFontWeight,
        descriptionsFontStyle,
        descriptionsFontWeight,
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
		horizontal,
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
							tagName={tag}
							key={rowIndex}
							style={cssVars({
								...(tag === 'dt') ? {
									'--termsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontStyle,
									'--termsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontWeight,
									'--termsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontSize,
									'--termsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsColor,
									'--termsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsMargin?.top, DEFAULTS.termsMargin.top),
									'--termsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsMargin?.bottom, DEFAULTS.termsMargin.bottom),
									'--termsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsMargin?.left, DEFAULTS.termsMargin.left),
									'--termsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsMargin?.right, DEFAULTS.termsMargin.right),
									'--termsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsPadding?.top, DEFAULTS.termsPadding.top),
									'--termsPaddingBottom': (/is-style-grid/.test(blockProps.className)) && unlessDefault(`${horizontal}px`, `${DEFAULTS.horizontal}px`),
									'--termsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsPadding?.left, DEFAULTS.termsPadding.left),
									'--termsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(termsPadding?.right, DEFAULTS.termsPadding.right),
								} : {
									'--descriptionsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontStyle,
									'--descriptionsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontWeight,
									'--descriptionsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontSize,
									'--descriptionsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsColor,
									'--descriptionsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsMargin?.top, DEFAULTS.descriptionsMargin.top),
									'--descriptionsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsMargin?.bottom, DEFAULTS.descriptionsMargin.bottom),
									'--descriptionsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsMargin?.left, DEFAULTS.descriptionsMargin.left),
									'--descriptionsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsMargin?.right, DEFAULTS.descriptionsMargin.right),
									'--descriptionsMarginInlineStart': (styleRegular || /is-style-grid/.test(blockProps.className)) && (0 <= indent ? unlessDefault(`${indent}%`, `${DEFAULTS.indent}%`) : undefined),
									'--descriptionsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsPadding?.top, DEFAULTS.descriptionsPadding.top),
									'--descriptionsPaddingBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(`${horizontal}px`, `${DEFAULTS.horizontal}px`),
									'--descriptionsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsPadding?.left, DEFAULTS.descriptionsPadding.left),
									'--descriptionsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && unlessDefault(descriptionsPadding?.right, DEFAULTS.descriptionsPadding.right),
								}
							})}
							value={content}
						/>
					);
				}
			)
		);
	};

	return (
		<dl {...useBlockProps.save({ className })}
			style={/is-style-grid/.test(blockProps.className) ? cssVars({ '--gridTemplateColumns': unlessDefault(`${spacing}% 2fr`, `${DEFAULTS.spacing}% 2fr`) }) : undefined}
		>
			<Section rows={list} />
		</dl>
	);
}
