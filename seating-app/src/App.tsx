import { useState } from 'react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { VenueCanvas } from './components/Venue/VenueCanvas';
import { TableModal } from './components/Table/TableModal';
import { ChairModal } from './components/Chair/ChairModal';
import { useVenueStore } from './store/venueStore';
import { useSelectedEntities } from './hooks/useSelectedEntities';
import './App.css';

function App() {
  const {
    isTableModalOpen,
    isChairModalOpen,
    closeTableModal,
    closeChairModal,
  } = useVenueStore();

  const { selectedTable, selectedChair } = useSelectedEntities();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-icon"></span>
      </button>

      <Toolbar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      <VenueCanvas />

      {/* Render modals */}
      {isTableModalOpen && selectedTable && (
        <TableModal
          table={selectedTable}
          isOpen={isTableModalOpen}
          onClose={closeTableModal}
        />
      )}

      {isChairModalOpen && selectedChair && (
        <ChairModal
          chair={selectedChair}
          isOpen={isChairModalOpen}
          onClose={closeChairModal}
        />
      )}
    </div>
  );
}

export default App;
