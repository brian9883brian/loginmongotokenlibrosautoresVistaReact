import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ usuarioActual, setEstaLogueado, setUsuarioActual }) => {
  const navigate = useNavigate();

  const irALibros = () => {
    navigate('/libros');
  };

  const irAAutores = () => {
    navigate('/autores');
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    setEstaLogueado(false);
    setUsuarioActual(null);
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Bienvenido, {usuarioActual ?? 'Invitado'}</h1>

      <div style={styles.botones}>
        <button style={styles.boton} onClick={irALibros}>📚 Libros</button>
        <button style={styles.boton} onClick={irAAutores}>🧑‍💼 Autores</button>
      </div>

      <button style={styles.cerrarSesionBtn} onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '10vh',
  },
  titulo: {
    fontSize: '2rem',
    marginBottom: '2rem',
  },
  botones: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
  },
  boton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    transition: '0.3s',
  },
  cerrarSesionBtn: {
    padding: '0.7rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#f44336',
    color: 'white',
    transition: '0.3s',
  },
};

export default Dashboard;
