# 座席表アプリケーション - 実装計画

## Phase 1: プロジェクトセットアップ

### Task 1.1: Vite + React + TypeScript プロジェクトの初期化
- [ ] `npm create vite@latest` でプロジェクト作成
- [ ] 必要な依存関係のインストール
  - React, React-DOM
  - TypeScript
  - Zustand (状態管理)
  - @dnd-kit/core, @dnd-kit/sortable (ドラッグ＆ドロップ)
- [ ] 開発用依存関係のインストール
  - ESLint, Prettier
  - TypeScript types
- [ ] 基本的な設定ファイルの確認
  - tsconfig.json
  - vite.config.ts

**完了条件**: `npm run dev` でアプリケーションが起動する

### Task 1.2: プロジェクト構造の作成
- [ ] ディレクトリ構造の作成
  - src/components/
  - src/store/
  - src/hooks/
  - src/utils/
  - src/types/
  - src/constants/
- [ ] .gitignore の確認・更新

**完了条件**: 必要なディレクトリが全て存在する

## Phase 2: 型定義と定数

### Task 2.1: 型定義の作成
- [ ] src/types/index.ts の作成
  - Position 型
  - TableShape 型
  - Member インターフェース
  - Chair インターフェース
  - Table インターフェース
  - Venue インターフェース
  - VenueState インターフェース

**完了条件**: 全ての型定義が完成し、TypeScriptエラーがない

### Task 2.2: 定数の定義
- [ ] src/constants/index.ts の作成
  - MAX_TABLES = 6
  - MAX_CHAIRS = 8
  - MIN_CHAIRS = 0
  - TABLE_RADIUS (円形)
  - TABLE_WIDTH, TABLE_HEIGHT (長方形)
  - CHAIR_SIZE
  - カラーパレット

**完了条件**: 定数が定義され、型が正しい

## Phase 3: 状態管理

### Task 3.1: Zustand ストアの作成
- [ ] src/store/venueStore.ts の作成
- [ ] 初期状態の定義
- [ ] アクションの実装
  - setVenueName
  - addTable
  - removeTable
  - updateTablePosition
  - updateTableName
  - updateChairCount
  - assignMember
  - removeMember
  - updateMember
  - exportData
  - importData
  - reset
- [ ] persist middleware の設定（ローカルストレージ）

**完了条件**: ストアが正しく動作し、状態の更新ができる

## Phase 4: ユーティリティ関数

### Task 4.1: geometry.ts の実装
- [ ] calculateChairPosition 関数
  - 円形テーブルの椅子配置計算
  - 長方形テーブルの椅子配置計算

**完了条件**: 椅子の位置が正しく計算される

### Task 4.2: validation.ts の実装
- [ ] validateMemberName 関数
- [ ] validateXId 関数

**完了条件**: バリデーションが正しく動作する

### Task 4.3: storage.ts の実装
- [ ] exportToJson 関数
- [ ] importFromJson 関数
- [ ] downloadJson 関数

**完了条件**: データのエクスポート/インポートが動作する

## Phase 5: 基本コンポーネント

### Task 5.1: 共通コンポーネントの作成
- [ ] src/components/Common/Button.tsx
  - 再利用可能なボタンコンポーネント
  - プライマリ、セカンダリ、危険ボタンのバリエーション
- [ ] src/components/Common/Modal.tsx
  - モーダルダイアログの基礎コンポーネント
  - オーバーレイ、閉じるボタン
- [ ] src/components/Common/Input.tsx
  - テキスト入力コンポーネント
  - バリデーションエラー表示

**完了条件**: 各コンポーネントが単独で動作する

### Task 5.2: App.tsx の基本構造
- [ ] src/App.tsx の実装
  - 基本的なレイアウト（Flexbox）
  - ヘッダー
  - メインエリア
- [ ] src/App.css の作成
  - グローバルスタイル
  - リセットCSS

**完了条件**: 基本的なレイアウトが表示される

## Phase 6: Toolbar コンポーネント

### Task 6.1: Toolbar の実装
- [ ] src/components/Toolbar/Toolbar.tsx
  - 会場名の表示と編集
  - 「円形テーブルを追加」ボタン
  - 「長方形テーブルを追加」ボタン
  - エクスポートボタン
  - インポートボタン
  - リセットボタン
- [ ] src/components/Toolbar/Toolbar.module.css
  - 縦配置のスタイル
  - ボタンのスタイル

**完了条件**: Toolbar が表示され、ボタンが機能する

## Phase 7: VenueCanvas コンポーネント

### Task 7.1: VenueCanvas の基本実装
- [ ] src/components/Venue/VenueCanvas.tsx
  - キャンバスエリアの表示
  - テーブルのリスト表示
- [ ] src/components/Venue/VenueCanvas.module.css
  - キャンバスのスタイル
  - 背景（グリッド）

**完了条件**: キャンバスが表示される

### Task 7.2: ドロップ機能の実装
- [ ] @dnd-kit を使用したドロップエリアの実装
- [ ] テーブルのドロップ処理

**完了条件**: テーブルをドロップできる

## Phase 8: Table コンポーネント

### Task 8.1: Table の基本実装
- [ ] src/components/Table/Table.tsx
  - テーブルの表示（SVG）
  - 円形テーブルの描画
  - 長方形テーブルの描画
  - テーブル名の表示
  - クリックイベント
- [ ] src/components/Table/Table.module.css
  - テーブルのスタイル

**完了条件**: テーブルが表示される

