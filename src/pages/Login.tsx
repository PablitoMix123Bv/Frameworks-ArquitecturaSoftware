// src/pages/Login.tsx
import React, { useState, type FormEvent } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        // Llamada real al backend a través del Contexto
        await login(email, password);
        
        // Si no hay error, redirigimos según rol (puedes leer el rol del estado o decodificarlo)
        // Como la actualización del estado puede tardar un tick, mejor redirigir a una ruta protegida que maneje la lógica
        // O leer del localStorage temporalmente para redirigir
        const userStored = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (userStored.rol === 'administrador') navigate("/admin/torneos");
        else if (userStored.rol === 'árbitro') navigate("/arbitro/dashboard");
        else navigate("/perfil/mi-equipo"); // Jugador

    } catch (err: any) {
        setError(err.message || "Credenciales incorrectas");
        setIsPosting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>SportFlow FIF</h1>
        <p>Inicia sesión para continuar</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" disabled={isPosting}>
            {isPosting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}