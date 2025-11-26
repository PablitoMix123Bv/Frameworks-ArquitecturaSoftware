// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import './Login.css'; 

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const expediente = formData.get("expediente") as string;
    const password = formData.get("password") as string;

    // --- VALIDACIÓN MANUAL ---
    if (!nombre || !email || !expediente || !password) {
        setError("Todos los campos son obligatorios.");
        return;
    }
    if (!email.includes('@')) {
        setError("El correo debe contener '@'.");
        return;
    }
    if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
    }
    // -------------------------

    setIsPosting(true);

    try {
        await register(nombre, email, expediente, password);
        navigate("/perfil/mi-equipo"); 
    } catch (err: any) {
        console.error(err);
        if (err.message && err.message.includes('duplicate')) {
            setError("Este correo o expediente ya está registrado.");
        } else {
            setError(err.message || "Error al registrarse.");
        }
        setIsPosting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 style={{color: '#1976D2'}}>Crear Cuenta</h1>
        <p>Regístrate para gestionar tu equipo</p>
        
        {error && <div className="error-message-custom">{error}</div>}
        
        {/* Eliminamos los placeholders y añadimos noValidate */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" />
          </div>
          
          <div className="input-group">
            <label htmlFor="expediente">Expediente</label>
            <input type="text" id="expediente" name="expediente" />
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo Institucional</label>
            <input type="email" id="email" name="email" />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" />
            <small style={{color:'#666', fontSize:'0.8em', marginTop:'5px', display:'block'}}>
                Mínimo 6 caracteres, 1 mayúscula, 1 número
            </small>
          </div>
          
          <button type="submit" disabled={isPosting}>
            {isPosting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="register-text">
            ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}