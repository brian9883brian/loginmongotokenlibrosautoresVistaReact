import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://www.autoreslibrossss.somee.com/api/Autor';

const AutorList = ({ usuarioActual, setEstaLogueado, setUsuarioActual }) => {
  const navigate = useNavigate();

  const [autores, setAutores] = useState([]);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [guidSeleccionado, setGuidSeleccionado] = useState(null);

  useEffect(() => {
    obtenerAutores();
  }, []);

  const obtenerAutores = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAutores(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de autores.');
    }
  };

  const validarFormulario = () => {
    if (!nombre.trim() || !apellido.trim() || !fechaNacimiento.trim()) {
      alert('Todos los campos son obligatorios.');
      return false;
    }

    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
      alert('La fecha de nacimiento no puede ser mayor a hoy.');
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setFechaNacimiento('');
    setGuidSeleccionado(null);
  };

  const cerrarSesion = () => {
    sessionStorage.clear();
    setEstaLogueado(false);
    setUsuarioActual(null);
    navigate('/');
  };

  const crearAutor = async () => {
    if (!validarFormulario()) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      const fechaISO = new Date(fechaNacimiento).toISOString();
      await axios.post(
        BASE_URL,
        {
          nombre,
          apellido,
          fechaNacimiento: fechaISO,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al crear autor.');
    }
  };

  const actualizarAutor = async () => {
    if (!validarFormulario()) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      const fechaISO = new Date(fechaNacimiento).toISOString();
      await axios.put(
        `${BASE_URL}/${guidSeleccionado}`,
        {
          autorLibroGuid: guidSeleccionado,
          nombre,
          apellido,
          fechaNacimiento: fechaISO,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      obtenerAutores();
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar autor.');
    }
  };

  const eliminarAutor = async (guid) => {
    if (!window.confirm('¿Seguro que deseas eliminar este autor?')) return;

    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.delete(`${BASE_URL}/${guid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerAutores();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar autor.');
    }
  };

  const seleccionarParaEditar = (autor) => {
    setGuidSeleccionado(autor.autorLibroGuid);
    setNombre(autor.nombre);
    setApellido(autor.apellido);
    setFechaNacimiento(autor.fechaNacimiento.split('T')[0]);
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
        <h1 style={styles.title}>Gestión de Autores</h1>
        <div>
          <span style={styles.user}>👤 {usuarioActual}</span>
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
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
        <button
          style={styles.buttonPrimary}
          onClick={guidSeleccionado ? actualizarAutor : crearAutor}
        >
          {guidSeleccionado ? 'Actualizar' : 'Crear'}
        </button>
        <button style={styles.buttonSecondary} onClick={limpiarFormulario}>
          Cancelar
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Apellido</th>
              <th style={styles.th}>Fecha Nacimiento</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autores.map((autor) => (
              <tr key={autor.autorLibroGuid}>
                <td style={styles.td}>{autor.nombre}</td>
                <td style={styles.td}>{autor.apellido}</td>
                <td style={styles.td}>{formatearFecha(autor.fechaNacimiento)}</td>
                <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>
                  <button
                    style={styles.editButton}
                    onClick={() => seleccionarParaEditar(autor)}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => eliminarAutor(autor.autorLibroGuid)}
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
    textAlign: 'left',
  },
  th: {
    padding: '12px 8px',
    borderBottom: '2px solid #ccc',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px 8px',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'middle',
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

export default AutorList;
