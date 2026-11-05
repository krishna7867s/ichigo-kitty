import { useState, useEffect } from 'react';

function FormularioProducto({
  productoActual,
  categorias,
  proveedores,
  alGuardar,
  alCancelar
}) {
  const [nombre, setNombre] = useState('');
  const [precioCompraCny, setPrecioCompraCny] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [stock, setStock] = useState('0');
  const [categoriaId, setCategoriaId] = useState('');
  const [proveedorId, setProveedorId] = useState('');

  useEffect(() => {
    if (productoActual) {
      setNombre(productoActual.nombre || '');
      setPrecioCompraCny(String(productoActual.precio_compra_cny ?? ''));
      setPrecioVenta(String(productoActual.precio_venta ?? ''));
      setStock(String(productoActual.stock ?? '0'));
      setCategoriaId(String(productoActual.categoria_id ?? ''));
      setProveedorId(String(productoActual.proveedor_id ?? ''));
    } else {
      setNombre('');
      setPrecioCompraCny('');
      setPrecioVenta('');
      setStock('0');
      setCategoriaId(categorias[0] ? String(categorias[0].id) : '');
      setProveedorId(proveedores[0] ? String(proveedores[0].id) : '');
    }
  }, [productoActual, categorias, proveedores]);

  function manejarEnvio(evento) {
    evento.preventDefault();
    alGuardar({
      nombre,
      precio_compra_cny: precioCompraCny === '' ? '' : Number(precioCompraCny),
      precio_venta: precioVenta === '' ? '' : Number(precioVenta),
      stock: stock === '' ? '' : Number(stock),
      categoria_id: categoriaId === '' ? '' : Number(categoriaId),
      proveedor_id: proveedorId === '' ? '' : Number(proveedorId)
    });
  }

  return (
    <form className="panel-formulario" onSubmit={manejarEnvio}>
      <h2 className="titulo-formulario">
        {productoActual ? `Editar producto #${productoActual.id}` : 'Nuevo producto'}
      </h2>

      <div className="rejilla-formulario">
        <div className="grupo-campo">
          <label htmlFor="prod-nombre">Nombre del producto</label>
          <input
            id="prod-nombre"
            type="text"
            className="input-sanrio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prod-categoria">Categoría</label>
          <select
            id="prod-categoria"
            className="select-sanrio"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-campo">
          <label htmlFor="prod-proveedor">Proveedor</label>
          <select
            id="prod-proveedor"
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
          <label htmlFor="prod-compra">Precio de compra (CNY)</label>
          <input
            id="prod-compra"
            type="number"
            step="0.01"
            className="input-sanrio"
            value={precioCompraCny}
            onChange={(e) => setPrecioCompraCny(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prod-venta">Precio de venta</label>
          <input
            id="prod-venta"
            type="number"
            step="0.01"
            className="input-sanrio"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="prod-stock">Stock actual</label>
          <input
            id="prod-stock"
            type="number"
            step="1"
            className="input-sanrio"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="boton-pildora-gloss">
          Guardar producto
        </button>
        <button type="button" className="boton-secundario-blanco" onClick={alCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioProducto;

