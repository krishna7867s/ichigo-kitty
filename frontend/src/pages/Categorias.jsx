import { useState, useEffect } from 'react';
import TablaCategorias from '../components/TablaCategorias';
import FormularioCategoria from '../components/FormularioCategoria';
import ModalConfirmar from '../components/ModalConfirmar';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../services/api';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null);
  const [categoriaParaEliminar, setCategoriaParaEliminar] = useState(null);
  const [errorBackend, setErrorBackend] = useState('');

  async function cargarCategorias() {
    try {
      const lista = await obtenerCategorias();
      setCategorias(lista);
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'Error al cargar las categorías'
      );
    }
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  function abrirCrear() {
    setErrorBackend('');
    setCategoriaEnEdicion(null);
    setMostrarFormulario(true);
  }

  function abrirEditar(categoria) {
    setErrorBackend('');
    setCategoriaEnEdicion(categoria);
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);
    setCategoriaEnEdicion(null);
  }

  async function guardarCategoria(datosFormulario) {
    setErrorBackend('');
    try {
      if (categoriaEnEdicion) {
        await actualizarCategoria(categoriaEnEdicion.id, datosFormulario);
      } else {
        await crearCategoria(datosFormulario);
      }
      await cargarCategorias();
      cerrarFormulario();
    } catch (err) {
      setErrorBackend(
        err.response?.data?.error || 'No se pudo guardar la categoría'
      );
    }
  }

  async function confirmarEliminacion() {
    if (!categoriaParaEliminar) return;
    setErrorBackend('');
    try {
      await eliminarCategoria(categoriaParaEliminar.id);
      setCategoriaParaEliminar(null);
      await cargarCategorias();
    } catch (err) {
      setCategoriaParaEliminar(null);
      setErrorBackend(
        err.response?.data?.error || 'No se pudo eliminar la categoría'
      );
    }
  }

  return (
    <div>
      <div className="cabecera-pagina-crud">
        <h1 className="titulo-pagina-crud">Categorías</h1>
        <button type="button" className="boton-pildora-gloss" onClick={abrirCrear}>
          Agregar categoría
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
        <FormularioCategoria
          categoriaActual={categoriaEnEdicion}
          alGuardar={guardarCategoria}
          alCancelar={cerrarFormulario}
        />
      )}

      <TablaCategorias
        categorias={categorias}
        alEditar={abrirEditar}
        alEliminar={(cat) => {
          setErrorBackend('');
          setCategoriaParaEliminar(cat);
        }}
      />

      <ModalConfirmar
        visible={Boolean(categoriaParaEliminar)}
        nombreElemento={categoriaParaEliminar ? categoriaParaEliminar.nombre : ''}
        alConfirmar={confirmarEliminacion}
        alCancelar={() => setCategoriaParaEliminar(null)}
      />
    </div>
  );
}

export default Categorias;

