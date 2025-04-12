import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="text-primary">¡Hola Mundo!</h1>
      <p className="lead">Ahora con Bootstrap 🎨</p>
      
      <button className="btn btn-success mx-2">
        Botón primario
      </button>
      
      <button className="btn btn-outline-danger mx-2">
        Botón secundario
      </button>

      <div className="alert alert-warning mt-4">
        Esto es una alerta de Bootstrap.
      </div>
    </div>
  );
}

export default App;
