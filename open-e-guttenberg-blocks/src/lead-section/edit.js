/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
// import { useBlockProps } from '@wordpress/block-editor';
import { useBlockProps, RichText, BlockControls, AlignmentToolbar, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
import { ToolbarGroup, ToolbarButton, Dashicon, PanelBody } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
	const { content, textAlign, isBold, isItalic, isUnderline, textColor } = attributes;

	// Get block props
	const blockProps = useBlockProps({
		style: {
			textAlign: textAlign,
			fontWeight: isBold ? 'bold' : 'normal',
			fontStyle: isItalic ? 'italic' : 'normal',
			textDecoration: isUnderline ? 'underline' : 'none',
			color: textColor,
		},
	});

	return (
		<>
			{/* Sidebar Controls */}
			<InspectorControls>
				{/* Text Color Picker */}
				<PanelColorSettings
					title={__('Text Color', 'highlight-section')}
					colorSettings={[
						{
							value: textColor,
							onChange: (newColor) => setAttributes({ textColor: newColor }),
							label: __('Text Color', 'highlight-section'),
						},
					]}
				/>
			</InspectorControls>

			{/* Formatting Toolbar */}
			<BlockControls>
				{/* Alignment Toolbar */}
				<AlignmentToolbar
					value={textAlign}
					onChange={(newAlign) => setAttributes({ textAlign: newAlign })}
				/>
			</BlockControls>

			{/* RichText Field */}
			<RichText
				{...useBlockProps()}
				tagName="p"
				value={content}
				onChange={(newContent) => setAttributes({ content: newContent })}
				placeholder={__('Enter highlighted text...', 'highlight-section')}
				style={{
					textAlign: textAlign,
					fontWeight: isBold ? 'bold' : 'normal',
					fontStyle: isItalic ? 'italic' : 'normal',
					textDecoration: isUnderline ? 'underline' : 'normal',
					color: textColor,
				}}
			/>
		</>
	);
}