import { useState, type FormEvent } from "react";
import "./index.css"; // importa tu CSS aquí
import { useNavigate } from "react-router-dom";
import { useAuth} from './context/AuthContext'


export default function Login() {
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

    // ... (useState declarations)
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtenemos la función 'login' del Contexto

  const validUser = {
    email: "admin@uaq.mx",
    password: "1234",
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPosting(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setTimeout(() => {
      if (email === validUser.email && password === validUser.password) {
        
        // Simulación de validación de rol
        const rol = email.includes('admin') ? 'administrador' : 'estudiante';
        
        // LLAMADA AL CONTEXTO: Guardamos el estado del usuario globalmente
        login(email, rol as 'administrador' | 'estudiante'); 
        
        setError("");
        
        // Redirigimos al área que corresponde al rol
        if (rol === 'administrador') {
          navigate("/admin/torneos");
        } else {
          // Si es estudiante, lo enviamos a una ruta de perfil o la pública
          navigate("/public/equipos"); 
        }
      } else {
        setError("Correo o contraseña incorrectos");
        setIsPosting(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Torneos UAQ</h1>
        <p>Inicia sesión para continuar</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@correo.com"
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
