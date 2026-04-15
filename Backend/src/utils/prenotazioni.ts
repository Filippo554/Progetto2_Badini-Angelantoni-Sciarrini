export interface TimeRange {
  ora_inizio: string;
  ora_fine: string;
}

export function normalizeOptionalText(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function isValidTimeRange(start: string, end: string): boolean {
  return start < end;
}

export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return a.ora_inizio < b.ora_fine && a.ora_fine > b.ora_inizio;
}

export function getWeekRange(dateStr: string): { lunedi: string; domenica: string } | null {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (x: Date): string => x.toISOString().split('T')[0] ?? '';
  return { lunedi: fmt(monday), domenica: fmt(sunday) };
}
