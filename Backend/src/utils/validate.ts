export function isValidId(id: unknown): id is number {
  return typeof id === 'number' && Number.isInteger(id) && id > 0;
}

export function parseId(id: unknown): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}
