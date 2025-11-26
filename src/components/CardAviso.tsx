// src/components/CardAviso.tsx

import React from 'react';
import type { Aviso } from '../types';
import './CardAviso.css';

interface CardAvisoProps {
    aviso: Aviso;
}

const CardAviso: React.FC<CardAvisoProps> = ({ aviso }) => {
    // Lógica para asignar clase de prioridad
    const prioridadClass = aviso.prioridad === 'URGENTE' ? 'aviso-urgente' : 'aviso-normal';

    return (
        <div className={`card-aviso ${prioridadClass}`}>
            <div className="aviso-header">
                <span className={`aviso-tag ${aviso.categoria.toLowerCase()}`}>
                    {aviso.categoria}
                </span>
                {/* Formateamos la fecha para que se vea bien */}
                <span className="aviso-date">
                    {new Date(aviso.fechaPublicacion).toLocaleDateString()}
                </span>
            </div>

            <h3 className="aviso-titulo">{aviso.titulo}</h3>
            <p className="aviso-contenido">{aviso.contenido}</p>
            
            <div className="aviso-footer">
                {/* CORRECCIÓN AQUÍ: Accedemos a .nombre y usamos un fallback */}
                <small>
                    Autor: {aviso.autor?.nombre || 'Administración'}
                    {aviso.torneo && ` | Torneo: ${aviso.torneo.nombre}`}
                </small>
            </div>
        </div>
    );
};

export default CardAviso;