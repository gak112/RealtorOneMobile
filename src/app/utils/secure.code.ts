export function generateSecureCode(length = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}
