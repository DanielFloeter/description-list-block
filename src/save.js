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
	} = attributes;
	const className = classnames( {
		[ `has-${ termsFontSize }-term-font-size` ]: termsFontSize,
		[ `has-${ descriptionsFontSize }-descriptions-font-size` ]: descriptionsFontSize,
	} );

	const Section = ( { rows } ) => {
		if ( ! rows.length ) {
			return null;
		}

		return (
			rows.map(
				({ content, tag }, rowIndex) => {
					return(
					<RichText.Content
						style={
							{
								fontSize:(tag === 'dt' ? termsFontSize : descriptionsFontSize),
								color:(tag === 'dt' ? termsColor : descriptionsColor),
								marginTop:(tag === 'dt' ? termsMargin?.top : descriptionsMargin?.top),
								marginBottom:(tag === 'dt' ? termsMargin?.bottom : descriptionsMargin?.bottom),
								marginLeft:(tag === 'dt' ? termsMargin?.left : descriptionsMargin?.left),
								marginRight:(tag === 'dt' ? termsMargin?.right : descriptionsMargin?.right),
								paddingTop:(tag === 'dt' ? termsPadding?.top : descriptionsPadding?.top),
								paddingBottom:(tag === 'dt' ? termsPadding?.bottom : descriptionsPadding?.bottom),
								paddingLeft:(tag === 'dt' ? termsPadding?.left : descriptionsPadding?.left),
								paddingRight:(tag === 'dt' ? termsPadding?.right : descriptionsPadding?.right),
								marginInlineStart:(tag === 'dd' && 'is-style-grid' !== style && 0 <= indent ? indent+'%' : ''),
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
			style={{gridTemplateColumns: (spacing??'33')+'% 2fr'}}
		>
			<Section rows={ list } />
		</dl>
	);
}

