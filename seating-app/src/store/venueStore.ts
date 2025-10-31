import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VenueState, Table, Chair, Member, Position, TableShape } from '../types';
import { MAX_TABLES, MAX_CHAIRS } from '../constants';

const initialState = {
  id: 'default-venue',
  name: '会場',
  tables: [],
  selectedTableId: null,
  selectedChairId: null,
  isTableModalOpen: false,
  isChairModalOpen: false,
};

export const useVenueStore = create<VenueState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setVenueName: (name: string) => {
        set({ name });
      },

      addTable: (shape: TableShape) => {
        const tables = get().tables;
        if (tables.length >= MAX_TABLES) {
          alert(`テーブルは最大${MAX_TABLES}個までです`);
          return;
        }

        const newTable: Table = {
          id: `table-${crypto.randomUUID()}`,
          shape,
          position: { x: 200 + tables.length * 100, y: 200 },
          chairCount: 4,
          chairs: [],
        };

        // 椅子を初期化

        // 椅子を初期化
        const chairs: Chair[] = [];
        for (let i = 0; i < 4; i++) {
          chairs.push({
            id: `chair-${newTable.id}-${i}`,
            tableId: newTable.id,
            position: i,
          });
        }
        newTable.chairs = chairs;

        set({ tables: [...tables, newTable] });
      },

      removeTable: (tableId: string) => {
        set((state) => {
          const tables = state.tables.filter((t) => t.id !== tableId);
          if (state.selectedTableId !== tableId) {
            return { tables };
          }
          return {
            tables,
            selectedTableId: null,
            selectedChairId: null,
            isTableModalOpen: false,
            isChairModalOpen: false,
          };
        });
      },

      updateTablePosition: (tableId: string, position: Position) => {
        set({
          tables: get().tables.map((t) =>
            t.id === tableId ? { ...t, position } : t
          ),
        });
      },

      updateTableName: (tableId: string, name: string) => {
        set({
          tables: get().tables.map((t) =>
            t.id === tableId ? { ...t, name } : t
          ),
        });
      },

      updateChairCount: (tableId: string, count: number) => {
        if (count < 0 || count > MAX_CHAIRS) {
          alert(`椅子の数は0〜${MAX_CHAIRS}個の範囲で指定してください`);
          return;
        }

        const tables = get().tables;
        set({
          tables: tables.map((t) => {
            if (t.id !== tableId) return t;

            const newChairs = [...t.chairs];
            if (count > t.chairCount) {
              // 椅子を追加
              for (let i = t.chairCount; i < count; i++) {
                newChairs.push({
                  id: `chair-${tableId}-${i}-${Date.now()}`,
                  tableId,
                  position: i,
                });
              }
            } else {
              // 椅子を削除
              newChairs.splice(count);
            }

            return { ...t, chairCount: count, chairs: newChairs };
          }),
        });
      },

      assignMember: (chairId: string, member: Member) => {
        set({
          tables: get().tables.map((t) => ({
            ...t,
            chairs: t.chairs.map((c) =>
              c.id === chairId ? { ...c, member } : c
            ),
          })),
        });
      },

      removeMember: (chairId: string) => {
        set({
          tables: get().tables.map((t) => ({
            ...t,
            chairs: t.chairs.map((c) =>
              c.id === chairId ? { ...c, member: undefined } : c
            ),
          })),
        });
      },

      updateMember: (memberId: string, updates: Partial<Member>) => {
        set({
          tables: get().tables.map((t) => ({
            ...t,
            chairs: t.chairs.map((c) =>
              c.member?.id === memberId
                ? { ...c, member: { ...c.member, ...updates } }
                : c
            ),
          })),
        });
      },

      exportData: () => {
        const { id, name, tables } = get();
        return JSON.stringify({ id, name, tables }, null, 2);
      },

      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (data.id && data.name && Array.isArray(data.tables)) {
            set({ id: data.id, name: data.name, tables: data.tables });
          } else {
            throw new Error('無効なデータ形式');
          }
        } catch (error) {
          alert('無効なデータ形式です');
          console.error(error);
        }
      },

      reset: () => {
        set(initialState);
      },

      // Selection actions
      setSelectedTable: (tableId: string | null) => {
        set({
          selectedTableId: tableId,
          selectedChairId: null, // Clear chair selection when table is selected
        });
      },

      setSelectedChair: (tableId: string | null, chairId: string | null) => {
        set({
          selectedTableId: tableId,
          selectedChairId: chairId,
        });
      },

      openTableModal: () => {
        set({ isTableModalOpen: true });
      },

      openChairModal: () => {
        set({ isChairModalOpen: true });
      },

      closeTableModal: () => {
        set({ isTableModalOpen: false });
      },

      closeChairModal: () => {
        set({ isChairModalOpen: false });
      },
    }),
    {
      name: 'venue-storage',
    }
  )
);
