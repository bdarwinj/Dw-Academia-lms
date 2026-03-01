import React, { useState, useRef } from 'react';
import {
    Save,
    Eye,
    Settings,
    BookOpen,
    Layout,
    ArrowLeft,
    UploadCloud,
    Loader2,
    CheckCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CourseBuilder from '../components/CourseBuilder/CourseBuilder';
import { buildApiUrl } from '../utils/api';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

    // Global Course State
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [price, setPrice] = useState('0');
    const [status, setStatus] = useState('draft');
    const [level, setLevel] = useState('beginner');
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Thumbnail State
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const fileInputRef = useRef(null);

    // Builder State
    const [builderData, setBuilderData] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null); // { sectionId, itemId, type, title }

    const tabs = [
        { id: 'general', label: 'Información General', icon: Layout },
        { id: 'builder', label: 'Constructor', icon: BookOpen },
        { id: 'settings', label: 'Ajustes', icon: Settings },
    ];

    const availableCategories = ['Desarrollo Web', 'Marketing', 'Diseño', 'Negocios', 'Fotografía'];

    const handleCategoryToggle = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setThumbnailUrl(url);
            setThumbnailFile(file);
        }
    };

    // --- Load Course Data ---
    React.useEffect(() => {
        if (!id) return;

        const fetchCourse = async () => {
            try {
                const url = buildApiUrl(`academia-lms/v1/courses/${id}`);
                const response = await fetch(url, { headers: { 'X-WP-Nonce': window.academiaLmsData.nonce } });
                if (response.ok) {
                    const data = await response.json();
                    setCourseTitle(data.title || '');
                    setDescription(data.description || '');
                    setVideoUrl(data.videoUrl || '');
                    setPrice(data.price || '0');
                    setStatus(data.status || 'draft');
                    setLevel(data.level || 'beginner');
                    setSelectedCategories(data.categories || []);
                    if (data.thumbnail) setThumbnailUrl(data.thumbnail);
                    if (data.builder_data) setBuilderData(data.builder_data);
                }
            } catch (error) {
                console.error("Error loading course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    // --- Save Course Logic ---
    const handleSave = async () => {
        if (!courseTitle.trim()) {
            alert('El título del curso es requerido.');
            return;
        }

        setIsSaving(true);
        let featured_media = null;

        if (thumbnailFile) {
            const formData = new FormData();
            formData.append('file', thumbnailFile);
            formData.append('title', `thumb_${thumbnailFile.name}`);
            try {
                const uploadRes = await fetch(window.academiaLmsData.root + 'wp/v2/media', {
                    method: 'POST',
                    headers: { 'X-WP-Nonce': window.academiaLmsData.nonce },
                    body: formData
                });
                if (uploadRes.ok) {
                    const mediaData = await uploadRes.json();
                    featured_media = mediaData.id;
                }
            } catch (error) {
                console.error("Error uploading thumbnail:", error);
            }
        }

        const payload = {
            title: courseTitle,
            description,
            videoUrl,
            price,
            status,
            level,
            categories: selectedCategories,
        };
        if (featured_media) payload.featured_media = featured_media;
        if (builderData) payload.builder_data = builderData;

        try {
            const endpoint = id ? `academia-lms/v1/courses/${id}` : `academia-lms/v1/courses`;
            const method = id ? 'PUT' : 'POST';
            const url = buildApiUrl(endpoint);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.academiaLmsData.nonce
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const resData = await response.json();
                alert(resData.message || (id ? 'Curso actualizado' : 'Curso creado'));
                if (!id && resData.id) {
                    navigate(`/courses/edit/${resData.id}`, { replace: true });
                }
            } else {
                alert('Error al guardar el curso.');
            }
        } catch (error) {
            console.error("Error saving course:", error);
            alert('Error de conexión al guardar.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditLesson = (lesson) => {
        setEditingLesson(lesson);
    };

    const closeLessonEditor = () => {
        setEditingLesson(null);
    };

    const updateLessonData = (sectionId, itemId, field, value) => {
        const newData = { ...builderData };
        const section = newData.sections[sectionId];
        const itemIndex = section.items.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
            section.items[itemIndex] = { ...section.items[itemIndex], [field]: value };
            setBuilderData(newData);
        }
    };

    return (
        <div className="course-editor-fullscreen">
            {loading && (
                <div className="editor-loading-overlay">
                    <Loader2 className="spinner" size={40} color="#9333ea" />
                </div>
            )}

            {/* Top Bar Navigation */}
            <header className="editor-topbar">
                <div className="editor-top-left">
                    <button className="btn-close-circle" onClick={() => navigate('/courses')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="editor-header-info">
                        <span className="info-badge">EDITANDO CURSO</span>
                        <input
                            type="text"
                            className="header-title-input"
                            placeholder="Nombre del curso..."
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                        />
                    </div>
                </div>

                <nav className="editor-nav-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`nav-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="editor-top-actions">
                    <button className="btn-secondary-light" onClick={() => alert('Vista previa...')}>
                        <Eye size={18} /> Previsualizar
                    </button>
                    <button className="btn-primary-purple" onClick={handleSave} disabled={isSaving || loading}>
                        {isSaving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Guardando...' : 'Publicar'}
                    </button>
                </div>
            </header>

            {/* Content Area */}
            <main className="editor-main-scroll">
                {activeTab === 'general' && (
                    <div className="overview-layout anim-fade-in">
                        {/* Main Pillar (70%) */}
                        <div className="overview-main-pillar">
                            <div className="pillar-block">
                                <label className="block-label">Título del Curso</label>
                                <input
                                    type="text"
                                    className="pill-input-title"
                                    placeholder="ej: Master Class de React Avanzado"
                                    value={courseTitle}
                                    onChange={(e) => setCourseTitle(e.target.value)}
                                />
                            </div>

                            <div className="pillar-block">
                                <label className="block-label">Descripción Detallada</label>
                                <div className="quill-wrapper-advanced">
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                    />
                                </div>
                            </div>

                            <div className="pillar-block">
                                <label className="block-label">Puntos Clave (Highlights)</label>
                                <textarea
                                    className="pillar-textarea"
                                    placeholder="¿Qué logrará el estudiante?"
                                    rows="4"
                                ></textarea>
                            </div>
                        </div>

                        {/* Sidebar Pillar (30%) */}
                        <aside className="overview-sidebar-pillar">
                            <div className="sidebar-block">
                                <label className="block-label">Portada del Curso</label>
                                <div className="dropzone-premium" onClick={() => fileInputRef.current.click()}>
                                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageSelect} />
                                    {thumbnailUrl ? (
                                        <img src={thumbnailUrl} alt="Thumbnail" className="img-full" />
                                    ) : (
                                        <div className="placeholder-content">
                                            <UploadCloud size={28} />
                                            <span>Subir Portada</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="sidebar-block">
                                <label className="block-label">Categorías</label>
                                <div className="categories-stack">
                                    {availableCategories.map(cat => (
                                        <label key={cat} className="stack-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryToggle(cat)}
                                            />
                                            <span>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-block">
                                <label className="block-label">Nivel / Dificultad</label>
                                <select className="pillar-select" value={level} onChange={e => setLevel(e.target.value)}>
                                    <option value="beginner">Principiante</option>
                                    <option value="intermediate">Intermedio</option>
                                    <option value="advanced">Avanzado</option>
                                </select>
                            </div>

                            <div className="sidebar-block">
                                <label className="block-label">Slug del Curso</label>
                                <input type="text" className="pillar-input-sm" placeholder="url-del-curso" defaultValue={courseTitle.toLowerCase().replace(/ /g, '-')} />
                            </div>
                        </aside>
                    </div>
                )}

                {activeTab === 'builder' && (
                    <div className="builder-canvas-wrapper anim-fade-in">
                        {!editingLesson ? (
                            <CourseBuilder
                                value={builderData}
                                onChange={setBuilderData}
                                onEditItem={handleEditLesson}
                            />
                        ) : (
                            <div className="lesson-sub-view anim-fade-in">
                                <header className="sub-view-header">
                                    <button className="btn-back-builder" onClick={closeLessonEditor}>
                                        <ArrowLeft size={18} /> Volver al Constructor
                                    </button>
                                    <div className="sub-view-title-info">
                                        <span className="type-badge">{editingLesson.type.toUpperCase()}</span>
                                        <h4>{editingLesson.title}</h4>
                                    </div>
                                    <button className="btn-primary-purple" onClick={closeLessonEditor}>
                                        <CheckCircle size={18} /> Finalizar Edición
                                    </button>
                                </header>

                                <div className="sub-view-grid">
                                    <div className="sub-view-main">
                                        <div className="pillar-block">
                                            <label className="block-label">Título de la Lección</label>
                                            <input
                                                type="text"
                                                className="pill-input-title"
                                                value={editingLesson.title}
                                                onChange={(e) => {
                                                    const newTitle = e.target.value;
                                                    setEditingLesson(prev => ({ ...prev, title: newTitle }));
                                                    updateLessonData(editingLesson.sectionId, editingLesson.itemId, 'title', newTitle);
                                                }}
                                            />
                                        </div>

                                        <div className="pillar-block">
                                            <label className="block-label">Contenido de la Lección</label>
                                            <div className="quill-wrapper-advanced">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={editingLesson.content || ''}
                                                    onChange={(content) => {
                                                        setEditingLesson(prev => ({ ...prev, content }));
                                                        updateLessonData(editingLesson.sectionId, editingLesson.itemId, 'content', content);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <aside className="sub-view-sidebar">
                                        {editingLesson.type === 'video' && (
                                            <div className="sidebar-block">
                                                <label className="block-label">URL del Video (YouTube/Vimeo)</label>
                                                <input
                                                    type="text"
                                                    className="pillar-input-sm"
                                                    placeholder="https://..."
                                                    value={editingLesson.videoUrl || ''}
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        setEditingLesson(prev => ({ ...prev, videoUrl: url }));
                                                        updateLessonData(editingLesson.sectionId, editingLesson.itemId, 'videoUrl', url);
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="sidebar-block">
                                            <label className="block-label">Ajustes de Lección</label>
                                            <label className="stack-item">
                                                <input type="checkbox" />
                                                <span>Vista previa gratuita</span>
                                            </label>
                                            <label className="stack-item" style={{ marginTop: '0.5rem' }}>
                                                <input type="checkbox" />
                                                <span>Obligatoria para avanzar</span>
                                            </label>
                                        </div>

                                        <div className="sidebar-block">
                                            <label className="block-label">Miniatura de Lección</label>
                                            <div className="dropzone-premium-sm">
                                                <UploadCloud size={20} />
                                                <span>Subir Imagen</span>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-master-detail-layout anim-fade-in">
                        <aside className="settings-nav-master">
                            <button className="nav-master-item active">General</button>
                            <button className="nav-master-item">Precios</button>
                            <button className="nav-master-item">Acceso y Restricciones</button>
                            <button className="nav-master-item">Visualización</button>
                            <button className="nav-master-item">Certificaciones</button>
                        </aside>
                        <div className="settings-detail-panel">
                            <div className="detail-section">
                                <h3>Configuración de Instructor</h3>
                                <div className="form-row">
                                    <label>Instructor Principal:</label>
                                    <input type="text" className="pillar-input-sm" disabled value="darwin" />
                                </div>
                                <div className="form-row">
                                    <label>Duración del Curso:</label>
                                    <div className="input-group-duration">
                                        <input type="number" placeholder="0" className="pillar-input-number" />
                                        <span>Horas</span>
                                        <input type="number" placeholder="0" className="pillar-input-number" />
                                        <span>Minutos</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                .course-editor-fullscreen {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #f1f5f9;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Inter', sans-serif;
                }
                .editor-loading-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.7);
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .editor-topbar {
                    height: 72px;
                    background: #fff;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                .editor-top-left { display: flex; align-items: center; gap: 1rem; }
                .btn-close-circle {
                    width: 40px; height: 40px; border-radius: 50%; border: none; background: #f8fafc;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;
                    transition: all 0.2s;
                }
                .btn-close-circle:hover { background: #e2e8f0; color: #1e293b; }
                .editor-header-info { display: flex; flex-direction: column; }
                .info-badge { font-size: 10px; font-weight: 800; color: #9333ea; letter-spacing: 0.5px; }
                .header-title-input { border: none; outline: none; font-size: 18px; font-weight: 700; color: #1e293b; padding: 0; width: 350px; background: transparent; }

                .editor-nav-tabs { display: flex; gap: 2rem; height: 100%; align-items: center; }
                .nav-tab-item {
                    display: flex; align-items: center; gap: 0.5rem; background: none; border: none;
                    height: 100%; border-bottom: 3px solid transparent; color: #64748b; font-weight: 600;
                    cursor: pointer; padding: 0 0.5rem; transition: all 0.2s;
                }
                .nav-tab-item.active { color: #9333ea; border-bottom-color: #9333ea; }

                .editor-top-actions { display: flex; gap: 0.75rem; }
                .btn-primary-purple {
                    background: #9333ea; color: #fff; border: none; padding: 0.6rem 1.25rem; border-radius: 8px;
                    font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s;
                }
                .btn-primary-purple:hover { background: #7e22ce; transform: translateY(-1px); }
                .btn-secondary-light {
                    background: #fff; color: #64748b; border: 1px solid #e2e8f0; padding: 0.6rem 1.25rem; border-radius: 8px;
                    font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
                }

                .editor-main-scroll { flex: 1; overflow-y: auto; padding: 2rem; }

                /* Overview Layout */
                .overview-layout { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                .overview-main-pillar { display: flex; flex-direction: column; gap: 1.5rem; }
                .pillar-block { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
                .block-label { display: block; font-weight: 700; color: #1e293b; margin-bottom: 1rem; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
                .pill-input-title { width: 100%; padding: 0.8rem; font-size: 1.25rem; font-weight: 700; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
                .pill-input-title:focus { border-color: #9333ea; }
                .quill-wrapper-advanced .ql-container { min-height: 250px; font-size: 16px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                .quill-wrapper-advanced .ql-toolbar { border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f8fafc; }
                .pillar-textarea { width: 100%; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; resize: vertical; }

                .overview-sidebar-pillar { display: flex; flex-direction: column; gap: 1.5rem; }
                .sidebar-block { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 1.5rem; }
                .dropzone-premium {
                    height: 160px; border: 2px dashed #cbd5e1; border-radius: 10px; background: #f8fafc;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden;
                    transition: all 0.2s;
                }
                .dropzone-premium:hover { border-color: #9333ea; background: #f3e8ff; }
                .img-full { width: 100%; height: 100%; object-fit: cover; }
                .placeholder-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: #94a3b8; font-weight: 600; font-size: 13px; }

                .categories-stack { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; background: #f8fafc; padding: 1rem; border-radius: 8px; }
                .stack-item { display: flex; align-items: center; gap: 0.75rem; font-size: 14px; color: #475569; cursor: pointer; }
                .stack-item input { width: 16px; height: 16px; accent-color: #9333ea; }

                .pillar-select, .pillar-input-sm { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none; }
                .pillar-input-number { width: 60px; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 6px; text-align: center; outline: none; }

                /* Settings Layout */
                .settings-master-detail-layout {
                    max-width: 1000px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
                    display: grid; grid-template-columns: 240px 1fr; min-height: 500px; overflow: hidden;
                }
                .settings-nav-master { background: #f8fafc; border-right: 1px solid #e2e8f0; padding: 1rem 0; }
                .nav-master-item {
                    width: 100%; text-align: left; padding: 1rem 1.5rem; border: none; background: transparent;
                    color: #64748b; font-weight: 600; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s;
                }
                .nav-master-item.active { background: #fff; color: #9333ea; border-left-color: #9333ea; }
                .settings-detail-panel { padding: 2.5rem; }
                .detail-section h3 { margin-bottom: 2rem; font-size: 1.25rem; font-weight: 800; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                .form-row { display: flex; align-items: center; gap: 2rem; margin-bottom: 1.5rem; }
                .form-row label { font-weight: 700; color: #475569; min-width: 160px; font-size: 14px; }
                .input-group-duration { display: flex; align-items: center; gap: 1rem; color: #64748b; font-size: 13px; }

                .builder-canvas-wrapper { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; }

                /* Lesson Sub-view Styles */
                .lesson-sub-view { display: flex; flex-direction: column; gap: 2rem; }
                .sub-view-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; }
                .btn-back-builder { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
                .btn-back-builder:hover { color: #9333ea; }
                .sub-view-title-info { text-align: center; }
                .sub-view-title-info h4 { margin: 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
                .type-badge { font-size: 10px; font-weight: 800; color: #9333ea; background: #f3e8ff; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 0.25rem; }
                
                .sub-view-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
                .sub-view-main { display: flex; flex-direction: column; gap: 1.5rem; }
                .sub-view-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
                .dropzone-premium-sm { height: 100px; border: 2px dashed #e2e8f0; border-radius: 10px; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #94a3b8; font-size: 12px; font-weight: 600; cursor: pointer; }

                .anim-fade-in { animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CourseEditor;
