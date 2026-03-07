import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 typing-dot"></div>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
