import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/Courses';
import StudentList from './pages/Students';
import InstructorList from './pages/Instructors';
import CourseEditor from './pages/CourseEditor';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Course Editor is a fullscreen experience outside the AppShell */}
                <Route path="/courses/new" element={<CourseEditor />} />
                <Route path="/courses/edit/:id" element={<CourseEditor />} />

                {/* Standard pages inside the AppShell */}
                <Route path="/*" element={
                    <AppShell>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/courses" element={<CourseList />} />
                            <Route path="/students" element={<StudentList />} />
                            <Route path="/instructors" element={<InstructorList />} />
                            <Route path="/quizzes" element={<div>Página de Exámenes (En construcción)</div>} />
                            <Route path="/qa" element={<div>Consultas Q&A (En construcción)</div>} />
                            <Route path="/woocommerce" element={<div>Integración WooCommerce (En construcción)</div>} />
                            <Route path="/tools" element={<div>Herramientas (En construcción)</div>} />
                            <Route path="/settings" element={<div>Ajustes (En construcción)</div>} />
                        </Routes>
                    </AppShell>
                } />
            </Routes>
        </Router>
    );
};

export default App;
