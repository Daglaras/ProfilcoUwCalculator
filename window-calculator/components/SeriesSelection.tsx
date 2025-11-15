'use client';

interface SeriesSelectionProps {
  onSelect: (type: string) => void;
}

export default function SeriesSelection({ onSelect }: SeriesSelectionProps) {
  return (
    <div>
      <div className="profilco-page-title">
        <h1>Επιλέξτε Σειρά Κουφωμάτων</h1>
        <p>Διαλέξτε μεταξύ ανοιγόμενων και συρόμενων συστημάτων</p>
      </div>

      <div className="profilco-series-grid">
        <div className="profilco-series-card" onClick={() => onSelect('Opening')}>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600"
            alt="Opening Series"
            className="profilco-series-image"
          />
          <div className="profilco-series-content">
            <h2 className="profilco-series-title">🚪 Ανοιγόμενα</h2>
            <p className="profilco-series-subtitle">Opening Series</p>
            <p className="profilco-series-description">
              Παραδοσιακός μηχανισμός ανοίγματος με άριστη στεγανοποίηση και ασφάλεια
            </p>
          </div>
        </div>

        <div className="profilco-series-card" onClick={() => onSelect('Sliding')}>
          <img
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600"
            alt="Sliding Series"
            className="profilco-series-image"
          />
          <div className="profilco-series-content">
            <h2 className="profilco-series-title">↔️ Συρόμενα</h2>
            <p className="profilco-series-subtitle">Sliding Series</p>
            <p className="profilco-series-description">
              Μοντέρνος μηχανισμός ολίσθησης για μεγάλα ανοίγματα και εξοικονόμηση χώρου
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}