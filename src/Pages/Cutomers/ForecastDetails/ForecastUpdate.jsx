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
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import { month, year } from "./DateAndYear";

export const ForecastUpdate = (props) => {
  const { getAllCompanyDetailsByID, forecastDataByID, setOpenPopup } = props;
  console.log("forecastDataByID", forecastDataByID);
  const [open, setOpen] = useState(false);
  const [productForecast, setProductForecast] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductForecast({ ...productForecast, [name]: value });
  };
  let searchValue = (property_value, array) => {
    let new_array = {};
    for (let i = 0; i < array.length; i++) {
      if (i === property_value) {
        return array[i];
      }
    }
    return new_array;
  };

  let FORECAST_DATA = searchValue(selectedMonth, forecastDataByID);
  console.log("FORECAST_DATA", FORECAST_DATA);
  // let array = [];
  // let obj =
  //   forecastDataByID.length > 0 &&
  //   forecastDataByID.map((element) => {
  //     return {
  //       product_forecast: element.product_forecast,
  //       month: element.month,
  //       year: element.year,
  //       forecast: element.forecast,
  //     };
  //   });

  // array.push(obj);
  // console.log("array", array);
  const updateProductForecastDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const req = {
        product_forecast: selectedMonth.product_forecast,
        month: selectedMonth.month,
        year: selectedMonth.year,
        forecast: productForecast
          ? productForecast.forecast
          : selectedMonth
          ? selectedMonth.forecast
          : "",
      };
      await CustomerServices.updateProductForecastData(selectedMonth.id, req);
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
          {/* {productForecast.map((input, index) => {
            return (
              <> */}
          {/* <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="product_forecast"
              size="small"
              label="Product Forecast"
              variant="outlined"
              value={selectedMonth ? selectedMonth.product_forecast : ""}
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="month"
                label="Month"
                value={selectedMonth ? selectedMonth : FORECAST_DATA.month}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {forecastDataByID.map((option, i) => {
                  return (
                    i >= 3 && (
                      <MenuItem key={i} value={option}>
                        {option.month}
                      </MenuItem>
                    )
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={3} sx={{ marginRight: "2rem" }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="year"
                label="Year"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {year.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type={"number"}
              name="forecast"
              size="small"
              label="Forecast"
              variant="outlined"
              value={
                productForecast.forecast
                  ? productForecast.forecast
                  : selectedMonth
                  ? selectedMonth.forecast
                  : ""
              }
              onChange={(event) => handleFormChange(event)}
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
