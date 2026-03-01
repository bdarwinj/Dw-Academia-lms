import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Plus } from 'lucide-react';
import './CourseBuilder.css';

const initialData = {
    sections: {
        'section-1': {
            id: 'section-1',
            title: 'Introducción al Curso',
            items: [
                { id: 'item-1', title: 'Bienvenida' },
                { id: 'item-2', title: 'Conceptos Básicos' }
            ]
        },
        'section-2': {
            id: 'section-2',
            title: 'Módulo Intermedio',
            items: [
                { id: 'item-3', title: 'Profundizando temas' }
            ]
        }
    },
    sectionOrder: ['section-1', 'section-2']
};

export default function CourseBuilder({ value, onChange }) {
    const [data, setData] = useState(value || initialData);

    // Sync from parent if value changes from null to populated
    React.useEffect(() => {
        if (value) {
            setData(value);
        }
    }, [value]);

    const updateData = (newData) => {
        setData(newData);
        if (onChange) {
            onChange(newData);
        }
    };

    const onDragEnd = (result) => {
        const { destination, source, type, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Handle drag and drop logic here for Sections and Items
        let newData = { ...data };

        if (type === 'section') {
            const newOrder = Array.from(data.sectionOrder);
            newOrder.splice(source.index, 1);
            newOrder.splice(destination.index, 0, draggableId);
            newData.sectionOrder = newOrder;
        } else if (type === 'item') {
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

    return (
        <div className="course-builder">
            <div className="builder-header">
                <h2>Curriculum del Curso</h2>
                <button className="btn-primary"><Plus size={16} /> Añadir Sección</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-sections" type="section">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="sections-container">
                            {data.sectionOrder.map((sectionId, index) => {
                                const section = data.sections[sectionId];
                                return (
                                    <Draggable key={section.id} draggableId={section.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="section-card"
                                            >
                                                <div className="section-header" {...provided.dragHandleProps}>
                                                    <GripVertical size={18} className="drag-handle" />
                                                    <h3>{section.title}</h3>
                                                </div>

                                                <div className="section-items">
                                                    <Droppable droppableId={section.id} type="item">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps} className="items-list">
                                                                {section.items.map((item, itemIndex) => (
                                                                    <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="item-card"
                                                                            >
                                                                                <GripVertical size={16} className="drag-handle" />
                                                                                <span>{item.title}</span>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
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
        </div>
    );
}
