import React, { useEffect, useState } from 'react';
import axiosAuth from './api/axiosAuth';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const baseUrl = 'https://autoreslibrolibroauotres.somee.com/api/Autor';

const AutorView = ({ usuarioActual, setEstaLogueado, setUsuarioActual }) => {
  const [autores, setAutores] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', fechaNacimiento: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [autorEditandoGuid, setAutorEditandoGuid] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cerrarSesion = () => {
    sessionStorage.clear();
    setEstaLogueado(false);
    setUsuarioActual(null);
    navigate('/');
  };
  const regresarDashboard = () => {
    navigate('/dashboard');
  };

  // Cargar autores
  const obtenerAutores = async () => {
    try {
      const response = await axiosAuth.get(baseUrl);
      setAutores(response.data);
    } catch (err) {
      console.error('Error al obtener autores', err);
      setError('Error al obtener autores');
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

  // Manejo de formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validar formulario
  const validarFormulario = () => {
    if (!form.nombre.trim() || !form.apellido.trim() || !form.fechaNacimiento) {
      setError('Todos los campos son obligatorios.');
      return false;
    }
    setError('');
    return true;
  };

  // Crear autor
  const crearAutor = async () => {
    if (!validarFormulario()) return;

    try {
      await axiosAuth.post(baseUrl, {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        fechaNacimiento: new Date(form.fechaNacimiento).toISOString(),
      });
      await obtenerAutores();
      limpiarFormulario();
    } catch (err) {
      console.error('Error al crear autor', err);
      setError('Error al crear autor');
    }
  };

  // Iniciar edición
  const iniciarEdicion = (autor) => {
    setForm({
      nombre: autor.nombre,
      apellido: autor.apellido,
      fechaNacimiento: dayjs(autor.fechaNacimiento).format('YYYY-MM-DD'),
    });
    setModoEdicion(true);
    setAutorEditandoGuid(autor.autorLibroGuid);
    setError('');
  };

  // Actualizar autor
  const actualizarAutor = async () => {
    if (!validarFormulario()) return;

    try {
      await axiosAuth.put(`${baseUrl}/${autorEditandoGuid}`, {
        autorLibroGuid: autorEditandoGuid,
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        fechaNacimiento: new Date(form.fechaNacimiento).toISOString(),
      });
      await obtenerAutores();
      limpiarFormulario();
      setModoEdicion(false);
      setAutorEditandoGuid(null);
    } catch (err) {
      console.error('Error al actualizar autor', err);
      setError('Error al actualizar autor');
    }
  };

  // Eliminar autor
  const eliminarAutor = async (guid) => {
    if (!window.confirm('¿Estás seguro de eliminar este autor?')) return;

    try {
      await axiosAuth.delete(`${baseUrl}/${guid}`);
      await obtenerAutores();
    } catch (err) {
      console.error('Error al eliminar autor', err);
      setError('Error al eliminar autor');
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setForm({ nombre: '', apellido: '', fechaNacimiento: '' });
    setError('');
  };

  return (
    <>
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>Gestión de Autores</h1>
          <button className="btn backBtn" onClick={regresarDashboard}>
            ← Regresar al Dashboard
          </button>
        </header>
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
</div>

        {/* Formulario */}
        <section className="card formCard">
          <h2>{modoEdicion ? 'Editar Autor' : 'Agregar Nuevo Autor'}</h2>

          {error && (
            <div className="errorMsg" role="alert">
              ⚠ {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              modoEdicion ? actualizarAutor() : crearAutor();
            }}
            noValidate
          >
            <div className="formGrid">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Gabriel"
                autoComplete="off"
              />

              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Ej. García Márquez"
                autoComplete="off"
              />

              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="formActions">
              {modoEdicion ? (
                <>
                  <button type="submit" className="btn primaryBtn">
                    ✔ Actualizar Autor
                  </button>
                  <button
                    type="button"
                    className="btn cancelBtn"
                    onClick={() => {
                      limpiarFormulario();
                      setModoEdicion(false);
                      setAutorEditandoGuid(null);
                    }}
                  >
                    ✖ Cancelar
                  </button>
                </>
              ) : (
                <button type="submit" className="btn successBtn">
                  + Crear Autor
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Tabla de autores */}
        <section className="card tableCard">
          <h2>Listado de Autores</h2>
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Fecha Nacimiento</th>
                  <th>GUID</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {autores.length > 0 ? (
                  autores.map((autor) => (
                    <tr key={autor.autorLibroGuid}>
                      <td>{autor.autorLibroId}</td>
                      <td>{autor.nombre}</td>
                      <td>{autor.apellido}</td>
                      <td>{dayjs(autor.fechaNacimiento).format('D [de] MMMM [de] YYYY')}</td>
                      <td title={autor.autorLibroGuid} className="guidCell">
                        {autor.autorLibroGuid.slice(0, 12)}...
                      </td>
                      <td>
                        <button
                          className="btn iconBtn editBtn"
                          onClick={() => iniciarEdicion(autor)}
                          aria-label="Editar autor"
                          title="Editar autor"
                        >
                          ✎
                        </button>
                        <button
                          className="btn iconBtn deleteBtn"
                          onClick={() => eliminarAutor(autor.autorLibroGuid)}
                          aria-label="Eliminar autor"
                          title="Eliminar autor"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="emptyMsg">
                      No hay autores registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

<style jsx>{`
  /* Container */
  .container {
    max-width: 900px;
    margin: 3rem auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #222;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }
  .header h1 {
    font-size: 2.4rem;
    color: #005f73;
    font-weight: 900;
    letter-spacing: 1px;
    text-shadow: 1px 1px 4px rgba(0, 95, 115, 0.3);
  }
  .backBtn {
    background: transparent;
    border: 2px solid #0a9396;
    color: #0a9396;
    font-weight: 600;
    padding: 0.5rem 1.3rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.1rem;
    box-shadow: 0 3px 8px rgba(10, 147, 150, 0.3);
  }
  .backBtn:hover {
    background: #0a9396;
    color: white;
    box-shadow: 0 6px 14px rgba(10, 147, 150, 0.7);
    transform: scale(1.05);
  }

  /* Cards */
  .card {
    background: #e0fbfc;
    border-radius: 16px;
    padding: 2rem 2.5rem;
    box-shadow: 0 8px 20px rgba(0, 95, 115, 0.1);
    margin-bottom: 3rem;
    transition: box-shadow 0.3s ease;
  }
  .card:hover {
    box-shadow: 0 12px 28px rgba(0, 95, 115, 0.2);
  }

  /* Form Card */
  .formCard h2 {
    margin-bottom: 1.8rem;
    color: #005f73;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-shadow: 1px 1px 3px rgba(0, 95, 115, 0.15);
  }

  /* Error */
  .errorMsg {
    background: #ffeded;
    border-left: 6px solid #ef233c;
    color: #b00020;
    padding: 0.7rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    user-select: none;
  }

  /* Form grid */
  .formGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.6rem 2.4rem;
    align-items: end; /* Alinea etiquetas e inputs para que queden parejos */
  }

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #0a9396;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
  }

  input[type='text'],
  input[type='date'] {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    border-radius: 10px;
    border: 2px solid #94d2bd;
    outline-offset: 2px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #14213d;
    box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.6);
    height: 42px; /* Altura fija para inputs parejos */
    box-sizing: border-box;
  }
  input[type='text']:focus,
  input[type='date']:focus {
    border-color: #005f73;
    box-shadow: 0 0 8px #0a9396aa;
  }

  /* Form buttons */
  .formActions {
    margin-top: 2.5rem;
    display: flex;
    gap: 1.5rem;
  }

  .btn {
    padding: 0.85rem 2rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 95, 115, 0.15);
    transition: all 0.35s ease;
    user-select: none;
  }

  .primaryBtn {
    background: #005f73;
    color: white;
  }
  .primaryBtn:hover {
    background: #0a9396;
    box-shadow: 0 6px 20px #0a9396cc;
    transform: scale(1.05);
  }

  .cancelBtn {
    background: #d8e2dc;
    color: #6b705c;
    font-weight: 600;
  }
  .cancelBtn:hover {
    background: #b7b7a4;
    color: #444;
    box-shadow: 0 6px 20px #b7b7a488;
    transform: scale(1.05);
  }

  .successBtn {
    background: #52b788;
    color: white;
    box-shadow: 0 4px 20px #52b788aa;
  }
  .successBtn:hover {
    background: #40916c;
    box-shadow: 0 6px 22px #40916ccc;
    transform: scale(1.05);
  }

  /* Tabla Card */
  .tableCard h2 {
    margin-bottom: 1.5rem;
    font-weight: 700;
    color: #005f73;
    text-shadow: 1px 1px 3px rgba(0, 95, 115, 0.12);
  }

  .tableWrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.7rem;
    font-size: 1rem;
    font-weight: 500;
    color: #14213d;
  }

  /* Ocultar columna GUID */
  table thead th:nth-child(5),
  table tbody td:nth-child(5) {
    display: none;
  }

  th,
  td {
    padding: 0.8rem 1rem;
    text-align: left;
    vertical-align: middle;
  }

  /* Ajuste ancho y centrado columna acciones */
  table th:last-child,
  table td:last-child {
    text-align: center;
    width: 110px;
    padding-right: 1.2rem;
  }

  thead tr {
    background: #94d2bd;
    color: #003b46;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.9rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px #94d2bdaa;
  }

  tbody tr {
    background: #ffffffdd;
    border-radius: 14px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    cursor: default;
    box-shadow: 0 1px 6px #005f7344;
  }

  tbody tr:hover {
    background: #e0fbfc;
    box-shadow: 0 8px 15px #0a939688;
  }

  tbody tr td:first-child {
    font-weight: 700;
    color: #0a9396;
  }

  .guidCell {
    font-family: monospace;
    color: #6b705c;
    max-width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Botones de acción */
  .iconBtn {
    background: #94d2bd;
    border-radius: 8px;
    padding: 0.3rem 0.6rem;
    margin-left: 0.4rem;
    font-size: 1.1rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.25s ease;
    color: #003b46;
    box-shadow: 0 2px 6px #003b4633;
    user-select: none;
  }
.userSection {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #005f73;
  font-size: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logoutButton {
  background-color: #ef4444; /* rojo vivo */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.5);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  user-select: none;
}

.logoutButton:hover {
  background-color: #b91c1c; /* rojo más oscuro */
  box-shadow: 0 6px 18px rgba(185, 28, 28, 0.7);
  transform: scale(1.05);
}

.logoutButton:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(185, 28, 28, 0.8);
}

  .iconBtn:hover {
    transform: scale(1.25);
    box-shadow: 0 5px 18px #0a939688;
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

  /* Empty message */
  .emptyMsg {
    text-align: center;
    padding: 3rem;
    font-style: italic;
    font-weight: 600;
    color: #6b705c;
    user-select: none;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .formGrid {
      grid-template-columns: 1fr;
    }
    .header {
      flex-direction: column;
      gap: 1rem;
    }
    .backBtn {
      width: 100%;
      text-align: center;
    }
    .formActions {
      flex-direction: column;
    }
    .formActions button {
      width: 100%;
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
      box-shadow: 0 6px 20px rgba(10, 147, 150, 0.2);
      padding: 1rem;
    }
    tbody td {
      border: none;
      padding: 0.5rem 0;
      position: relative;
      padding-left: 50%;
      text-align: left;
      font-size: 0.95rem;
    }
    tbody td:before {
      position: absolute;
      top: 50%;
      left: 1rem;
      width: 45%;
      padding-right: 1rem;
      white-space: nowrap;
      font-weight: 700;
      transform: translateY(-50%);
      color: #0a9396;
    }
    tbody td:nth-of-type(1):before {
      content: 'ID';
    }
    tbody td:nth-of-type(2):before {
      content: 'Nombre';
    }
    tbody td:nth-of-type(3):before {
      content: 'Apellido';
    }
    tbody td:nth-of-type(4):before {
      content: 'Fecha Nacimiento';
    }
    tbody td:nth-of-type(6):before {
      content: 'Acciones';
    }
    /* Ocultar GUID en móvil */
    tbody td:nth-of-type(5):before {
      display: none;
    }
    .guidCell {
      max-width: none;
      white-space: normal;
      overflow: visible;
    }
    .iconBtn {
      margin-left: 0;
      margin-right: 0.5rem;
    }
  }
`}</style>

    </>
  );
};

export default AutorView;
