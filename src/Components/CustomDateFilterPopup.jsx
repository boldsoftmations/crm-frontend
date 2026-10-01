import React from "react";
import { Box, Grid, Button } from "@mui/material";
import { Popup } from "./Popup";

import CustomTextField from "./CustomTextField";
import { getMaxEndDate, formatDate } from "../utility/dateUtils";
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
  onReset,
  onError, // ✅ NEW PROP (for professional alert/snackbar)
}) => {
  // const getMaxEndDate = (date) =>
  //   date ? new Date(date).toISOString().split("T")[0] : "";

  const handleStartDateChange = (event) => {
    if (!event.target.value) return;

    // create local date (no timezone shift)
    const selectedDate = new Date(event.target.value + "T00:00:00");

    setStartDate(selectedDate);

    if (endDate) {
      const maxEnd = getMaxEndDate(selectedDate);

      if (endDate > maxEnd) {
        setEndDate(maxEnd);

        if (onError) {
          onError("End date adjusted to maximum allowed range (3 months)");
        }
      }
    }
  };
  const getResetDate = () => {
    setStartDate(null);
    setEndDate(null);

    if (onReset) {
      onReset();
    }
  };
  const handleEndDateChange = (event) => {
    if (!event.target.value) return;
    console.log("End Date Changed:", event.target.value);

    const selectedDate = new Date(event.target.value + "T00:00:00");
    console.log(selectedDate);

    if (startDate && selectedDate < startDate) {
      if (onError) {
        onError("End date cannot be before start date");
      }
      return;
    }

    if (startDate) {
      const maxEnd = getMaxEndDate(startDate);

      if (selectedDate > maxEnd) {
        if (onError) {
          onError("Date range cannot exceed 3 months");
        }
        return;
      }
    }

    setEndDate(selectedDate);
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
