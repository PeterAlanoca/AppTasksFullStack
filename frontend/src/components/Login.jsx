import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('peter.alanoca@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const request =  { 
        email, 
        password 
      }
      const httpResponse = await api.post('/auth/login', request);
      const response = httpResponse.data
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.message || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error al iniciar sesión. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email" 
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="8"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>

          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;