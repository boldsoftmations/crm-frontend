import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";
import HideSourceIcon from "@mui/icons-material/HideSource";
export const PageNotFound = () => {
  return (
    <div className="mainbox">
      <div className="err">4</div>
      <div className="far">
        <HideSourceIcon fontSize="40" />
      </div>
      <div className="err2">4</div>
      <div className="msg">

          Let's go{" "}
          <Link className="link" to={`/`}>
            Login
          </Link>{" "}
          and try from there.

      </div>
    </div>
  );
};
