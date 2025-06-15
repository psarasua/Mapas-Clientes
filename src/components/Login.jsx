import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // 1. Buscar el email asociado al usuario
    const { data, error } = await supabase
      .from("usuarios")
      .select("email")
      .eq("usuario", usuario)
      .single();
    console.log("Resultado consulta:", data, error);

    if (error || !data) {
      setErrorMsg("Usuario no encontrado.");
      setLoading(false);
      return;
    }

    // 2. Login con email y password
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setErrorMsg("Usuario o contraseña incorrectos.");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}