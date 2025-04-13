import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    dueDate: ''
  });

  const fetchTasks = async () => {
    try {
      setError('');
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

  useEffect(() => {
    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleDelete = async (id) => {
    try {
      setError('');
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

  const handleCreate = async () => {
    const errors = {};
    if (!newTask.title.trim()) {
      errors.title = 'El título es obligatorio.';
    }
    if (!newTask.description.trim()) {
      errors.description = 'La descripción es obligatoria.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError('');
      setFormErrors({});

      const request = {
        ...newTask,
        dueDate: newTask.dueDate || null
      };
      const httpResponse = await api.post('/tasks', request);
      const response = httpResponse.data;
      if (response.success) {
        setShowModal(false);
        setNewTask({
          title: '',
          description: '',
          status: 'Pendiente',
          dueDate: ''
        });
        fetchTasks();
      } else {
        setError(response.message || 'Error al crear la tarea');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Error al crear la tarea.'
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
          <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={fetchTasks}>
            Gestión de Tareas
          </span>
          <button
            className="btn btn-outline-light ms-auto"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ingrese el título"
                isInvalid={!!formErrors.title}
              />
              {formErrors.title && <small className="text-danger">{formErrors.title}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Ingrese la descripción"
                isInvalid={!!formErrors.description}
              />
              {formErrors.description && <small className="text-danger">{formErrors.description}</small>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha Límite</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Crear Tarea
          </Button>
        </Modal.Footer>
      </Modal>

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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Listado de Tareas</h2>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
              >
                <i className="bi bi-plus-circle"></i> Nueva Tarea
              </button>
            </div>
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
