// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setEstaLogueado, setUsuarioActual }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async () => {
    if (!username || !password) {
      alert('Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      const res = await fetch('https://loginconectadotokenlibrosautores.somee.com/api/Users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login exitoso');
        sessionStorage.setItem('logueado', 'true');
        sessionStorage.setItem('usuario', username);
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
        setEstaLogueado(true);
        setUsuarioActual(username);
        navigate('/'); // o a la página principal que quieras
      } else {
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Bienvenido</h2>
        <p style={styles.subtitle}>Por favor, inicia sesión para continuar</p>
        <input
          style={styles.input}
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={manejarLogin}>
          Entrar
        </button>
        <p style={styles.link} onClick={() => navigate('/forgot-password')}>
          ¿Olvidaste tu contraseña?
        </p>
        <p style={styles.link} onClick={() => navigate('/register')}>
          ¿No tienes cuenta? <span style={styles.linkAccent}>Regístrate aquí</span>
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
  subtitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '20px',
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
  linkAccent: {
    color: '#2980b9',
    fontWeight: 'bold',
  },
};

export default Login;
