import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
// import { month, year } from "./DateAndYear";

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
  console.log("forecast", forecast);
  console.log("forecastDataByID", forecastDataByID);
  console.log("selectedMonthForecast", selectedMonthForecast);
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
      // setOpenPopup(false);s
      getAllCompanyDetailsByID();
      setOpen(false);
    } catch (error) {
      console.log("createing company detail error", error);
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
                onChange={(event) => handleFormChange(event)}
              >
                {forecastDataByID.product_forecast.map((option, i) => {
                  return (
                    i >= 2 && (
                      <MenuItem key={i} value={option}>
                        {months[option.month - 1]}
                      </MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
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

          {/* <Grid item xs={12} sm={8} alignContent="right">
                  <Button
                    onClick={addFields}
                    variant="contained"
                    sx={{ marginRight: "1em" }}
                  >
                    Add More...
                  </Button>
                  {index !== 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  )}
                </Grid> */}
          {/* </>
            );
          })} */}
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
