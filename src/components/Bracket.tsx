// src/components/Bracket.tsx

import React from 'react';
// Importamos la librería que acabas de instalar
import { SingleEliminationBracket, Match, SVGViewer } from 'react-tournament-brackets';
import './Bracket.css'; // Crearemos este CSS

// --- SIMULACIÓN DE DATOS (MOCK) ---
// Esto simula las "Rondas" de un torneo de 4 equipos
const rounds = [
  {
    title: 'Semifinales',
    seeds: [
      {
        id: 1,
        teams: [
          { name: 'Hunters', score: 3 }, // Equipo 1
          { name: 'Castrosos', score: 1 }  // Equipo 2
        ],
      },
      {
        id: 2,
        teams: [
          { name: 'Pythons', score: 2 },  // Equipo 3
          { name: 'Leones', score: 4 }   // Equipo 4
        ],
      },
    ],
  },
  {
    title: 'Final',
    seeds: [
      {
        id: 3,
        teams: [
          { name: 'Hunters', score: 2 }, // Ganador Partido 1
          { name: 'Leones', score: 1 }  // Ganador Partido 2
        ],
      },
    ],
  },
];
// --- FIN DE LA SIMULACIÓN ---


const Bracket: React.FC = () => {
    
    // Función para renderizar un partido (Match)
    // Esto nos permite personalizar cómo se ve cada "cajita" del bracket
    const renderMatch = (match: any, props: any) => {
        const { onMatchClick, onPartyClick, onMouseEnter, onMouseLeave } = props;

        // Extraemos los dos equipos
        const [team1, team2] = match.teams;

        // Determinamos quién ganó para el estilo
        const isTeam1Winner = team1.score > team2.score;
        const isTeam2Winner = team2.score > team1.score;

        return (
            <div 
                className="bracket-match" 
                onClick={() => onMatchClick(match)}
                onMouseEnter={() => onMouseEnter(match.id)}
                onMouseLeave={() => onMouseLeave(match.id)}
            >
                <div 
                    className={`bracket-team ${isTeam1Winner ? 'winner' : ''} ${isTeam2Winner ? 'loser' : ''}`}
                    onClick={() => onPartyClick(team1)}
                >
                    <span className="team-name">{team1.name}</span>
                    <span className="team-score">{team1.score}</span>
                </div>
                
                <div className="match-separator"></div>

                <div 
                    className={`bracket-team ${isTeam2Winner ? 'winner' : ''} ${isTeam1Winner ? 'loser' : ''}`}
                    onClick={() => onPartyClick(team2)}
                >
                    <span className="team-name">{team2.name}</span>
                    <span className="team-score">{team2.score}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bracket-container">
            <h3>Fase de Eliminatorias (Bracket)</h3>
            <SingleEliminationBracket
                rounds={rounds}
                matchComponent={renderMatch}
                // Usamos el visor SVG para las líneas conectoras
                svgWrapper={({ children, ...props }) => (
                    <SVGViewer 
                        width={800} // Ancho del bracket
                        height={500} // Alto del bracket
                        {...props}
                    >
                        {children}
                    </SVGViewer>
                )}
            />
        </div>
    );
};

export default Bracket;