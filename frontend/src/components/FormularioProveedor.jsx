import { useState, useEffect } from 'react';

function FormularioProveedor({ proveedorActual, alGuardar, alCancelar }) {
  const [nombre, setNombre] = useState('');
  const [plataforma, setPlataforma] = useState('Taobao');
  const [ciudad, setCiudad] = useState('');
  const [contacto, setContacto] = useState('');
  const [calificacion, setCalificacion] = useState('5');

  useEffect(() => {
    if (proveedorActual) {
      setNombre(proveedorActual.nombre || '');
      setPlataforma(proveedorActual.plataforma || 'Taobao');
      setCiudad(proveedorActual.ciudad || '');
      setContacto(proveedorActual.contacto || '');
      setCalificacion(
        proveedorActual.calificacion !== null && proveedorActual.calificacion !== undefined
          ? String(proveedorActual.calificacion)
          : ''
      );
    } else {
      setNombre('');
      setPlataforma('Taobao');
      setCiudad('');
      setContacto('');
      setCalificacion('5');
    }
  }, [proveedorActual]);

  function manejarEnvio(evento) {
    evento.preventDefault();
    alGuardar({
      nombre,
      plataforma,
      ciudad: ciudad || null,
      contacto,
      calificacion: calificacion === '' ? null : Number(calificacion)
    });
  }

  return (
    <form className="panel-formulario" onSubmit={manejarEnvio}>
      <h2 className="titulo-formulario">
        {proveedorActual ? `Editar proveedor #${proveedorActual.id}` : 'Nuevo proveedor'}
      </h2>

      <div className="rejilla-formulario">
        <div className="grupo-campo">
          <label htmlFor="prov-nombre">Nombre de la tienda</label>
          <input
            id="prov-nombre"
            type="text"
            className="input-sanrio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prov-plataforma">Plataforma</label>
          <select
            id="prov-plataforma"
            className="select-sanrio"
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
          >
            <option value="Taobao">Taobao</option>
            <option value="1688">1688</option>
            <option value="AliExpress">AliExpress</option>
          </select>
        </div>

        <div className="grupo-campo">
          <label htmlFor="prov-ciudad">Ciudad (opcional)</label>
          <input
            id="prov-ciudad"
            type="text"
            className="input-sanrio"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prov-contacto">Contacto (WeChat / Correo)</label>
          <input
            id="prov-contacto"
            type="text"
            className="input-sanrio"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prov-calificacion">Calificación (1 a 5)</label>
          <select
            id="prov-calificacion"
            className="select-sanrio"
            value={calificacion}
            onChange={(e) => setCalificacion(e.target.value)}
          >
            <option value="">Sin calificación</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-pildora-gloss">
          Guardar proveedor
        </button>
        <button type="button" className="boton-secundario-blanco" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioProveedor;