### Task 8.2: ドラッグ機能の実装
- [ ] @dnd-kit を使用したドラッグ機能
- [ ] ドラッグ中のプレビュー
- [ ] ドロップ時の位置更新

**完了条件**: テーブルをドラッグ＆ドロップできる

### Task 8.3: TableModal の実装
- [ ] src/components/Table/TableModal.tsx
  - テーブル名の編集フォーム
  - 椅子の数の調整（0-8）
  - 削除ボタン
  - 保存・キャンセルボタン
- [ ] スタイリング

**完了条件**: テーブルをクリックしてモーダルが開き、編集できる

## Phase 9: Chair コンポーネント

### Task 9.1: Chair の基本実装
- [ ] src/components/Chair/Chair.tsx
  - 椅子の表示（SVG circle）
  - メンバーが割り当てられている場合の表示
  - メンバー名の表示
  - クリックイベント
- [ ] src/components/Chair/Chair.module.css
  - 椅子のスタイル
  - 割り当て済み/未割り当ての色分け

**完了条件**: 椅子が表示される

### Task 9.2: ChairModal の実装
- [ ] src/components/Chair/ChairModal.tsx
  - メンバー割り当てフォーム
  - 名前入力（必須）
  - XのID入力（オプション）
  - 保存ボタン
  - メンバーの削除ボタン
  - キャンセルボタン
- [ ] バリデーションの実装
- [ ] スタイリング

**完了条件**: 椅子をクリックしてメンバーを割り当てられる

### Task 9.3: 椅子の配置計算
- [ ] geometry.ts を使用した椅子の位置計算
- [ ] テーブルの形状に応じた配置
- [ ] 椅子の数に応じた均等配置

**完了条件**: 椅子がテーブルの周りに正しく配置される

## Phase 10: Member 管理

### Task 10.1: MemberList の実装（オプション）
- [ ] src/components/Member/MemberList.tsx
  - 未割り当てメンバーのリスト表示
  - メンバーの検索
- [ ] スタイリング

**完了条件**: メンバーリストが表示される（優先度低）

## Phase 11: データの永続化

### Task 11.1: ローカルストレージの実装
- [ ] Zustand persist middleware の確認
- [ ] データの自動保存
- [ ] ページリロード時のデータ復元

**完了条件**: データがリロード後も保持される

### Task 11.2: エクスポート機能
- [ ] JSON形式でのエクスポート
- [ ] ファイルのダウンロード
- [ ] ファイル名の自動生成（日時含む）

**完了条件**: JSONファイルがダウンロードされる

### Task 11.3: インポート機能
- [ ] ファイルアップロード
- [ ] JSONのパース
- [ ] データの検証
- [ ] エラーハンドリング

**完了条件**: JSONファイルからデータをインポートできる

## Phase 12: スタイリングと UX 改善

### Task 12.1: 全体的なスタイリング
- [ ] カラーパレットの適用
- [ ] レスポンシブデザインの調整
- [ ] アニメーションの追加
- [ ] ホバーエフェクト

**完了条件**: UIが美しく、使いやすい

### Task 12.2: エラーハンドリング
- [ ] バリデーションエラーの表示
- [ ] 最大数エラーのアラート
- [ ] インポートエラーの処理

**完了条件**: エラーメッセージが適切に表示される

### Task 12.3: UX 改善
- [ ] ローディング状態の表示
- [ ] 確認ダイアログ（削除時など）
- [ ] トーストメッセージ
- [ ] キーボードショートカット

**完了条件**: UXが洗練されている

## Phase 13: テストとバグフィックス

### Task 13.1: 手動テスト
- [ ] 全機能の動作確認
- [ ] エッジケースのテスト
  - テーブル0個
  - 椅子0個
  - テーブル最大6個
  - 椅子最大8個
- [ ] ブラウザ互換性テスト
  - Chrome
  - Firefox
  - Safari
  - Edge

**完了条件**: 全ての機能が正しく動作する

### Task 13.2: バグフィックス
- [ ] 発見されたバグの修正
- [ ] パフォーマンスの最適化
- [ ] コードのリファクタリング

**完了条件**: バグが全て修正されている

## Phase 14: ドキュメントとデプロイ

### Task 14.1: README の作成
- [ ] プロジェクトの説明
- [ ] インストール手順
- [ ] 使用方法
- [ ] スクリーンショット

**完了条件**: README が完成している

### Task 14.2: デプロイ準備（オプション）
- [ ] ビルドの確認
- [ ] 静的ホスティング設定（Vercel, Netlify など）

**完了条件**: アプリケーションがデプロイされている

## 実装の順序

1. Phase 1-2: セットアップと基礎
2. Phase 3-4: 状態管理とユーティリティ
3. Phase 5-6: 基本UIとツールバー
4. Phase 7-9: メイン機能（テーブル、椅子）
5. Phase 10-11: データ永続化
6. Phase 12-13: 仕上げとテスト
7. Phase 14: ドキュメント

## 見積もり時間

- Phase 1-2: 1-2時間
- Phase 3-4: 1-2時間
- Phase 5-6: 1-2時間
- Phase 7-9: 3-4時間
- Phase 10-11: 1-2時間
- Phase 12-13: 2-3時間
- Phase 14: 1時間

**合計**: 10-16時間

## 注意事項

- 各フェーズ完了後にコミット
- TypeScriptエラーが出ないことを確認
- 動作確認を行いながら進める
- 問題が発生したら早めに対処
- コードレビューを定期的に実施
