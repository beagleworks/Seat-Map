import { Toolbar } from './components/Toolbar/Toolbar';
import { VenueCanvas } from './components/Venue/VenueCanvas';
import { TableModal } from './components/Table/TableModal';
import { ChairModal } from './components/Chair/ChairModal';
import { useVenueStore } from './store/venueStore';
import './App.css';

function App() {
  const {
    tables,
    selectedTableId,
    selectedChairId,
    isTableModalOpen,
    isChairModalOpen,
    closeTableModal,
    closeChairModal,
  } = useVenueStore();

  // Get selected table and chair
  const selectedTable = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;
  const selectedChair = selectedTableId && selectedChairId
    ? tables.find(t => t.id === selectedTableId)?.chairs.find(c => c.id === selectedChairId)
    : null;

  return (
    <div className="app">
      <Toolbar />
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
