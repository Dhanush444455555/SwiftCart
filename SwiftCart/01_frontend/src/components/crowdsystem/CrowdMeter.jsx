import React from 'react';
import './CrowdMeter.css';

/**
 * CrowdMeter — animated crowd level bar
 * Props: percent (0–100), label, color, emoji
 */
const CrowdMeter = ({ percent, label, color, emoji }) => {
  return (
    <div className="crowd-meter">
      <div className="cm-header">
        <span className="cm-emoji">{emoji}</span>
        <span className="cm-label" style={{ color }}>
          {label}
        </span>
        <span className="cm-percent">{percent}%</span>
      </div>
      <div className="cm-track">
        <div
          className="cm-fill"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
      </div>
      <p className="cm-hint">Current store crowd level</p>
    </div>
  );
};

export default CrowdMeter;
