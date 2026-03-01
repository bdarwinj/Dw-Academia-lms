import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    Plus,
    GripVertical,
    Trash2,
    Type,
    AtSign,
    Phone,
    ChevronDown,
    CheckSquare,
    Save,
    Loader2
} from 'lucide-react';
import { buildApiUrl } from '../utils/api';

const fieldTypes = [
    { type: 'text', label: 'Campo de Texto', icon: Type },
    { type: 'email', label: 'Correo Electrónico', icon: AtSign },
    { type: 'tel', label: 'Teléfono', icon: Phone },
    { type: 'select', label: 'Selección Simple', icon: ChevronDown },
    { type: 'checkbox', label: 'Casilla de Verificación', icon: CheckSquare },
];

const FormBuilder = () => {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const url = buildApiUrl('academia-lms/v1/settings/registration-form');
                const response = await fetch(url, {
                    headers: { 'X-WP-Nonce': window.academiaLmsData.nonce }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFields(data);
                }
            } catch (error) {
                console.error("Error fetching form schema:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchema();
    }, []);

    const addField = (fieldType) => {
        const newField = {
            id: `field_${Date.now()}`,
            type: fieldType,
            label: `Nuevo Campo de ${fieldType}`,
            placeholder: 'Escribe aquí...',
            required: false,
            options: fieldType === 'select' ? ['Opción 1', 'Opción 2'] : []
        };
        setFields([...fields, newField]);
    };

    const removeField = (id) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id, updates) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(fields);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFields(items);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const url = buildApiUrl('academia-lms/v1/settings/registration-form');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.academiaLmsData.nonce
                },
                body: JSON.stringify(fields)
            });
            if (response.ok) {
                alert('Formulario guardado correctamente.');
            }
        } catch (error) {
            console.error("Error saving form:", error);
            alert('Error al guardar el formulario.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin" size={40} color="#9333ea" />
            </div>
        );
    }

    return (
        <div className="form-builder-page anim-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <h1>Constructor de Formularios</h1>
                    <p>Diseña el formulario de registro para tus alumnos.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Guardando...' : 'Guardar Formulario'}
                    </button>
                </div>
            </header>

            <div className="builder-layout">
                {/* Toolbox */}
                <aside className="builder-toolbox">
                    <h3>Añadir Campo</h3>
                    <div className="toolbox-items">
                        {fieldTypes.map(ft => (
                            <button key={ft.type} className="toolbox-btn" onClick={() => addField(ft.type)}>
                                <ft.icon size={18} />
                                <span>{ft.label}</span>
                                <Plus size={16} className="plus-icon" />
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Workspace */}
                <main className="builder-workspace">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="form-fields">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="fields-list">
                                    {fields.length === 0 && (
                                        <div className="empty-state">
                                            <p>No hay campos en el formulario. Empieza añadiendo uno desde la izquierda.</p>
                                        </div>
                                    )}
                                    {fields.map((field, index) => (
                                        <Draggable key={field.id} draggableId={field.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="field-card"
                                                >
                                                    <div className="field-handle" {...provided.dragHandleProps}>
                                                        <GripVertical size={20} color="#94a3b8" />
                                                    </div>

                                                    <div className="field-content">
                                                        <div className="field-row">
                                                            <div className="field-type-badge">
                                                                {field.type.toUpperCase()}
                                                            </div>
                                                            <div className="field-main-inputs">
                                                                <input
                                                                    type="text"
                                                                    value={field.label}
                                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                    className="field-label-input"
                                                                    placeholder="Título del campo"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={field.placeholder}
                                                                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                                    className="field-placeholder-input"
                                                                    placeholder="Texto de ayuda (placeholder)"
                                                                />
                                                            </div>
                                                        </div>

                                                        {field.type === 'select' && (
                                                            <div className="field-options-area">
                                                                <label>Opciones (separadas por coma)</label>
                                                                <input
                                                                    type="text"
                                                                    value={field.options.join(', ')}
                                                                    onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                                                                    className="academia-input"
                                                                    placeholder="Opción 1, Opción 2..."
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="field-meta">
                                                            <label className="checkbox-label">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={field.required}
                                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                                />
                                                                Obligatorio
                                                            </label>
                                                            <button className="btn-delete" onClick={() => removeField(field.id)}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </main>
            </div>

            <style>{`
                .form-builder-page {
                    max-width: 1100px;
                }
                .builder-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2rem;
                    align-items: start;
                }
                .builder-toolbox {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    padding: 1.5rem;
                }
                .builder-toolbox h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: 1.25rem;
                    color: #1e293b;
                }
                .toolbox-items {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .toolbox-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: #f8fafc;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #475569;
                    font-weight: 500;
                    text-align: left;
                }
                .toolbox-btn:hover {
                    border-color: #9333ea;
                    background: #f3e8ff;
                    color: #9333ea;
                }
                .plus-icon {
                    margin-left: auto;
                    opacity: 0.4;
                }
                .builder-workspace {
                    background: #f1f5f9;
                    border-radius: 16px;
                    padding: 1.5rem;
                    min-height: 500px;
                }
                .fields-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .field-card {
                    background: #fff;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    padding: 1rem;
                    gap: 1rem;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .field-handle {
                    display: flex;
                    align-items: center;
                    cursor: grab;
                }
                .field-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .field-row {
                    display: flex;
                    align-items: start;
                    gap: 1rem;
                }
                .field-type-badge {
                    background: #f3e8ff;
                    color: #9333ea;
                    font-size: 10px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                    margin-top: 8px;
                }
                .field-main-inputs {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .field-label-input {
                    border: none;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #1e293b;
                    outline: none;
                    padding: 0;
                }
                .field-placeholder-input {
                    border: none;
                    font-size: 0.875rem;
                    color: #64748b;
                    outline: none;
                    padding: 0;
                }
                .field-options-area label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 0.4rem;
                }
                .field-meta {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 0.75rem;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                }
                .btn-delete {
                    background: #fef2f2;
                    color: #dc2626;
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-delete:hover {
                    background: #fee2e2;
                    transform: scale(1.1);
                }
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #94a3b8;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default FormBuilder;
