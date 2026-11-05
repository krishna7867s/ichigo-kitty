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

function TablaProveedores({ proveedores, alEditar, alEliminar }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-sanrio">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Plataforma</th>
            <th>Ciudad</th>
            <th>Contacto</th>
            <th>Calificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length === 0 ? (
            <tr>
              <td colSpan="7">No hay proveedores registrados.</td>
            </tr>
          ) : (
            proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.plataforma}</td>
                <td>{proveedor.ciudad || '—'}</td>
                <td>{proveedor.contacto}</td>
                <td>{proveedor.calificacion ? `${proveedor.calificacion} / 5` : 'Sin calificar'}</td>
                <td>
                  <div className="celda-acciones">
                    <button
                      type="button"
                      className="enlace-azul-corazon"
                      onClick={() => alEditar(proveedor)}
                    >
                      <CorazonAzul />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="enlace-eliminar-rosa"
                      onClick={() => alEliminar(proveedor)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaProveedores;

