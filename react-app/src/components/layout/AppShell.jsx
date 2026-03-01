import React from 'react';
import Sidebar from './Sidebar';

const AppShell = ({ children }) => {
    return (
        <div className="academia-app-container">
            <Sidebar />
            <main className="academia-main-content">
                <header className="academia-topbar">
                    <div className="breadcrumb">
                        <span style={{ color: '#64748b' }}>Dw Bolivar Academia lms</span>
                    </div>
                    <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 500 }}>Admin</span>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0' }}></div>
                    </div>
                </header>
                <section className="academia-page-body">
                    {children}
                </section>
            </main>
        </div>
    );
};

export default AppShell;
