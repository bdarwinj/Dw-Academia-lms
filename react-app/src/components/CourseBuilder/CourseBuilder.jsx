import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    GripVertical,
    Plus,
    FileText,
    Video,
    Link,
    HelpCircle,
    Trash2,
    ChevronDown,
    ChevronUp,
    MoreVertical
} from 'lucide-react';
import './CourseBuilder.css';

const initialData = {
    sections: {
        'section-1': {
            id: 'section-1',
            title: 'Introducción al Curso',
            items: [
                { id: 'item-1', title: 'Bienvenida', type: 'text' },
                { id: 'item-2', title: 'Conceptos Básicos', type: 'video' }
            ]
        }
    },
    sectionOrder: ['section-1']
};

const ContentTypeModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    const types = [
        { id: 'text', label: 'Lección de Texto', icon: FileText },
        { id: 'video', label: 'Lección de Video', icon: Video },
        { id: 'quiz', label: 'Cuestionario (Quiz)', icon: HelpCircle },
        { id: 'resource', label: 'Material / Recurso', icon: Link },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4>¿Qué deseas añadir?</h4>
                    <p>Selecciona el tipo de contenido para tu lección.</p>
                </div>
                <div className="type-grid">
                    {types.map(type => (
                        <div key={type.id} className="type-option" onClick={() => onSelect(type.id)}>
                            <div className="type-option-icon">
                                <type.icon size={24} />
                            </div>
                            <span>{type.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function CourseBuilder({ value, onChange }) {
    const [data, setData] = useState(value || initialData);
    const [expandedSections, setExpandedSections] = useState(['section-1']);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, sectionId: null });

    // Sync from parent
    React.useEffect(() => {
        if (value) setData(value);
    }, [value]);

    const updateData = (newData) => {
        setData(newData);
        if (onChange) onChange(newData);
    };

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleAddSection = () => {
        const id = `section-${Date.now()}`;
        const newData = {
            ...data,
            sections: {
                ...data.sections,
                [id]: { id, title: 'Nueva Sección', items: [] }
            },
            sectionOrder: [...data.sectionOrder, id]
        };
        updateData(newData);
        setExpandedSections(prev => [...prev, id]);
    };

    const openModal = (sectionId) => {
        setModalConfig({ isOpen: true, sectionId });
    };

    const handleAddItem = (type) => {
        const sectionId = modalConfig.sectionId;
        const itemId = `item-${Date.now()}`;
        const newItem = { id: itemId, title: `Nueva ${type === 'quiz' ? 'Evaluación' : 'Lección'}`, type };

        const newData = {
            ...data,
            sections: {
                ...data.sections,
                [sectionId]: {
                    ...data.sections[sectionId],
                    items: [...data.sections[sectionId].items, newItem]
                }
            }
        };
        updateData(newData);
        setModalConfig({ isOpen: false, sectionId: null });
    };

    const handleDeleteSection = (id) => {
        if (!confirm('¿Deseas eliminar esta sección y todo su contenido?')) return;
        const newOrder = data.sectionOrder.filter(sid => sid !== id);
        const { [id]: removed, ...newSections } = data.sections;
        updateData({ sections: newSections, sectionOrder: newOrder });
    };

    const handleDeleteItem = (sectionId, itemId) => {
        const newItems = data.sections[sectionId].items.filter(item => item.id !== itemId);
        const newData = {
            ...data,
            sections: {
                ...data.sections,
                [sectionId]: { ...data.sections[sectionId], items: newItems }
            }
        };
        updateData(newData);
    };

    const onDragEnd = (result) => {
        const { destination, source, type, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        let newData = { ...data };

        if (type === 'section') {
            const newOrder = Array.from(data.sectionOrder);
            newOrder.splice(source.index, 1);
            newOrder.splice(destination.index, 0, draggableId);
            newData.sectionOrder = newOrder;
        } else {
            const sourceSection = data.sections[source.droppableId];
            const destSection = data.sections[destination.droppableId];

            if (source.droppableId === destination.droppableId) {
                const newItems = Array.from(sourceSection.items);
                const [moved] = newItems.splice(source.index, 1);
                newItems.splice(destination.index, 0, moved);
                newData.sections = {
                    ...data.sections,
                    [sourceSection.id]: { ...sourceSection, items: newItems }
                };
            } else {
                const sourceItems = Array.from(sourceSection.items);
                const destItems = Array.from(destSection.items);
                const [moved] = sourceItems.splice(source.index, 1);
                destItems.splice(destination.index, 0, moved);
                newData.sections = {
                    ...data.sections,
                    [sourceSection.id]: { ...sourceSection, items: sourceItems },
                    [destSection.id]: { ...destSection, items: destItems }
                };
            }
        }
        updateData(newData);
    };

    const getItemIcon = (type) => {
        switch (type) {
            case 'video': return <Video size={16} />;
            case 'quiz': return <HelpCircle size={16} />;
            case 'resource': return <Link size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <div className="course-builder">
            <header className="builder-header">
                <h2>Plan de Estudios</h2>
                <button className="btn-add-section" onClick={handleAddSection}>
                    <Plus size={18} /> Añadir Sección
                </button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-sections" type="section">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="sections-container">
                            {data.sectionOrder.map((sectionId, index) => {
                                const section = data.sections[sectionId];
                                const isExpanded = expandedSections.includes(sectionId);

                                return (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className="section-card">
                                                <div className="section-header" {...provided.dragHandleProps}>
                                                    <GripVertical size={18} className="drag-handle" />
                                                    <h3>{section.title}</h3>
                                                    <div className="section-actions">
                                                        <button
                                                            className="btn-icon-sm"
                                                            onClick={(e) => { e.stopPropagation(); toggleSection(sectionId); }}
                                                        >
                                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                        </button>
                                                        <button className="btn-icon-sm" onClick={() => handleDeleteSection(sectionId)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="section-items">
                                                        <Droppable droppableId={section.id} type="item">
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.droppableProps} className="items-list">
                                                                    {section.items.map((item, itemIndex) => (
                                                                        <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                                                            {(provided) => (
                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="item-card">
                                                                                    <GripVertical size={14} className="drag-handle" />
                                                                                    <div className="item-type-icon">
                                                                                        {getItemIcon(item.type)}
                                                                                    </div>
                                                                                    <div className="item-info">
                                                                                        <span className="item-title">{item.title}</span>
                                                                                    </div>
                                                                                    <button className="btn-icon-sm" onClick={() => handleDeleteItem(sectionId, item.id)}>
                                                                                        <Trash2 size={14} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>

                                                        <div className="add-content-area">
                                                            <button className="btn-add-content" onClick={() => openModal(sectionId)}>
                                                                <Plus size={16} /> Añadir contenido
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <ContentTypeModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, sectionId: null })}
                onSelect={handleAddItem}
            />
        </div>
    );
}
