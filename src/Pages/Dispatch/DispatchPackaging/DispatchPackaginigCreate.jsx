import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

import InvoiceServices from "../../../services/InvoiceService";
import ProductService from "../../../services/ProductService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const DispatchPackaginigCreate = ({
  setOpenPopup,
  getAllMasterCountries,
}) => {
  const [open, setOpen] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const [inputValue, setInputValue] = useState({
    product: "",
    quantity: "",
    unit: "",
    unit_cost: "",
    seller_account_input: "",
    pending_quantity: "",
  });
  const [productListing, setproductListing] = useState([]);

  const getInventoryProducts = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllStoresInventoryDetails(
        "all",
        "consumables",
      );
      console.log("Data is :", res.data);
      setproductListing(res.data);
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "An unexpected error occurred",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };
  useEffect(() => {
    getInventoryProducts();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAutocompleteChange = (event, newValue) => {
    if (!newValue) return;

    setInputValue((prevData) => ({
      ...prevData,
      product: newValue.product, // ✅ store name
      unit: newValue.unit,
      seller_account_input: newValue.seller_account,
      unit_cost: newValue.rate,
      pending_quantity: newValue.pending_quantity,
      // ✅ auto set unit
      // Set seller account when product changes
    }));
    console.log(inputValue);
  };

  const createCountry = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      const { pending_quantity, ...payload } = inputValue;
      const response =
        await InvoiceServices.createDispatchPackagingData(payload);
      if (response.status === 201) {
        setAlertMsg({
          message:
            response.message || "Dispatch packaging created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          setOpenPopup(false);
          getAllMasterCountries();
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Failed to create country",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "An unexpected error occurred",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
      // Reset input value after submission
      setInputValue({
        product: "",
        quantity: "",
        unit: "",
        unit_cost: "",
        seller_account_input: "",
      });
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={createCountry} // Moved onSubmit to the Box component
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              label="Product Name"
              name="product"
              size="small"
              value={
                productListing.find(
                  (item) => item.product === inputValue.product,
                ) || null
              }
              options={productListing.map((item) => item)}
              getOptionLabel={(option) => option.product || ""}
              onChange={handleAutocompleteChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unit"
              name="unit"
              size="small"
              value={inputValue.unit || ""}
              inputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Seller Account"
              name="seller_account_input"
              size="small"
              value={inputValue.seller_account_input}
              inputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unit Cost"
              name="unit_cost"
              size="small"
              inputProps={{
                readOnly: true,
              }}
              value={inputValue.unit_cost}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Available Quantity"
              name="pending_quantity"
              size="small"
              value={inputValue.pending_quantity}
              onChange={handleInputChange}
              inputProps={{
                readOnly: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              size="small"
              value={inputValue.quantity}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>

        <Button
          type="submit" // Keep type submit for the button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
