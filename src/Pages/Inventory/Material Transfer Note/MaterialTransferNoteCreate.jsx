import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { useSelector } from "react-redux";

export const MaterialTransferNoteCreate = (props) => {
  const { setOpenPopup, sellerOption, getAllMaterialTransferNoteDetails } =
    props;
  const [open, setOpen] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const [error, setError] = useState(null);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState();
  const [selectedSellerData, setSelectedSellerData] = useState(null);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getAllConsProductionInventoryData();
      setProductOption(response.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const createMaterialTransferNoteDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        seller_account: selectedSellerData,
        user: users.email,
        product: product.product__name,
        quantity: quantity,
      };
      await InventoryServices.createMaterialTransferNoteData(req);
      setOpenPopup(false);
      getAllMaterialTransferNoteDetails();
      setOpen(false);
    } catch (error) {
      setError(
        error.response.data.errors
          ? error.response.data.errors.non_field_errors
          : ""
      );
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createMaterialTransferNoteDetails(e)}
      >
        <Snackbar
          open={Boolean(error)}
          onClose={handleCloseSnackbar}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={
                sellerOption && sellerOption.map((option) => option.unit)
              }
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField {...params} label="Seller Account" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              name="product"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setProduct(value)}
              options={productOption}
              getOptionLabel={(option) => option.product__name}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField {...params} label="Product Name" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={product ? product.product__unit : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="quantity"
              size="small"
              label="Quantity"
              variant="outlined"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
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
