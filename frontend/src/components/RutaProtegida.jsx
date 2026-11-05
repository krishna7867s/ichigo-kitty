import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CLAVE_TOKEN } from '../services/api';

function RutaProtegida({ children }) {
  const { autenticado, cargandoSesion } = useAuth();
  const tokenEnStorage = localStorage.getItem(CLAVE_TOKEN);

  if (cargandoSesion) {
    return null;
  }

  if (!autenticado || !tokenEnStorage) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;

