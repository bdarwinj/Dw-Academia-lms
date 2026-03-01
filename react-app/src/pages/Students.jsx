import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    User,
    GraduationCap,
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

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentCourses, setStudentCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        role: 'subscriber'
    });

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/users/students?search=${search}`, {
                headers: {
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            const data = await response.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/users`, {
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
                setFormData({ name: '', email: '', username: '', role: 'subscriber' });
                fetchStudents();
            } else {
                alert(result.message || "Error al crear estudiante");
            }
        } catch (error) {
            console.error("Error creating student:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!confirm("¿Estás seguro de eliminar a este estudiante?")) return;

        try {
            const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            if (response.ok) {
                fetchStudents();
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const openProfile = async (student) => {
        setSelectedStudent(student);
        setIsProfileOpen(true);
        setLoadingCourses(true);
        try {
            const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/users/${student.id}/courses`, {
                headers: { 'X-WP-Nonce': window.academiaLmsData.nonce }
            });
            const data = await response.json();
            setStudentCourses(data);
        } catch (error) {
            console.error("Error fetching student courses:", error);
        } finally {
            setLoadingCourses(false);
        }
    };

    return (
        <div className="students-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Gestión de Estudiantes</h1>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Visualiza y administra a los alumnos inscritos en tu academia.</p>
                </div>
                <button
                    className="academia-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={18} />
                    Añadir Nuevo Estudiante
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
                            placeholder="Buscar por nombre o email..."
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

            {/* Listado de Estudiantes */}
            <div className="academia-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Estudiante</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Usuario / Email</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>Cursos Inscritos</th>
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
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                        <GraduationCap size={48} style={{ color: '#e2e8f0' }} />
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '1.125rem', fontWeight: 500 }}>No hay estudiantes registrados</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            students.map(student => (
                                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img src={student.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{student.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                                                <User size={14} style={{ color: '#94a3b8' }} />
                                                <strong>{student.username}</strong>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                <Mail size={14} style={{ color: '#94a3b8' }} />
                                                {student.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            background: '#eef2ff',
                                            color: '#6366f1',
                                            fontSize: '0.875rem',
                                            fontWeight: 600
                                        }}>
                                            {student.courses_count} Cursos
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#64748b', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            {new Date(student.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button className="academia-btn-icon" title="Editar" onClick={() => openProfile(student)}><Edit size={16} /></button>
                                            <button className="academia-btn-icon" title="Ver Perfil" onClick={() => openProfile(student)}><ExternalLink size={16} /></button>
                                            <button className="academia-btn-icon" title="Eliminar" style={{ color: '#ef4444' }} onClick={() => handleDeleteStudent(student.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para Añadir Estudiante */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Añadir Nuevo Estudiante"
                footer={(
                    <>
                        <button className="academia-btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                        <button
                            className="academia-btn-primary"
                            onClick={handleAddStudent}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Crear Estudiante'}
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
                            placeholder="Ej: Juan Pérez"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de Usuario</label>
                        <input
                            type="text"
                            className="academia-input"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Ej: juanperez123"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo Electrónico</label>
                        <input
                            type="email"
                            className="academia-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                        />
                    </div>
                </div>
            </Modal>

            {/* SlideOver para Perfil de Estudiante */}
            <SlideOver
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                title="Perfil del Estudiante"
            >
                {selectedStudent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={selectedStudent.avatar} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>{selectedStudent.name}</h4>
                                <span style={{ color: '#64748b' }}>{selectedStudent.email}</span>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Cursos Inscritos</h5>
                                <button className="academia-btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>+ Inscribir</button>
                            </div>

                            {loadingCourses ? (
                                <p style={{ color: '#94a3b8' }}>Cargando cursos...</p>
                            ) : studentCourses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    <BookOpen size={32} style={{ color: '#e2e8f0', marginBottom: '0.5rem' }} />
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>No tiene cursos inscritos.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {studentCourses.map(course => (
                                        <div key={course.id} style={{ padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{course.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Progreso: {course.progress}%</div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#dcfce7', color: '#166534' }}>
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

export default StudentList;
