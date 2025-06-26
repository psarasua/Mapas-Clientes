import React, { useState } from 'react';
import { Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { Toaster, toast } from 'sonner';
import api from '../../services/api';

const SignupForm = ({ onSignup }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await api.post('/auth/signup', { usuario, contrasenia, email });
      toast.success('Usuario registrado correctamente', { closeButton: true });
      setSuccess(true);
      onSignup && onSignup();
    } catch (err) {
      setError(err?.response?.error || err?.message || 'Error en el registro');
      toast.error('Error en el registro', { closeButton: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Toaster position="top-center" />
      <Card style={{ minWidth: 350 }} className="shadow">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Registro de Usuario</Card.Title>
          <Form onSubmit={handleSubmit} autoComplete="on">
            <Form.Group className="mb-3" controlId="signupUsuario">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                placeholder="Ingrese un usuario"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Ingrese su email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="signupContrasenia">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasenia}
                onChange={e => setContrasenia(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Ingrese una contraseña"
              />
            </Form.Group>
            {error && <Alert variant="danger" className="py-1">{error}</Alert>}
            {success && <Alert variant="success" className="py-1">Usuario registrado correctamente</Alert>}
            <div className="d-grid gap-2 mt-3">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Registrarse'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignupForm;
