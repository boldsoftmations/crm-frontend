import React, { memo } from "react";
import "./CustomLoader.css"; // ⬅️ import CSS

export const CustomLoader = memo(({ open }) => {
  if (!open) return null;

  return (
    <div className="loader-backdrop">
      <div class="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
});
