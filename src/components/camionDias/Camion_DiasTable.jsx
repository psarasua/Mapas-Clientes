import { useState, useEffect, useCallback, useMemo } from "react";
import CamionDiasModal from "./CamionDiasModal";
import CamionDiasColumnas from "./CamionDiasColumnas";
import MapaClientesModal from "./MapaClientesModal";
import supabase from "../../supabaseClient";

function CamionesDiasCards() {
  // Estados principales del componente
  const [registros, setRegistros] = useState([]); // Registros de camiones por día
  const [dias, setDias] = useState([]); // Días disponibles
  const [camiones, setCamiones] = useState([]); // Camiones disponibles
  const [modalOpen, setModalOpen] = useState(false); // Estado del modal
  const [editId, setEditId] = useState(null); // ID de edición
  const [form, setForm] = useState({ camion_id: "", dia_id: "" }); // Formulario de camión y día
  const [mensaje, setMensaje] = useState(""); // Mensaje de feedback
  const [mostrarMapa, setMostrarMapa] = useState(false); // Estado del modal de mapa
  const [clientesMapa, setClientesMapa] = useState([]); // Clientes a mostrar en el mapa
  const [clientesAsignados, setClientesAsignados] = useState([]); // Clientes asignados al camión/día
  const [todosClientes, setTodosClientes] = useState([]); // Todos los clientes activos
  const [busqueda, setBusqueda] = useState(""); // Texto de búsqueda de clientes

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    fetchAll();
  }, []);

  // Función para cargar todos los datos principales (memorizada para evitar recreación)
  const fetchAll = useCallback(async () => {
    // Carga registros de camiones_dias con relaciones
    const { data: registrosData } = await supabase
      .from("camiones_dias")
      .select(`
        id,
        camion_id,
        dia_id,
        camiones(descripcion),
        dias_entrega(descripcion),
        clientesAsignados:camion_dias_entrega (
          id,
          cliente_id,
          clientes(nombre, x, y)
        )
      `);
    setRegistros(registrosData || []);

    // Carga días de entrega
    const { data: diasData } = await supabase.from("dias_entrega").select("*");
    setDias(diasData || []);

    // Carga camiones
    const { data: camionesData } = await supabase.from("camiones").select("*");
    setCamiones(camionesData || []);
  }, []);

  // Abre el modal para agregar o editar un registro
  const openModal = useCallback(async (registro = null) => {
    if (registro) {
      setEditId(registro.id);
      setForm({
        camion_id: registro.camion_id,
        dia_id: registro.dia_id,
      });
      // Carga clientes asignados al registro
      setClientesAsignados(
        (registro.clientesAsignados || []).map(ca => ({
          id: ca.id,
          nombre: ca.clientes.nombre,
          x: ca.clientes.x,
          y: ca.clientes.y
        }))
      );
    } else {
      setEditId(null);
      setForm({ camion_id: "", dia_id: "" });
      setClientesAsignados([]);
    }
    setMensaje("");
    setModalOpen(true);

    // Carga todos los clientes solo si aún no están cargados
    if (todosClientes.length === 0) {
      const { data } = await supabase
        .from("clientes")
        .select("id, nombre, razon, codigo_alternativo, x, y")
        .eq("activo", true);
      setTodosClientes(data || []);
    }
  }, [todosClientes.length]);

  // Cierra el modal y limpia mensajes
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setMensaje("");
  }, []);

  // Maneja cambios en los campos del formulario
  const handleChange = useCallback((e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, [form]);

  // Maneja el submit del formulario (agregar o actualizar)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (editId) {
      // Actualiza registro existente
      const { error } = await supabase
        .from("camiones_dias")
        .update(form)
        .eq("id", editId);
      if (error) {
        setMensaje("Error al actualizar: " + error.message);
        return;
      }
      setMensaje("Registro actualizado.");
    } else {
      // Inserta nuevo registro
      const { error } = await supabase
        .from("camiones_dias")
        .insert([form]);
      if (error) {
        setMensaje("Error al agregar: " + error.message);
        return;
      }
      setMensaje("Registro agregado.");
    }
    fetchAll(); // Refresca datos
    setTimeout(closeModal, 1000); // Cierra modal tras feedback
  }, [editId, form, fetchAll, closeModal]);

  // Elimina un registro de camión/día
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      const { error } = await supabase
        .from("camiones_dias")
        .delete()
        .eq("id", id);
      if (!error) {
        fetchAll();
      }
    }
  }, [fetchAll]);

  // Muestra el mapa con los clientes asignados a un camión/día
  const handleVerMapa = useCallback((cd) => {
    const clientes = (cd.clientesAsignados || [])
      .filter(ca => ca.clientes && ca.clientes.x && ca.clientes.y)
      .map(ca => ({
        id: ca.id,
        nombre: ca.clientes.nombre,
        x: ca.clientes.x,
        y: ca.clientes.y
      }));
    setClientesMapa(clientes);
    setMostrarMapa(true);
  }, []);

  // Agrega un cliente al camión/día actual
  const agregarCliente = useCallback(async (cliente) => {
    if (!editId) return;
    await supabase.from("camion_dias_entrega").insert([
      { camion_dia: editId, cliente_id: cliente.id }
    ]);
    // Actualiza la lista localmente para feedback inmediato
    setClientesAsignados(prev => [...prev, cliente]);
  }, [editId]);

  // Elimina un cliente asignado del camión/día actual
  const eliminarCliente = useCallback(async (clienteId) => {
    if (!editId) return;
    await supabase
      .from("camion_dias_entrega")
      .delete()
      .eq("camion_dia", editId)
      .eq("cliente_id", clienteId);
    setClientesAsignados(prev => prev.filter(c => c.id !== clienteId));
  }, [editId]);

  // Agrupa los registros por día y los ordena por id (memorizado para evitar cálculos innecesarios)
  const columnasPorDia = useMemo(() =>
    dias.map((dia) => {
      const registrosDelDia = registros
        .filter((r) => r.dia_id === dia.id)
        .sort((a, b) => a.id - b.id);
      return { ...dia, registros: registrosDelDia };
    }), [dias, registros]
  );

  // Limpia y normaliza el texto de búsqueda
  const busquedaLimpia = useMemo(() => busqueda.trim().toLowerCase(), [busqueda]);

  // Filtra los clientes según la búsqueda (memorizado)
  const clientesFiltrados = useMemo(() =>
    todosClientes.filter(
      c =>
        c &&
        (
          (c.nombre && c.nombre.toLowerCase().includes(busquedaLimpia)) ||
          (c.razon && c.razon.toLowerCase().includes(busquedaLimpia)) ||
          (c.codigo_alternativo &&
            c.codigo_alternativo.toString().toLowerCase().includes(busquedaLimpia))
        )
    ), [todosClientes, busquedaLimpia]
  );

  // Render principal del componente
  return (
    <div>
      <h2>Camiones agrupados por día (columnas)</h2>
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Agregar registro
      </button>
      <CamionDiasColumnas
        columnasPorDia={columnasPorDia}
        onVerMapa={handleVerMapa}
        onEditar={openModal}
        onEliminar={handleDelete}
      />
      {modalOpen && (
        <CamionDiasModal
          editId={editId}
          form={form}
          camiones={camiones}
          dias={dias}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          clientesAsignados={clientesAsignados}
          eliminarCliente={eliminarCliente}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          clientesFiltrados={clientesFiltrados}
          agregarCliente={agregarCliente}
          mensaje={mensaje}
        />
      )}
      {mostrarMapa && (
        <MapaClientesModal
          clientes={clientesMapa}
          onClose={() => setMostrarMapa(false)}
        />
      )}
    </div>
  );
}

export default CamionesDiasCards;
