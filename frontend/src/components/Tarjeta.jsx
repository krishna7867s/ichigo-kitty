import { Link } from 'react-router-dom';

function Tarjeta({ numero, titulo, detalle, textoEnlace, destino }) {
  return (
    <article className="tarjeta-sanrio">
      <div className="tarjeta-cabecera-pastel">
        <div className="tarjeta-numero-grande">{numero}</div>
        <div className="tarjeta-subtitulo">{titulo}</div>
      </div>
      <div className="tarjeta-cuerpo">
        <p className="tarjeta-detalle">{detalle}</p>
        <div>
          <Link to={destino} className="enlace-azul-corazon">
            <svg
              width="12"
              height="11"
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
            <span>{textoEnlace}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Tarjeta;

