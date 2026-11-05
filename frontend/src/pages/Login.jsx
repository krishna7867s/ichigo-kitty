import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { autenticado, iniciarSesion } = useAuth();
  const navegar = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  if (autenticado) {
    return <Navigate to="/" replace />;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setMensajeError('');

    const correoLimpio = correo.trim();
    if (!correoLimpio || !password) {
      setMensajeError('Debes completar el correo y la contraseña');
      return;
    }

    if (password.length < 8) {
      setMensajeError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      await iniciarSesion(correoLimpio, password);
      navegar('/');
    } catch (err) {
      setMensajeError(
        err.response?.data?.error || 'No se pudo iniciar sesión'
      );
    }
  }

  return (
    <div className="contenedor-autenticacion">
      <div className="envoltura-panel-auth">
        {mensajeError && (
          <div className="caja-error-api" role="alert">
            <span>{mensajeError}</span>
            <button
              type="button"
              className="boton-cerrar-error"
              onClick={() => setMensajeError('')}
            >
              Cerrar
            </button>
          </div>
        )}

        <form className="panel-autenticacion" onSubmit={manejarEnvio}>
          <h1 className="titulo-autenticacion">Entrar</h1>

          <div className="grupo-campo campo-auth">
            <label htmlFor="login-correo">Correo</label>
            <input
              id="login-correo"
              type="email"
              className="input-sanrio"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <div className="grupo-campo campo-auth">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              className="input-sanrio"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="acciones-auth">
            <button type="submit" className="boton-pildora-gloss">
              Entrar
            </button>

            <Link to="/registro" className="enlace-azul-corazon">
              <svg
                width="12"
                height="11"
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 10.2C5.7 9.95 1 6.3 1 3.4C1 1.85 2.2 0.7 3.7 0.7C4.65 0.7 5.5 1.18 6 1.95C6.5 1.18 7.35 0.7 8.3 0.7C9.8 0.7 11 1.85 11 3.4C11 6.3 6.3 9.95 6 10.2Z"
                  fill="#1f6bcc"
                />
              </svg>
              <span>Crear cuenta nueva</span>
            </Link>
          </div>
        </form>
      </div>

      <div className="columna-kitty-auth">
        <div className="marco-kitty">
          <img
            src="/img/kitty.png"
            alt="Ichigo Kitty"
            className="imagen-kitty-auth"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
