// LibroMaterialView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://www.librostoken.somee.com/api/LibroMaterial';

const LibroMaterialView = ({ usuarioActual, setEstaLogueado, setUsuarioActual }) => {
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [titulo, setTitulo] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const obtenerLibros = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) throw new Error('No hay token de autorización');

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLibros(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de libros.');
      if (err.response?.status === 401) {
        alert('Sesión expirada o no autorizada. Por favor, inicia sesión nuevamente.');
        cerrarSesion();
      }
    }
  }, []);

  useEffect(() => {
    obtenerLibros();
  }, [obtenerLibros]);

  const validarFormulario = () => {
    if (!titulo.trim() || !fechaPublicacion.trim()) {
      alert('Todos los campos son obligatorios.');
      return false;
    }
    return true;
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setFechaPublicacion('');
    setEditandoId(null);
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    setEstaLogueado(false);
    setUsuarioActual(null);
    navigate('/');
  };

  const crearLibro = async () => {
    if (!validarFormulario()) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      const fechaISO = new Date(fechaPublicacion).toISOString();

      await axios.post(
        API_URL,
        {
          titulo,
          fechaPublicacion: fechaISO,
          autorLibro: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      obtenerLibros();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al crear libro.');
    }
  };

  const actualizarLibro = async () => {
    if (!validarFormulario()) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      const fechaISO = new Date(fechaPublicacion).toISOString();

      await axios.put(
        `${API_URL}/${editandoId}`,
        {
          titulo,
          fechaPublicacion: fechaISO,
          autorLibro: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      obtenerLibros();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar libro.');
    }
  };

  const eliminarLibro = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este libro?')) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerLibros();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar libro.');
    }
  };

  const seleccionarParaEditar = (libro) => {
    setEditandoId(libro.libreriaMaterialId);
    setTitulo(libro.titulo);
    setFechaPublicacion(libro.fechaPublicacion.split('T')[0]);
  };

  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const regresarDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Libros</h1>
        <div>
          <span style={styles.user}>📖 {usuarioActual}</span>
          <button style={styles.logoutButton} onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <button style={styles.backButton} onClick={regresarDashboard}>
        ← Regresar al Dashboard
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={fechaPublicacion}
          onChange={(e) => setFechaPublicacion(e.target.value)}
        />
        <button
          style={styles.buttonPrimary}
          onClick={editandoId ? actualizarLibro : crearLibro}
        >
          {editandoId ? 'Actualizar' : 'Crear'}
        </button>
        <button style={styles.buttonSecondary} onClick={limpiarFormulario}>
          Cancelar
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Fecha Publicación</th>
              <th>AutorLibro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro) => (
              <tr key={libro.libreriaMaterialId}>
                <td>{libro.libreriaMaterialId}</td>
                <td>{libro.titulo}</td>
                <td>{formatearFecha(libro.fechaPublicacion)}</td>
                <td style={{ fontSize: '0.8rem', color: '#555' }}>{libro.autorLibro}</td>
                <td>
                  <button
                    style={styles.editButton}
                    onClick={() => seleccionarParaEditar(libro)}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => eliminarLibro(libro.libreriaMaterialId)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#ecf0f1',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
  },
  user: {
    marginRight: '20px',
    fontSize: '1rem',
    color: '#34495e',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  backButton: {
    marginBottom: '20px',
    padding: '8px 16px',
    backgroundColor: '#34495e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  error: {
    backgroundColor: '#ffcccc',
    color: '#c0392b',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '200px',
  },
  buttonPrimary: {
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  buttonSecondary: {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  editButton: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    marginRight: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default LibroMaterialView;
