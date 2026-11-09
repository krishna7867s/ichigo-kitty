import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import TablaProductos from '../components/TablaProductos';
import FormularioProducto from '../components/FormularioProducto';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  obtenerProductos,
  obtenerCategorias,
  obtenerProveedores,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/api';
import { exportarDatosCSV } from '../utils/exportarCSV';
import { useAuth } from '../context/AuthContext';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [productoParaEliminar, setProductoParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');
  const [parametrosBusqueda] = useSearchParams();
  const { permisosActuales } = useAuth();

  const [busquedaLocal, setBusquedaLocal] = useState(
    () => parametrosBusqueda.get('buscar') || ''
  );
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [proveedorFiltro, setProveedorFiltro] = useState('');
  const [soloStockBajo, setSoloStockBajo] = useState(false);

  useEffect(() => {
    const q = parametrosBusqueda.get('buscar');
    if (q !== null) {
      setBusquedaLocal(q);
    }
  }, [parametrosBusqueda]);

  async function cargarDatos() {
    try {
      const [listaProductos, listaCategorias, listaProveedores] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias(),
        obtenerProveedores()
      ]);
      setProductos(listaProductos);
      setCategorias(listaCategorias);
      setProveedores(listaProveedores);
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'Error al cargar los productos desde el servidor'
      );
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function abrirCrear() {
    setErrorBackend('');
    setProductoEnEdicion(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(producto) {
    setErrorBackend('');
    setProductoEnEdicion(producto);
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);
    setProductoEnEdicion(null);
  }

  async function guardarProducto(datosFormulario) {
    setErrorBackend('');
    try {
      if (productoEnEdicion) {
        await actualizarProducto(productoEnEdicion.id, datosFormulario);
      } else {
        await crearProducto(datosFormulario);
      }
      await cargarDatos();
      cerrarFormulario();
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudo guardar el producto'
      );
    }
  }

  async function confirmarEliminacion() {
    if (!productoParaEliminar) return;
    if (!permisosActuales.puedeEliminar) {
      setProductoParaEliminar(null);
      setErrorBackend(
        `Tu rol actual (${permisosActuales.etiqueta}) no tiene permiso para eliminar productos. Cambia a Directora General en la barra superior.`
      );
      return;
    }
    setErrorBackend('');
    try {
      await eliminarProducto(productoParaEliminar.id);
      setProductoParaEliminar(null);
      await cargarDatos();
    } catch (err) {
      setProductoParaEliminar(null);
      setErrorBackend(
        err.response?.data?.error || 'No se pudo eliminar el producto'
      );
    }
  }

  const textoLimpio = busquedaLocal.trim().toLowerCase();

  const productosFiltrados = productos.filter((p) => {
    const coincideTexto =
      !textoLimpio ||
      p.nombre.toLowerCase().includes(textoLimpio) ||
      (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(textoLimpio)) ||
      (p.proveedor_nombre && p.proveedor_nombre.toLowerCase().includes(textoLimpio));

    const coincideCategoria =
      !categoriaFiltro || String(p.categoria_id) === String(categoriaFiltro);

    const coincideProveedor =
      !proveedorFiltro || String(p.proveedor_id) === String(proveedorFiltro);

    const coincideStock = !soloStockBajo || Number(p.stock) <= 12;

    return coincideTexto && coincideCategoria && coincideProveedor && coincideStock;
  });

  function exportarInventarioCSV() {
    exportarDatosCSV(
      'inventario_productos_ichigo_kitty_cr.csv',
      productosFiltrados.map((p) => ({
        ID: p.id,
        Producto: p.nombre,
        Categoria: p.categoria_nombre || '',
        Proveedor_China: p.proveedor_nombre || '',
        Costo_FOB_CNY: p.precio_compra_cny,
        Precio_Venta_Ref: p.precio_venta,
        Stock_Bodega_CR: p.stock,
        Estado_Stock: p.stock <= 12 ? 'ALERTA REPOSICION' : 'OPTIMO'
      }))
    );
  }

  return (
    <div>
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">Catálogo de Productos e Inventario</h1>
        <div className="acciones-cabecera-multiple">
          <button
            type="button"
            className="boton-secundario-blanco"
            onClick={exportarInventarioCSV}
          >
            Exportar a Excel (CSV)
          </button>
          <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
            Agregar producto
          </button>
        </div>
      </div>

      {/* BARRA DE BUSQUEDA INSTANTANEA Y FILTROS */}
      <div className="barra-filtros-catalogo">
        <div className="grupo-campo">
          <label htmlFor="filtro-texto-prod" className="etiqueta-campo">
            Buscar por nombre o palabra clave
          </label>
          <input
            id="filtro-texto-prod"
            type="text"
            className="input-sanrio"
            placeholder="Ej. Peluche, Llavero, Mochi..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="filtro-cat-prod" className="etiqueta-campo">
            Filtrar por Categoría
          </label>
          <select
            id="filtro-cat-prod"
            className="select-sanrio"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías ({categorias.length})</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-campo">
          <label htmlFor="filtro-prov-prod" className="etiqueta-campo">
            Filtrar por Proveedor en China
          </label>
          <select
            id="filtro-prov-prod"
            className="select-sanrio"
            value={proveedorFiltro}
            onChange={(e) => setProveedorFiltro(e.target.value)}
          >
            <option value="">Todos los proveedores ({proveedores.length})</option>
            {proveedores.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.nombre} ({pr.plataforma})
              </option>
            ))}
          </select>
        </div>

        <div className="grupo-campo-checkbox">
          <label className="etiqueta-checkbox-alerta">
            <input
              type="checkbox"
              checked={soloStockBajo}
              onChange={(e) => setSoloStockBajo(e.target.checked)}
            />
            <span>Mostrar solo alertas de stock bajo (&lt;= 12 uds.)</span>
          </label>
        </div>
      </div>

      {errorBackend && (
        <div className="caja-error-api" role="alert">
          <span>{errorBackend}</span>
          <button
            type="button"
            className="boton-cerrar-error"
            onClick={() => setErrorBackend('')}
          >
            Cerrar
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <FormularioProducto
          productoActual={productoEnEdicion}
          categorias={categorias}
          proveedores={proveedores}
          alGuardar={guardarProducto}
          alCancelar={cerrarFormulario}
        />
      )}

      <TablaProductos
        productos={productosFiltrados}
        alEditar={abrirEditar}
        alEliminar={(prod) => {
          setErrorBackend('');
          setProductoParaEliminar(prod);
        }}
      />

      <ModalConfirmar
        visible={Boolean(productoParaEliminar)}
        nombreElemento={productoParaEliminar ? productoParaEliminar.nombre : ''}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setProductoParaEliminar(null)}
      />
    </div>
  );
}

export default Productos;
