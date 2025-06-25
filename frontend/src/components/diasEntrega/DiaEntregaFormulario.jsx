// DiaEntregaFormulario.jsx
// Formulario para crear o editar un día de entrega.
// Permite ingresar la descripción y gestiona el submit del formulario.

import React, { useCallback, useMemo } from "react";
import { Form, Button, Row, Col, Modal } from "react-bootstrap";

const DiaEntregaFormulario = React.memo(function DiaEntregaFormulario({
  form,
  editId,
  onChange,
  onSubmit,
  ariaLabelledby = "dias-entrega-titulo",
}) {
  // Memoiza el handler de cambio de input
  const handleInputChange = useCallback(
    (e) => {
      onChange({ ...form, descripcion: e.target.value });
    },
    [form, onChange]
  );

  // Memoiza el texto del botón
  const buttonText = useMemo(
    () => (editId ? "Actualizar" : "Agregar"),
    [editId]
  );

  return (
    <Form
      className="mb-4"
      onSubmit={onSubmit}
      aria-labelledby={ariaLabelledby}
      role="form"
    >
      <Row className="g-3">
        <Col md={8}>
          <Form.Label htmlFor="descripcion-dia" visuallyHidden>
            Descripción del día de entrega
          </Form.Label>
          <Form.Control
            id="descripcion-dia"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-label="Descripción del día de entrega"
            autoComplete="off"
          />
        </Col>
        <Col md={4}>
          <Button className="w-100" type="submit" variant="primary">
            {buttonText}
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

export default DiaEntregaFormulario;
