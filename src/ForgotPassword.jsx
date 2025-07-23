// ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [respuestaSecreta, setRespuestaSecreta] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const navigate = useNavigate();

  const manejarRecuperacion = async () => {
    if (!username || !respuestaSecreta || !nuevaPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch('https://loginconectadotokenlibrosautores.somee.com/api/Users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, respuestaSecreta, nuevaPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Contraseña actualizada correctamente.');
        navigate('/login');
      } else {
        alert(data.error || 'Error al actualizar contraseña');
      }
    } catch (err) {
      console.error(err);
      alert('Error en la conexión');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Recuperar Contraseña</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Respuesta secreta"
          value={respuestaSecreta}
          onChange={(e) => setRespuestaSecreta(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
        />
        <button style={styles.button} onClick={manejarRecuperacion}>
          Actualizar contraseña
        </button>
        <p style={styles.link} onClick={() => navigate('/login')}>
          Volver al inicio de sesión
        </p>
      </div>
    </div>
  );
};

const styles = {
  background: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    marginTop: '15px',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  link: {
    fontSize: '14px',
    color: '#34495e',
    marginTop: '15px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default ForgotPassword;
