import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Alert,
} from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import ProductService from "../../../services/ProductService";
import LeadServices from "../../../services/LeadService";

export const LeadForecastCreate = (
  props,
  { getAllLeadDetailsByID, setOpenPopup, refreshData }
) => {
  const { leadsByID, getLeadByID, setOpenModal } = props;
  const [leadForecast, setLeadForecast] = useState({
    lead: leadsByID,
    product: "",
    month: "",
    quantity: "",
  });
  const [open, setOpen] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setMonthOptions(getMonthOptions());
    getProduct();
  }, []);

  const getMonthOptions = () => {
    const monthNames = [
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

    let options = [];
    let currentDate = new Date();
    for (let i = 1; i <= 2; i++) {
      let futureDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      options.push(monthNames[futureDate.getMonth()]);
    }
    return options;
  };
  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllValidPriceList("all");
      setProductOption(res.data);

      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadForecast({ ...leadForecast, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await LeadServices.createLeadForecast(leadForecast);
      await getLeadByID(leadsByID);
      console.log("Lead Potential Created:", response.data);
      setOpenPopup(false);
      getAllLeadDetailsByID();
      setSuccessMessage("Successfully created forecast");
    } catch (err) {
      alert = "This Product Forecast Already Created";
    }
  };

  return (
    <form>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            name="product"
            size="small"
            disablePortal
            id="combo-box-demo"
            onChange={(event, value) => {
              setSelectedProduct(value);
              setLeadForecast({ ...leadForecast, product: value });
            }}
            options={productOption.map((option) => option.product)}
            getOptionLabel={(option) => option}
            sx={{ minWidth: 300 }}
            renderInput={(params) => (
              <CustomTextField {...params} label="Product Name" />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Autocomplete
            name="month"
            size="small"
            disablePortal
            id="month-autocomplete"
            value={leadForecast.month}
            onChange={(event, value) =>
              setLeadForecast({ ...leadForecast, month: value })
            }
            options={monthOptions}
            sx={{ minWidth: 300 }}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={leadForecast.quantity}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Create Lead Forecast
            </Button>
          </Box>
        </Grid>
      </Grid>
      {successMessage && (
        <Grid item xs={12}>
          <Alert severity="success">{successMessage}</Alert>
        </Grid>
      )}
    </form>
  );
};
