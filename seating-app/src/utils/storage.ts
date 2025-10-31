import type { Venue } from '../types';

/**
 * 座席表データをJSON形式でエクスポート
 */
export function exportToJson(venue: Venue): string {
  return JSON.stringify(venue, null, 2);
}

/**
 * JSON文字列から座席表データをインポート
 */
export function importFromJson(json: string): Venue {
  try {
    const data = JSON.parse(json);
    // Basic validation
    if (!data.id || !data.name || !Array.isArray(data.tables)) {
      throw new Error('Invalid venue data structure');
    }
    return data as Venue;
  } catch (error) {
    throw new Error(`Failed to import venue data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * JSONファイルをダウンロード
 */
export function downloadJson(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * ファイル名を生成（日時含む）
 */
export function generateFilename(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `seating-chart-${dateStr}-${timeStr}.json`;
}
