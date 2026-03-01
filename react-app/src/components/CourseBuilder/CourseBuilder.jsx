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

export default function CourseBuilder() {
    const [data, setData] = useState(initialData);

    const onDragEnd = (result) => {
        const { destination, source, type } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // TODO: Handle drag and drop logic here for Sections and Items
        // For now we just mock the interface to prove the structure
        console.log("Drag result:", result);
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
