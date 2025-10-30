import { useState } from 'react';
import type { Chair, Member } from '../../types';
import { useVenueStore } from '../../store/venueStore';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { validateMemberName, validateXId } from '../../utils/validation';
import styles from './ChairModal.module.css';

interface ChairModalProps {
  chair: Chair;
  isOpen: boolean;
  onClose: () => void;
}

export const ChairModal: React.FC<ChairModalProps> = ({
  chair,
  isOpen,
  onClose,
}) => {
  const { assignMember, removeMember } = useVenueStore();
  const [name, setName] = useState(chair.member?.name || '');
  const [xId, setXId] = useState(chair.member?.xId || '');
  const [nameError, setNameError] = useState('');
  const [xIdError, setXIdError] = useState('');

  const handleSave = () => {
    // バリデーション
    if (!validateMemberName(name)) {
      setNameError('名前を入力してください');
      return;
    }

    if (xId && !validateXId(xId)) {
      setXIdError('有効なXのIDを入力してください（1-15文字）');
      return;
    }

    const member: Member = {
      id: chair.member?.id || `member-${Date.now()}`,
      name: name.trim(),
      xId: xId.trim() || undefined,
    };

    assignMember(chair.id, member);
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('このメンバーを削除しますか?')) {
      removeMember(chair.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={chair.member ? 'メンバーの編集' : 'メンバーの追加'}
    >
      <div className={styles.content}>
        <Input
          label="名前"
          value={name}
          onChange={(value) => {
            setName(value);
            setNameError('');
          }}
          placeholder="山田 太郎"
          error={nameError}
          required
        />

        <Input
          label="XのID"
          value={xId}
          onChange={(value) => {
            setXId(value);
            setXIdError('');
          }}
          placeholder="@example または example"
          error={xIdError}
        />

        <div className={styles.actions}>
          <Button onClick={handleSave}>保存</Button>
          <Button onClick={onClose} variant="secondary">
            キャンセル
          </Button>
          {chair.member && (
            <Button onClick={handleRemove} variant="danger">
              削除
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
