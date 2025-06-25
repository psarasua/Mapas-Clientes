// ClienteModalFormulario.jsx
// Modal con formulario para crear o editar un cliente.
// Permite ingresar y modificar datos, incluyendo coordenadas en el mapa.
// Incluye validaciones y sincronización de estado.

import React, { useEffect, useState } from "react";
import SelectorCoordenadasMapa from "./SelectorCoordenadasMapa";
import { apiFetch } from '../../services/api';
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";

const camposVacios = {
  codigo_alternativo: "",
  nombre: "",
  razon: "",
  direccion: "",
  telefono: "",
  rut: "",
  activo: true,
  x: "",
  y: "",
};

const ClientesPanelModalEditar = ({
  showEditModal,
  clienteEdit,
  setShowEditModal,
  setClienteEdit,
  fetchClientes,
}) => {
  // Detectar modo
  const esAlta = !clienteEdit;

  // Estado local del formulario
  const [form, setForm] = useState(esAlta ? camposVacios : clienteEdit);

  // Sincronizar cuando cambia clienteEdit o se abre el modal
  useEffect(() => {
    setForm(esAlta ? camposVacios : clienteEdit);
  }, [clienteEdit, showEditModal, esAlta]);

  if (!showEditModal) return null;
  if (!form) {
    return (
      <Alert variant="warning" className="text-center my-4" role="status" aria-live="polite">
        No hay datos del cliente para mostrar o editar.
      </Alert>
    );
  }

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (!esAlta && setClienteEdit) {
      setClienteEdit((prev) => ({ ...prev, [campo]: valor }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (esAlta) {
      await apiFetch('/clientes', {
        method: 'POST',
        body: JSON.stringify(form)
      });
    } else {
      await apiFetch(`/clientes/${form.id}`, {
        method: 'PUT',
        body: JSON.stringify(form)
      });
    }
    fetchClientes();
    setShowEditModal(false);
    if (setClienteEdit) setClienteEdit(null);
  };

  return (
    <Modal
      show={showEditModal}
      onHide={() => {
        setShowEditModal(false);
        if (setClienteEdit) setClienteEdit(null);
      }}
      size="lg"
      centered
      aria-labelledby="cliente-modal-titulo"
    >
      <Modal.Header closeButton>
        <Modal.Title id="cliente-modal-titulo">
          {esAlta ? "Crear Cliente" : "Editar Cliente"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="codigo_alternativo" className="d-flex align-items-center">
                <i className="bi bi-upc me-2"></i>
                Código Alternativo
              </Form.Label>
              <Form.Control
                id="codigo_alternativo"
                value={form.codigo_alternativo || ""}
                onChange={e => handleChange("codigo_alternativo", e.target.value)}
                aria-label="Código alternativo"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="nombre" className="d-flex align-items-center">
                <i className="bi bi-person-fill me-2"></i>
                Nombre
              </Form.Label>
              <Form.Control
                id="nombre"
                value={form.nombre || ""}
                onChange={e => handleChange("nombre", e.target.value)}
                required
                aria-required="true"
                aria-label="Nombre"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="razon" className="d-flex align-items-center">
                <i className="bi bi-briefcase-fill me-2"></i>
                Razón
              </Form.Label>
              <Form.Control
                id="razon"
                value={form.razon || ""}
                onChange={e => handleChange("razon", e.target.value)}
                aria-label="Razón"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="direccion" className="d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Dirección
              </Form.Label>
              <Form.Control
                id="direccion"
                value={form.direccion || ""}
                onChange={e => handleChange("direccion", e.target.value)}
                aria-label="Dirección"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="telefono" className="d-flex align-items-center">
                <i className="bi bi-telephone-fill me-2"></i>
                Teléfono
              </Form.Label>
              <Form.Control
                id="telefono"
                value={form.telefono || ""}
                onChange={e => handleChange("telefono", e.target.value)}
                aria-label="Teléfono"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="rut" className="d-flex align-items-center">
                <i className="bi bi-card-text me-2"></i>
                RUT
              </Form.Label>
              <Form.Control
                id="rut"
                value={form.rut || ""}
                onChange={e => handleChange("rut", e.target.value)}
                aria-label="RUT"
                autoComplete="off"
              />
            </Col>
            {!esAlta && (
              <Col md={6} className="mb-3">
                <Form.Label htmlFor="activo" className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Activo
                </Form.Label>
                <Form.Select
                  id="activo"
                  value={form.activo ? "true" : "false"}
                  onChange={e => handleChange("activo", e.target.value === "true")}
                  aria-label="Activo"
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </Form.Select>
              </Col>
            )}
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="coordenada_x" className="d-flex align-items-center">
                <i className="bi bi-geo me-2"></i>
                Coordenada X (Longitud)
              </Form.Label>
              <Form.Control
                id="coordenada_x"
                type="number"
                step="any"
                value={form.x || ""}
                onChange={e => handleChange("x", e.target.value)}
                aria-label="Coordenada X (Longitud)"
                autoComplete="off"
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label htmlFor="coordenada_y" className="d-flex align-items-center">
                <i className="bi bi-geo me-2"></i>
                Coordenada Y (Latitud)
              </Form.Label>
              <Form.Control
                id="coordenada_y"
                type="number"
                step="any"
                value={form.y || ""}
                onChange={e => handleChange("y", e.target.value)}
                aria-label="Coordenada Y (Latitud)"
                autoComplete="off"
              />
            </Col>
            <Col xs={12} className="mb-3">
              <Form.Label htmlFor="selector-coordenadas" className="d-flex align-items-center">
                <i className="bi bi-map me-2"></i>
                Seleccionar ubicación en el mapa
              </Form.Label>
              <SelectorCoordenadasMapa
                id="selector-coordenadas"
                value={{ x: form.x, y: form.y }}
                onChange={({ x, y }) => handleChange("x", x) || handleChange("y", y)}
              />
            </Col>
          </Row>
          <div className="text-end">
            <Button type="submit" variant="primary">
              {esAlta ? "Crear Cliente" : "Guardar Cambios"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClientesPanelModalEditar;
