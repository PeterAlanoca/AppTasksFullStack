import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pendiente',
    dueDate: ''
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userData, setUserData] = useState(null);
  
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
      setError(err.response?.data?.message || err.message || 'Error al cargar las tareas.');
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
      setError(err.response?.data?.message || err.message || 'Error al eliminar la tarea.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const handleCreate = async () => {
    const errors = {};
    if (!newTask.title.trim()) errors.title = 'El título es obligatorio.';
    if (!newTask.description.trim()) errors.description = 'La descripción es obligatoria.';
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
        setNewTask({ title: '', description: '', status: 'Pendiente', dueDate: '' });
        fetchTasks();
      } else {
        setError(response.message || 'Error al crear la tarea');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear la tarea.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  };

  const openEditModal = (task) => {
    setSelectedTask({ ...task, dueDate: task.dueDate || '' });
    setShowEditModal(true);
  };

  const handleEdit = async () => {
    if (!selectedTask.title.trim() || !selectedTask.description.trim()) {
      setFormErrors({
        title: !selectedTask.title.trim() ? 'El título es obligatorio.' : '',
        description: !selectedTask.description.trim() ? 'La descripción es obligatoria.' : ''
      });
      return;
    }

    try {
      setError('');
      const httpResponse = await api.put(`/tasks/${selectedTask.id}`, {
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate || null
      });
      const response = httpResponse.data;
      if (response.success) {
        setShowEditModal(false);
        setSelectedTask(null);
        fetchTasks();
        setToast({
          show: true,
          message: response.message || 'Tarea actualizada correctamente.',
          bg: 'success'
        });
      } else {
        setError(response.message || 'Error al actualizar la tarea');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar la tarea.');
    }
  };

  const handleView = async (id) => {
    try {
      const httpResponse = await api.get(`/tasks/${id}`);
      const response = httpResponse.data;
      if (response.success) {
        setTaskDetails(response.data);
        setShowViewModal(true);
      } else {
        setToast({ show: true, message: response.message || 'No se pudo cargar la tarea.', bg: 'danger' });
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || err.message || 'Error al obtener la tarea.',
        bg: 'danger'
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUserData(response.data.data); 
        setShowUserModal(true);
      }
    } catch (err) {
      setToast({
        show: true,
        message: 'Error al cargar información del usuario',
        bg: 'danger'
      });
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={fetchTasks}>
            Gestión de Tareas
          </span>
          <div className="d-flex">
            <button 
              onClick={fetchUserData}
              className="btn btn-outline-light me-2"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0'
              }}
            >
              <i className="bi bi-person"></i>
            </button>
            
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
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
                isInvalid={!!formErrors.title}
              />
              <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleCreate}>Crear Tarea</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
                  isInvalid={!!formErrors.title}
                />
                <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
                  isInvalid={!!formErrors.description}
                />
                <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={selectedTask.status}
                  onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
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
                  value={selectedTask.dueDate}
                  onChange={(e) => setSelectedTask({ ...selectedTask, dueDate: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleEdit}>Modificar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskDetails && (
            <div>
              <p><strong>ID:</strong> {taskDetails.id}</p>
              <p><strong>Título:</strong> {taskDetails.title}</p>
              <p><strong>Descripción:</strong> {taskDetails.description}</p>
              <p><strong>Estado:</strong> {taskDetails.status}</p>
              <p><strong>Fecha Límite:</strong> {taskDetails.dueDate || 'No especificada'}</p>
              <p><strong>Creado:</strong> {taskDetails.createdAt}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mi Información</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userData && (
            <div>
              <p><strong>ID:</strong> {userData.id}</p>
              <p><strong>Nombre:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            Cerrar
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
              <button className="btn btn-success" onClick={() => setShowModal(true)}>
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
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleView(task.id)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => openEditModal(task)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
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

      <ToastContainer position="top-center" className="p-3">
        <Toast
          bg={toast.bg}
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Dashboard;
