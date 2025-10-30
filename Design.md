# 座席表アプリケーション - 実装仕様

## 1. 技術スタック

### フロントエンド
- **React** 18.x - UIライブラリ
- **TypeScript** 5.x - 型安全性
- **Vite** - ビルドツール・開発サーバー
- **Zustand** - 軽量な状態管理
- **React DnD** または **@dnd-kit** - ドラッグ＆ドロップ機能
- **CSS Modules** または **styled-components** - スタイリング

### 開発ツール
- **ESLint** - 静的解析
- **Prettier** - コードフォーマット
- **TypeScript** - 型チェック

## 2. プロジェクト構造

```
Seat-Map/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── Venue/
│   │   │   ├── VenueCanvas.tsx
│   │   │   └── VenueCanvas.module.css
│   │   ├── Table/
│   │   │   ├── Table.tsx
│   │   │   ├── TableModal.tsx
│   │   │   └── Table.module.css
│   │   ├── Chair/
│   │   │   ├── Chair.tsx
│   │   │   ├── ChairModal.tsx
│   │   │   └── Chair.module.css
│   │   ├── Member/
│   │   │   ├── MemberList.tsx
│   │   │   ├── MemberForm.tsx
│   │   │   └── Member.module.css
│   │   ├── Toolbar/
│   │   │   ├── Toolbar.tsx
│   │   │   └── Toolbar.module.css
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Input.tsx
│   ├── store/               # Zustand状態管理
│   │   ├── venueStore.ts
│   │   └── types.ts
│   ├── hooks/               # カスタムフック
│   │   ├── useDragAndDrop.ts
│   │   └── useLocalStorage.ts
│   ├── utils/               # ユーティリティ関数
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   └── geometry.ts
│   ├── constants/           # 定数
│   │   └── index.ts
│   ├── types/               # 型定義
│   │   └── index.ts
│   ├── App.tsx              # メインコンポーネント
│   ├── App.css
│   ├── main.tsx             # エントリーポイント
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Spec.md
├── Design.md
└── Tasks.md
```

## 3. データモデル詳細

### 3.1 型定義 (src/types/index.ts)

```typescript
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
}
```

## 4. コンポーネント設計

### 4.1 App.tsx
- 最上位コンポーネント
- レイアウトの管理
- Toolbar と VenueCanvas を配置

### 4.2 Toolbar.tsx
- 新規テーブル追加ボタン
- エクスポート/インポートボタン
- リセットボタン
- 会場名の編集

### 4.3 VenueCanvas.tsx
- 会場全体を表示するキャンバス
- テーブルのドロップエリア
- 背景のグリッド表示（オプション）

### 4.4 Table.tsx
- テーブルの表示と操作
- ドラッグ可能
- クリックでモーダルを開く
- 椅子を配置

Props:
```typescript
interface TableProps {
  table: Table;
  onDragEnd: (position: Position) => void;
  onClick: () => void;
}
```

### 4.5 TableModal.tsx
- テーブルの詳細設定モーダル
- テーブル名の編集
- 椅子の数の調整
- テーブルの削除

### 4.6 Chair.tsx
- 椅子の表示
- クリックでメンバー割り当てモーダルを開く
- メンバーが割り当てられている場合は名前を表示

Props:
```typescript
interface ChairProps {
  chair: Chair;
  onClick: () => void;
}
```

### 4.7 ChairModal.tsx
- メンバーの割り当て・編集
- 名前とXのIDの入力フォーム
- メンバーの削除

### 4.8 MemberList.tsx
- 未割り当てのメンバーリスト
- メンバーをドラッグして椅子に割り当て可能

## 5. 状態管理（Zustand）

### 5.1 venueStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VenueState, Table, Chair, Member, Position, TableShape } from '../types';

const initialState = {
  id: 'default-venue',
  name: '会場',
  tables: [],
};

