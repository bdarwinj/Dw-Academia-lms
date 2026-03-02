import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import './style.css';

registerBlockType('academia-lms/search-bar', {
    title: __('Buscador de Cursos', 'academia-lms'),
    icon: 'search',
    category: 'academia-lms',
    attributes: {
        placeholder: {
            type: 'string',
            default: 'Encuentra un curso...'
        },
        buttonText: {
            type: 'string',
            default: 'Buscar'
        }
    },
    edit: ({ attributes, setAttributes }) => {
        const blockProps = useBlockProps({ className: 'academia-search-block-editor' });
        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Ajustes del Buscador', 'academia-lms')}>
                        <TextControl
                            label={__('Texto base (Placeholder)', 'academia-lms')}
                            value={attributes.placeholder}
                            onChange={(val) => setAttributes({ placeholder: val })}
                        />
                        <TextControl
                            label={__('Botón', 'academia-lms')}
                            value={attributes.buttonText}
                            onChange={(val) => setAttributes({ buttonText: val })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="academia-search-preview" style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            placeholder={attributes.placeholder}
                            disabled
                            style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                        />
                        <button disabled style={{ padding: '12px 24px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                            {attributes.buttonText}
                        </button>
                    </div>
                </div>
            </div>
        );
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({ className: 'academia-search-block-frontend' });
        return (
            <div {...blockProps}>
                <form action="/" method="get" className="academia-search-form">
                    <input type="hidden" name="post_type" value="academia_curso" />
                    <input type="text" name="s" placeholder={attributes.placeholder} required />
                    <button type="submit">{attributes.buttonText}</button>
                </form>
            </div>
        );
    }
});
