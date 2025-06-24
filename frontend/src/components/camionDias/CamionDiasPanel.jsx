// CamionDiasPanel.jsx
// Panel principal para gestionar la asignación de camiones a días.
// Permite ver, crear, editar y eliminar asignaciones, así como visualizar clientes en el mapa.
// Maneja el estado y la lógica de interacción de la vista principal.

import React, { useState, useEffect, useCallback, useMemo } from "react";
import CamionDiasColumnasLista from "./CamionDiasColumnasLista";
import CamionDiaModalFormulario from "./CamionDiaModalFormulario";
import CamionDiaMapaModal from "./CamionDiaMapaModal";
import BarraCarga from "../ui/BarraCarga";

const CamionDiasPanel = () => {
  const [columnasPorDia, setColumnasPorDia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalMapaAbierto, setModalMapaAbierto] = useState(false);
  const [registroEdit, setRegistroEdit] = useState(null);
  const [clientesMapa, setClientesMapa] = useState([]);

  // Simulación de fetch inicial
  useEffect(() => {
    setLoading(true);
    // Aquí iría la llamada real a la API
    setTimeout(() => {
      setColumnasPorDia([
        {
          id: 1,
          descripcion: "Lunes",
          registros: [],
        },
        {
          id: 2,
          descripcion: "Martes",
          registros: [],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleVerMapa = useCallback((cd) => {
    setClientesMapa(cd.clientesAsignados || []);
    setModalMapaAbierto(true);
  }, []);

  const handleEditar = useCallback((cd) => {
    setRegistroEdit(cd);
    setModalAbierto(true);
  }, []);

  const handleEliminar = useCallback((id) => {
    // Aquí iría la lógica de eliminación
    setColumnasPorDia((prev) =>
      prev.map((col) => ({
        ...col,
        registros: col.registros.filter((r) => r.id !== id),
      }))
    );
  }, []);

  const handleCerrarModal = useCallback(() => {
    setModalAbierto(false);
    setRegistroEdit(null);
  }, []);

  const handleCerrarMapa = useCallback(() => {
    setModalMapaAbierto(false);
    setClientesMapa([]);
  }, []);

  return (
    <div className="container-fluid py-3">
      <h2 className="mb-4" id="camion-dias-titulo">Gestión de Camiones por Día</h2>
      {loading && <BarraCarga />}
      <CamionDiasColumnasLista
        columnasPorDia={columnasPorDia}
        onVerMapa={handleVerMapa}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />
      {modalAbierto && (
        <CamionDiaModalFormulario
          editId={registroEdit?.id}
          form={registroEdit}
          closeModal={handleCerrarModal}
          // ...otros props necesarios...
        />
      )}
      {modalMapaAbierto && (
        <CamionDiaMapaModal clientes={clientesMapa} onClose={handleCerrarMapa} />
      )}
    </div>
  );
};

export default React.memo(CamionDiasPanel);
