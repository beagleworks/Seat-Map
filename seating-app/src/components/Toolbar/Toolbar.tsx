import React, { useState } from 'react';
import { useVenueStore } from '../../store/venueStore';
import { useSelectedEntities } from '../../hooks/useSelectedEntities';
import { Button } from '../Common/Button';
import { downloadJson, generateFilename } from '../../utils/storage';
import styles from './Toolbar.module.css';

export const Toolbar: React.FC = () => {
  const {
    name,
    setVenueName,
    addTable,
    exportData,
    importData,
    reset,
    openTableModal,
    openChairModal,
  } = useVenueStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [venueName, setVenueNameLocal] = useState(name);

  const { selectedTable, selectedChair } = useSelectedEntities();

  const handleSaveName = () => {
    setVenueName(venueName);
    setIsEditingName(false);
  };

  const handleExport = () => {
    const json = exportData();
    downloadJson(json, generateFilename());
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          importData(json);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('全てのデータをリセットしますか？')) {
      reset();
    }
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.section}>
        <h1 className={styles.title}>座席表</h1>

        {isEditingName ? (
          <div className={styles.nameEdit}>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueNameLocal(e.target.value)}
              className={styles.nameInput}
              autoFocus
            />
            <Button onClick={handleSaveName}>保存</Button>
          </div>
        ) : (
          <div className={styles.venueName} onClick={() => setIsEditingName(true)}>
            {name} <span className={styles.editIcon}>✎</span>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>テーブルを追加</h3>
        <Button onClick={() => addTable('circle')}>
          円形テーブル
        </Button>
        <Button onClick={() => addTable('rectangle')} variant="secondary">
          長方形テーブル
        </Button>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>選択項目を編集</h3>
        {selectedTable && (
          <Button
            onClick={openTableModal}
            variant="primary"
          >
            テーブル情報を編集
          </Button>
        )}
        {selectedChair && (
          <Button
            onClick={openChairModal}
            variant="primary"
          >
            メンバー情報を編集
          </Button>
        )}
        {!selectedTable && !selectedChair && (
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '8px 0' }}>
            テーブルまたは椅子を<br />クリックして選択してください
          </p>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>データ管理</h3>
        <Button onClick={handleExport}>
          エクスポート
        </Button>
        <Button onClick={handleImport}>
          インポート
        </Button>
        <Button onClick={handleReset} variant="danger">
          リセット
        </Button>
      </div>
    </div>
  );
};
