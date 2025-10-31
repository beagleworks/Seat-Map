import { useState, useEffect } from 'react';
import type { Table } from '../../types';
import { useVenueStore } from '../../store/venueStore';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import styles from './TableModal.module.css';

interface TableModalProps {
  table: Table;
  isOpen: boolean;
  onClose: () => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  table,
  isOpen,
  onClose,
}) => {
  const { updateTableName, updateChairCount, removeTable } = useVenueStore();
  const [tableName, setTableName] = useState(table.name || '');
  const [chairCount, setChairCount] = useState(table.chairCount);
  useEffect(() => {
    setTableName(table.name || '');
    setChairCount(table.chairCount);
  }, [table.id]);

  const handleSave = () => {
    updateTableName(table.id, tableName);
    updateChairCount(table.id, chairCount);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('このテーブルを削除しますか?')) {
      removeTable(table.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="テーブルの設定">
      <div className={styles.content}>
        <Input
          label="テーブル名"
          value={tableName}
          onChange={setTableName}
          placeholder="例: メインテーブル"
        />

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            椅子の数 (0-8)
          </label>
          <input
            type="number"
            min="0"
            max="8"
            value={chairCount}
            onChange={(e) => setChairCount(Number(e.target.value))}
            className={styles.numberInput}
          />
        </div>

        <div className={styles.info}>
          <p>形状: {table.shape === 'circle' ? '円形' : '長方形'}</p>
          <p>配置済みメンバー: {table.chairs.filter(c => c.member).length}人</p>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleSave}>保存</Button>
          <Button onClick={onClose} variant="secondary">
            キャンセル
          </Button>
          <Button onClick={handleDelete} variant="danger">
            削除
          </Button>
        </div>
      </div>
    </Modal>
  );
};
