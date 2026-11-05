function ModalConfirmar({ visible, nombreElemento, alConfirmar, alCancelar }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fondo-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-confirmar">
      <div className="caja-modal">
        <div id="titulo-modal-confirmar" className="cabecera-modal">
          Confirmar eliminación
        </div>
        <div className="cuerpo-modal">
          <p>Se va a borrar {nombreElemento}. No se puede deshacer.</p>
        </div>
        <div className="acciones-modal">
          <button type="button" className="boton-pildora-gloss" onClick={alConfirmar}>
            Sí, eliminar
          </button>
          <button type="button" className="boton-secundario-blanco" onClick={alCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmar;

