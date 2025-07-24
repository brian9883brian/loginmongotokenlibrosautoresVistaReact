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
    <>
      <div className="container">
        <h1 className="titulo">Bienvenido, {usuarioActual ?? 'Invitado'}</h1>

        <div className="botones">
          <button className="btn libroBtn" onClick={irALibros}>
            📚 Libros
          </button>
          <button className="btn autorBtn" onClick={irAAutores}>
            🧑‍💼 Autores
          </button>
        </div>

        <button className="btn cerrarSesionBtn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 12vh auto;
          background: linear-gradient(135deg, #0a9396, #94d2bd);
          padding: 3rem 2.5rem 4rem;
          border-radius: 20px;
          box-shadow: 0 12px 30px rgba(10, 147, 150, 0.4);
          text-align: center;
          color: #e0f2f1;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
        }

        .titulo {
          font-size: 2.8rem;
          font-weight: 900;
          text-shadow: 1.5px 1.5px 5px rgba(0,0,0,0.3);
          margin-bottom: 3rem;
          letter-spacing: 1.2px;
        }

        .botones {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .btn {
          cursor: pointer;
          border: none;
          border-radius: 14px;
          padding: 1.2rem 2.8rem;
          font-size: 1.5rem;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          color: #fff;
          user-select: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .libroBtn {
          background: linear-gradient(45deg, #005f73, #0a9396);
          box-shadow: 0 8px 25px #0a9396aa;
        }
        .libroBtn:hover {
          background: linear-gradient(45deg, #0a9396, #005f73);
          transform: translateY(-4px) scale(1.07);
          box-shadow: 0 12px 32px #0a9396cc;
        }

        .autorBtn {
          background: linear-gradient(45deg, #52b788, #2f855a);
          box-shadow: 0 8px 25px #2f855aaa;
        }
        .autorBtn:hover {
          background: linear-gradient(45deg, #2f855a, #52b788);
          transform: translateY(-4px) scale(1.07);
          box-shadow: 0 12px 32px #2f855acc;
        }

        .cerrarSesionBtn {
          background: #ef233c;
          padding: 1rem 2.4rem;
          font-size: 1.2rem;
          border-radius: 12px;
          box-shadow: 0 6px 20px #b00020aa;
          transition: background-color 0.3s ease, transform 0.3s ease;
          user-select: none;
        }
        .cerrarSesionBtn:hover {
          background: #b00020;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 9px 28px #b00020cc;
        }

        @media (max-width: 480px) {
          .container {
            margin: 8vh 1.5rem;
            padding: 2rem 1.8rem 3rem;
          }
          .titulo {
            font-size: 2.2rem;
            margin-bottom: 2rem;
          }
          .botones {
            flex-direction: column;
            gap: 1.6rem;
          }
          .btn {
            width: 100%;
            font-size: 1.4rem;
            padding: 1rem 0;
          }
          .cerrarSesionBtn {
            width: 100%;
            font-size: 1.1rem;
            padding: 0.8rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;
