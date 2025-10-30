import type { Chair as ChairType, Table } from '../../types';
import { calculateChairPosition } from '../../utils/geometry';
import { CHAIR_SIZE, COLORS } from '../../constants';

interface ChairProps {
  chair: ChairType;
  table: Table;
  onChairClick: (chair: ChairType) => void;
}

export const Chair: React.FC<ChairProps> = ({ chair, table, onChairClick }) => {
  const position = calculateChairPosition(
    table.position,
    table.shape,
    chair.position,
    table.chairCount
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChairClick(chair);
  };

  return (
    <g onClick={handleClick} style={{ cursor: 'pointer' }}>
      {/* 椅子 */}
      <circle
        cx={position.x}
        cy={position.y}
        r={CHAIR_SIZE / 2}
        fill={chair.member ? COLORS.chairOccupied : COLORS.chairEmpty}
        stroke={COLORS.chairBorder}
        strokeWidth="2"
      />

      {/* メンバー名 */}
      {chair.member && (
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="10"
          fontWeight="600"
          pointerEvents="none"
        >
          {chair.member.name.length > 4
            ? chair.member.name.substring(0, 3) + '...'
            : chair.member.name}
        </text>
      )}
    </g>
  );
};
