// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const estaLogueado = sessionStorage.getItem('logueado') === 'true';
  return estaLogueado ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
