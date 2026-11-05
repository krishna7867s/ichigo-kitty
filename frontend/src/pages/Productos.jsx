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

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);
  const [productoParaEliminar, setProductoParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');
  const [parametrosBusqueda] = useSearchParams();

  const filtroTexto = (parametrosBusqueda.get('buscar') || '').trim().toLowerCase();

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

  const productosFiltrados = filtroTexto
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(filtroTexto) ||
          (p.categoria_nombre && p.categoria_nombre.toLowerCase().includes(filtroTexto)) ||
          (p.proveedor_nombre && p.proveedor_nombre.toLowerCase().includes(filtroTexto))
      )
    : productos;

  return (
    <div>
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">Productos</h1>
        <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
          Agregar producto
        </button>
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

