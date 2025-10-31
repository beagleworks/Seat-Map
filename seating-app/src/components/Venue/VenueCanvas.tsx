import { useCallback } from 'react';
import { useVenueStore } from '../../store/venueStore';
import { Table } from '../Table/Table';
import styles from './VenueCanvas.module.css';

export const VenueCanvas: React.FC = () => {
  const {
    tables,
    selectedTableId,
    selectedChairId,
    setSelectedTable,
    setSelectedChair,
  } = useVenueStore();

  // Memoize click handlers to prevent unnecessary re-renders of child components
  const handleTableClick = useCallback((table: { id: string }) => {
    setSelectedTable(table.id);
  }, [setSelectedTable]);

  const handleChairClick = useCallback((tableId: string, chairId: string) => {
    setSelectedChair(tableId, chairId);
  }, [setSelectedChair]); 

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
            isSelected={selectedTableId === table.id}
            selectedChairId={selectedChairId}
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

    </div>
  );
};
