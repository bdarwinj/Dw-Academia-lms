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
    ExternalLink
} from 'lucide-react';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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
                                            <button className="academia-btn-icon" title="Editar"><Edit size={16} /></button>
                                            <button className="academia-btn-icon" title="Ver Perfil"><ExternalLink size={16} /></button>
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

export default StudentList;
