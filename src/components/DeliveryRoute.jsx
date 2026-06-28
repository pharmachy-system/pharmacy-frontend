import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DeliveryRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!['delivery', 'admin'].includes(user.role)) return <Navigate to="/" replace />;

  return children;
}
