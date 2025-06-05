import { useState } from "react";

export default function useExpandableList(data = [], itemsPerRow = 4, initialRows = 1) {
  const [visibleRows, setVisibleRows] = useState(initialRows);
  const itemsPerPage = visibleRows * itemsPerRow;

  const visibleItems = data.slice(0, itemsPerPage);
  const hasMore = itemsPerPage < data.length;
  const showMore = () => setVisibleRows((prev) => prev + 1);

  return {
    visibleItems,
    hasMore,
    showMore,
  };
}
