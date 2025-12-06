import { Box, Button, Grid } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { useSelector } from "react-redux";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
export const MaterialTransferNoteCreate = memo((props) => {
  const {
    setOpenCreatePopup,

    getAllMaterialTransferNoteDetails,
    currentPage,
    searchQuery,

    acceptedFilter,
  } = props;
  const [open, setOpen] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [materialTransferNoteDetails, setMaterialTransferNoteDetails] =
    useState([]);

  const handleSelectChange = (name, value) => {
    let updates = { [name]: value };

    if (name === "product") {
      const selectedProduct = productOption.find(
        (item) => item.product__name === value
      );
      if (selectedProduct) {
        updates.product__unit = selectedProduct.product__unit;
        updates.seller_account = selectedProduct.seller_account;
        updates.type_of_unit = selectedProduct.type_of_unit;
        updates.max_decimal_digit = selectedProduct.max_decimal_digit;
      }
      console.log(selectedProduct);
    }

    setMaterialTransferNoteDetails((prevDetails) => ({
      ...prevDetails,
      ...updates,
    }));
  };

  const handleInputChnage = (e) => {
    const { name, value } = e.target;
    setMaterialTransferNoteDetails({
      ...materialTransferNoteDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    setOpen(true);
    try {
      const response =
        await InventoryServices.getAllConsProductionInventoryData();
      if (response && response.data) {
        setProductOption(response.data);
      }
    } catch (err) {
      handleError(err);
      console.error("error potential", err);
    } finally {
      setOpen(false);
    }
  };

  const createMaterialTransferNoteDetails = async (e) => {
    e.preventDefault();
    setOpen(true);

    const requestPayload = {
      seller_account: materialTransferNoteDetails.seller_account,
      user: users.email,
      product: materialTransferNoteDetails.product,
      quantity: materialTransferNoteDetails.quantity,
    };
    const quantities = [materialTransferNoteDetails.quantity];

    const numTypes = [materialTransferNoteDetails.type_of_unit];
    const unit = [materialTransferNoteDetails.product__unit];
    const decimalCounts = [
      String(materialTransferNoteDetails.max_decimal_digit),
    ];
    console.log(materialTransferNoteDetails);
    console.log(numTypes);
    const isvalid = DecimalValidation({
      numTypes,
      quantities,
      decimalCounts,
      unit,
      handleError,
    });
    if (!isvalid) {
      setOpen(false);
      return;
    }

    try {
      await InventoryServices.createMaterialTransferNoteData(requestPayload);

      handleSuccess("Material Transfer Note created successfully");
      setTimeout(() => {
        setOpenCreatePopup(false);
      }, 300);
      getAllMaterialTransferNoteDetails(
        currentPage,
        searchQuery,
        acceptedFilter
      );
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
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
        onSubmit={(e) => createMaterialTransferNoteDetails(e)}
      >
        <Grid container spacing={2}>
          {/* Product Name */}
          <Grid item xs={12} sm={6} md={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="product-name-combo-box"
              onChange={(event, value) => handleSelectChange("product", value)}
              options={productOption.map((option) => option.product__name)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 120 }}
              label="Product Name"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="seller account"
              variant="outlined"
              value={materialTransferNoteDetails.seller_account || ""}
            />
          </Grid>

          {/* Unit and Quantity always take up half width on sm and above */}
          <Grid item xs={12} sm={6} md={3}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={materialTransferNoteDetails.product__unit || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={materialTransferNoteDetails.quantity || ""}
              onChange={handleInputChnage}
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
});
