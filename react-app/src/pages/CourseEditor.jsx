import React, { useState } from 'react';
import {
    X,
    Save,
    Eye,
    Settings,
    BookOpen,
    Layout,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import CourseBuilder from '../components/CourseBuilder/CourseBuilder';

const CourseEditor = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [courseTitle, setCourseTitle] = useState('');

    const tabs = [
        { id: 'general', label: 'Información General', icon: Layout },
        { id: 'builder', label: 'Curriculum (D&D)', icon: BookOpen },
        { id: 'settings', label: 'Ajustes del Curso', icon: Settings },
    ];

    return (
        <div className="course-editor-fullscreen">
            {/* Top Bar Navigation */}
            <div className="editor-topbar">
                <div className="editor-left">
                    <button className="btn-close" onClick={() => window.history.back()}>
                        <X size={20} />
                    </button>
                    <div className="editor-title-container">
                        <span className="editor-badge">EDITANDO CURSO</span>
                        <input
                            type="text"
                            className="editor-title-input"
                            placeholder="Título del Curso..."
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div className="editor-actions">
                    <button className="btn-secondary">
                        <Eye size={18} /> Previsualizar
                    </button>
                    <button className="btn-primary">
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="editor-layout">
                <aside className="editor-sidebar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`editor-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}

                    <div className="editor-sidebar-footer">
                        <div className="progress-card">
                            <div className="progress-info">
                                <span>Progreso de creación</span>
                                <span>30%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Edit Area */}
                <main className="editor-content">
                    {activeTab === 'general' && (
                        <div className="editor-pane anim-fade-in">
                            <div className="pane-header">
                                <h2>Configuración General</h2>
                                <p>Define el título, descripción y multimedia de tu curso.</p>
                            </div>
                            <div className="editor-form">
                                <div className="form-group">
                                    <label>Descripción del Curso</label>
                                    <div className="placeholder-editor" style={{ height: '300px', background: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                        Inserción de Editor Rico (Quill/Gutenberg) - Fase 9.2
                                    </div>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Imagen de Portada</label>
                                        <div className="dropzone-mock">
                                            <span>Click para subir o arrastrar archivo</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Video Promocional</label>
                                        <input type="text" placeholder="URL de YouTube o Vimeo" className="academia-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'builder' && (
                        <div className="editor-pane anim-fade-in" style={{ padding: 0 }}>
                            <CourseBuilder />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="editor-pane anim-fade-in">
                            <h2>Ajustes Avanzados</h2>
                            <p>En construcción - Fase 9.2</p>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .course-editor-fullscreen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #fff;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                }
                .editor-topbar {
                    height: 70px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    background: #fff;
                }
                .editor-left {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .btn-close {
                    background: #f1f5f9;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                }
                .editor-title-container {
                    display: flex;
                    flex-direction: column;
                }
                .editor-badge {
                    font-size: 10px;
                    font-weight: 800;
                    color: #9333ea;
                    letter-spacing: 1px;
                }
                .editor-title-input {
                    border: none;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    outline: none;
                    width: 400px;
                    padding: 0;
                }
                .editor-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .editor-layout {
                    flex: 1;
                    display: flex;
                    overflow: hidden;
                }
                .editor-sidebar {
                    width: 280px;
                    border-right: 1px solid #e2e8f0;
                    background: #f8fafc;
                    display: flex;
                    flex-direction: column;
                    padding: 1rem 0;
                }
                .editor-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    border: none;
                    background: transparent;
                    width: 100%;
                    cursor: pointer;
                    color: #64748b;
                    font-weight: 500;
                    transition: all 0.2s;
                    border-left: 4px solid transparent;
                }
                .editor-nav-item.active {
                    color: #9333ea;
                    background: #f3e8ff;
                    border-left-color: #9333ea;
                }
                .editor-sidebar-footer {
                    margin-top: auto;
                    padding: 1.5rem;
                }
                .progress-card {
                    background: #fff;
                    padding: 1rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .progress-bar {
                    height: 6px;
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                .progress-fill {
                    height: 100%;
                    background: #9333ea;
                    border-radius: 3px;
                }
                .editor-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 3rem;
                    background: #fff;
                }
                .editor-pane {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .pane-header {
                    margin-bottom: 2.5rem;
                }
                .pane-header h2 { font-size: 2rem; font-weight: 800; margin: 0; }
                .pane-header p { color: #64748b; margin-top: 0.5rem; }
                .anim-fade-in { animation: fadeIn 0.4s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                
                .form-group { margin-bottom: 2rem; }
                .form-group label { display: block; font-weight: 600; margin-bottom: 0.75rem; color: #1e293b; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .dropzone-mock {
                    height: 150px;
                    border: 2px dashed #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: border 0.2s;
                }
                .dropzone-mock:hover { border-color: #9333ea; color: #9333ea; }
                .academia-input {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default CourseEditor;
