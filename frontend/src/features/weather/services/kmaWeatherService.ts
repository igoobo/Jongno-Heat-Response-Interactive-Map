import { apiClient } from '../../../apiClient';

export async function fetchKmaTemperatureExtremes(nx: number, ny: number, base_date: string, base_time: string) {
  return apiClient<any>(`/api/kma-temperature-extremes?nx=${nx}&ny=${ny}&base_date=${base_date}&base_time=${base_time}`);
}

export async function fetchKmaWeatherWarnings() {
  return apiClient<any>('/api/kma-weather-warnings');
}