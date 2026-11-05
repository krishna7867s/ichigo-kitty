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

function TablaCategorias({ categorias, alEditar, alEliminar }) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-sanrio">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="4">No hay categorías registradas.</td>
            </tr>
          ) : (
            categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>{categoria.descripcion || '—'}</td>
                <td>
                  <div className="celda-acciones">
                    <button
                      type="button"
                      className="enlace-azul-corazon"
                      onClick={() => alEditar(categoria)}
                    >
                      <CorazonAzul />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      className="enlace-eliminar-rosa"
                      onClick={() => alEliminar(categoria)}
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

export default TablaCategorias;

