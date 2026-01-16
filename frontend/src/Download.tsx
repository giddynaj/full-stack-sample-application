import React, { useMemo, useState } from "react";

/**
 * Primitive values allowed in CSV cells
 */
type CsvValue = string | number | boolean | null | undefined;

/**
 * Generic row type: keys map to CSV-safe values
 */
export type CsvRow = Record<string, CsvValue>;

/**
 * Escape a value for CSV output
 */
function escapeCsvValue(value: CsvValue): string {
  const s = value == null ? "" : String(value);

  // Wrap in quotes if needed and escape quotes
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Convert array of objects to CSV
 */
function rowsToCsv<T extends CsvRow>(rows: readonly T[]): string {
  if (rows.length === 0) return "";

  // Collect all headers across rows
  const headers: (keyof T)[] = Array.from(
    rows.reduce<Set<keyof T>>((set, row) => {
      (Object.keys(row) as (keyof T)[]).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  const headerLine = headers.map(String).join(",");

  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsvValue(row[h])).join(",")
  );

  return [headerLine, ...dataLines].join("\r\n");
}

/**
 * Trigger a browser download
 */
function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Example data shape
 */

type UserRow = {
  id: string;
  title: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
  num_bars: number;
  num_sections: number;
  num_segments: number;
  class: number;
  ratings: number;
};

type PlaylistTableProps = {
  playlists: UserRow[]; // or whatever your type is
};

const DownloadStateAsCsv = ({ playlists }: PlaylistTableProps) => {
  const [rows, setRows] = useState<UserRow[]>(playlists);
  const csv = useMemo(() => rowsToCsv(rows as any), [rows]);

  const handleDownload = (): void => {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:T]/g, "-")
      .slice(0, 19);
    downloadCsv(`users-${timestamp}.csv`, csv);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button onClick={handleDownload} disabled={!rows.length}>
        Download CSV
      </button>
    </div>
  );
};

export default DownloadStateAsCsv;
