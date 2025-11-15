'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SeriesSelection from '../components/SeriesSelection';
import WindowSelection from '../components/WindowSelection';
import Configuration from '../components/Configuration';

export default function Home() {
  const [page, setPage] = useState<'series' | 'window' | 'config'>('series');
  const [selectedSeriesType, setSelectedSeriesType] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<any>(null);

  const handleNavigate = (newPage: 'series' | 'window' | 'config') => {
    if (newPage === 'series') {
      setPage('series');
    } else if (newPage === 'window' && selectedSeriesType) {
      setPage('window');
    } else if (newPage === 'config' && selectedWindow) {
      setPage('config');
    }
  };

  return (
    <>
      <Sidebar
        currentPage={page}
        onNavigate={handleNavigate}
        canNavigateToWindow={selectedSeriesType !== null}
        canNavigateToConfig={selectedWindow !== null}
      />

      <div className="profilco-main-with-sidebar">
        <header className="profilco-header profilco-header-with-sidebar">
          <div className="profilco-container">
            <h1 className="profilco-logo">
              Profilco <span>Uw Calculator</span>
            </h1>
          </div>
        </header>

        <main className="profilco-container">
          {page === 'series' && (
            <SeriesSelection
              onSelect={(type) => {
                setSelectedSeriesType(type);
                setPage('window');
              }}
            />
          )}
          
          {page === 'window' && selectedSeriesType && (
            <WindowSelection
              seriesType={selectedSeriesType}
              onBack={() => setPage('series')}
              onSelect={(window) => {
                setSelectedWindow(window);
                setPage('config');
              }}
            />
          )}
          
          {page === 'config' && selectedWindow && selectedSeriesType && (
            <Configuration
              window={selectedWindow}
              seriesType={selectedSeriesType}
              onBack={() => setPage('window')}
            />
          )}
        </main>
      </div>
    </>
  );
}