import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SlideOver = ({ isOpen, onClose, title, children, footer }) => {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'flex-end'
        }} onClick={onClose}>
            <div
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: '#fff',
                    height: '100%',
                    boxShadow: '-10px 0 15px -3px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'slideIn 0.3s ease-out'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', flex: 1 }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#f1f5f9',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '6px',
                            borderRadius: '50%',
                            display: 'flex'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {children}
                </div>

                {footer && (
                    <div style={{
                        padding: '1.5rem',
                        borderTop: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc'
                    }}>
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </div>
    );
};

export default SlideOver;
