import React, { useMemo } from "react";

const Dashboard = React.memo(function Dashboard() {
  // Memoiza el contenido del dashboard (útil si luego agregas lógica)
  const content = useMemo(
    () => (
      <div className="container-fluid mt-4">
        <h3>Sin información</h3>
      </div>
    ),
    []
  );

  return content;
});

export default Dashboard;