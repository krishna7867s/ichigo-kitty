import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Pedidos from './pages/Pedidos';

function App() {
  return (
    <BrowserRouter>
      <div className="estructura-sitio">
        <Encabezado />
        <main className="contenido-principal">
          <div className="contenedor-central">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/proveedores" element={<Proveedores />} />
              <Route path="/pedidos" element={<Pedidos />} />
            </Routes>
          </div>
        </main>
        <PiePagina />
      </div>
    </BrowserRouter>
  );
}

export default App;

