// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import AutorList from './AutorList';
import LibroMaterialView from './LibroMaterialView';
import Register from './Register';
import ForgottenPassword from './ForgotPassword';
import Dashboard from './Dashboard'; // 👉 NUEVO

const App = () => {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    const logueado = sessionStorage.getItem('logueado') === 'true';
    const usuario = sessionStorage.getItem('usuario');
    setEstaLogueado(logueado);
    setUsuarioActual(usuario);

    const onStorageChange = () => {
      const logueado = sessionStorage.getItem('logueado') === 'true';
      const usuario = sessionStorage.getItem('usuario');
      setEstaLogueado(logueado);
      setUsuarioActual(usuario);
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            estaLogueado ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login
                setEstaLogueado={setEstaLogueado}
                setUsuarioActual={setUsuarioActual}
              />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />

        {/* 👉 NUEVA VISTA DESPUÉS DE LOGIN */}
<Route
  path="/dashboard"
  element={
    estaLogueado ? (
      <Dashboard
        usuarioActual={usuarioActual}
        setEstaLogueado={setEstaLogueado}
        setUsuarioActual={setUsuarioActual}
      />
    ) : (
      <Navigate to="/" />
    )
  }
/>


        <Route
          path="/autores"
          element={
            estaLogueado ? (
              <AutorList
                usuarioActual={usuarioActual}
                setEstaLogueado={setEstaLogueado}
                setUsuarioActual={setUsuarioActual}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/libros"
          element={
            estaLogueado ? (
              <LibroMaterialView
                setEstaLogueado={setEstaLogueado}
                setUsuarioActual={setUsuarioActual}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
