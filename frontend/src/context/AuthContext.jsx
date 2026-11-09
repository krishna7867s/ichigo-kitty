import { createContext, useContext, useState, useEffect } from 'react';
import {
  CLAVE_TOKEN,
  loginUsuario,
  registrarUsuario,
  obtenerUsuarioActual
} from '../services/api';

const AuthContext = createContext(null);

export const ROLES_SISTEMA = {
  'Directora General': {
    nombre: 'Directora General',
    etiqueta: 'Directora General (Acceso Total)',
    puedeEliminar: true,
    puedeEditarCostos: true,
    descripcion: 'Autorización total sobre compras en Taobao/1688, liberación de DUA en Aduana TICA y eliminación de registros.'
  },
  'Encargada de Importación': {
    nombre: 'Encargada de Importación',
    etiqueta: 'Encargada de Aduana TICA',
    puedeEliminar: false,
    puedeEditarCostos: true,
    descripcion: 'Autorizada para gestionar pedidos en tránsito, cálculo de aranceles en colones (₡) y seguimiento naviero.'
  },
  'Coordinadora de Ventas': {
    nombre: 'Coordinadora de Ventas',
    etiqueta: 'Ventas & SINPE Móvil',
    puedeEliminar: false,
    puedeEditarCostos: false,
    descripcion: 'Autorizada para facturación en colones, generación de comprobantes SINPE Móvil y guías de Correos de Costa Rica.'
  },
  'Almacenista': {
    nombre: 'Almacenista',
    etiqueta: 'Bodega San José / Heredia',
    puedeEliminar: false,
    puedeEditarCostos: false,
    descripcion: 'Autorizada para conteo de stock en pasillos, recepción de cajas y dictámenes de control de calidad.'
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(CLAVE_TOKEN) || '');
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(() => Boolean(localStorage.getItem(CLAVE_TOKEN)));
  const [rolActivo, setRolActivo] = useState(
    () => localStorage.getItem('rol_kitty_cr') || 'Directora General'
  );

  function cambiarRolActivo(nuevoRol) {
    if (ROLES_SISTEMA[nuevoRol]) {
      localStorage.setItem('rol_kitty_cr', nuevoRol);
      setRolActivo(nuevoRol);
    }
  }

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
  const permisosActuales = ROLES_SISTEMA[rolActivo] || ROLES_SISTEMA['Directora General'];

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        autenticado,
        cargandoSesion,
        rolActivo,
        permisosActuales,
        cambiarRolActivo,
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
