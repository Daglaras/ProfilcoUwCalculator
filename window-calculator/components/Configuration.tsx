'use client';

import { useState } from 'react';
import { cases, profiles, slidingSeries, openingSeries } from '../lib/data';

interface ConfigurationProps {
  window: any;
  seriesType: string;
  onBack: () => void;
}

export default function Configuration({ window, seriesType, onBack }: ConfigurationProps) {
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [ugValue, setUgValue] = useState(1.0);
  const [psiValue, setPsiValue] = useState(0.05);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seriesOptions = seriesType === 'Sliding' ? slidingSeries : openingSeries;
  const compatibleCases = window.compatible_cases.map((i: number) => cases[i]);
  const compatibleProfiles = window.compatible_profiles.map((i: number) => profiles[i]);

  const handleCalculate = async () => {
    if (!selectedSeries || !selectedCase || !selectedProfile) return;

    setLoading(true);
    setError(null);
    
    const caseIndex = window.compatible_cases[compatibleCases.indexOf(selectedCase)];
    const profileIndex = window.compatible_profiles[compatibleProfiles.indexOf(selectedProfile)];

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          window,
          series: selectedSeries,
          case_index: caseIndex,
          profile_index: profileIndex,
          ug_value: ugValue,
          psi_value: psiValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }

      const data = await response.json();
      
      if (!data || typeof data.Uw === 'undefined') {
        throw new Error('Invalid response from server');
      }
      
      setResults(data);
    } catch (error: any) {
      console.error('Calculation error:', error);
      setError(error.message || 'Σφάλμα υπολογισμού. Βεβαιωθείτε ότι το backend τρέχει.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="profilco-button profilco-button-secondary" style={{ marginBottom: '2rem' }}>
        ← Πίσω στην Επιλογή Κουφώματος
      </button>

      <div className="profilco-page-title">
        <h1>Διαμόρφωση Κουφώματος</h1>
        <p>Κούφωμα: <strong>{window.name}</strong> | {window.length}m × {window.height}m</p>
      </div>

      <div className="profilco-form-card">
        <div className="profilco-form-grid">
          <div>
            <div className="profilco-form-group">
              <label className="profilco-label">🔧 Σειρά</label>
              <select
                className="profilco-select"
                onChange={(e) => setSelectedSeries(seriesOptions[parseInt(e.target.value)])}
              >
                <option value="">Επιλέξτε Σειρά...</option>
                {seriesOptions.map((s: any, i: number) => (
                  <option key={i} value={i}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="profilco-form-group">
              <label className="profilco-label">📦 Κάσα</label>
              <select
                className="profilco-select"
                onChange={(e) => setSelectedCase(compatibleCases[parseInt(e.target.value)])}
              >
                <option value="">Επιλέξτε Κάσα...</option>
                {compatibleCases.map((c: any, i: number) => (
                  <option key={i} value={i}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="profilco-form-group">
              <label className="profilco-label">🔩 Προφίλ</label>
              <select
                className="profilco-select"
                onChange={(e) => setSelectedProfile(compatibleProfiles[parseInt(e.target.value)])}
              >
                <option value="">Επιλέξτε Προφίλ...</option>
                {compatibleProfiles.map((p: any, i: number) => (
                  <option key={i} value={i}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="profilco-form-group">
              <label className="profilco-label">🌡️ Τιμή UG (W/m²K)</label>
              <input
                type="number"
                step="0.1"
                value={ugValue}
                onChange={(e) => setUgValue(parseFloat(e.target.value))}
                className="profilco-input"
              />
            </div>

            <div className="profilco-form-group">
              <label className="profilco-label">🔗 Τιμή Ψ (W/mK)</label>
              <select
                className="profilco-select"
                value={psiValue}
                onChange={(e) => setPsiValue(parseFloat(e.target.value))}
              >
                <option value={0.05}>0.05</option>
                <option value={0.08}>0.08</option>
                <option value={0.11}>0.11</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="profilco-error-message" style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          ⚠️ {error}
        </div>
      )}

      <button
        onClick={handleCalculate}
        disabled={!selectedSeries || !selectedCase || !selectedProfile || loading}
        className="profilco-button profilco-button-primary profilco-button-full"
      >
        {loading ? (
          <>
            <span className="profilco-loading"></span>
            Υπολογισμός...
          </>
        ) : (
          '🔍 Υπολογισμός Αποτελεσμάτων'
        )}
      </button>

      {results && (
        <>
          <div className="profilco-result-hero">
            <div className="profilco-result-value">
              Uw = {results.Uw.toFixed(4)} W/m²K
            </div>
            <div className="profilco-result-label">
              Συνολικός Συντελεστής Θερμοπερατότητας
            </div>
          </div>

          <div className="profilco-metrics-grid">
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Ύψος Υαλοπίνακα</div>
              <div className="profilco-metric-value">{results.glass_height.toFixed(4)} m</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Μήκος Υαλοπίνακα</div>
              <div className="profilco-metric-value">{results.glass_length.toFixed(4)} m</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Επιφάνεια Υαλοπίνακα</div>
              <div className="profilco-metric-value">{results.glass_area.toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Ύψος Πλαισίου</div>
              <div className="profilco-metric-value">{results.plaisio_height.toFixed(4)} m</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Μήκος Πλαισίου</div>
              <div className="profilco-metric-value">{results.plaisio_length.toFixed(4)} m</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Ag (Επιφάνεια Πλαισίου)</div>
              <div className="profilco-metric-value">{results.Ag.toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Επιφάνεια Κάσας (Af)</div>
              <div className="profilco-metric-value">{results.Af.toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Af1</div>
              <div className="profilco-metric-value">{results.Af1.toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Af2</div>
              <div className="profilco-metric-value">{results.Af2.toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Ig (Περίμετρος)</div>
              <div className="profilco-metric-value">{results.Ig.toFixed(4)} m</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Επιφάνεια Κουφώματος</div>
              <div className="profilco-metric-value">{(window.length * window.height).toFixed(4)} m²</div>
            </div>
            <div className="profilco-metric-card">
              <div className="profilco-metric-label">Γάντζος</div>
              <div className="profilco-metric-value">{results.has_hook ? 'Ναι' : 'Όχι'}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}