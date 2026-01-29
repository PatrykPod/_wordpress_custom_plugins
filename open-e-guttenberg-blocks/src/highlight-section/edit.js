import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	FontSizePicker,
	ToggleControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const {
		textAlign,
		isBold,
		isItalic,
		isUnderline,
		fontSize,
		textColor,
	} = attributes;

	const blockProps = useBlockProps({
		style: {
			textAlign,
			fontWeight: isBold ? 'bold' : 'normal',
			fontStyle: isItalic ? 'italic' : 'normal',
			textDecoration: isUnderline ? 'underline' : 'none',
			fontSize: fontSize ? `${fontSize}px` : undefined,
			color: textColor,
			padding: '1rem',
			border: '2px solid #ddd',
			borderRadius: '6px',
			backgroundColor: '#fefefe',
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Text Settings", "highlight-section")} initialOpen>
					<FontSizePicker
						value={fontSize}
						onChange={(value) => setAttributes({ fontSize: value })}
					/>
					<ToggleControl
						label={__("Bold", "highlight-section")}
						checked={isBold}
						onChange={(value) => setAttributes({ isBold: value })}
					/>
					<ToggleControl
						label={__("Italic", "highlight-section")}
						checked={isItalic}
						onChange={(value) => setAttributes({ isItalic: value })}
					/>
					<ToggleControl
						label={__("Underline", "highlight-section")}
						checked={isUnderline}
						onChange={(value) => setAttributes({ isUnderline: value })}
					/>
				</PanelBody>

				<PanelColorSettings
					title={__("Text Color", "highlight-section")}
					colorSettings={[
						{
							value: textColor,
							onChange: (value) => setAttributes({ textColor: value }),
							label: __("Text Color", "highlight-section"),
						},
					]}
				/>
			</InspectorControls>

			<BlockControls>
				<AlignmentToolbar
					value={textAlign}
					onChange={(value) => setAttributes({ textAlign: value })}
				/>
			</BlockControls>

			<div {...blockProps}>
				<InnerBlocks />
			</div>
		</>
	);
}
