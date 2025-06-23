import React, { useMemo } from "react";

const PanelPrincipal = React.memo(function PanelPrincipal() {
  // Memoiza el contenido del dashboard (útil si luego agregas lógica)
  const content = useMemo(
    () => (
      <main
        className="container-fluid mt-4 d-flex flex-column align-items-center justify-content-center"
        role="main"
        aria-label="Panel principal"
        tabIndex={0}
      >
        <h3 id="dashboard-titulo" tabIndex={0}>
          Sin información
        </h3>
        {/* Puedes agregar aquí widgets o tarjetas informativas en el futuro */}
      </main>
    ),
    []
  );

  return content;
});

export default PanelPrincipal;