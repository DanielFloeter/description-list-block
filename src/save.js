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
		termsPadding,
		descriptionsPadding,
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
		<dl { ...useBlockProps.save( { className } ) }>
			<Section rows={ list } />
		</dl>
	);
}

