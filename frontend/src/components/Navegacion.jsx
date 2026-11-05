import { NavLink } from 'react-router-dom';

const ENLACES = [
  { ruta: '/', texto: 'Inicio', exacto: true },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/proveedores', texto: 'Proveedores' },
  { ruta: '/pedidos', texto: 'Pedidos' }
];

function Navegacion() {
  return (
    <nav className="barra-navegacion" aria-label="Navegación principal">
      {ENLACES.map((enlace, indice) => (
        <span key={enlace.ruta} className="item-navegacion">
          <NavLink
            to={enlace.ruta}
            end={enlace.exacto}
            className={({ isActive }) =>
              isActive
                ? 'enlace-navegacion enlace-navegacion-activo'
                : 'enlace-navegacion'
            }
          >
            {enlace.texto}
          </NavLink>
          {indice < ENLACES.length - 1 && (
            <span className="separador-navegacion" aria-hidden="true" />
          )}
        </span>
      ))}
    </nav>
  );
}

export default Navegacion;

