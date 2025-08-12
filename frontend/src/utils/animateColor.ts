// utils/animateColor.ts
export function animatePolygonColor(polygon: any, startColor: string, endColor: string, duration: number = 300) {
  const start = parseColor(startColor);
  const end = parseColor(endColor);

  let startTime: number | null = null;

  function animateStep(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const interpolatedColor = `rgb(
      ${Math.round(start.r + (end.r - start.r) * progress)},
      ${Math.round(start.g + (end.g - start.g) * progress)},
      ${Math.round(start.b + (end.b - start.b) * progress)}
    )`;

    polygon.setOptions({ fillColor: interpolatedColor });

    if (progress < 1) {
      requestAnimationFrame(animateStep);
    }
  }

  requestAnimationFrame(animateStep);
}

function parseColor(color: string): { r: number; g: number; b: number } {
  const canvas = document.createElement('canvas');
  canvas.height = canvas.width = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
  return { r, g, b };
}
