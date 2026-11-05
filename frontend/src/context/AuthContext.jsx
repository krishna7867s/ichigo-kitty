import { createContext, useContext, useState, useEffect } from 'react';
import {
  CLAVE_TOKEN,
  loginUsuario,
  registrarUsuario,
  obtenerUsuarioActual
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLAVE_TOKEN) || '');
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(() => Boolean(localStorage.getItem(CLAVE_TOKEN)));

  useEffect(() => {
    function manejarExpiracion() {
      setToken('');
      setUsuario(null);
    }

    window.addEventListener('sesion_expirada_kitty', manejarExpiracion);
    return () => window.removeEventListener('sesion_expirada_kitty', manejarExpiracion);
  }, []);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem(CLAVE_TOKEN);
    if (!tokenGuardado) {
      setToken('');
      setUsuario(null);
      setCargandoSesion(false);
      return;
    }

    let activo = true;
    obtenerUsuarioActual()
      .then((datosUsuario) => {
        if (activo) {
          setToken(tokenGuardado);
          setUsuario(datosUsuario);
        }
      })
      .catch(() => {
        localStorage.removeItem(CLAVE_TOKEN);
        if (activo) {
          setToken('');
          setUsuario(null);
        }
      })
      .finally(() => {
        if (activo) {
          setCargandoSesion(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  async function iniciarSesion(correo, password) {
    const datos = await loginUsuario(correo, password);
    localStorage.setItem(CLAVE_TOKEN, datos.token);
    setToken(datos.token);
    setUsuario(datos.usuario);
    return datos;
  }

  async function registrar(datosRegistro) {
    await registrarUsuario(datosRegistro);
    return iniciarSesion(datosRegistro.correo, datosRegistro.password);
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN);
    setToken('');
    setUsuario(null);
  }

  const autenticado = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        autenticado,
        cargandoSesion,
        iniciarSesion,
        registrar,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

