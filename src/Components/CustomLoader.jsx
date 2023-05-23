import React from "react";
import "./Style.css";
export const CustomLoader = (props) => {
  const { open } = props;

  return open ? (
    <div className="custom-loader">
      <div className="backdrop"></div>
      <div className="spinner"></div>
    </div>
  ) : null;
};
