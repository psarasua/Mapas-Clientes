// CamionDiaModalFormulario.jsx
// Modal con formulario para crear o editar la asignación de un camión a un día.
// Permite seleccionar camión, día y gestionar clientes asignados.
// Incluye validaciones y mensajes informativos.

import React, { useCallback } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import ClientesAsignadosLista from "./ClientesAsignadosLista";

const CamionDiaModalFormulario = React.memo(function CamionDiaModalFormulario({
  editId,
  form = {},
  camiones = [],
  dias = [],
  handleChange = () => {},
  handleSubmit = () => {},
  closeModal = () => {},
  clientesAsignados = [],
  eliminarCliente = () => {},
  busqueda = "",
  setBusqueda = () => {},
  clientesFiltrados = [],
  agregarCliente = () => {},
  mensaje = "",
  role = "dialog",
  ariaModal = "true",
  ariaLabelledby = "modal-titulo",
}) {
  const onFormChange = useCallback(
    (e) => handleChange(e),
    [handleChange]
  );
  const onFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );
  return (
    <Modal show={true} onHide={closeModal} size="lg" centered role={role} aria-modal={ariaModal} aria-labelledby={ariaLabelledby}>
      <Modal.Header closeButton>
        <Modal.Title id={ariaLabelledby}>{editId ? "Editar" : "Nuevo"} Camión Día</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onFormSubmit} autoComplete="off">
        <Modal.Body>
          {mensaje && <Alert variant="info">{mensaje}</Alert>}
          <div className="mb-3">
            <Form.Label>Camión</Form.Label>
            <Form.Select name="camion_id" value={form.camion_id || ""} onChange={onFormChange} required>
              <option value="">Seleccione un camión</option>
              {camiones.map((c) => (
                <option key={c.id} value={c.id}>{c.descripcion}</option>
              ))}
            </Form.Select>
          </div>
          <div className="mb-3">
            <Form.Label>Día</Form.Label>
            <Form.Select name="dia_id" value={form.dia_id || ""} onChange={onFormChange} required>
              <option value="">Seleccione un día</option>
              {dias.map((d) => (
                <option key={d.id} value={d.id}>{d.descripcion}</option>
              ))}
            </Form.Select>
          </div>
          <div className="mb-3">
            <Form.Label>Clientes asignados</Form.Label>
            <ClientesAsignadosLista
              clientesAsignados={clientesAsignados}
              eliminarCliente={eliminarCliente}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              clientesFiltrados={clientesFiltrados}
              agregarCliente={agregarCliente}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button type="submit" variant="primary">{editId ? "Guardar cambios" : "Crear"}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});

export default CamionDiaModalFormulario;
