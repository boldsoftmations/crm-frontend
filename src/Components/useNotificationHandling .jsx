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
      let errorData = error.response && error.response.data;
      let extractedErrors = [];

      if (errorData && errorData.detail) {
        extractedErrors = [errorData.detail];
      } else if (errorData && errorData.errors) {
        extractedErrors = Object.entries(errorData.errors).flatMap(
          ([key, value]) =>
            Array.isArray(value)
              ? value.map((msg) => `${key}: ${msg}`)
              : `${key}: ${value}`
        );
      }

      if (extractedErrors.length === 0) {
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
