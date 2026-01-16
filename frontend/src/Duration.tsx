import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Row = {
  name: string;
  value: number;
};

const data: Row[] = [
  { name: "A", value: 12 },
  { name: "B", value: 18 },
  { name: "C", value: 5 },
  { name: "D", value: 22 },
];
type durationDataType = {
  acoustic: string;
  tempo: string;
};

export default function DurationChart() {
  const [durationData, setDurationData] = useState();

  useEffect(() => {
    const fetchDurationData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/duration-bar`);
        if (!response.ok) {
          throw new Error("Failed to fetch duration data.");
        }
        const data = await response.json();
        console.log("data eb", data.data);
        setDurationData(data.data);
      } finally {
        //
      }
    };

    fetchDurationData();
  }, []);

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
