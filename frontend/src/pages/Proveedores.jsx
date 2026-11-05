import { useState, useEffect } from 'react';
import TablaProveedores from '../components/TablaProveedores';
import FormularioProveedor from '../components/FormularioProveedor';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} from '../services/api';

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEnEdicion, setProveedorEnEdicion] = useState(null);
  const [proveedorParaEliminar, setProveedorParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');

  async function cargarProveedores() {
    try {
      const lista = await obtenerProveedores();
      setProveedores(lista);
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'Error al cargar los proveedores'
      );
    }
  }

  useEffect(() => {
    cargarProveedores();
  }, []);

  function abrirCrear() {
    setErrorBackend('');
    setProveedorEnEdicion(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(proveedor) {
    setErrorBackend('');
    setProveedorEnEdicion(proveedor);
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);
    setProveedorEnEdicion(null);
  }

  async function guardarProveedor(datosFormulario) {
    setErrorBackend('');
    try {
      if (proveedorEnEdicion) {
        await actualizarProveedor(proveedorEnEdicion.id, datosFormulario);
      } else {
        await crearProveedor(datosFormulario);
      }
      await cargarProveedores();
      cerrarFormulario();
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudo guardar el proveedor'
      );
    }
  }

  async function confirmarEliminacion() {
    if (!proveedorParaEliminar) return;
    setErrorBackend('');
    try {
      await eliminarProveedor(proveedorParaEliminar.id);
      setProveedorParaEliminar(null);
      await cargarProveedores();
    } catch (err) {
      setProveedorParaEliminar(null);
      setErrorBackend(
        err.response?.data?.error || 'No se pudo eliminar el proveedor'
      );
    }
  }

  return (
    <div>
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">Proveedores</h1>
        <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
          Agregar proveedor
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
        <FormularioProveedor
          proveedorActual={proveedorEnEdicion}
          alGuardar={guardarProveedor}
          alCancelar={cerrarFormulario}
        />
      )}

      <TablaProveedores
        proveedores={proveedores}
        alEditar={abrirEditar}
        alEliminar={(prov) => {
          setErrorBackend('');
          setProveedorParaEliminar(prov);
        }}
      />

      <ModalConfirmar
        visible={Boolean(proveedorParaEliminar)}
        nombreElemento={proveedorParaEliminar ? proveedorParaEliminar.nombre : ''}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setProveedorParaEliminar(null)}
      />
    </div>
  );
}

export default Proveedores;

