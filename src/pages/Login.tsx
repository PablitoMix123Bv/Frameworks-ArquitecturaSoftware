// src/Login.tsx

import React, { useState, type FormEvent } from "react";
import "./Login.css"; // Estilos dedicados al componente Login
import { useNavigate } from "react-router-dom";
import { useAuth} from '../context/AuthContext'
import type { Rol } from '../context/AuthContext'; // Importamos el tipo Rol

export default function Login() {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene la función 'login' del Contexto

  // Usuarios simulados para la demostración
  const validUser = {
    admin: { email: "admin@uaq.mx", password: "1234" },
    jugador: { email: "jugador@uaq.mx", password: "1234" },
    arbitro: { email: "arbitro@uaq.mx", password: "1234" }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setTimeout(() => {
      let userRole: Rol | null = null;
      let redirectPath = '';

      // 1. Simulación de la autenticación y asignación de rol
      if (email === validUser.admin.email && password === validUser.admin.password) {
        userRole = 'administrador';
        redirectPath = "/admin/torneos";
      } else if (email === validUser.jugador.email && password === validUser.jugador.password) {
        userRole = 'jugador';
        redirectPath = "/perfil/mi-equipo";
      } else if (email === validUser.arbitro.email && password === validUser.arbitro.password) {
        userRole = 'árbitro';
        redirectPath = "/arbitro/dashboard";
      }

      if (userRole) {
        login(email, userRole); // Guarda el rol en el Contexto
        setError("");
        navigate(redirectPath); // Redirige al dashboard
      } else {
        setError("Correo o contraseña incorrectos");
        setIsPosting(false);
      }
    }, 800);
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
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@uaq.mx o jugador@uaq.mx"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={isPosting}>
            {isPosting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="register-text">
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </div>
    </div>
  );
}