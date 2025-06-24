import React from "react";

const BarraCarga = React.memo(function BarraCarga({ progress = 0, text = "Cargando..." }) {
  return (
    <div
      className="text-center py-4 flex-grow-1 d-flex flex-column align-items-center justify-content-center"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <div className="spinner-border text-primary mb-3" aria-hidden="true"></div>
      <div className="w-100 w-md-50">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`Progreso: ${progress}%`}
          >
            {progress}%
          </div>
        </div>
      </div>
      <div className="mt-2" id="loadingbar-text">
        {text}
      </div>
    </div>
  );
});

export default BarraCarga;
