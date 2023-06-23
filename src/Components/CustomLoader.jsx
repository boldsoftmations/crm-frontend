import React, { memo } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

export const CustomLoader = memo((props) => {
  const { open } = props;
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
});
