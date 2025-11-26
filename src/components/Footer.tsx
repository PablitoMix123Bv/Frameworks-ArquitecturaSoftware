// src/components/Footer.tsx

import React from 'react';
import './Footer.css'; // Implementaremos los estilos a continuación

const Footer: React.FC = () => {
    
    // Lista de desarrolladores
    const desarrolladores = [
        "Maximiliano Cano Pérez",
        "Juan Carlos Ugalde Monroy",
        "Pablo Arturo Morales González"
    ];

    return (
        <footer className="app-footer">
            <div className="footer-content">
                
                <div className="footer-section">
                    <h4>{new Date().getFullYear()} &copy; SportFlow FIF</h4>
                    <p>Plataforma de Gestión de Torneos Deportivos Internos.</p>
                </div>

                <div className="footer-section">
                    <h4>Desarrollado por:</h4>
                    <ul className="desarrolladores-list">
                        {desarrolladores.map((nombre, index) => (
                            <li key={index}>{nombre}</li>
                        ))}
                    </ul>
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;