import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';

const App = () => {
    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/courses" element={<div>Página de Cursos (En construcción)</div>} />
                    <Route path="/students" element={<div>Página de Estudiantes (En construcción)</div>} />
                    <Route path="/instructors" element={<div>Página de Instructores (En construcción)</div>} />
                    <Route path="/settings" element={<div>Ajustes (En construcción)</div>} />
                    {/* Añadir más rutas según el roadmap */}
                </Routes>
            </AppShell>
        </Router>
    );
};

export default App;
