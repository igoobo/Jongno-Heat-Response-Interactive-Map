import { useEffect, useState } from 'react';
import { fetchKmaWeatherWarnings } from '../services/kmaWeatherService';

interface KmaWarning {
  REG_UP: string;
  REG_UP_KO: string;
  REG_ID: string;
  REG_KO: string;
  TM_FC: string;
  TM_EF: string;
  WRN: string;
  LVL: string;
  CMD: string;
  ED_TM: string;
}

export const useKmaWeatherWarnings = () => {
  const [warnings, setWarnings] = useState<KmaWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWarnings = async () => {
      try {
        const data = await fetchKmaWeatherWarnings();
        setWarnings(data);
      } catch (err) {
        setError((err as Error).message);
        setWarnings([]);
      } finally {
        setLoading(false);
      }
    };

    getWarnings();
  }, []);

  return { warnings, loading, error };
};
