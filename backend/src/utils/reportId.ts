export function generateReportId(date = new Date()): string {
  const suffix = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `BF-${date.getFullYear()}-${suffix}`;
}
