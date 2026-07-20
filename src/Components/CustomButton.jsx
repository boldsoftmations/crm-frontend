import { Button } from "@mui/material";
import React from "react";

export const CustomButton = (props) => {
  const { type, fullWidth, variant, text, others, sx, startIcon, disabled } =
    props;
  return (
    <Button
      startIcon={startIcon}
      type={type}
      fullWidth={fullWidth}
      variant={variant}
      sx={{ ...sx, backgroundColor: "#006ba1" }}
      {...others}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};
