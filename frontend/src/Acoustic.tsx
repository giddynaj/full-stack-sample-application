import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type seriesMapType = {
  seriesMap: any;
  binCount: number;
};

function makeHistogramData({ seriesMap, binCount = 20 }: seriesMapType) {
  const keys = Object.keys(seriesMap);

  const cleaned = {};
  for (const k of keys)
    (cleaned as any)[k] = (seriesMap[k] ?? []).filter(Number.isFinite);

  const all = keys.flatMap((k) => (cleaned as any)[k]);
  if (all.length === 0) return [];

  const min = Math.min(...all);
  const max = Math.max(...all);
  const domainMin = min;
  const domainMax = max === min ? min + 1 : max;

  const step = (domainMax - domainMin) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => {
    const binStart = domainMin + i * step;
    const binEnd = i === binCount - 1 ? domainMax : domainMin + (i + 1) * step;

    const row = {
      binStart,
      binEnd,
      label: `${binStart.toFixed(1)}–${binEnd.toFixed(1)}`,
    };
    for (const k of keys) (row as any)[k] = 0;
    return row;
  });

  for (const k of keys) {
    for (const v of (cleaned as any)[k]) {
      let idx = Math.floor((v - domainMin) / step);
      if (idx >= binCount) idx = binCount - 1;
      if (idx < 0) idx = 0;
      (bins as any)[idx][k] += 1;
    }
  }

  return bins;
}

type PayloadType = {
  dataKey: string;
  name: string;
  value: string;
};

type CustomTooltipType = {
  active: string;
  payload: PayloadType[];
  label: string;
};
function CustomTooltip({ active, payload, label }: CustomTooltipType) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: "flex", gap: 8 }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}
type rowsType = {
  a: number;
  b: number;
};

export default function FetchedHistogram() {
  const [rows, setRows] = useState<rowsType[]>([]); // fetched data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        // Example endpoint: replace with yours
        const res = await fetch("http://localhost:8000/acoustic", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // Expecting json like: [{ a: 12.3, b: 9.8 }, ...]
        const parsed = json.data;
        setRows(Array.isArray(parsed) ? parsed : []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Operation was cancelled."); // Ignore or handle as needed
        } else {
          console.error(err); // Handle genuine errors
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // Convert fetched rows -> two numeric arrays
  const seriesA = useMemo(
    () => rows.map((r) => r.a).filter(Number.isFinite),
    [rows]
  );
  const seriesB = useMemo(
    () => rows.map((r) => r.b).filter(Number.isFinite),
    [rows]
  );

  // Build histogram bins for both series
  const chartData = useMemo(() => {
    return makeHistogramData({
      seriesMap: { "Column A": seriesA, "Column B": seriesB },
      binCount: 20,
    });
  }, [seriesA, seriesB]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: "crimson" }}>Error: {error}</div>;
  if (!chartData.length) return <div>No numeric data to display</div>;

  return (
    <div style={{ width: "100%", height: 420 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} barCategoryGap={2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={2} tick={{ fontSize: 12 }} />
          <YAxis />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          <Legend />
          <Bar dataKey="Column A" name="Column A" />
          <Bar dataKey="Column B" name="Column B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
