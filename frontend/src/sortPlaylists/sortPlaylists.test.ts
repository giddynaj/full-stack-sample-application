import { sortPlaylistsByKey, SortConfig } from "./sortPlaylists";

type Playlist = {
  id: number;
  name: string;
  tracks: number;
};

describe("sortPlaylistsByKey", () => {
  const data: Playlist[] = [
    { id: 2, name: "B", tracks: 10 },
    { id: 1, name: "A", tracks: 30 },
    { id: 3, name: "C", tracks: 20 },
  ];

  test("sorts ascending by key when key differs from sortConfig.key", () => {
    const sortConfig: SortConfig = { key: "tracks", direction: "asc" };

    const { sortedData, nextSortConfig } = sortPlaylistsByKey(
      data,
      "name",
      sortConfig
    );

    expect(sortedData.map((p) => p.name)).toEqual(["A", "B", "C"]);
    expect(nextSortConfig).toEqual({ key: "name", direction: "asc" });

    // original array should not be mutated
    expect(data.map((p) => p.id)).toEqual([2, 1, 3]);
  });

  test("toggles to descending when sorting same key and current direction is asc", () => {
    const sortConfig: SortConfig = { key: "name", direction: "asc" };

    const { sortedData, nextSortConfig } = sortPlaylistsByKey(
      data,
      "name",
      sortConfig
    );

    expect(sortedData.map((p) => p.name)).toEqual(["C", "B", "A"]);
    expect(nextSortConfig).toEqual({ key: "name", direction: "desc" });
  });

  test("resets to ascending when sorting same key and current direction is desc", () => {
    // Based on your current logic: only flips when current is asc -> desc.
    // If it's already desc, calling again yields asc.
    const sortConfig: SortConfig = { key: "name", direction: "desc" };

    const { sortedData, nextSortConfig } = sortPlaylistsByKey(
      data,
      "name",
      sortConfig
    );

    expect(sortedData.map((p) => p.name)).toEqual(["A", "B", "C"]);
    expect(nextSortConfig).toEqual({ key: "name", direction: "asc" });
  });

  test("returns stable ordering when values are equal for the sort key", () => {
    const tied: Playlist[] = [
      { id: 1, name: "A", tracks: 10 },
      { id: 2, name: "B", tracks: 10 },
      { id: 3, name: "C", tracks: 5 },
    ];
    const sortConfig: SortConfig = { key: "name", direction: "asc" };

    const { sortedData } = sortPlaylistsByKey(tied, "tracks", sortConfig);

    expect(sortedData.map((p) => p.id)).toEqual([3, 1, 2]);
  });
});
