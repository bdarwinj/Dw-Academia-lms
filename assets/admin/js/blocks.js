(function (blocks, editor, element, components) {
    var el = element.createElement;
    var RichText = editor.RichText;
    var MediaUpload = editor.MediaUpload;
    var InspectorControls = editor.InspectorControls;
    var PanelBody = components.PanelBody;
    var RangeControl = components.RangeControl;

    /**
     * Hero Block
     */
    blocks.registerBlockType('academia-lms/hero', {
        title: 'Academia Hero',
        icon: 'welcome-learn-more',
        category: 'academia-lms',
        attributes: {
            title: { type: 'string', source: 'html', selector: 'h1' },
            subtitle: { type: 'string', source: 'html', selector: 'p' },
            backgroundImage: { type: 'string', default: '' },
            ctaText: { type: 'string', default: 'Empieza Ahora' }
        },
        edit: function (props) {
            var attributes = props.attributes;

            function onSelectImage(media) {
                props.setAttributes({ backgroundImage: media.url });
            }

            return [
                el(InspectorControls, { key: 'controls' },
                    el(PanelBody, { title: 'Ajustes de Fondo' },
                        el(MediaUpload, {
                            onSelect: onSelectImage,
                            allowedTypes: ['image'],
                            render: function (obj) {
                                return el(components.Button, {
                                    className: 'button button-large',
                                    onClick: obj.open
                                }, !attributes.backgroundImage ? 'Seleccionar Imagen' : 'Cambiar Imagen');
                            }
                        })
                    )
                ),
                el('div', {
                    className: props.className + ' academia-hero-editor',
                    style: { backgroundImage: 'url(' + attributes.backgroundImage + ')' }
                },
                    el(RichText, {
                        tagName: 'h1',
                        placeholder: 'Título de Impacto...',
                        value: attributes.title,
                        onChange: function (nextTitle) { props.setAttributes({ title: nextTitle }); }
                    }),
                    el(RichText, {
                        tagName: 'p',
                        placeholder: 'Subtítulo descriptivo...',
                        value: attributes.subtitle,
                        onChange: function (nextSubtitle) { props.setAttributes({ subtitle: nextSubtitle }); }
                    }),
                    el('div', { className: 'hero-cta-preview' }, attributes.ctaText)
                )
            ];
        },
        save: function (props) {
            var attributes = props.attributes;
            return el('section', {
                className: 'academia-hero',
                style: { backgroundImage: 'url(' + attributes.backgroundImage + ')' }
            },
                el('div', { className: 'academia-hero-overlay' }),
                el('div', { className: 'academia-hero-content' },
                    el(RichText.Content, { tagName: 'h1', value: attributes.title }),
                    el(RichText.Content, { tagName: 'p', value: attributes.subtitle }),
                    el('a', { href: '#', className: 'btn-premium-hero' }, attributes.ctaText)
                )
            );
        }
    });

    /**
     * Course Grid Block (Dynamic)
     */
    blocks.registerBlockType('academia-lms/course-grid', {
        title: 'Grilla de Cursos',
        icon: 'grid-view',
        category: 'academia-lms',
        attributes: {
            columns: { type: 'number', default: 3 },
            limit: { type: 'number', default: 6 }
        },
        edit: function (props) {
            var attributes = props.attributes;

            return [
                el(InspectorControls, { key: 'controls' },
                    el(PanelBody, { title: 'Ajustes de Grilla' },
                        el(RangeControl, {
                            label: 'Columnas',
                            value: attributes.columns,
                            onChange: function (nextColumns) { props.setAttributes({ columns: nextColumns }); },
                            min: 1,
                            max: 4
                        }),
                        el(RangeControl, {
                            label: 'Límite de Cursos',
                            value: attributes.limit,
                            onChange: function (nextLimit) { props.setAttributes({ limit: nextLimit }); },
                            min: 1,
                            max: 20
                        })
                    )
                ),
                el('div', { className: props.className + ' academia-block-placeholder' },
                    el('div', { className: 'placeholder-icon' }, el(components.Dashicon, { icon: 'grid-view' })),
                    el('p', {}, 'Vista previa: Grilla de Cursos (' + attributes.columns + ' columnas, max ' + attributes.limit + ' cursos)')
                )
            ];
        },
        save: function () {
            return null; // Rendered via PHP callback
        }
    });

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components);
