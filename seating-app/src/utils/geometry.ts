import type { Position, TableShape } from '../types';
import { CHAIR_RADIUS_CIRCLE, CHAIR_RADIUS_RECT } from '../constants';

/**
 * テーブルの形状と椅子の番号から椅子の位置を計算する
 */
export function calculateChairPosition(
  tablePosition: Position,
  tableShape: TableShape,
  chairIndex: number,
  totalChairs: number
): Position {
  const radius = tableShape === 'circle' ? CHAIR_RADIUS_CIRCLE : CHAIR_RADIUS_RECT;

  // 椅子を均等に配置（上から時計回り）
  const angle = (Math.PI * 2 * chairIndex) / totalChairs - Math.PI / 2;

  return {
    x: tablePosition.x + radius * Math.cos(angle),
    y: tablePosition.y + radius * Math.sin(angle),
  };
}
