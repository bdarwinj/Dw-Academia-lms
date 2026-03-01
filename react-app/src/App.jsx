import React from 'react'
import CourseBuilder from './components/CourseBuilder/CourseBuilder'
import './index.css'

function App() {
    return (
        <div className="academia-admin-wrap wrap">
            <h1>Academia LMS Dashboard</h1>
            <p>Bienvenido al panel de administración de Academia LMS.</p>

            <CourseBuilder />
        </div>
    )
}

export default App
