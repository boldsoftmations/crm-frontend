import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import CustomTextField from "../../../Components/CustomTextField";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const ForecastUpdate = (props) => {
  const { getAllCompanyDetailsByID, setOpenPopup, forecastDataByID } = props;
  const [open, setOpen] = useState(false);
  const [selectedMonthForecast, setSelectedMonthForecast] = useState([]);
  const [forecast, setForecast] = useState(null);

  // Get current month and next two months
  const currentMonth = new Date().getMonth(); // 0-indexed (0 = January)
  const nextTwoMonths = [
    currentMonth,
    (currentMonth + 1) % 12,
    (currentMonth + 2) % 12,
  ];

  useEffect(() => {
    console.log("forecast", forecast);
    console.log("forecastDataByID", forecastDataByID);
    console.log("selectedMonthForecast", selectedMonthForecast);
  }, [forecast, forecastDataByID, selectedMonthForecast]);

  const handleFormChange = (event) => {
    setSelectedMonthForecast(event.target.value);
  };

  const updateProductForecastDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product_forecast: selectedMonthForecast.product_forecast,
        month: selectedMonthForecast.month,
        year: selectedMonthForecast.year,
        forecast: forecast
          ? forecast
          : selectedMonthForecast && selectedMonthForecast.forecast
          ? selectedMonthForecast.forecast
          : "",
      };
      await CustomerServices.updateProductForecastData(
        selectedMonthForecast.id,
        req
      );
      setOpenPopup(false);
      getAllCompanyDetailsByID();
      setOpen(false);
    } catch (error) {
      console.log("creating company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateProductForecastDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="month"
                label="Month"
                onChange={handleFormChange}
              >
                {forecastDataByID.product_forecast
                  .filter((option) => nextTwoMonths.includes(option.month - 1))
                  .map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {months[option.month - 1]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="forecast"
              size="small"
              label="Forecast"
              variant="outlined"
              value={
                forecast
                  ? forecast
                  : selectedMonthForecast && selectedMonthForecast.forecast
                  ? selectedMonthForecast.forecast
                  : ""
              }
              onChange={(event) => setForecast(event.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
