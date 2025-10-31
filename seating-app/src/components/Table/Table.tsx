import { useState, useEffect, useRef, memo } from 'react';
import type { Table as TableType, Chair as ChairType } from '../../types';
import { useVenueStore } from '../../store/venueStore';
import { Chair } from '../Chair/Chair';
import {
  CIRCLE_TABLE_RADIUS,
  RECT_TABLE_WIDTH,
  RECT_TABLE_HEIGHT,
  COLORS,
} from '../../constants';

interface TableProps {
  table: TableType;
  isSelected: boolean;
  selectedChairId: string | null;
  onTableClick: (table: TableType) => void;
  onChairClick: (tableId: string, chairId: string) => void;
}

export const Table: React.FC<TableProps> = memo(({ table, isSelected, selectedChairId, onTableClick, onChairClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const updateTablePosition = useVenueStore((state) => state.updateTablePosition);

  // Cache SVG reference to avoid expensive DOM queries on every mousemove
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGGElement>) => {
    // Single click to select table
    onTableClick(table);

    const svg = (e.target as SVGElement).ownerSVGElement;
    if (svg) {
      // Cache the SVG reference for use during dragging
      svgRef.current = svg;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      setDragOffset({
        x: svgPoint.x - table.position.x,
        y: svgPoint.y - table.position.y,
      });

      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        // Use cached SVG reference instead of expensive DOM query
        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        updateTablePosition(table.id, {
          x: svgPoint.x - dragOffset.x,
          y: svgPoint.y - dragOffset.y,
        });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        // Clear the cached reference when dragging ends
        svgRef.current = null;
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragOffset, table.id, updateTablePosition]);

  return (
    <>
      <g
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* テーブル本体 */}
        {table.shape === 'circle' ? (
          <circle
            cx={table.position.x}
            cy={table.position.y}
            r={CIRCLE_TABLE_RADIUS}
            fill={COLORS.tableBackground}
            stroke={isSelected ? '#3b82f6' : COLORS.tableBorder}
            strokeWidth={isSelected ? '3' : '2'}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))' }}
          />
        ) : (
          <rect
            x={table.position.x - RECT_TABLE_WIDTH / 2}
            y={table.position.y - RECT_TABLE_HEIGHT / 2}
            width={RECT_TABLE_WIDTH}
            height={RECT_TABLE_HEIGHT}
            rx="10"
            fill={COLORS.tableBackground}
            stroke={isSelected ? '#3b82f6' : COLORS.tableBorder}
            strokeWidth={isSelected ? '3' : '2'}
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1))' }}
          />
        )}

        {/* テーブル名 */}
        <text
          x={table.position.x}
          y={table.position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={COLORS.text}
          fontSize="14"
          fontWeight="500"
          pointerEvents="none"
        >
          {table.name || `テーブル ${table.id.slice(-4)}`}
        </text>
      </g>

      {/* 椅子 */}
      {table.chairs.map((chair) => (
        <Chair
          key={chair.id}
          chair={chair}
          table={table}
          isSelected={selectedChairId === chair.id}
          onChairClick={onChairClick}
        />
      ))}
    </>
  );
});
