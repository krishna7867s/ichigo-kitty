import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Encabezado from './components/Encabezado';
import PiePagina from './components/PiePagina';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Pedidos from './pages/Pedidos';
import Operaciones from './pages/Operaciones';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="estructura-sitio">
          <Encabezado />
          <main className="contenido-principal">
            <div className="contenedor-central">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                  path="/"
                  element={
                    <RutaProtegida>
                      <Inicio />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/productos"
                  element={
                    <RutaProtegida>
                      <Productos />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <RutaProtegida>
                      <Categorias />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <RutaProtegida>
                      <Proveedores />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/pedidos"
                  element={
                    <RutaProtegida>
                      <Pedidos />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/operaciones"
                  element={
                    <RutaProtegida>
                      <Operaciones />
                    </RutaProtegida>
                  }
                />
              </Routes>
            </div>
          </main>
          <PiePagina />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
