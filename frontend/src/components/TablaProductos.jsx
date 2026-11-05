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

function TablaProductos({ productos, alEditar, alEliminar }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-sanrio">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Compra (CNY)</th>
            <th>Precio venta</th>
            <th>Margen estimado</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="9">No hay productos registrados.</td>
            </tr>
          ) : (
            productos.map((producto) => {
              const costoEstimadoMxn = Number(producto.precio_compra_cny) * 2.75;
              const margenMxn = Number(producto.precio_venta) - costoEstimadoMxn;
              return (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>
                  <strong>{producto.nombre}</strong>
                </td>
                <td>{producto.categoria_nombre}</td>
                <td>{producto.proveedor_nombre}</td>
                <td>¥{Number(producto.precio_compra_cny).toFixed(2)}</td>
                <td>${Number(producto.precio_venta).toFixed(2)}</td>
                <td>+${margenMxn.toFixed(2)}</td>
                <td>
                  <span className={producto.stock < 5 ? 'stock-bajo' : 'stock-normal'}>
                    {producto.stock} pzas
                  </span>
                </td>
                <td>
                  <div className="celda-acciones">
                    <button
                      type="button"
                      className="enlace-azul-corazon"
                      onClick={() => alEditar(producto)}
                    >
                      <CorazonAzul />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="enlace-eliminar-rosa"
                      onClick={() => alEliminar(producto)}
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

export default TablaProductos;

