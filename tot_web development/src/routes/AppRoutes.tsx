// src/routes/AppRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import NotFoundPage from '../pages/NotFoundPage'; 
import AdminApp from '../pages/admin/AdminApp'; 
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import HomePage from '../pages/home/HomePage';
import PrivateRoutes from './PrivateRoutes'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin/*" element={<AdminApp />} />
      </Route>

      {/* Catch-all Route for undefined paths (404) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
