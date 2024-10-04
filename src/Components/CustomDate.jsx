import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import CustomTextField from "./CustomTextField"; // Update with the actual path to your CustomTextField component

const CustomDate = ({
  startDate,
  endDate,
  minDate,
  maxDate,
  handleStartDateChange,
  handleEndDateChange,
  resetDate,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.2)",
        margin: "10px",
        padding: "20px 30px",
        maxWidth: 550,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
        Select Date Range
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={5}>
          <CustomTextField
            fullWidth
            label="Start Date"
            variant="outlined"
            size="small"
            type="date"
            id="start-date"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            min={minDate}
            max={maxDate}
            onChange={handleStartDateChange}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <CustomTextField
            fullWidth
            label="End Date"
            variant="outlined"
            size="small"
            type="date"
            id="end-date"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            min={startDate ? startDate.toISOString().split("T")[0] : minDate}
            max={maxDate}
            onChange={handleEndDateChange}
            disabled={!startDate}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={resetDate}
            sx={{
              fontWeight: "bold",
              padding: "8px 16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomDate;
