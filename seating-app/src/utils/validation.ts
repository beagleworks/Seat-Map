/**
 * メンバー名のバリデーション
 */
export function validateMemberName(name: string): boolean {
  return name.trim().length > 0;
}

/**
 * XのIDのバリデーション
 * @param xId - XのID（@で始まっても良い、1-15文字の英数字とアンダースコア）
 */
export function validateXId(xId: string): boolean {
  if (!xId) return true; // オプションなので空でもOK
  return /^@?[a-zA-Z0-9_]{1,15}$/.test(xId);
}
