import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export const MessageAlert = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          maxWidth: 600,
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          alignItems: "flex-start",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
