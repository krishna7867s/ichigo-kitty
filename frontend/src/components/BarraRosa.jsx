import { Link } from 'react-router-dom';

const NOMBRES_ESTADO = {
  pedido: 'Pedido',
  en_transito: 'En tránsito',
  recibido: 'Recibido',
  cancelado: 'Cancelado'
};

function BarraRosa({ pedidosRecientes }) {
  return (
    <section className="contenedor-barra-rosa" aria-label="Pedidos recientes">
      <div className="barra-rosa-gloss">
        <span className="barra-rosa-titulo">Pedidos recientes</span>
        <Link to="/pedidos" className="barra-rosa-enlace">
          <span>Ver más</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4.5 2.5L8 6L4.5 9.5"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      <ul className="lista-pedidos-recientes">
        {pedidosRecientes.length === 0 ? (
          <li className="fila-pedido-reciente">
            <span>No hay pedidos registrados.</span>
          </li>
        ) : (
          pedidosRecientes.map((pedido) => (
            <li key={pedido.id} className="fila-pedido-reciente">
              <span className="dato-pedido-reciente">
                Pedido #{pedido.id} — {pedido.proveedor_nombre}
              </span>
              <span className="plataforma-pedido-reciente">
                Plataforma: {pedido.plataforma || 'Taobao'}
              </span>
              <span className="etiqueta-estado">
                {NOMBRES_ESTADO[pedido.estado] || pedido.estado}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

export default BarraRosa;

