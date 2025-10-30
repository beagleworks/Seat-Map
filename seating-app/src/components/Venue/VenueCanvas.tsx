import { useState } from 'react';
import { useVenueStore } from '../../store/venueStore';
import { Table } from '../Table/Table';
import { TableModal } from '../Table/TableModal';
import { ChairModal } from '../Chair/ChairModal';
import type { Table as TableType, Chair as ChairType } from '../../types';
import styles from './VenueCanvas.module.css';

export const VenueCanvas: React.FC = () => {
  const { tables } = useVenueStore();
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [selectedChair, setSelectedChair] = useState<ChairType | null>(null);

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
            onTableClick={setSelectedTable}
            onChairClick={setSelectedChair}
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
          onClose={() => setSelectedTable(null)}
        />
      )}

      {selectedChair && (
        <ChairModal
          chair={selectedChair}
          isOpen={true}
          onClose={() => setSelectedChair(null)}
        />
      )}
    </div>
  );
};
