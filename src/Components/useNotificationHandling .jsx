import { useState, useCallback } from "react";

export const useNotificationHandling = (initialErrorMessages = []) => {
  const [errorMessages, setErrorMessages] = useState(initialErrorMessages);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: initialErrorMessages[0] || "",
    severity: "info",
  });

  const updateAlertInfo = useCallback((messages, severity) => {
    setAlertInfo({
      open: true,
      message: messages[0] || "An unexpected error occurred",
      severity,
    });
    setErrorMessages(messages);
  }, []);

  const handleSuccess = useCallback(
    (message) => {
      updateAlertInfo([message], "success");
    },
    [updateAlertInfo]
  );

  const handleError = useCallback(
    (error) => {
      let extractedErrors = [];

      // ✅ If it's a plain string (custom validation)
      if (typeof error === "string") {
        extractedErrors = [error];
      }
      // ✅ If it's a standard Error object with response (like Axios)
      else if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.detail) {
          extractedErrors = [errorData.detail];
        } else if (errorData.errors) {
          extractedErrors = Object.entries(errorData.errors).flatMap(
            ([key, value]) =>
              Array.isArray(value)
                ? value.map((msg) => `${key}: ${msg}`)
                : `${key}: ${value}`
          );
        }
      }
      // ✅ Fallback (unknown case)
      else {
        extractedErrors = ["An unexpected error occurred"];
      }

      updateAlertInfo(extractedErrors, "error");
    },
    [updateAlertInfo]
  );

  const handleCloseSnackbar = useCallback(() => {
    if (errorMessages.length > 1) {
      const [nextMessage, ...restMessages] = errorMessages;
      setErrorMessages(restMessages);
      setAlertInfo((prev) => ({
        ...prev,
        message: nextMessage,
      }));
    } else {
      setAlertInfo((prev) => ({ ...prev, open: false }));
    }
  }, [errorMessages]);

  return {
    alertInfo,
    handleSuccess,
    handleError,
    handleCloseSnackbar,
  };
};
