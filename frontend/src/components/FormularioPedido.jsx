import { useState, useEffect } from 'react';

function FormularioPedido({
  pedidoActual,
  lineasIniciales,
  proveedores,
  productos,
  alGuardar,
  alCancelar
}) {
  const [proveedorId, setProveedorId] = useState('');
  const [estado, setEstado] = useState('pedido');
  const [rastreo, setRastreo] = useState('');
  const [costoEnvio, setCostoEnvio] = useState('0');
  const [lineas, setLineas] = useState([]);

  useEffect(() => {
    if (pedidoActual) {
      setProveedorId(String(pedidoActual.proveedor_id ?? ''));
      setEstado(pedidoActual.estado || 'pedido');
      setRastreo(pedidoActual.rastreo || '');
      setCostoEnvio(String(pedidoActual.costo_envio ?? '0'));
      if (lineasIniciales && lineasIniciales.length > 0) {
        setLineas(
          lineasIniciales.map((l) => ({
            id: l.id,
            producto_id: String(l.producto_id),
            cantidad: String(l.cantidad),
            precio_unitario_cny: String(l.precio_unitario_cny)
          }))
        );
      } else {
        setLineas([]);
      }
    } else {
      setProveedorId(proveedores[0] ? String(proveedores[0].id) : '');
      setEstado('pedido');
      setRastreo('');
      setCostoEnvio('0');
      const primerProd = productos[0];
      setLineas(
        primerProd
          ? [
              {
                producto_id: String(primerProd.id),
                cantidad: '1',
                precio_unitario_cny: String(primerProd.precio_compra_cny)
              }
            ]
          : []
      );
    }
  }, [pedidoActual, lineasIniciales, proveedores, productos]);

  function agregarLinea() {
    const primerProd = productos[0];
    setLineas((prev) => [
      ...prev,
      {
        producto_id: primerProd ? String(primerProd.id) : '',
        cantidad: '1',
        precio_unitario_cny: primerProd ? String(primerProd.precio_compra_cny) : '1'
      }
    ]);
  }

  function actualizarLinea(indice, campo, valor) {
    setLineas((prev) =>
      prev.map((linea, i) => {
        if (i !== indice) return linea;
        const actualizada = { ...linea, [campo]: valor };
        if (campo === 'producto_id') {
          const prod = productos.find((p) => String(p.id) === String(valor));
          if (prod) {
            actualizada.precio_unitario_cny = String(prod.precio_compra_cny);
          }
        }
        return actualizada;
      })
    );
  }

  function quitarLinea(indice) {
    setLineas((prev) => prev.filter((_, i) => i !== indice));
  }

  const totalCalculadoCny = lineas.reduce((acum, l) => {
    const cant = Number(l.cantidad) || 0;
    const precio = Number(l.precio_unitario_cny) || 0;
    return acum + cant * precio;
  }, 0);

  function manejarEnvio(evento) {
    evento.preventDefault();
    alGuardar(
      {
        proveedor_id: proveedorId === '' ? '' : Number(proveedorId),
        estado,
        rastreo: rastreo || null,
        costo_envio: costoEnvio === '' ? '' : Number(costoEnvio)
      },
      lineas.map((l) => ({
        id: l.id,
        producto_id: Number(l.producto_id),
        cantidad: Number(l.cantidad),
        precio_unitario_cny: Number(l.precio_unitario_cny)
      }))
    );
  }

  return (
    <form className="panel-formulario" onSubmit={manejarEnvio}>
      <h2 className="titulo-formulario">
        {pedidoActual ? `Editar pedido #${pedidoActual.id}` : 'Nuevo pedido de importación'}
      </h2>

      <div className="rejilla-formulario">
        <div className="grupo-campo">
          <label htmlFor="ped-proveedor">Proveedor</label>
          <select
            id="ped-proveedor"
            className="select-sanrio"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre} ({prov.plataforma})
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-campo">
          <label htmlFor="ped-estado">Estado del pedido</label>
          <select
            id="ped-estado"
            className="select-sanrio"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="pedido">Pedido</option>
            <option value="en_transito">En tránsito</option>
            <option value="recibido">Recibido</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="grupo-campo">
          <label htmlFor="ped-rastreo">Código de rastreo (opcional)</label>
          <input
            id="ped-rastreo"
            type="text"
            className="input-sanrio"
            value={rastreo}
            onChange={(e) => setRastreo(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="ped-envio">Costo de envío</label>
          <input
            id="ped-envio"
            type="number"
            step="0.01"
            className="input-sanrio"
            value={costoEnvio}
            onChange={(e) => setCostoEnvio(e.target.value)}
          />
        </div>
      </div>

      <div className="seccion-lineas-pedido">
        <div className="cabecera-lineas-pedido">
          <span className="subtitulo-lineas">Líneas de productos del pedido</span>
          <button
            type="button"
            className="boton-secundario-blanco"
            onClick={agregarLinea}
          >
            Agregar línea de producto
          </button>
        </div>

        {lineas.map((linea, indice) => (
          <div key={indice} className="fila-linea-pedido">
            <div className="grupo-campo">
              <label htmlFor={`linea-producto-${indice}`}>Producto</label>
              <select
                id={`linea-producto-${indice}`}
                className="select-sanrio"
                value={linea.producto_id}
                onChange={(e) => actualizarLinea(indice, 'producto_id', e.target.value)}
              >
                <option value="">Selecciona producto</option>
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} (Stock: {prod.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grupo-campo">
              <label htmlFor={`linea-cantidad-${indice}`}>Cantidad</label>
              <input
                id={`linea-cantidad-${indice}`}
                type="number"
                step="1"
                className="input-sanrio"
                value={linea.cantidad}
                onChange={(e) => actualizarLinea(indice, 'cantidad', e.target.value)}
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor={`linea-precio-${indice}`}>Precio unitario (CNY)</label>
              <input
                id={`linea-precio-${indice}`}
                type="number"
                step="0.01"
                className="input-sanrio"
                value={linea.precio_unitario_cny}
                onChange={(e) => actualizarLinea(indice, 'precio_unitario_cny', e.target.value)}
              />
            </div>

            <div>
              <button
                type="button"
                className="enlace-eliminar-rosa"
                onClick={() => quitarLinea(indice)}
              >
                Quitar línea
              </button>
            </div>
          </div>
        ))}

        <div className="resumen-total-pedido">
          Total del pedido en CNY: ¥{totalCalculadoCny.toFixed(2)}
        </div>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-pildora-gloss">
          Guardar pedido
        </button>
        <button type="button" className="boton-secundario-blanco" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioPedido;

