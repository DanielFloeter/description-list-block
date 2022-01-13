const semver = require('semver');
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save({ attributes }) {
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
		style,
		ver,
	} = attributes;
	const className = classnames( {
		[ `has-${ termsFontSize }-term-font-size` ]: termsFontSize,
		[ `has-${ descriptionsFontSize }-descriptions-font-size` ]: descriptionsFontSize,
	} );

	const Section = ( { rows } ) => {
		if ( ! rows.length ) {
			return null;
		}

		const v1_1_8 = tag => semver.satisfies(ver, '>=1.1.8') &&
		{
			fontSize:(tag === 'dt' ? termsFontSize : descriptionsFontSize),
			color:(tag === 'dt' ? termsColor : descriptionsColor),
			marginTop:(tag === 'dt' ? termsMargin?.top : descriptionsMargin?.top),
			marginBottom:(tag === 'dt' ? termsMargin?.bottom : descriptionsMargin?.bottom),
			marginLeft:(tag === 'dt' ? termsMargin?.left : descriptionsMargin?.left),
			marginRight:(tag === 'dt' ? termsMargin?.right : descriptionsMargin?.right),
			marginInlineStart:(tag === 'dd' && 'is-style-grid' !== style && 0 <= indent ? indent+'%' : undefined),
		}

		const v1_1_9 = tag => semver.satisfies(ver, '>=1.1.9') &&
		{
			paddingTop:(tag === 'dt' ? termsPadding?.top : descriptionsPadding?.top),
			paddingBottom:(tag === 'dt' ? termsPadding?.bottom : descriptionsPadding?.bottom),
			paddingLeft:(tag === 'dt' ? termsPadding?.left : descriptionsPadding?.left),
			paddingRight:(tag === 'dt' ? termsPadding?.right : descriptionsPadding?.right),
		}

		return (
			rows.map(
				({ content, tag }, rowIndex) => {
					return(
					<RichText.Content
						style={'is-style-no-bloat' !== style && {...v1_1_8(tag), ...v1_1_9(tag)}}
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
			style={'is-style-grid' === style && {gridTemplateColumns: (spacing??'33')+'% 2fr'}}
		>
			<Section rows={ list } />
		</dl>
	);
}

