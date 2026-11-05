function CorazonAzul() {
  return (
    <svg
      width="11"
      height="10"
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
  );
}

const ETIQUETAS_ESTADO = {
  pedido: 'Pedido',
  en_transito: 'En tránsito',
  recibido: 'Recibido',
  cancelado: 'Cancelado'
};

function formatearFecha(fechaIso) {
  if (!fechaIso) return '—';
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return fechaIso;
  return fecha.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function TablaPedidos({ pedidos, detallesPorPedido, alEditar, alEliminar }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-sanrio">
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Rastreo</th>
            <th>Envío</th>
            <th>Total (CNY)</th>
            <th>Artículos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan="9">No hay pedidos registrados.</td>
            </tr>
          ) : (
            pedidos.map((pedido) => {
              const detalles = detallesPorPedido[pedido.id] || [];
              return (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{pedido.proveedor_nombre}</td>
                  <td>{formatearFecha(pedido.fecha)}</td>
                  <td>
                    <span className="etiqueta-estado">
                      {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
                    </span>
                  </td>
                  <td>{pedido.rastreo || '—'}</td>
                  <td>${Number(pedido.costo_envio).toFixed(2)}</td>
                  <td>
                    <strong>¥{Number(pedido.total_cny).toFixed(2)}</strong>
                  </td>
                  <td>
                    {detalles.length === 0 ? (
                      <span>Sin líneas</span>
                    ) : (
                      <ul className="lista-detalles-celda">
                        {detalles.map((d) => (
                          <li key={d.id}>
                            {d.cantidad}x {d.producto_nombre} (¥{Number(d.precio_unitario_cny).toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td>
                    <div className="celda-acciones">
                      <button
                        type="button"
                        className="enlace-azul-corazon"
                        onClick={() => alEditar(pedido)}
                      >
                        <CorazonAzul />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        className="enlace-eliminar-rosa"
                        onClick={() => alEliminar(pedido)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPedidos;

