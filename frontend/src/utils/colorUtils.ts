// utils/colorUtils.ts

export function getColorByTemperature(temp: number): string {
  if (temp <= 0) return '#blue';
  if (temp <= 10) return '#78a9d1';
  if (temp <= 20) return '#a2d6f9';
  if (temp <= 25) return '#f1c40f';
  if (temp <= 30) return '#f39c12';
  if (temp <= 35) return '#e67e22';
  return '#e74c3c';
}
