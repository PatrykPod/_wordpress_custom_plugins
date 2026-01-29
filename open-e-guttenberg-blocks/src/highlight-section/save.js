import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		textAlign,
		isBold,
		isItalic,
		isUnderline,
		fontSize,
		textColor,
	} = attributes;

	const blockProps = useBlockProps.save({
		style: {
			textAlign,
			fontWeight: isBold ? 'bold' : 'normal',
			fontStyle: isItalic ? 'italic' : 'normal',
			textDecoration: isUnderline ? 'underline' : 'none',
			fontSize: fontSize ? `${fontSize}px` : '16px',
			color: textColor,
			padding: '1rem',
			border: '2px solid #ddd',
			borderRadius: '6px',
			backgroundColor: '#fefefe',
		}
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}
