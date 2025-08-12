export async function fetchKmaTemperatureExtremes(nx: number, ny: number, base_date: string, base_time: string) {
  const response = await fetch(`/api/kma-temperature-extremes?nx=${nx}&ny=${ny}&base_date=${base_date}&base_time=${base_time}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch KMA temperature extremes: ${response.statusText}`);
  }
  return response.json();
}
