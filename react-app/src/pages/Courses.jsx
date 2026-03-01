import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    MoreVertical,
    Filter,
    BookOpen,
    User,
    Tag,
    Eye,
    Edit,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('any');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/courses?status=${status}&search=${search}`, {
                headers: {
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            const data = await response.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [status]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    const statusTabs = [
        { id: 'any', label: 'Todos' },
        { id: 'publish', label: 'Publicados' },
        { id: 'draft', label: 'Borradores' },
        { id: 'trash', label: 'Papelera' },
    ];

    return (
        <div className="courses-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Gestión de Cursos</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Administra y supervisa todos tus contenidos educativos.</p>
                </div>
                <Link
                    to="/courses/new"
                    className="academia-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                    <Plus size={18} />
                    Crear Nuevo Curso
                </Link>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="academia-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
                        {statusTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStatus(tab.id)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    background: 'none',
                                    color: status === tab.id ? '#6366f1' : '#64748b',
                                    borderBottom: status === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                                    fontWeight: status === tab.id ? 600 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} style={{ position: 'relative', minWidth: '300px' }}>
                        <Search
                            size={18}
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar cursos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.625rem 1rem 0.625rem 2.5rem',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.875rem'
                            }}
                        />
                    </form>
                </div>
            </div>

            {/* Listado de Cursos */}
            <div className="academia-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Curso</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Autor</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Categoría</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estudiantes</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Precio</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td colSpan="7" style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>Cargando datos...</td>
                                </tr>
                            ))
                        ) : courses.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <BookOpen size={48} style={{ color: '#e2e8f0' }} />
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '1.125rem', fontWeight: 500 }}>No hay cursos disponibles</p>
                                        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Prueba ajustando tus filtros de búsqueda.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            courses.map(course => (
                                <tr key={course.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                    <BookOpen size={20} />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{course.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {course.id} • {course.date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={14} />
                                            </div>
                                            {course.author}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {course.categories.length > 0 ? course.categories.map((cat, idx) => (
                                                <span key={idx} style={{ padding: '0.125rem 0.5rem', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem' }}>{cat}</span>
                                            )) : <span style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>Sin categoría</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#475569', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                            <Users size={16} style={{ color: '#94a3b8' }} />
                                            {course.enrollments} Alumnos
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: course.status === 'publish' ? '#dcfce7' : '#fef9c3',
                                            color: course.status === 'publish' ? '#166534' : '#854d0e'
                                        }}>
                                            {course.status === 'publish' ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                                        {course.price === 'Gratis' ? <span style={{ color: '#22c55e' }}>Gratis</span> : `$${course.price}`}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button className="academia-btn-icon" title="Ver Curso"><Eye size={16} /></button>
                                            <button className="academia-btn-icon" title="Editar"><Edit size={16} /></button>
                                            <button className="academia-btn-icon" title="Eliminar" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
