import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '../common/Loading';
import PropTypes from 'prop-types';

// Mock authentication check - replace with real auth hook
const useAuth = () => {
  // In a real app, this would use Context or Redux
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate API call to check auth
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token');
      // Very basic mock
      if (token) {
        setIsAuth(true);
        setIsAdmin(localStorage.getItem('role') === 'admin');
      } else {
        // For development/demo purposes without a backend, just let them in if no token logic is wired
        // Change this back to false in production!
        setIsAuth(true); 
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { isAuth, isAdmin, isLoading: isAuth === null };
};

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuth, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="VERIFYING CREDENTIALS..." />;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
