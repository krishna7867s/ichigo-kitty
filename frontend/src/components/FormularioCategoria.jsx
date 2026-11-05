import { useState, useEffect } from 'react';

function FormularioCategoria({ categoriaActual, alGuardar, alCancelar }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (categoriaActual) {
      setNombre(categoriaActual.nombre || '');
      setDescripcion(categoriaActual.descripcion || '');
    } else {
      setNombre('');
      setDescripcion('');
    }
  }, [categoriaActual]);

  function manejarEnvio(evento) {
    evento.preventDefault();
    alGuardar({
      nombre,
      descripcion
    });
  }

  return (
    <form className="panel-formulario" onSubmit={manejarEnvio}>
      <h2 className="titulo-formulario">
        {categoriaActual ? `Editar categoría #${categoriaActual.id}` : 'Nueva categoría'}
      </h2>

      <div className="rejilla-formulario">
        <div className="grupo-campo">
          <label htmlFor="cat-nombre">Nombre de la categoría</label>
          <input
            id="cat-nombre"
            type="text"
            className="input-sanrio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="cat-descripcion">Descripción (opcional)</label>
          <input
            id="cat-descripcion"
            type="text"
            className="input-sanrio"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-pildora-gloss">
          Guardar categoría
        </button>
        <button type="button" className="boton-secundario-blanco" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioCategoria;

