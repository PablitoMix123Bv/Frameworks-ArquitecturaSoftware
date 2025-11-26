// src/pages/Login.tsx

import React, { useState, type FormEvent } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(""); 

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        setError("Por favor completa todos los campos.");
        return;
    }

    setIsPosting(true);

    try {
        await login(email, password);
        
        const userStored = JSON.parse(localStorage.getItem('user') || '{}');
        const roles = userStored.roles || [];

        // Lógica limpia con roles de BD
        if (roles.includes('admin')) {
            navigate("/admin/torneos");
        } else if (roles.includes('arbitro')) {
            navigate("/arbitro/dashboard");
        } else {
            navigate("/perfil/mi-equipo"); 
        }

    } catch (err: any) {
        console.log("Error login:", err.message);
        
        let mensaje = err.message || "Error al iniciar sesión";

        if (mensaje.includes('password must be longer')) {
            mensaje = "La contraseña debe tener al menos 6 caracteres.";
        } else if (mensaje.includes('Unauthorized') || mensaje.includes('Credenciales')) {
            mensaje = "Correo o contraseña incorrectos.";
        } else if (mensaje.includes('uppercase') || mensaje.includes('lowercase')) {
             mensaje = "La contraseña debe tener mayúsculas, minúsculas y números.";
        }

        setError(mensaje);
        setIsPosting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>SportFlow FIF</h1>
        <p>Inicia sesión para continuar</p>
        
        {error && <div className="error-message-custom">{error}</div>}
        
        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit" disabled={isPosting}>
            {isPosting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="register-text">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}