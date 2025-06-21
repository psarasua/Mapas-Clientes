import React from "react";

const LoadingBar = React.memo(function LoadingBar({ progress = 0, text = "Cargando..." }) {
  return (
    <div className="text-center py-4 flex-grow-1 d-flex flex-column align-items-center justify-content-center">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <div className="w-50">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
      </div>
      <div className="mt-2">{text}</div>
    </div>
  );
});

export default LoadingBar;