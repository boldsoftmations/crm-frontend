import { useState, useCallback } from "react";

const humanizeFieldName = (fieldName) => {
  if (!fieldName || fieldName === "non_field_errors") {
    return "";
  }

  return String(fieldName)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const extractDjangoErrorDetails = (value) => {
  if (typeof value !== "string") {
    return [];
  }

  const messages = [];
  const regex =
    /ErrorDetail\(string=(?:'([^']*)'|"([^"]*)"),\s*code=(?:'[^']*'|"[^"]*")\)/g;

  let match = regex.exec(value);

  while (match) {
    const message = match[1] || match[2];

    if (message && messages.indexOf(message) === -1) {
      messages.push(message);
    }

    match = regex.exec(value);
  }

  return messages;
};

const isHtmlResponse = (value) => {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized.indexOf("<!doctype html") === 0 ||
    normalized.indexOf("<html") === 0
  );
};

const addMessage = (messages, message, fieldName) => {
  if (message === null || message === undefined || message === "") {
    return;
  }

  const stringMessage = String(message).trim();

  if (!stringMessage) {
    return;
  }

  const djangoMessages = extractDjangoErrorDetails(stringMessage);

  if (djangoMessages.length > 0) {
    djangoMessages.forEach((djangoMessage) => {
      addMessage(messages, djangoMessage, fieldName);
    });
    return;
  }

  if (isHtmlResponse(stringMessage)) {
    return;
  }

  const fieldLabel = humanizeFieldName(fieldName);
  const finalMessage = fieldLabel
    ? fieldLabel + ": " + stringMessage
    : stringMessage;

  if (messages.indexOf(finalMessage) === -1) {
    messages.push(finalMessage);
  }
};

const extractMessagesFromValue = (value, messages, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    addMessage(messages, value, fieldName);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      extractMessagesFromValue(item, messages, fieldName);
    });
    return;
  }

  if (typeof value === "object") {
    Object.keys(value).forEach((key) => {
      extractMessagesFromValue(value[key], messages, key);
    });
  }
};

const extractBackendErrorMessages = (error) => {
  const messages = [];

  if (typeof error === "string") {
    addMessage(messages, error);
    return messages;
  }

  if (!error) {
    return messages;
  }

  if (error.response && error.response.data !== undefined) {
    const errorData = error.response.data;

    // Common backend response formats used in this CRM:
    // { message: "..." }
    // { detail: "..." }
    // { error: "..." }
    // { errors: { field: ["..."] } }
    // DRF field errors directly: { field: ["..."] }
    if (typeof errorData === "string") {
      addMessage(messages, errorData);
    } else if (Array.isArray(errorData)) {
      extractMessagesFromValue(errorData, messages);
    } else if (errorData && typeof errorData === "object") {
      if (errorData.detail !== undefined) {
        extractMessagesFromValue(errorData.detail, messages);
      }

      if (errorData.message !== undefined) {
        extractMessagesFromValue(errorData.message, messages);
      }

      if (errorData.error !== undefined) {
        extractMessagesFromValue(errorData.error, messages);
      }

      if (errorData.errors !== undefined) {
        extractMessagesFromValue(errorData.errors, messages);
      }

      // If none of the standard keys produced a useful message,
      // parse the full DRF validation object, e.g.
      // { mobile_number: ["This contact number is already mapped..."] }
      if (messages.length === 0) {
        Object.keys(errorData).forEach((key) => {
          if (
            key !== "status" &&
            key !== "statusCode" &&
            key !== "success" &&
            key !== "code"
          ) {
            extractMessagesFromValue(errorData[key], messages, key);
          }
        });
      }
    }

    if (messages.length === 0 && error.response.status) {
      if (error.response.status >= 500) {
        addMessage(
          messages,
          "Server error. Please try again or contact the administrator.",
        );
      } else {
        addMessage(
          messages,
          "Request failed with status " + error.response.status + ".",
        );
      }
    }

    return messages;
  }

  if (error.message) {
    if (String(error.message).toLowerCase() === "network error") {
      addMessage(
        messages,
        "Unable to connect to the server. Please check your connection and try again.",
      );
    } else {
      addMessage(messages, error.message);
    }
  }

  return messages;
};

export const useNotificationHandling = (initialErrorMessages = []) => {
  const [errorMessages, setErrorMessages] = useState(initialErrorMessages);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: initialErrorMessages.length > 0 ? initialErrorMessages.join("\n") : "",
    severity: "info",
  });

  const updateAlertInfo = useCallback((messages, severity) => {
    const safeMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
        : ["Something went wrong. Please try again."];

    setAlertInfo({
      open: true,
      message: safeMessages.join("\n"),
      severity,
    });

    setErrorMessages(safeMessages);
  }, []);

  const handleSuccess = useCallback(
    (message) => {
      updateAlertInfo([message], "success");
    },
    [updateAlertInfo],
  );

  const handleError = useCallback(
    (error) => {
      const extractedErrors = extractBackendErrorMessages(error);

      updateAlertInfo(
        extractedErrors.length > 0
          ? extractedErrors
          : ["Something went wrong. Please try again."],
        "error",
      );
    },
    [updateAlertInfo],
  );

  const handleCloseSnackbar = useCallback(() => {
    setAlertInfo((previous) => ({
      ...previous,
      open: false,
    }));

    setErrorMessages([]);
  }, []);

  return {
    alertInfo,
    errorMessages,
    handleSuccess,
    handleError,
    handleCloseSnackbar,
  };
};
