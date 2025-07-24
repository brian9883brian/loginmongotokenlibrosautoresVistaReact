import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosAuth from './api/axiosAuth'; // Usamos instancia con manejo de tokens

const API_URL = 'https://www.librostoken.somee.com/api/LibroMaterial';

const LibroMaterialView = ({ usuarioActual, setEstaLogueado, setUsuarioActual }) => {
  const navigate = useNavigate();

  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [titulo, setTitulo] = useState('');
  const [fechaPublicacion, setFechaPublicacion] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const cerrarSesion = () => {
    sessionStorage.clear();
    setEstaLogueado(false);
    setUsuarioActual(null);
    navigate('/');
  };

  const obtenerLibros = useCallback(async () => {
    try {
      const response = await axiosAuth.get(API_URL);
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

    const fecha = new Date(fechaPublicacion);
    if (isNaN(fecha.getTime())) {
      alert('La fecha de publicación no es válida.');
      return false;
    }

    return true;
  };

  const limpiarFormulario = () => {
    setTitulo('');
    setFechaPublicacion('');
    setEditandoId(null);
  };

  const crearLibro = async () => {
    if (!validarFormulario()) return;

    try {
      const fechaISO = new Date(fechaPublicacion).toISOString();

      await axiosAuth.post(API_URL, {
        titulo,
        fechaPublicacion: fechaISO,
        autorLibro: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      });

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
      const fechaISO = new Date(fechaPublicacion).toISOString();

      await axiosAuth.put(`${API_URL}/${editandoId}`, {
        titulo,
        fechaPublicacion: fechaISO,
        autorLibro: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      });

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
      await axiosAuth.delete(`${API_URL}/${id}`);
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
    <>
      <div className="container">
        <div className="header">
          <h1>Gestión de Libros</h1>
          <div className="userSection">
            <span>📖 {usuarioActual}</span>
            <button className="logoutButton" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <button className="backButton" onClick={regresarDashboard}>
          ← Regresar al Dashboard
        </button>

        {error && <div className="error">{error}</div>}

        <div className="form">
          <input
            className="input"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            className="input"
            type="date"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
          />
          <button className="buttonPrimary" onClick={editandoId ? actualizarLibro : crearLibro}>
            {editandoId ? 'Actualizar' : 'Crear'}
          </button>
          <button className="buttonSecondary" onClick={limpiarFormulario}>
            Cancelar
          </button>
        </div>

        <div className="tableWrapper">
          <table className="table">
            <thead>
              <tr>
                {/* ID oculto */}
                {/* <th>ID</th> */}
                <th>Título</th>
                <th>Fecha Publicación</th>
                <th>AutorLibro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.libreriaMaterialId}>
                  {/* ID oculto */}
                  {/* <td>{libro.libreriaMaterialId}</td> */}
                  <td>{libro.titulo}</td>
                  <td>{formatearFecha(libro.fechaPublicacion)}</td>
                  <td className="autorLibroCell">{libro.autorLibro}</td>
                  <td className="actionsCell">
                    <button
                      className="iconBtn editBtn"
                      onClick={() => seleccionarParaEditar(libro)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="iconBtn deleteBtn"
                      onClick={() => eliminarLibro(libro.libreriaMaterialId)}
                      title="Eliminar"
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

      <style jsx>{`
        /* Contenedor general */
        .container {
          max-width: 900px;
          margin: 3rem auto 5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #222;
          background: #f7f9fa;
          padding: 2rem 3rem 3rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0, 95, 115, 0.12);
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .header h1 {
          font-size: 2.6rem;
          color: #005f73;
          font-weight: 900;
          letter-spacing: 1px;
          text-shadow: 1px 1px 5px rgba(0, 95, 115, 0.3);
        }
        .userSection {
          display: flex;
          align-items: center;
          gap: 1.4rem;
          font-size: 1rem;
          color: #34495e;
          font-weight: 600;
        }
        .logoutButton {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.5);
          transition: background-color 0.3s ease, transform 0.25s ease;
        }
        .logoutButton:hover {
          background-color: #c0392b;
          transform: scale(1.07);
          box-shadow: 0 7px 18px rgba(192, 57, 43, 0.7);
        }

        /* Botón regresar */
        .backButton {
          margin-bottom: 30px;
          background-color: #34495e;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 5px 15px rgba(52, 73, 94, 0.4);
          transition: background-color 0.3s ease, transform 0.25s ease;
        }
        .backButton:hover {
          background-color: #2c3e50;
          transform: scale(1.05);
          box-shadow: 0 8px 22px rgba(44, 62, 80, 0.6);
        }

        /* Error */
        .error {
          background-color: #ffeded;
          border-left: 6px solid #ef233c;
          color: #b00020;
          padding: 1rem 1.2rem;
          border-radius: 10px;
          font-weight: 700;
          margin-bottom: 2rem;
          user-select: none;
          text-align: center;
          box-shadow: 0 3px 15px rgba(239, 35, 60, 0.2);
        }

        /* Formulario */
        .form {
          display: flex;
          flex-wrap: wrap;
          gap: 1.8rem 2.5rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 3.5rem;
        }
        .input {
          width: 230px;
          padding: 12px 16px;
          font-size: 1.1rem;
          border-radius: 14px;
          border: 2px solid #94d2bd;
          box-shadow: inset 0 3px 6px #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #14213d;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          height: 44px;
          box-sizing: border-box;
        }
        .input:focus {
          outline: none;
          border-color: #0a9396;
          box-shadow: 0 0 12px #0a9396cc;
        }

        /* Botones */
        .buttonPrimary {
          background-color: #005f73;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 28px;
          font-weight: 800;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 5px 20px #0a939688;
          transition: background-color 0.3s ease, transform 0.3s ease;
          user-select: none;
        }
        .buttonPrimary:hover {
          background-color: #0a9396;
          transform: scale(1.07);
          box-shadow: 0 7px 25px #0a9396cc;
        }
        .buttonSecondary {
          background-color: #b7b7a4;
          color: #3a3a3a;
          border: none;
          border-radius: 50px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          box-shadow: 0 5px 18px #b7b7a488;
          transition: background-color 0.3s ease, transform 0.3s ease;
          user-select: none;
        }
        .buttonSecondary:hover {
          background-color: #949482;
          transform: scale(1.05);
          box-shadow: 0 7px 20px #949482cc;
        }

        /* Tabla contenedor */
        .tableWrapper {
          overflow-x: auto;
          background-color: #fff;
          border-radius: 16px;
          padding: 20px 30px;
          box-shadow: 0 10px 30px rgba(0, 95, 115, 0.1);
        }

        /* Tabla */
        .table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.8rem;
          font-size: 1rem;
          font-weight: 600;
          color: #14213d;
        }
        thead tr {
          background: #94d2bd;
          color: #003b46;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.06em;
          box-shadow: 0 2px 10px #94d2bdaa;
          border-radius: 14px;
        }

        th,
        td {
          padding: 1rem 1.2rem;
          text-align: left;
          vertical-align: middle;
          border-radius: 10px;
        }

        /* Ocultar columna ID */
        thead th:nth-child(1),
        tbody td:nth-child(1) {
          display: none;
        }

        tbody tr {
          background: #ffffffdd;
          border-radius: 14px;
          box-shadow: 0 1px 6px #005f7344;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }
        tbody tr:hover {
          background: #e0fbfc;
          box-shadow: 0 10px 22px #0a939688;
        }

        /* Ajustes celdas */
        tbody td:nth-child(2) {
          font-weight: 700;
          color: #0a9396;
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        tbody td:nth-child(3) {
          color: #555;
          font-style: italic;
          max-width: 170px;
        }
        tbody td.autorLibroCell {
          font-size: 0.85rem;
          color: #555;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: monospace;
        }

        /* Acciones */
        td.actionsCell {
          text-align: center;
          width: 130px;
          padding-right: 1.5rem;
        }

        .iconBtn {
          background: #94d2bd;
          border-radius: 10px;
          padding: 8px 14px;
          margin-left: 0.6rem;
          font-size: 1.2rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          color: #003b46;
          box-shadow: 0 3px 8px #003b4633;
          transition: background-color 0.3s ease, transform 0.3s ease;
          user-select: none;
          line-height: 1;
        }
        .iconBtn:hover {
          transform: scale(1.3);
          box-shadow: 0 8px 20px #0a939688;
        }
        .editBtn {
          background: #52b788;
          color: white;
        }
        .editBtn:hover {
          background: #40916c;
        }
        .deleteBtn {
          background: #ef233c;
          color: white;
        }
        .deleteBtn:hover {
          background: #b00020;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form {
            flex-direction: column;
            gap: 1.5rem;
          }
          .input {
            width: 100%;
            max-width: 100%;
          }
          .tableWrapper {
            padding: 15px 20px;
          }
          table,
          thead,
          tbody,
          th,
          td,
          tr {
            display: block;
          }
          thead tr {
            position: absolute;
            top: -9999px;
            left: -9999px;
          }
          tbody tr {
            margin-bottom: 1.5rem;
            border-radius: 16px;
            background: #e0fbfc;
            box-shadow: 0 8px 25px rgba(10, 147, 150, 0.25);
            padding: 1rem 1.2rem;
          }
          tbody td {
            border: none;
            padding: 0.8rem 0;
            position: relative;
            padding-left: 55%;
            text-align: left;
            font-size: 0.95rem;
            white-space: normal;
          }
          tbody td:before {
            position: absolute;
            top: 50%;
            left: 1.2rem;
            width: 40%;
            padding-right: 1rem;
            white-space: nowrap;
            font-weight: 700;
            transform: translateY(-50%);
            color: #0a9396;
          }
          tbody td:nth-of-type(1):before {
            content: ''; /* ID oculto */
            display: none;
          }
          tbody td:nth-of-type(2):before {
            content: 'Título';
          }
          tbody td:nth-of-type(3):before {
            content: 'Fecha Publicación';
          }
          tbody td:nth-of-type(4):before {
            content: 'AutorLibro';
          }
          tbody td:nth-of-type(5):before {
            content: 'Acciones';
          }
          td.actionsCell {
            text-align: right;
            padding-right: 0;
          }
          .iconBtn {
            margin-left: 0;
            margin-right: 0.7rem;
          }
        }
      `}</style>
    </>
  );
};

export default LibroMaterialView;
