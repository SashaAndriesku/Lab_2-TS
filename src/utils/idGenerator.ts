export function generateNumericId(): string {
  return Date.now().toString() + Math.floor(Math.random() * 100).toString();
}