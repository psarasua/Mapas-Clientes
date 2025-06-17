import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

function CamionDiaDetalle() {
  const { id } = useParams();
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      const { data, error } = await supabase
        .from("camion_dias_entrega")
        .select(`
          id,
          cliente_id,
          clientes(nombre),
          camion_dia,          
          camiones_dias(
            id,
            camion_id,
            dia_id,
            camiones(descripcion),
            dias_entrega(descripcion)
          )
        `)
        .eq("id", id)
        .single();
      setDetalle(data);
      setLoading(false);
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!detalle) return <div>No se encontró el registro.</div>;

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h4>Detalle de Asignación</h4>
      </div>
      <div className="card-body">
        <p><strong>Cliente:</strong> {detalle.clientes?.nombre || detalle.cliente_id}</p>
        <p><strong>Camión:</strong> {detalle.camiones_dias?.camiones?.descripcion || detalle.camiones_dias?.camion_id}</p>
        <p><strong>Día de Entrega:</strong> {detalle.camiones_dias?.dias_entrega?.descripcion || detalle.camiones_dias?.dia_id}</p>
      </div>
    </div>
  );
}

export default CamionDiaDetalle;