export interface Position {
  x: number;
  y: number;
}

export type TableShape = 'circle' | 'rectangle';

export interface Member {
  id: string;
  name: string;
  xId?: string;
}

export interface Chair {
  id: string;
  tableId: string;
  position: number; // 0-7の位置
  member?: Member;
}

export interface Table {
  id: string;
  name?: string;
  shape: TableShape;
  position: Position;
  chairCount: number; // 0-8
  chairs: Chair[];
}

export interface Venue {
  id: string;
  name: string;
  tables: Table[];
}

export interface VenueState extends Venue {
  // Selection state
  selectedTableId: string | null;
  selectedChairId: string | null;
  isTableModalOpen: boolean;
  isChairModalOpen: boolean;

  // Actions
  setVenueName: (name: string) => void;
  addTable: (shape: TableShape) => void;
  removeTable: (tableId: string) => void;
  updateTablePosition: (tableId: string, position: Position) => void;
  updateTableName: (tableId: string, name: string) => void;
  updateChairCount: (tableId: string, count: number) => void;
  assignMember: (chairId: string, member: Member) => void;
  removeMember: (chairId: string) => void;
  updateMember: (memberId: string, member: Partial<Member>) => void;
  exportData: () => string;
  importData: (json: string) => void;
  reset: () => void;

  // Selection actions
  setSelectedTable: (tableId: string | null) => void;
  setSelectedChair: (tableId: string | null, chairId: string | null) => void;
  openTableModal: () => void;
  openChairModal: () => void;
  closeTableModal: () => void;
  closeChairModal: () => void;
}
