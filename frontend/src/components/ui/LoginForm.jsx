import React, { useState } from 'react';
import { Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginForm = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { usuario, contrasenia });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        toast.success('¡Bienvenido!', { closeButton: true });
        onLogin && onLogin();
      } else {
        setError('Respuesta inesperada del servidor.');
      }
    } catch (err) {
      setError(err?.message || 'Error de autenticación');
      toast.error('Error de autenticación', { closeButton: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Toaster position="top-center" />
      <Card style={{ minWidth: 350 }} className="shadow">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Iniciar Sesión</Card.Title>
          <Form onSubmit={handleSubmit} autoComplete="on">
            <Form.Group className="mb-3" controlId="loginUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                placeholder="Ingrese su usuario"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginContrasenia">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasenia}
                onChange={e => setContrasenia(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Ingrese su contraseña"
              />
            </Form.Group>
            {error && <Alert variant="danger" className="py-1">{error}</Alert>}
            <div className="d-grid gap-2 mt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Ingresar'}
              </Button>
              <Button variant="outline-secondary" type="button" onClick={() => navigate('/signup')}>
                ¿No tienes cuenta? Registrate
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
