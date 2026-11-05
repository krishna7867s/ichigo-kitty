import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navegacion from './Navegacion';

function Encabezado() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const navegar = useNavigate();

  function manejarBusqueda(evento) {
    evento.preventDefault();
    const limpio = terminoBusqueda.trim();
    if (limpio) {
      navegar(`/productos?buscar=${encodeURIComponent(limpio)}`);
    } else {
      navegar('/productos');
    }
  }

  return (
    <header className="franja-encabezado">
      <div className="contenedor-central">
        <div className="encabezado-superior">
          <Link to="/" className="logo-kitty">
            Ichigo Kitty
          </Link>

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
              placeholder="Nombre de producto..."
            />
            <button type="submit" className="boton-ir">
              IR
            </button>
          </form>
        </div>

        <Navegacion />
      </div>
    </header>
  );
}

export default Encabezado;

