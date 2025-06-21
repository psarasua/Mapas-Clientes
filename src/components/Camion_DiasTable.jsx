import { useEffect, useState, useCallback, useMemo } from "react"; // Importa useCallback y useMemo para optimizaciones
import supabase from "../supabaseClient";
import MapaClientes from "./MapaClientes";

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
      {/* Botón para abrir modal de agregar */}
      <button className="btn btn-success mb-3" onClick={() => openModal()}>
        Agregar registro
      </button>

      {/* Columnas por día */}
      <div className="row">
        {columnasPorDia.map((dia) => (
          <div className="col" key={dia.id}>
            <h5 className="text-center">{dia.descripcion}</h5>
            {dia.registros.map((cd) => (
              <div className="card mb-3" key={cd.id}>
                <div className="card-body">
                  <h6 className="card-title">
                    {cd.camiones?.descripcion || cd.camion_id}
                  </h6>
                  <p className="card-text">
                    <strong>Total de clientes:</strong> {cd.clientesAsignados?.length || 0}
                  </p>
                  <div className="d-flex gap-2 mt-2">
                    {/* Botón para ver mapa */}
                    <button className="btn btn-info btn-sm" onClick={() => handleVerMapa(cd)}>
                      Ver Mapa
                    </button>
                    {/* Botón para editar */}
                    <button className="btn btn-warning btn-sm" onClick={() => openModal(cd)}>
                      Editar
                    </button>
                    {/* Botón para eliminar */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(cd.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Mensaje si no hay camiones ese día */}
            {dia.registros.length === 0 && (
              <div className="text-muted text-center">Sin camiones</div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de agregar/editar */}
      {modalOpen && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Editar" : "Agregar"} registro
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Selector de camión */}
                  <div className="mb-3">
                    <label className="form-label">Camión:</label>
                    <select
                      className="form-select"
                      name="camion_id"
                      value={form.camion_id}
                      onChange={handleChange}
                      required
                      disabled={!!editId}
                    >
                      <option value="">Seleccione</option>
                      {camiones.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Selector de día */}
                  <div className="mb-3">
                    <label className="form-label">Día:</label>
                    <select
                      className="form-select"
                      name="dia_id"
                      value={form.dia_id}
                      onChange={handleChange}
                      required
                      disabled={!!editId}
                    >
                      <option value="">Seleccione</option>
                      {dias.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Lista de clientes asignados */}
                  <div className="mb-3">
                    <label className="form-label">Clientes asignados:</label>
                    <ul className="list-group mb-2">
                      {clientesAsignados.map((c) => (
                        <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                          {c.nombre}
                          <button className="btn btn-sm btn-danger" type="button" onClick={() => eliminarCliente(c.id)}>
                            Eliminar
                          </button>
                        </li>
                      ))}
                      {clientesAsignados.length === 0 && (
                        <li className="list-group-item text-muted">Sin clientes asignados</li>
                      )}
                    </ul>
                    {/* Buscador de clientes */}
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Buscar cliente por nombre o razón..."
                      value={busqueda}
                      onChange={e => setBusqueda(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}
                    />
                    {/* Resultados de búsqueda */}
                    {busquedaLimpia.length > 0 && (
                      <ul className="list-group">
                        {clientesFiltrados.length > 0 ? (
                          clientesFiltrados.map(c => {
                            const yaAsignado = clientesAsignados.some(a => a.id === c.id);
                            return (
                              <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {c.nombre} {c.razon && <span className="text-muted">({c.razon})</span>}
                                {yaAsignado ? (
                                  <button className="btn btn-sm btn-secondary" disabled>
                                    Ya asignado
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => agregarCliente(c)}
                                  >
                                    Agregar
                                  </button>
                                )}
                              </li>
                            );
                          })
                        ) : (
                          <li className="list-group-item text-muted">Sin resultados</li>
                        )}
                      </ul>
                    )}
                  </div>
                  {/* Mensaje de feedback */}
                  {mensaje && (
                    <div className="alert alert-info">{mensaje}</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Actualizar" : "Agregar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal del mapa */}
      {mostrarMapa && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mapa de Clientes</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarMapa(false)}></button>
              </div>
              <div className="modal-body" style={{ height: 500 }}>
                <MapaClientes clientes={clientesMapa} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CamionesDiasCards;
