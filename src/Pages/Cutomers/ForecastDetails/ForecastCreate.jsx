import { Alert, Box, Button, Grid, Snackbar } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import ProductService from "../../../services/ProductService";
import { ForecastProductCreate } from "./ForecastProductCreate";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const ForecastCreate = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [IDForEdit, setIDForEdit] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const Company_Name = data.companyName;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

  useEffect(() => {
    getProduct();
  }, []);

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

  const extractErrorMessages = (error) => {
    let messages = [];

    // Check if the error is from Axios and has a response with data
    if (error.response && error.response.data) {
      // Handle custom backend error structure
      if (error.response.data.errors) {
        for (const [key, value] of Object.entries(error.response.data.errors)) {
          value.forEach((msg) => {
            messages.push(`${key}: ${msg}`);
          });
        }
      } else if (error.response.data.message) {
        // Handle single message error
        messages.push(error.response.data.message);
      }
    } else {
      // Handle other types of errors (e.g., network error)
      messages.push(error.message || "An unknown error occurred");
    }

    return messages;
  };

  const createForecastDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: Company_Name,
        sales_person: users.email,
        product: selectedProduct,
      };
      const response = await CustomerServices.createForecastData(req);
      console.log("response", response);
      setIDForEdit(response.data.forecast_id);
      setOpenPopup(false);
      getAllCompanyDetailsByID();
      setOpen(false);
      // setOpenModal(true);
    } catch (error) {
      console.log("createing company detail error", error);
      const newErrors = extractErrorMessages(error.response.data);
      setErrorMessages(newErrors);
      setCurrentErrorIndex(0); // Reset the error index when new errors arrive
      setOpenSnackbar((prevOpen) => !prevOpen);
    } finally {
      setOpen(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
    }
  }, [currentErrorIndex, errorMessages.length]);

  return (
    <div>
      <CustomLoader open={open} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createForecastDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* <Button
              variant="outlined"
              // disabled={() => openModal(false)}
              onClick={() => setOpenModal(true)}
            >
              Add Product Forecast
            </Button> */}
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              name="company"
              label="Company"
              variant="outlined"
              value={Company_Name}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              multiline
              fullWidth
              name="cheque_no"
              size="small"
              label="Sales Person"
              variant="outlined"
              value={users.email}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedProduct(value)}
              options={productOption.map((option) => option.product)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Product Name"
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
      <Popup
        title={"Update Product Forecast Details"}
        openPopup={openModal}
        setOpenPopup={setOpenModal}
      >
        <ForecastProductCreate
          IDForEdit={IDForEdit}
          getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          setOpenModal={setOpenModal}
          setOpenPopup={setOpenPopup}
        />
      </Popup>
    </div>
  );
};
