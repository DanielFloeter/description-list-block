
import './style.scss';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

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
	const className = classnames({
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
									'--termsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontStyle,
									'--termsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontWeight,
									'--termsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsFontSize,
									'--termsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsColor,
									'--termsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.top,
									'--termsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.bottom,
									'--termsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.left,
									'--termsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsMargin?.right,
									'--termsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.top,
									'--termsPaddingBottom': (/is-style-grid/.test(blockProps.className)) && `${horizontal}px`,
									'--termsPaddingLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.left,
									'--termsPaddingRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && termsPadding?.right,
								} : {
									'--descriptionsFontStyle': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontStyle,
									'--descriptionsFontWeight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontWeight,
									'--descriptionsFontSize': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsFontSize,
									'--descriptionsColor': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsColor,
									'--descriptionsMarginTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.top,
									'--descriptionsMarginBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.bottom,
									'--descriptionsMarginLeft': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.left,
									'--descriptionsMarginRight': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsMargin?.right,
									'--descriptionsMarginInlineStart': (styleRegular || /is-style-grid/.test(blockProps.className)) && (0 <= indent ? `${indent}%` : undefined),
									'--descriptionsPaddingTop': (styleRegular || /is-style-grid/.test(blockProps.className)) && descriptionsPadding?.top,
									'--descriptionsPaddingBottom': (styleRegular || /is-style-grid/.test(blockProps.className)) && `${horizontal}px`,
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

