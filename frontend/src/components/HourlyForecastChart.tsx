// components/HourlyForecastChart.tsx
import React, { useMemo, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useHourlyForecast } from "@/hooks/useHourlyForecast";
import { useMapLocation } from "@/context/MapLocationContext";

const formatHour = (dt: number) => {
  const date = new Date(dt * 1000);
  return `${date.getHours()}시`;
};

function HourlyForecastChartComponent() {
  const { location } = useMapLocation();
  const { data, loading } = useHourlyForecast(location);

  useEffect(() => {
    console.log("날씨 데이터 로딩됨:", data);
  }, [data]);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: formatHour(item.dt),
      temp: item.main.temp,
      humidity: item.main.humidity,
    }));
  }, [data]);

  if (loading || !chartData.length) {
    return (
      <div className="w-full h-60 bg-muted rounded-lg p-3 flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          차트 로딩 중...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-60 bg-muted rounded-lg p-3">
      <h3 className="text-sm font-medium mb-2 text-muted-foreground">
        24시간 온습도 변화
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={30} />
          <Tooltip
              contentStyle={{ fontSize: "12px" }}
              labelFormatter={(value) => `시간: ${value}`}
              formatter={(value: any, name: string) => {
                const unit = name === "온도" ? "°C" : "%";
                return [`${value} ${unit}`, name];
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              fill="url(#colorTemp)"
              name="온도"
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#38bdf8"
              fill="url(#colorHumidity)"
              name="습도"
            />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 🔒 memo로 컴포넌트 리렌더링 방지
export const HourlyForecastChart = React.memo(HourlyForecastChartComponent);
export default HourlyForecastChart;
