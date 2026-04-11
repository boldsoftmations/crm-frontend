import { Box, Button, Grid, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import ProductService from "../../../services/ProductService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

import CustomSnackbar from "../../../Components/CustomerSnackbar";

import InvoiceServices from "../../../services/InvoiceService";

export const DispatchPackaginigUpdate = ({
  recordForEdit,
  setOpenUpdatePopup,
  getAllMasterCountries,
}) => {
  const [open, setOpen] = useState(false);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [consumable, setConsumable] = useState([]);
  const [sellerAccount, setSellerAccount] = useState([]);
  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  const [inputValue, setInputValue] = useState({
    product: recordForEdit.product_name || "",
    seller_account_input: recordForEdit.seller_account_name || "",
    quantity: recordForEdit.quantity || "",
    unit: recordForEdit.unit_name || "",
    unit_cost: recordForEdit.unit_cost || "",
  });
  console.log("data :", recordForEdit);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getConsumableData = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllConsumable("all", "");
      console.log(res.data);
      setConsumable(res.data);
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
  const getSellerAccountData = async () => {
    try {
      setOpen(true);
      const res = await InvoiceServices.getAllSellerAccountData();
      setSellerAccount(res.data.results);
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
    getConsumableData();
    getSellerAccountData();
  }, []);


  const handleAutocompleteChange = (event, newValue) => {
    if (!newValue) return;

    setInputValue((prevData) => ({
      ...prevData,
      product: newValue.name, // ✅ store name
      unit: newValue.unit, // ✅ auto set unit
     
    }));
  };
  const handleSellerAccountChange = (event, newValue) => {
    setInputValue((prevData) => ({
      ...prevData,
      seller_account_input: newValue ? newValue.unit : "",
    }));
  };

  const updateMasterCountry = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);

      const response = await InvoiceServices.updateDispatchPackagingData(
        recordForEdit.id,
        inputValue,
      );

      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "Updated successfully",
          severity: "success",
          open: true,
        });

        setTimeout(() => {
          setOpenUpdatePopup(false);
          getAllMasterCountries();
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Update failed",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          "An unexpected error occurred",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
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

      <Box component="form" noValidate onSubmit={updateMasterCountry}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              label="Product Name"
              name="product"
              size="small"
              value={
                consumable.find((item) => item.name === inputValue.product) ||
                null
              }
              options={consumable.map((item) => item)}
              getOptionLabel={(option) => option.name || ""}
              onChange={handleAutocompleteChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Unit"
              name="unit_cost"
              size="small"
              value={inputValue.unit || ""}
              inputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              label="Seller Account"
              name="seller_account_input"
              size="small"
              value={
                sellerAccount.find(
                  (item) => item.unit === inputValue.seller_account_input,
                ) || null
              }
              options={sellerAccount}
              getOptionLabel={(option) => option.unit || ""}
              onChange={handleSellerAccountChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              size="small"
              value={inputValue.quantity || ""}
              onChange={handleInputChange}
              name="quantity"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Unit Cost"
              type="number"
              fullWidth
              size="small"
              value={inputValue.unit_cost || ""}
              onChange={handleInputChange}
              name="unit_cost"
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
    </>
  );
};
