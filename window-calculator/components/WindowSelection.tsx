'use client';

import { windowTypes } from '../lib/data';

interface WindowSelectionProps {
  seriesType: string;
  onBack: () => void;
  onSelect: (window: any) => void;
}

export default function WindowSelection({ seriesType, onBack, onSelect }: WindowSelectionProps) {
  const availableWindows = windowTypes.filter(w => w.series_type === seriesType);

  return (
    <div>
      <button onClick={onBack} className="profilco-button profilco-button-secondary" style={{ marginBottom: '2rem' }}>
        ← Πίσω στην Επιλογή Σειράς
      </button>

      <div className="profilco-page-title">
        <h1>Επιλέξτε Τύπο Κουφώματος</h1>
        <p>Σειρά: <strong>{seriesType === 'Sliding' ? 'Συρόμενα' : 'Ανοιγόμενα'}</strong></p>
      </div>

      <div className="profilco-window-grid">
        {availableWindows.map((window) => (
          <div
            key={window.name}
            className="profilco-window-card"
            onClick={() => onSelect(window)}
          >
            <h3 className="profilco-window-title">📐 {window.name}</h3>
            <div className="profilco-window-specs">
              <div className="profilco-spec-item">
                <span className="profilco-spec-label">Διαστάσεις</span>
                <span className="profilco-spec-value">{window.length}m × {window.height}m</span>
              </div>
              <div className="profilco-spec-item">
                <span className="profilco-spec-label">Αριθμός Φύλλων</span>
                <span className="profilco-spec-value">{window.num_windows}</span>
              </div>
              <div className="profilco-spec-item">
                <span className="profilco-spec-label">Τύπος</span>
                <span className="profilco-spec-value">{window.series_type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}