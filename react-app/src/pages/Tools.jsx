import React, { useState, useEffect } from 'react';
import {
    Wrench,
    Zap,
    CheckCircle,
    AlertCircle,
    Loader2,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import { buildApiUrl } from '../utils/api';

const Tools = () => {
    const [pageStatus, setPageStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchStatus = async () => {
        try {
            const url = buildApiUrl('academia-lms/v1/tools/check-pages');
            const response = await fetch(url, {
                headers: { 'X-WP-Nonce': window.academiaLmsData.nonce }
            });
            if (response.ok) {
                const data = await response.json();
                setPageStatus(data);
            }
        } catch (error) {
            console.error("Error checking pages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleGenerate = async () => {
        setProcessing(true);
        setMessage(null);
        try {
            const url = buildApiUrl('academia-lms/v1/tools/generate-pages');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.academiaLmsData.nonce
                }
            });
            const data = await response.json();
            setMessage({ type: 'success', text: data.message });
            fetchStatus();
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al conectar con el servidor.' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="academia-tools-page anim-fade-in">
            <header className="page-header">
                <div className="header-info">
                    <h1>Soporte y Herramientas</h1>
                    <p>Acciones administrativas para el mantenimiento de la plataforma.</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn-secondary"
                        onClick={fetchStatus}
                        disabled={loading || processing}
                    >
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </header>

            <div className="tools-grid">
                {/* Tool 1: Page Generation */}
                <div className="tool-card">
                    <div className="tool-icon">
                        <Zap size={24} color="#9333ea" />
                    </div>
                    <div className="tool-body">
                        <h3>Generación de Páginas Críticas</h3>
                        <p>
                            Esta herramienta verifica si las páginas esenciales (Dashboard, Catálogo, etc.) existen.
                            Si no están, las crea automáticamente con sus respectivos shortcodes.
                        </p>

                        <div className="status-checklist">
                            {loading ? (
                                <div className="loading-shimmer" style={{ height: '60px' }}></div>
                            ) : (
                                pageStatus.map(page => (
                                    <div key={page.id} className="status-item">
                                        {page.exists ? (
                                            <CheckCircle size={16} color="#10b981" />
                                        ) : (
                                            <AlertCircle size={16} color="#f59e0b" />
                                        )}
                                        <span className={page.exists ? '' : 'text-warning'}>
                                            {page.title}
                                        </span>
                                        {page.exists && (
                                            <a
                                                href={`/wp-admin/post.php?post=${page.page_id}&action=edit`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link-icon"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {message && (
                            <div className={`tool-message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleGenerate}
                            disabled={processing || loading}
                            style={{ marginTop: '1.5rem', width: '100%' }}
                        >
                            {processing ? (
                                <Loader2 size={18} className="spin" />
                            ) : (
                                <Zap size={18} />
                            )}
                            {processing ? 'Procesando...' : 'Generar Páginas Faltantes'}
                        </button>
                    </div>
                </div>

                {/* Tool 2: Database Integrity (Placeholder) */}
                <div className="tool-card opacity-50">
                    <div className="tool-icon">
                        <Wrench size={24} color="#64748b" />
                    </div>
                    <div className="tool-body">
                        <h3>Mantenimiento de Datos</h3>
                        <p>
                            Reparación de tablas de progreso y sincronización de matrículas huérfanas.
                        </p>
                        <button className="btn-secondary" disabled style={{ marginTop: '1.5rem', width: '100%' }}>
                            Próximamente
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .academia-tools-page {
                    max-width: 1000px;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2.5rem;
                }
                .header-info h1 {
                    font-size: 1.875rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0;
                }
                .header-info p {
                    color: #64748b;
                    margin-top: 0.5rem;
                }
                .tools-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 1.5rem;
                }
                .tool-card {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    padding: 2rem;
                    display: flex;
                    gap: 1.5rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .tool-card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }
                .tool-icon {
                    width: 48px;
                    height: 48px;
                    background: #f3e8ff;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .tool-body h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #1e293b;
                }
                .tool-body p {
                    font-size: 0.9375rem;
                    color: #64748b;
                    line-height: 1.5;
                    margin-bottom: 1.5rem;
                }
                .status-checklist {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    color: #475569;
                    font-weight: 500;
                }
                .text-warning { color: #f59e0b; }
                .link-icon {
                    color: #94a3b8;
                    margin-left: auto;
                    transition: color 0.1s;
                }
                .link-icon:hover { color: #9333ea; }
                .tool-message {
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                .tool-message.success {
                    background: #ecfdf5;
                    color: #059669;
                    border: 1px solid #10b98144;
                }
                .tool-message.error {
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #ef444444;
                }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                .opacity-50 { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default Tools;
