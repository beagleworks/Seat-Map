import { memo } from 'react';
import type { Chair as ChairType, Table } from '../../types';
import { calculateChairPosition } from '../../utils/geometry';
import { CHAIR_SIZE, COLORS } from '../../constants';

interface ChairProps {
  chair: ChairType;
  table: Table;
  isSelected: boolean;
  onChairClick: (tableId: string, chairId: string) => void;
}

export const Chair: React.FC<ChairProps> = memo(({ chair, table, isSelected, onChairClick }) => {
  const position = calculateChairPosition(
    table.position,
    table.shape,
    chair.position,
    table.chairCount
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChairClick(table.id, chair.id);
  };

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* 椅子 */}
      <circle
        cx={position.x}
        cy={position.y}
        r={CHAIR_SIZE / 2}
        fill={chair.member ? COLORS.chairOccupied : COLORS.chairEmpty}
        stroke={isSelected ? '#3b82f6' : COLORS.chairBorder}
        strokeWidth={isSelected ? '3' : '2'}
      />

      {/* メンバー情報表示 */}
      {chair.member && (
        <>
          {/* 名前（椅子の下） */}
          <text
            x={position.x}
            y={position.y + CHAIR_SIZE / 2 + 15}
            textAnchor="middle"
            fill={COLORS.text}
            fontSize="11"
            fontWeight="600"
            pointerEvents="none"
            style={{
              textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white',
            }}
          >
            {chair.member.name}
          </text>

          {/* XID（名前のさらに下） */}
          {chair.member.xId && (
            <text
              x={position.x}
              y={position.y + CHAIR_SIZE / 2 + 28}
              textAnchor="middle"
              fill={COLORS.textLight}
              fontSize="9"
              pointerEvents="none"
              style={{
                textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white',
              }}
            >
              {chair.member.xId.startsWith('@') ? chair.member.xId : `@${chair.member.xId}`}
            </text>
          )}
        </>
      )}
    </g>
  );
});
