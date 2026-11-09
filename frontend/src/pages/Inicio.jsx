import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BarraRosa from '../components/BarraRosa';
import Tarjeta from '../components/Tarjeta';
import {
  obtenerPedidos,
  obtenerProductos,
  obtenerProveedores
} from '../services/api';

function Inicio() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    async function cargarResumen() {
      try {
        const [listaPedidos, listaProductos, listaProveedores] = await Promise.all([
          obtenerPedidos(),
          obtenerProductos(),
          obtenerProveedores()
        ]);
        setPedidos(listaPedidos);
        setProductos(listaProductos);
        setProveedores(listaProveedores);
      } catch (err) {
        setErrorCarga(
          err.response?.data?.error || 'No se pudo conectar con el servidor de la tienda'
        );
      }
    }

    cargarResumen();
  }, []);

  const mapaPlataformaPorProveedor = {};
  proveedores.forEach((prov) => {
    mapaPlataformaPorProveedor[prov.id] = prov.plataforma;
  });

  const ultimosTresPedidos = [...pedidos]
    .slice(-3)
    .reverse()
    .map((ped) => ({
      ...ped,
      plataforma: mapaPlataformaPorProveedor[ped.proveedor_id] || 'Taobao'
    }));

  const cantidadEnTransito = pedidos.filter((p) => p.estado === 'en_transito').length;
  const productosStockBajo = productos.filter((p) => p.stock <= 12);
  const cantidadStockBajo = productosStockBajo.length;
  const cantidadProveedores = proveedores.length;

  return (
    <div>
      {errorCarga && (
        <div className="caja-error-api" role="alert">
          <span>{errorCarga}</span>
          <button
            type="button"
            className="boton-cerrar-error"
            onClick={() => setErrorCarga('')}
          >
            Cerrar
          </button>
        </div>
      )}

      <section className="seccion-hero">
        <div className="columna-hero-texto">
          <h1 className="titular-inicio">Pedidos e inventario de la tienda</h1>
          <p className="descripcion-inicio">
            Sigue cada pedido a Taobao y 1688, revisa existencias y calcula cuánto ganas por producto.
          </p>
          <Link to="/pedidos" className="boton-pildora-blanco">
            <span>Ver pedidos</span>
            <span className="circulo-flecha-rosa" aria-hidden="true">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 2L6.8 5L3.5 8"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        <div className="columna-hero-imagen">
          <div className="marco-kitty">
            <img
              src="/img/kitty.png"
              alt="Ichigo Kitty"
              className="imagen-kitty"
            />
          </div>

          <svg
            className="guirnalda-corazones"
            width="240"
            height="44"
            viewBox="0 0 240 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 6 Q120 32 232 6"
              stroke="#d42a80"
              strokeWidth="1.5"
              fill="none"
            />
            <line x1="45" y1="12" x2="45" y2="21" stroke="#d42a80" strokeWidth="1.2" />
            <path
              d="M45 31C44.7 30.7 40 27.3 40 24.6C40 23.1 41.1 22 42.5 22C43.4 22 44.3 22.5 45 23.3C45.7 22.5 46.6 22 47.5 22C48.9 22 50 23.1 50 24.6C50 27.3 45.3 30.7 45 31Z"
              fill="#e6358f"
            />
            <line x1="85" y1="17" x2="85" y2="26" stroke="#d42a80" strokeWidth="1.2" />
            <path
              d="M85 37C84.7 36.7 79.5 32.8 79.5 29.8C79.5 28.1 80.8 26.9 82.4 26.9C83.4 26.9 84.3 27.5 85 28.3C85.7 27.5 86.6 26.9 87.6 26.9C89.2 26.9 90.5 28.1 90.5 29.8C90.5 32.8 85.3 36.7 85 37Z"
              fill="#d42a80"
            />
            <line x1="120" y1="19" x2="120" y2="28" stroke="#d42a80" strokeWidth="1.2" />
            <path
              d="M120 40C119.6 39.7 114 35.4 114 32.1C114 30.3 115.4 29 117.1 29C118.2 29 119.2 29.6 120 30.5C120.8 29.6 121.8 29 122.9 29C124.6 29 126 30.3 126 32.1C126 35.4 120.4 39.7 120 40Z"
              fill="#b8135f"
            />
            <line x1="155" y1="17" x2="155" y2="26" stroke="#d42a80" strokeWidth="1.2" />
            <path
              d="M155 37C154.7 36.7 149.5 32.8 149.5 29.8C149.5 28.1 150.8 26.9 152.4 26.9C153.4 26.9 154.3 27.5 155 28.3C155.7 27.5 156.6 26.9 157.6 26.9C159.2 26.9 160.5 28.1 160.5 29.8C160.5 32.8 155.3 36.7 155 37Z"
              fill="#d42a80"
            />
            <line x1="195" y1="12" x2="195" y2="21" stroke="#d42a80" strokeWidth="1.2" />
            <path
              d="M195 31C194.7 30.7 190 27.3 190 24.6C190 23.1 191.1 22 192.5 22C193.4 22 194.3 22.5 195 23.3C195.7 22.5 196.6 22 197.5 22C198.9 22 200 23.1 200 24.6C200 27.3 195.3 30.7 195 31Z"
              fill="#e6358f"
            />
          </svg>
        </div>
      </section>

      <BarraRosa pedidosRecientes={ultimosTresPedidos} />

      <section className="rejilla-tarjetas" aria-label="Indicadores de la tienda">
        <Tarjeta
          numero={cantidadEnTransito}
          titulo="Pedidos en tránsito"
          detalle="Paquetes enviados por proveedores que están en camino."
          textoEnlace="Ver pedidos en tránsito"
          destino="/pedidos"
        />
        <Tarjeta
          numero={cantidadStockBajo}
          titulo="Alertas de stock (<= 12)"
          detalle="Productos que requieren reposición urgente desde China."
          textoEnlace="Revisar alertas de stock"
          destino="/productos"
        />
        <Tarjeta
          numero={cantidadProveedores}
          titulo="Proveedores activos"
          detalle="Tiendas registradas en Taobao, 1688 y AliExpress."
          textoEnlace="Ver proveedores"
          destino="/proveedores"
        />
      </section>

      {productosStockBajo.length > 0 && (
        <section className="panel-alerta-stock-inicio" aria-label="Alertas automáticas de stock bajo">
          <div className="cabecera-alerta-stock">
            <strong>
              Alerta Automática de Reposición a China ({productosStockBajo.length} artículos con 12 unidades o menos en bodega de San José)
            </strong>
            <div className="acciones-cabecera-multiple">
              <Link to="/herramientas" className="enlace-accion-alerta">
                Simular arancel DUA TICA
              </Link>
              <Link to="/pedidos" className="enlace-accion-alerta">
                Crear orden de compra
              </Link>
            </div>
          </div>
          <div className="lista-alertas-stock-grid">
            {productosStockBajo.map((item) => (
              <div key={item.id} className="item-alerta-stock">
                <div className="item-alerta-titulo">{item.nombre}</div>
                <div className="item-alerta-meta">
                  <span>Stock actual: <strong>{item.stock} uds.</strong></span>
                  <span>Costo China: <strong>¥{Number(item.precio_compra_cny).toFixed(2)} CNY</strong></span>
                </div>
                <div className="item-alerta-proveedor">
                  Proveedor: {item.proveedor_nombre || 'Taobao / 1688'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="contenedor-barra-rosa" aria-label="Mapa de los 20 módulos del sistema">
        <div className="barra-rosa-gloss">
          <span className="barra-rosa-titulo">Arquitectura del Sistema Ichigo Kitty (20 Tablas Conectadas)</span>
          <Link to="/operaciones" className="barra-rosa-enlace">
            <span>Abrir centro de módulos</span>
          </Link>
        </div>
        <div className="rejilla-departamentos-inicio">
          <div className="bloque-departamento-inicio">
            <h3 className="titulo-departamento-inicio">1. Catálogo y Licencias</h3>
            <p className="texto-departamento-inicio">
              Controla <strong>productos</strong>, <strong>categorias</strong> y <strong>marcas_licencias</strong> oficiales (Hello Kitty, Kuromi, Cinnamoroll) con costos en yuanes (CNY), precios de venta y margen de ganancia por pieza.
            </p>
          </div>
          <div className="bloque-departamento-inicio">
            <h3 className="titulo-departamento-inicio">2. Importación y Aduanas</h3>
            <p className="texto-departamento-inicio">
              Administra <strong>proveedores</strong> de Taobao/1688, <strong>pedidos</strong>, <strong>detalle_pedido</strong>, <strong>agentes_envio</strong>, <strong>aduana_despachos</strong> (pedimentos y aranceles) e <strong>incidencias_envio</strong>.
            </p>
          </div>
          <div className="bloque-departamento-inicio">
            <h3 className="titulo-departamento-inicio">3. Bodegas y Calidad</h3>
            <p className="texto-departamento-inicio">
              Registra <strong>almacenes</strong> en Costa Rica, ubicación por pasillo en <strong>inventario_almacen</strong> y dictámenes de revisión física en <strong>control_calidad</strong> al recibir cada caja.
            </p>
          </div>
          <div className="bloque-departamento-inicio">
            <h3 className="titulo-departamento-inicio">4. Ventas, Finanzas y Acceso</h3>
            <p className="texto-departamento-inicio">
              Coordina <strong>clientes</strong> VIP, <strong>ventas</strong>, <strong>detalle_venta</strong>, <strong>promociones_descuentos</strong>, <strong>metodos_pago</strong>, <strong>pagos_proveedor</strong>, <strong>roles</strong> y <strong>usuarios</strong> (JWT).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;