export const useVenueStore = create<VenueState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setVenueName: (name) => set({ name }),

      addTable: (shape) => {
        const tables = get().tables;
        if (tables.length >= 6) {
          alert('テーブルは最大6個までです');
          return;
        }
        const newTable: Table = {
          id: `table-${Date.now()}`,
          shape,
          position: { x: 100 + tables.length * 50, y: 100 },
          chairCount: 4,
          chairs: [],
        };
        // 椅子を初期化
        for (let i = 0; i < 4; i++) {
          newTable.chairs.push({
            id: `chair-${newTable.id}-${i}`,
            tableId: newTable.id,
            position: i,
          });
        }
        set({ tables: [...tables, newTable] });
      },

      removeTable: (tableId) => {
        set({ tables: get().tables.filter(t => t.id !== tableId) });
      },

      updateTablePosition: (tableId, position) => {
        set({
          tables: get().tables.map(t =>
            t.id === tableId ? { ...t, position } : t
          ),
        });
      },

      updateTableName: (tableId, name) => {
        set({
          tables: get().tables.map(t =>
            t.id === tableId ? { ...t, name } : t
          ),
        });
      },

      updateChairCount: (tableId, count) => {
        if (count < 0 || count > 8) return;
        const tables = get().tables;
        set({
          tables: tables.map(t => {
            if (t.id !== tableId) return t;
            const newChairs = [...t.chairs];
            if (count > t.chairCount) {
              // 椅子を追加
              for (let i = t.chairCount; i < count; i++) {
                newChairs.push({
                  id: `chair-${tableId}-${i}`,
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

      assignMember: (chairId, member) => {
        set({
          tables: get().tables.map(t => ({
            ...t,
            chairs: t.chairs.map(c =>
              c.id === chairId ? { ...c, member } : c
            ),
          })),
        });
      },

      removeMember: (chairId) => {
        set({
          tables: get().tables.map(t => ({
            ...t,
            chairs: t.chairs.map(c =>
              c.id === chairId ? { ...c, member: undefined } : c
            ),
          })),
        });
      },

      updateMember: (memberId, updates) => {
        set({
          tables: get().tables.map(t => ({
            ...t,
            chairs: t.chairs.map(c =>
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

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set({ id: data.id, name: data.name, tables: data.tables });
        } catch (error) {
          alert('無効なデータ形式です');
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'venue-storage',
    }
  )
);
```

## 6. ユーティリティ関数

### 6.1 geometry.ts
椅子の位置計算関数

```typescript
export function calculateChairPosition(
  tablePosition: Position,
  tableShape: TableShape,
  chairIndex: number,
  totalChairs: number
): Position {
  const radius = tableShape === 'circle' ? 80 : 100;
  const angle = (Math.PI * 2 * chairIndex) / totalChairs - Math.PI / 2;

  return {
    x: tablePosition.x + radius * Math.cos(angle),
    y: tablePosition.y + radius * Math.sin(angle),
  };
}
```

### 6.2 validation.ts
入力バリデーション

```typescript
export function validateMemberName(name: string): boolean {
  return name.trim().length > 0;
}

export function validateXId(xId: string): boolean {
  return !xId || /^@?[a-zA-Z0-9_]{1,15}$/.test(xId);
}
```

## 7. スタイリング方針

### 7.1 レイアウト
- Flexbox を使用した柔軟なレイアウト
- 左側: Toolbar（縦配置）
- 右側: VenueCanvas（メインエリア）

### 7.2 カラーパレット
- プライマリ: #3b82f6 (青)
- セカンダリ: #8b5cf6 (紫)
- 背景: #f9fafb (明るいグレー)
- テーブル: #ffffff (白)
- 椅子: #e5e7eb (グレー)
- 椅子（メンバー割り当て済み）: #10b981 (緑)

### 7.3 テーブルの描画
- 円形テーブル: SVG circle
- 長方形テーブル: SVG rect with rounded corners
- 影とボーダーで立体感

### 7.4 レスポンシブデザイン
- 最小幅: 1024px
- タブレット対応
- モバイルは優先度低（デスクトップファースト）

## 8. ドラッグ＆ドロップ実装

### 使用ライブラリ: @dnd-kit/core

- テーブルのドラッグ: Draggable
- キャンバス: Droppable
- ドラッグ中のプレビュー表示
- スナップ機能（グリッドに合わせる）

## 9. パフォーマンス最適化

- React.memo でコンポーネントのメモ化
- useMemo / useCallback の適切な使用
- 大量のテーブル・椅子でも滑らかに動作
- 仮想化は不要（最大6テーブル、48椅子）

## 10. エラーハンドリング

- 入力バリデーション
- 最大数チェック（テーブル6個、椅子8個）
- インポート時のJSONパースエラー
- ローカルストレージのエラー
- ユーザーフレンドリーなエラーメッセージ

## 11. アクセシビリティ

- キーボード操作可能
- ARIA属性の適切な使用
- フォーカス管理
- セマンティックHTML

## 12. テスト方針

- コンポーネントの単体テスト（オプション）
- 状態管理のテスト（オプション）
- E2Eテスト（オプション）
- 手動テストを優先

## 13. 実装の優先順位

1. **Phase 1: 基本構造**
   - プロジェクトセットアップ
   - 型定義
   - 状態管理の基礎

2. **Phase 2: コア機能**
   - テーブルの追加・削除
   - 椅子の追加・削除
   - メンバーの割り当て

3. **Phase 3: UI/UX**
   - ドラッグ＆ドロップ
   - モーダルダイアログ
   - スタイリング

4. **Phase 4: 永続化**
   - ローカルストレージ
   - エクスポート/インポート

5. **Phase 5: 仕上げ**
   - バリデーション
   - エラーハンドリング
   - UX改善
