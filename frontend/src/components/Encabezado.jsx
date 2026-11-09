import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navegacion from './Navegacion';
import { useAuth, ROLES_SISTEMA } from '../context/AuthContext';

function Encabezado() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const {
    usuario,
    autenticado,
    rolActivo,
    cambiarRolActivo,
    cerrarSesion
  } = useAuth();

  const esPaginaAuth =
    ubicacion.pathname === '/login' || ubicacion.pathname === '/registro';

  function manejarBusqueda(evento) {
    evento.preventDefault();
    const limpio = terminoBusqueda.trim();
    if (limpio) {
      navegar(`/productos?buscar=${encodeURIComponent(limpio)}`);
    } else {
      navegar('/productos');
    }
  }

  function manejarCerrarSesion(evento) {
    evento.preventDefault();
    cerrarSesion();
    navegar('/login');
  }

  return (
    <header className="franja-encabezado">
      <div className="contenedor-central">
        <div className={esPaginaAuth ? 'encabezado-superior encabezado-sin-borde' : 'encabezado-superior'}>
          <Link to="/" className="logo-kitty">
            Ichigo Kitty CR
          </Link>

          {!esPaginaAuth && autenticado && (
            <div className="controles-encabezado-derecha">
              <form className="formulario-busqueda" onSubmit={manejarBusqueda}>
                <label htmlFor="campo-buscar-header" className="etiqueta-busqueda">
                  Buscar:
                </label>
                <input
                  id="campo-buscar-header"
                  type="text"
                  className="campo-busqueda"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Producto, categoría..."
                />
                <button type="submit" className="boton-ir">
                  IR
                </button>
              </form>

              <div className="selector-rol-encabezado">
                <label htmlFor="select-rol-activo" className="etiqueta-busqueda">
                  Rol:
                </label>
                <select
                  id="select-rol-activo"
                  className="select-rol-sanrio"
                  value={rolActivo}
                  onChange={(e) => cambiarRolActivo(e.target.value)}
                >
                  {Object.keys(ROLES_SISTEMA).map((clave) => (
                    <option key={clave} value={clave}>
                      {ROLES_SISTEMA[clave].etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bloque-usuario-encabezado">
                <span className="nombre-usuario-encabezado">
                  {usuario?.nombre || 'Sakura Admin'}
                </span>
                <span className="separador-navegacion" aria-hidden="true" />
                <a
                  href="/login"
                  className="enlace-cerrar-sesion"
                  onClick={manejarCerrarSesion}
                >
                  Cerrar sesión
                </a>
              </div>
            </div>
          )}
        </div>

        {!esPaginaAuth && <Navegacion />}
      </div>
    </header>
  );
}

export default Encabezado;
