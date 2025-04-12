import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin' },
    { id: 2, nombre: 'María García', email: 'maria@example.com', rol: 'Usuario' },
    { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Usuario' },
  ]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* Navbar solo en Dashboard */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand">Dashboard</span>
          <button 
            className="btn btn-outline-light ms-auto" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido de la tabla */}
      <div className="container mt-4">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>{item.email}</td>
                <td>{item.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;