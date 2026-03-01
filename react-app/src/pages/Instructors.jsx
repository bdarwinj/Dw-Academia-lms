import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Users,
    User,
    Mail,
    Calendar,
    BookOpen,
    Edit,
    Trash2,
    ExternalLink,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import Modal from '../components/common/Modal';
import SlideOver from '../components/common/SlideOver';
import { buildApiUrl } from '../utils/api';

const InstructorList = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [instructorCourses, setInstructorCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        role: 'instructor'
    });

    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const url = buildApiUrl('academia-lms/v1/users/instructors', { search });
            const response = await fetch(url, {
                headers: {
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            const data = await response.json();
            setInstructors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInstructors();
    };

    const handleAddInstructor = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = buildApiUrl('academia-lms/v1/users');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.academiaLmsData.nonce
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                setIsAddModalOpen(false);
                setFormData({ name: '', email: '', username: '', role: 'instructor' });
                fetchInstructors();
            } else {
                alert(result.message || "Error al invitar profesor");
            }
        } catch (error) {
            console.error("Error creating instructor:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteInstructor = async (id) => {
        if (!confirm("¿Estás seguro de eliminar a este profesor?")) return;

        try {
            const url = buildApiUrl(`academia-lms/v1/users/${id}`);
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            if (response.ok) {
                fetchInstructors();
            }
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    const openProfile = async (instructor) => {
        setSelectedInstructor(instructor);
        setIsProfileOpen(true);
        setLoadingCourses(true);
        try {
            const url = buildApiUrl(`academia-lms/v1/users/${instructor.id}/courses`);
            const response = await fetch(url, {
                headers: { 'X-WP-Nonce': window.academiaLmsData.nonce }
            });
            const data = await response.json();
            setInstructorCourses(data);
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
        } finally {
            setLoadingCourses(false);
        }
    };

    return (
        <div className="instructors-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Gestión de Profesores</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Administra el equipo docente y sus cursos asignados.</p>
                </div>
                <button
                    className="academia-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={18} />
                    Invitar Profesor
                </button>
            </div>

            {/* Filtros y Búsqueda */}
            <div className="academia-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <form onSubmit={handleSearch} style={{ position: 'relative', minWidth: '300px' }}>
                        <Search
                            size={18}
                            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                        />
                        <input
                            type="text"
                            placeholder="Buscar profesor..."
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

            {/* Listado de Instructores */}
            <div className="academia-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Profesor</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Usuario / Email</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Cursos Creados</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha Registro</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>Cargando datos...</td>
                                </tr>
                            ))
                        ) : instructors.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <Users size={48} style={{ color: '#e2e8f0' }} />
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '1.125rem', fontWeight: 500 }}>No hay profesores registrados</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            instructors.map(instructor => (
                                <tr key={instructor.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img src={instructor.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{instructor.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{instructor.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                                <User size={14} style={{ color: '#94a3b8' }} />
                                                <strong>{instructor.username}</strong>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Mail size={14} style={{ color: '#94a3b8' }} />
                                                {instructor.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            background: '#fef3c7',
                                            color: '#d97706',
                                            fontSize: '0.875rem',
                                            fontWeight: 600
                                        }}>
                                            {instructor.courses_count} Cursos
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            {new Date(instructor.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button className="academia-btn-icon" title="Editar" onClick={() => openProfile(instructor)}><Edit size={16} /></button>
                                            <button className="academia-btn-icon" title="Ver Cursos" onClick={() => openProfile(instructor)}><BookOpen size={16} /></button>
                                            <button className="academia-btn-icon" title="Eliminar" style={{ color: '#ef4444' }} onClick={() => handleDeleteInstructor(instructor.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Invitar Profesor */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Invitar Nuevo Profesor"
                footer={(
                    <>
                        <button className="academia-btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                        <button
                            className="academia-btn-primary"
                            onClick={handleAddInstructor}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Invitar Profesor'}
                        </button>
                    </>
                )}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre Completo</label>
                        <input
                            type="text"
                            className="academia-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Dr. Alejandro Silva"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de Usuario</label>
                        <input
                            type="text"
                            className="academia-input"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Ej: asilva_pro"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
                        <input
                            type="email"
                            className="academia-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="asilva@academia.com"
                        />
                    </div>
                </div>
            </Modal>

            {/* SlideOver para Cursos del Profesor */}
            <SlideOver
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                title="Cursos Asignados"
            >
                {selectedInstructor && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={selectedInstructor.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{selectedInstructor.name}</h4>
                                <span style={{ color: '#64748b' }}>Profesor ID: #{selectedInstructor.id}</span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                            <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Listado de Cursos Creados</h5>

                            {loadingCourses ? (
                                <p style={{ color: '#94a3b8' }}>Cargando cursos...</p>
                            ) : instructorCourses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    <BookOpen size={32} style={{ color: '#e2e8f0', marginBottom: '0.5rem' }} />
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>No tiene cursos asignados aún.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {instructorCourses.map(course => (
                                        <div key={course.id} style={{ padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{course.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {course.id}</div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>
                                                {course.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SlideOver>
        </div>
    );
};


export default InstructorList;
