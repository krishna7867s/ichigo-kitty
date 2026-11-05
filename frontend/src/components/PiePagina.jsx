import { Link } from 'react-router-dom';

function PiePagina() {
  return (
    <footer className="pie-pagina">
      <div className="contenedor-central pie-pagina-interior">
        <span>© 2026 Ichigo Kitty — Mini proyecto 1</span>
        <nav className="enlaces-pie" aria-label="Enlaces de pie de página">
          <Link to="/" className="enlace-pie">Inicio</Link>
          <span className="separador-pie">|</span>
          <Link to="/productos" className="enlace-pie">Productos</Link>
          <span className="separador-pie">|</span>
          <Link to="/categorias" className="enlace-pie">Categorías</Link>
          <span className="separador-pie">|</span>
          <Link to="/proveedores" className="enlace-pie">Proveedores</Link>
          <span className="separador-pie">|</span>
          <Link to="/pedidos" className="enlace-pie">Pedidos</Link>
        </nav>
      </div>
    </footer>
  );
}

export default PiePagina;

