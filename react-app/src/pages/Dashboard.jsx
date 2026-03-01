import React, { useState, useEffect } from 'react';
import { BarChart2, BookOpen, Users, GraduationCap } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="academia-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: color + '15',
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{value}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        courses: 0,
        enrollments: 0,
        lessons: 0,
        questions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${window.academiaLmsData.root}academia-lms/v1/stats/overview`, {
                    headers: {
                        'X-WP-Nonce': window.academiaLmsData.nonce
                    }
                });
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-page">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Panel de Control (Dw Bolivar)</h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Bienvenido a tu academia personalizada.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                <StatCard label="Total Cursos" value={loading ? '...' : stats.courses} icon={BookOpen} color="#6366f1" />
                <StatCard label="Cursos Enrolados" value={loading ? '...' : stats.enrollments} icon={GraduationCap} color="#ec4899" />
                <StatCard label="Total Lecciones" value={loading ? '...' : stats.lessons} icon={BarChart2} color="#3b82f6" />
                <StatCard label="Preguntas" value={loading ? '...' : stats.questions} icon={Users} color="#f59e0b" />
            </div>

            <div className="academia-card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <BarChart2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>Aquí se mostrarán los gráficos de barras interactivos próximamente.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
