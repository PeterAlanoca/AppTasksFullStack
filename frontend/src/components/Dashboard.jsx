import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const httpResponse = await api.get('/tasks');
        const response = httpResponse.data;
        if (response.success) {
          setTasks(response.data);
        } else {
          setError(response.message || 'Error al obtener las tareas');
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Error al cargar las tareas.'
        );
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = async (id) => {
    try {
      const httpResponse = await api.delete(`/tasks/${id}`);
      const response = httpResponse.data;
      if (response.success) {
        setTasks(tasks.filter(task => task.id !== id));
      } else {
        setError(response.message || 'Error al obtener las tareas');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Error al eliminar la tarea.'
      );
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Gestión de Tareas</span>
          <button 
            className="btn btn-outline-light ms-auto" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando tareas...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <h2 className="mb-4">Listado de Tareas</h2>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title || '-'}</td>
                    <td>{task.description || '-'}</td>
                    <td>{task.status}</td>
                    <td>{task.createdAt}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;