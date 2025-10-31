import { useState, useMemo, useCallback } from 'react';
import { useVenueStore } from '../../store/venueStore';
import { Table } from '../Table/Table';
import { TableModal } from '../Table/TableModal';
import { ChairModal } from '../Chair/ChairModal';
import styles from './VenueCanvas.module.css';

export const VenueCanvas: React.FC = () => {
  const { tables } = useVenueStore();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedChairId, setSelectedChairId] = useState<string | null>(null);

  // Memoize table lookup to avoid O(n) search on every render
  const selectedTable = useMemo(() => {
    return selectedTableId ? tables.find(t => t.id === selectedTableId) ?? null : null;
  }, [selectedTableId, tables]);

  // Memoize chair lookup to avoid nested find operations on every render
  const selectedChair = useMemo(() => {
    if (!selectedTableId || !selectedChairId) return null;
    const table = tables.find(t => t.id === selectedTableId);
    return table?.chairs.find(c => c.id === selectedChairId) ?? null;
  }, [selectedTableId, selectedChairId, tables]);

  // Memoize click handlers to prevent unnecessary re-renders of child components
  const handleTableClick = useCallback((table: { id: string }) => {
    setSelectedTableId(table.id);
  }, []);

  const handleChairClick = useCallback((chair: { id: string }) => {
    setSelectedChairId(chair.id);
  }, []); 

  return (
    <div className={styles.canvas}>
      <svg className={styles.svg} width="100%" height="100%">
        {/* グリッド背景 */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* テーブル */}
        {tables.map((table) => (
          <Table
            key={table.id}
            table={table}
            onTableClick={handleTableClick}
            onChairClick={handleChairClick}
          />
        ))}
      </svg>

      {tables.length === 0 && (
        <div className={styles.emptyMessage}>
          左側のツールバーから<br />テーブルを追加してください
        </div>
      )}

      {/* モーダル（SVGの外） */}
      {selectedTable && (
        <TableModal
          table={selectedTable}
          isOpen={true}
          onClose={() => setSelectedTableId(null)}
        />
      )}

      {selectedChair && (
        <ChairModal
          chair={selectedChair}
          isOpen={true}
          onClose={() => setSelectedChairId(null)}
        />
      )}
    </div>
  );
};
