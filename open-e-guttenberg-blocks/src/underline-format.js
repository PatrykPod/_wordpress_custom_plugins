import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Dashicon } from '@wordpress/components';
// import { formatUnderline } from '@wordpress/icons';

registerFormatType('custom/underline', {
    title: __('Underline', 'open-e-guttenberg-blocks'),
    tagName: 'u', // <u> tag will be used for underline
    className: null, // No extra class needed
    edit({ isActive, value, onChange }) {
        return (
            <RichTextToolbarButton
                icon={<Dashicon icon="editor-underline" />}
                title={__('Underline', 'open-e-guttenberg-blocks')}
                onClick={() => onChange(toggleFormat(value, { type: 'custom/underline' }))}
                isActive={isActive}
            />
        );
    },
});
