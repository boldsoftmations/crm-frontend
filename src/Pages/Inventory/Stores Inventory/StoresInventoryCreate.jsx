import React, { memo, useEffect, useState } from "react";
import { Box, Grid, Button } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import ProductService from "../../../services/ProductService";
import InvoiceServices from "../../../services/InvoiceService";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
export const StoresInventoryCreate = memo((props) => {
  const {
    setOpenPopup,
    getAllStoresInventoryDetails,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [storeInventoryData, setStoreInventoryData] = useState([]);
  const [product, setProduct] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let updatedPendingQuantity = storeInventoryData.pending_quantity;
    let updatedAmount = storeInventoryData.amount;

    if (name === "quantity") {
      updatedPendingQuantity = parseInt(value);
      const rate = parseFloat(storeInventoryData.rate || 0); // If rate is not entered, default to 0
      updatedAmount = rate * parseFloat(value) || ""; // If rate is not entered, set amount as an empty string
    } else if (name === "rate") {
      updatedAmount =
        parseFloat(value) * parseInt(storeInventoryData.quantity) || ""; // If quantity is not entered, set amount as an empty string
    }

    setStoreInventoryData({
      ...storeInventoryData,
      [name]: value,
      pending_quantity: updatedPendingQuantity,
      amount: updatedAmount,
    });
  };

  const handleSelectChange = (name, value) => {
    setStoreInventoryData({
      ...storeInventoryData,
      [name]: value,
    });
  };

  useEffect(() => {
    getProduct();
    getAllSellerAccountsDetails();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      console.log("response seller", response.data);
      setSellerData(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const createStoreInventoryDetails = async (e) => {
    try {
      e.preventDefault();
      const req = {
        seller_account: storeInventoryData.seller_account,
        product: storeInventoryData.product,
        quantity: storeInventoryData.quantity,
        pending_quantity: storeInventoryData.pending_quantity,
        rate: storeInventoryData.rate,
        amount: storeInventoryData.amount,
      };
      setOpen(true);
      await InventoryServices.createStoresInventoryData(req);
      const successMessage = "Store Inventory Created Successfully";
      handleSuccess(successMessage);
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      getAllStoresInventoryDetails(currentPage, searchQuery);
      setOpen(false);
    } catch (err) {
      handleError(err);
      setOpen(false);
      console.error("error Store Inventory", err);
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createStoreInventoryDetails(e)}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              value={storeInventoryData.seller_account || ""}
              onChange={(event, value) =>
                handleSelectChange("seller_account", value)
              }
              options={sellerData.map((option) => option.unit)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Seller Account"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              value={storeInventoryData.product || ""}
              onChange={(event, value) => handleSelectChange("product", value)}
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={storeInventoryData.quantity || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="pending_quantity"
              size="small"
              label="Pending Quantity"
              variant="outlined"
              value={storeInventoryData.pending_quantity || ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="rate"
              size="small"
              label="Rate"
              variant="outlined"
              value={storeInventoryData.rate || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="amount"
              size="small"
              label="Amount"
              variant="outlined"
              value={storeInventoryData.amount || ""}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, textAlign: "right" }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
});
