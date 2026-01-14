export type SortDirection = "asc" | "desc";

export type SortConfig = {
  key: string;
  direction: SortDirection;
};

export function sortPlaylistsByKey<T extends Record<string, any>>(
  playlists: T[],
  key: keyof T & string,
  sortConfig: SortConfig
): { sortedData: T[]; nextSortConfig: SortConfig } {
  let direction: SortDirection = "asc";

  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }

  const sortedData = [...playlists].sort((a, b) => {
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return {
    sortedData,
    nextSortConfig: { key, direction },
  };
}
