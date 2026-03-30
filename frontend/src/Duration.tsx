import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useFetchData } from "./useFetchData";
import { API_BASE_URL } from "./config";

type Row = {
  name: string;
  value: number;
};

export default function DurationChart() {
  const { data: durationData } = useFetchData<Row[]>(
    `${API_BASE_URL}/duration-bar`
  );

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart
          data={durationData}
          margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
