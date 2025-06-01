import React from 'react';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, User, ShieldAlert } from 'lucide-react';
import './Alerts.css';

const Alerts = () => {
  const { incidentes } = usePage().props;

  return (
    <div className="alerts-dark-container">
      <h1 className="alerts-dark-title">
        <AlertTriangle className="inline-block mr-2 text-yellow-400" size={28} />
        Incidentes Críticos por Procesar
      </h1>

      <div className="alerts-dark-list">
        {incidentes.map((incidente: any) => (
          <div className="alerts-dark-card animate" key={incidente.id}>
            <div className="alerts-dark-header">
              <ShieldAlert size={24} className="text-red-500" />
              <h2 className="alerts-dark-incident-title">{incidente.titulo}</h2>
            </div>
            <p className="alerts-dark-description">{incidente.descripcion}</p>
            <div className="alerts-dark-meta">
              <p>
                <strong className="text-neutral-400">Activo Afectado:</strong>{' '}
                <span>
                  {`${incidente.activo_involucrado || 'Desconocido'}`}
                </span>
              </p>
              <p>
                <User size={16} className="inline-block mr-1 text-indigo-400" />
                <span>{incidente.usuario_email}</span>
              </p>
            </div>
            <div className="alerts-dark-severity">
              <span className={`alerts-dark-tag ${incidente.severidad.toLowerCase()}`}>
                {incidente.severidad.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
