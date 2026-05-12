import React from "react";
import { Box, Grid, Button } from "@mui/material";
import { Popup } from "./Popup";
import CustomTextField from "./CustomTextField";
import { getMaxEndDate } from "../utility/dateUtils";

const CustomDateFilterPopup = ({
  open,
  setOpen,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onSubmit,
  minDate,
  maxDate,
  onError, // ✅ NEW PROP (for professional alert/snackbar)
}) => {
  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  const handleStartDateChange = (event) => {
    const value = event.target.value;

    if (!value) {
      onError && onError("Please select a valid start date");
      return;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      onError && onError("Invalid start date selected");
      return;
    }

    setStartDate(date);

    const maxEnd = getMaxEndDate(date);

    if (endDate && new Date(endDate) > maxEnd) {
      setEndDate(maxEnd);
      onError &&
        onError("End date adjusted to maximum allowed range (3 months)");
    }
  };
  const getResetDate = () => {
    setStartDate(new Date());
    setEndDate(new Date());
  };
  const handleEndDateChange = (event) => {
    const value = event.target.value;

    if (!value) {
      onError && onError("Please select a valid end date");
      return;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      onError && onError("Invalid end date selected");
      return;
    }

    if (!startDate) {
      setEndDate(date);
      return;
    }

    const maxEnd = getMaxEndDate(startDate);

    if (date > maxEnd) {
      onError && onError("Date range cannot exceed 3 months");
      return;
    }

    setEndDate(date);
  };

  return (
    <Popup
      openPopup={open}
      setOpenPopup={setOpen}
      title="Date Filter"
      maxWidth="md"
    >
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          backgroundColor: "#fff4e5",
          border: "1px solid #ffa726",
          borderRadius: "6px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#e65100", fontWeight: 500 }}>
          Note: You cannot filter data for more than 3 months.
        </span>
      </Box>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          padding: "20px",
        }}
      >
        {/* ✅ NOTE HERE */}

        <Grid container spacing={2}>
          {/* Start Date */}
          <Grid item xs={4}>
            <CustomTextField
              fullWidth
              label="Start Date"
              size="small"
              type="date"
              value={formatDate(startDate)}
              min={minDate}
              max={maxDate}
              onChange={handleStartDateChange}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={4}>
            <CustomTextField
              fullWidth
              label="End Date"
              size="small"
              type="date"
              value={formatDate(endDate)}
              min={startDate ? formatDate(startDate) : minDate}
              max={startDate ? formatDate(getMaxEndDate(startDate)) : maxDate}
              onChange={handleEndDateChange}
              disabled={!startDate}
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={2}>
            <Button fullWidth variant="contained" onClick={onSubmit}>
              Submit
            </Button>
          </Grid>

          {/* Reset */}
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "red",
                color: "red",
                "&:hover": {
                  color: "red",
                  borderColor: "red",
                },
              }}
              onClick={getResetDate}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Popup>
  );
};

export default CustomDateFilterPopup;
