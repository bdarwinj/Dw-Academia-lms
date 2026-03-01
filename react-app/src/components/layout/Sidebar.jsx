import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart2,
    BookOpen,
    Settings,
    Users,
    GraduationCap,
    FileText,
    MessageSquare,
    Wrench,
    ShoppingBag
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { label: 'Dashboard', path: '/', icon: BarChart2 },
        { label: 'Cursos', path: '/courses', icon: BookOpen },
        { label: 'Estudiantes', path: '/students', icon: GraduationCap },
        { label: 'Profesores', path: '/instructors', icon: Users },
        { label: 'Exámenes', path: '/quizzes', icon: FileText },
        { label: 'Consultas (Q&A)', path: '/qa', icon: MessageSquare },
        { label: 'WooCommerce', path: '/woocommerce', icon: ShoppingBag },
        { label: 'Formularios', path: '/forms', icon: FileText },
        { label: 'Herramientas', path: '/tools', icon: Wrench },
        { label: 'Ajustes', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="academia-sidebar">
            <div className="academia-sidebar-logo">
                <GraduationCap size={32} color="#9333ea" />
                <span>Dw Bolivar</span>
            </div>

            <nav className="academia-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `academia-nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer" style={{ padding: '1.5rem', fontSize: '0.8rem', opacity: 0.5 }}>
                v1.0.0
            </div>
        </aside>
    );
};

export default Sidebar;
