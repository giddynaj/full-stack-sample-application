import { useState } from "react";

export default function PaginatedBlock(props: any) {
  let page = props.page;
  const setPage = props.setpage;
  const pageSize = 10;
  const totalPages = props.totalpages;
  const [loading, setLoading] = useState(false);
  //const [error, , setError] = useState("");

  return (
    <div style={{ display: "inline-block" }}>
      {loading && <p>Loading...</p>}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setPage((p: any) => p - 1)}
          disabled={page === 1 || loading}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages}{" "}
        </span>
        <button
          onClick={() => setPage((p: any) => p + 1)}
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
