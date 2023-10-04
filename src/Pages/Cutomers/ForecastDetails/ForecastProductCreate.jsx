import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import { year } from "./DateAndYear";
import { month } from "./DateAndYear";
import CustomTextField from "../../../Components/CustomTextField";
export const ForecastProductCreate = (props) => {
  const { setOpenModal, getAllCompanyDetailsByID, IDForEdit } = props;
  const [open, setOpen] = useState(false);
  const [productForecast, setProductForecast] = useState([
    {
      product_forecast: IDForEdit,
      month: 0,
      year: 0,
      forecast: 0,
    },
  ]);

  // const handleFormChange = (event) => {
  //   let data = [...productForecast];
  //   data[event.target.name] = event.target.value;
  //   setProductForecast(data);
  // };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductForecast({ ...productForecast, [name]: value });
  };
  // const addFields = () => {
  //   let newfield = {
  //     product_forecast: IDForEdit,
  //     month: "mm",
  //     year: "yy",
  //     forecast: 0,
  //   };
  //   setProductForecast([...productForecast, newfield]);
  // };

  // const removeFields = (index) => {
  //   let data = [...productForecast];
  //   data.splice(index, 1);
  //   setProductForecast(data);
  // };

  const createProductForecastDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        product_forecast: IDForEdit,
        month: productForecast.month,
        year: productForecast.year,
        forecast: productForecast.forecast,
      };
      const response = await CustomerServices.createProductForecastData(req);
      console.log("response", response);
      setOpenModal(false);
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
        onSubmit={(e) => createProductForecastDetails(e)}
      >
        <Grid container spacing={2}>
          {/* {productForecast.map((input, index) => {
            return (
              <> */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="product_forecast"
              size="small"
              label="product_forecast"
              variant="outlined"
              value={IDForEdit}
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ marginRight: "2rem" }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="month"
                label="Month"
                // value={filterQuery}
                onChange={(event) => handleFormChange(event)}
              >
                {month.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ marginRight: "2rem" }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Year</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="year"
                label="Year"
                // value={filterQuery}
                onChange={(event) => handleFormChange(event)}
              >
                {year.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type={"number"}
              name="forecast"
              size="small"
              label="Forecast"
              variant="outlined"
              value={productForecast.forecast}
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
