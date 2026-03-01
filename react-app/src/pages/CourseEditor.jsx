import React, { useState, useRef } from 'react';
import {
    X,
    Save,
    Eye,
    Settings,
    BookOpen,
    Layout,
    CheckCircle,
    ArrowLeft,
    UploadCloud,
    Image as ImageIcon,
    Loader2
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

    const tabs = [
        { id: 'general', label: 'Información General', icon: Layout },
        { id: 'builder', label: 'Curriculum (D&D)', icon: BookOpen },
        { id: 'settings', label: 'Ajustes del Curso', icon: Settings },
    ];

    const availableCategories = ['Desarrollo Web', 'Marketing', 'Diseño', 'Negocios', 'Fotografía'];

    const handleCategoryToggle = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setThumbnailUrl(url);
            setThumbnailFile(file);
        }
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

        // 1. Upload Thumbnail if changed
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

        // 2. Prepare payload
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

        // 3. Save or Update Course
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

    return (
        <div className="course-editor-fullscreen">
            {loading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="spinner" size={40} color="#9333ea" />
                    <style>{`.spinner { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

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
                    <button className="btn-secondary" disabled={isSaving}>
                        <Eye size={18} /> Previsualizar
                    </button>
                    <button className="btn-primary" onClick={handleSave} disabled={isSaving || loading}>
                        {isSaving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
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
                                <div className="form-group" style={{ marginBottom: '4rem' }}>
                                    <label>Descripción del Curso</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={setDescription}
                                        style={{ height: '250px' }}
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Imagen de Portada</label>
                                        <div
                                            className="dropzone-interactive"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={handleImageDrop}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                            />
                                            {thumbnailUrl ? (
                                                <img src={thumbnailUrl} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                            ) : (
                                                <div className="dropzone-content">
                                                    <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '10px' }} />
                                                    <span>Haz clic o arrastra una imagen aquí</span>
                                                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>JPG, PNG, WebP (Max 2MB)</span>
                                                </div>
                                            )}
                                        </div>
                                        {thumbnailUrl && (
                                            <button className="btn-text" style={{ marginTop: '0.5rem', color: '#ef4444' }} onClick={() => setThumbnailUrl(null)}>
                                                Quitar imagen
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Video Promocional</label>
                                        <input
                                            type="text"
                                            placeholder="URL de YouTube, Vimeo o MP4"
                                            className="academia-input"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                        />
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '0.5rem' }}>
                                            Ingresa el enlace al video de introducción. Los estudiantes lo verán antes de matricularse.
                                        </p>
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
                            <div className="pane-header">
                                <h2>Ajustes Avanzados</h2>
                                <p>Configura precio, estado, taxonomías y dificultad del curso.</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Estado de Publicación</label>
                                    <select
                                        className="academia-select"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                    >
                                        <option value="draft">Borrador (Privado)</option>
                                        <option value="publish">Publicado (Visible)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Precio (USD)</label>
                                    <input
                                        type="number"
                                        className="academia-input"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>Deja 0 para que sea un curso Gratuito.</span>
                                </div>
                                <div className="form-group">
                                    <label>Nivel del Curso</label>
                                    <select
                                        className="academia-select"
                                        value={level}
                                        onChange={e => setLevel(e.target.value)}
                                    >
                                        <option value="beginner">Principiante</option>
                                        <option value="intermediate">Intermedio</option>
                                        <option value="advanced">Avanzado</option>
                                        <option value="all">Todos los niveles</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '2rem' }}>
                                <label>Categorías / Etiquetas</label>
                                <div className="categories-grid" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {availableCategories.map(cat => (
                                        <label
                                            key={cat}
                                            className={`category-pill ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                hidden
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryToggle(cat)}
                                            />
                                            {selectedCategories.includes(cat) && <CheckCircle size={14} />}
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

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
                
                .dropzone-interactive {
                    height: 180px;
                    border: 2px dashed #cbd5e1;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .dropzone-interactive:hover { border-color: #9333ea; background: #f3e8ff; color: #9333ea; }
                .dropzone-content { display: flex; flex-direction: column; alignItems: center; textAlign: center; }
                
                .academia-input, .academia-select {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 8px;
                    border: 1px solid #cbd5e1;
                    outline: none;
                    background: #fff;
                    font-size: 14px;
                }
                .academia-input:focus, .academia-select:focus { border-color: #9333ea; box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1); }
                
                .category-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    border: 1px solid #cbd5e1;
                    background: #fff;
                    color: #475569;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .category-pill.selected {
                    background: #9333ea;
                    border-color: #9333ea;
                    color: #fff;
                }
                
                .btn-text {
                    background: none;
                    border: none;
                    font-size: 13px;
                    cursor: pointer;
                    font-weight: 500;
                }
                .btn-text:hover { text-decoration: underline; }
                
                /* Quill overrides */
                .ql-editor { font-family: 'Inter', sans-serif; font-size: 15px; }
                .ql-container { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                .ql-toolbar { border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default CourseEditor;
