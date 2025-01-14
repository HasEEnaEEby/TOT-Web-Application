import { Route, Routes } from 'react-router-dom';
import VerificationPending from '../components/auth/VerificationPending';
import CustomerWelcomeForm from '../components/customer_Dashboard/Customer_form/CustomerWelcomeform';
import NotFoundPage from '../pages/NotFoundPage';
import AdminApp from '../pages/admin/AdminApp';
import LoginPage from '../pages/auth/LoginPage';
import SignUpPage from '../pages/auth/SignUpPage';
import VerifyEmail from '../pages/auth/VerifyEmail';
import HomePage from '../pages/home/HomePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/verification-pending" element={<VerificationPending />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/customer-dashboard" element={<CustomerWelcomeForm />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;