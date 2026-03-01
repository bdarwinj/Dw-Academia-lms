import React, { useState } from 'react'
import './index.css'

function App() {
    const [count, setCount] = useState(0)

    // Use the global window object localized from PHP
    const apiRoot = window.academiaLmsData?.root || '';

    return (
        <div className="academia-admin-wrap wrap">
            <h1>Academia LMS Dashboard</h1>
            <p>Bienvenido al panel de administración de Academia LMS (React SPA).</p>

            <div className="card">
                <h2>Prueba de interactividad</h2>
                <button onClick={() => setCount((c) => c + 1)}>
                    Contador interactivo: {count}
                </button>
            </div>

            <div className="card" style={{ marginTop: '20px' }}>
                <h2>API Connection Info</h2>
                <p>WordPress REST API Root Endpoint: <code>{apiRoot}</code></p>
            </div>
        </div>
    )
}

export default App
