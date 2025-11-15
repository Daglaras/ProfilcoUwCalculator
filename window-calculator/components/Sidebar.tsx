'use client';

import { useState } from 'react';

interface SidebarProps {
  currentPage: 'series' | 'window' | 'config';
  onNavigate: (page: 'series' | 'window' | 'config') => void;
  canNavigateToWindow: boolean;
  canNavigateToConfig: boolean;
}

export default function Sidebar({ currentPage, onNavigate, canNavigateToWindow, canNavigateToConfig }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profilco-mobile-menu-btn"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`profilco-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="profilco-sidebar-header">
          <h2 className="profilco-sidebar-logo">
            Profilco <span>Uw</span>
          </h2>
          <p className="profilco-sidebar-subtitle">Calculator</p>
        </div>

        <nav className="profilco-sidebar-nav">
          <button
            onClick={() => onNavigate('series')}
            className={`profilco-sidebar-item ${currentPage === 'series' ? 'active' : ''}`}
          >
            <span className="profilco-sidebar-icon">🏠</span>
            <div className="profilco-sidebar-text">
              <span className="profilco-sidebar-title">Αρχική</span>
              <span className="profilco-sidebar-desc">Επιλογή Σειράς</span>
            </div>
          </button>

          <button
            onClick={() => canNavigateToWindow && onNavigate('window')}
            disabled={!canNavigateToWindow}
            className={`profilco-sidebar-item ${currentPage === 'window' ? 'active' : ''} ${!canNavigateToWindow ? 'disabled' : ''}`}
          >
            <span className="profilco-sidebar-icon">🪟</span>
            <div className="profilco-sidebar-text">
              <span className="profilco-sidebar-title">Κουφώματα</span>
              <span className="profilco-sidebar-desc">Επιλογή Τύπου</span>
            </div>
            {!canNavigateToWindow && <span className="profilco-lock-icon">🔒</span>}
          </button>

          <button
            onClick={() => canNavigateToConfig && onNavigate('config')}
            disabled={!canNavigateToConfig}
            className={`profilco-sidebar-item ${currentPage === 'config' ? 'active' : ''} ${!canNavigateToConfig ? 'disabled' : ''}`}
          >
            <span className="profilco-sidebar-icon">⚙️</span>
            <div className="profilco-sidebar-text">
              <span className="profilco-sidebar-title">Διαμόρφωση</span>
              <span className="profilco-sidebar-desc">Υπολογισμός</span>
            </div>
            {!canNavigateToConfig && <span className="profilco-lock-icon">🔒</span>}
          </button>
        </nav>

        <div className="profilco-sidebar-footer">
          <div className="profilco-sidebar-info">
            <p className="profilco-sidebar-info-title">Πληροφορίες</p>
            <p className="profilco-sidebar-info-text">
              Υπολογισμός συντελεστή θερμοπερατότητας κουφωμάτων αλουμινίου
            </p>
          </div>
          <div className="profilco-sidebar-contact">
            <a href="https://profilco.gr" target="_blank" rel="noopener noreferrer">
              🌐 profilco.gr
            </a>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="profilco-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}