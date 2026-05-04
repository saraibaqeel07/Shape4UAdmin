import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard';
import Users from './pages/Users';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import Weeks from './pages/Weeks';



console.log('Routes component loaded');

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  console.log('ProtectedRoute - User:', user);
  
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  console.log('User found, rendering children');
  return children;
};

const AppRoutes = () => {
  console.log('AppRoutes rendering');
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
       
        <Route path="/users" element={<Users />} />
        <Route path="/weeks" element={<Weeks />} />
        

      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 