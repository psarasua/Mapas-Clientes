import React from "react";
import { Button, Card } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../services/api";

const ConfiguracionPanel = () => {
  const verificarBackend = async () => {
    try {
      await apiFetch("/ping");
      toast.success("Conexión al backend exitosa", { closeButton: true });
    } catch {
      toast.error("No se pudo conectar al backend", { closeButton: true });
    }
  };

  const verificarDB = async () => {
    try {
      const res = await apiFetch("/ping?db=1");
      if (res && res.db) {
        toast.success("Conexión a la base de datos exitosa", { closeButton: true });
      } else {
        throw new Error();
      }
    } catch {
      toast.error("No se pudo conectar a la base de datos", { closeButton: true });
    }
  };

  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>Configuración y Diagnóstico</Card.Title>
        <Button variant="primary" className="me-2" onClick={verificarBackend}>
          Verificar conexión al backend
        </Button>
        <Button variant="success" onClick={verificarDB}>
          Verificar conexión a la base de datos
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ConfiguracionPanel;
