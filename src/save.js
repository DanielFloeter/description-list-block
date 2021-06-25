import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import classnames from 'classnames';

export default function save({ attributes }) {
	const { list, termFontSize, descriptionsFontSize } = attributes;
	const className = classnames( {
		[ `has-${ termFontSize }-term-font-size` ]: termFontSize,
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
						style={{fontSize:(tag === 'dt' ? termFontSize : descriptionsFontSize)}}
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

