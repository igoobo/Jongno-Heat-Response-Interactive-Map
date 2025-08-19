// utils/colorUtils.ts

export function getColorByTemperature(temp: number): string {
  if (temp <= 25) return '#FFFACD'; // Lemon Chiffon
  if (temp <= 28) return '#FFD700'; // Gold
  if (temp <= 30) return '#FF8C00'; // Dark Orange
  if (temp <= 33) return '#FF4500'; // OrangeRed
  if (temp <= 35) return '#FF0000'; // Red
  return '#B22222'; // Firebrick
}
