import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute( { children } : { children: React.ReactNode }) {
    const auth = useAuth();
    return auth?.token ? children: <Navigate to="/login" />;
}