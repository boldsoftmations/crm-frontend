import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Grid, IconButton, Snackbar, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { CustomLoader } from "../../../Components/CustomLoader";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PackingListCreate = ({ selectedRow, setOpenPopup }) => {
  console.log("selectedRow", selectedRow);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().slice(0, 10);
  const [details, setDetails] = useState(() => ({
    seller_account: selectedRow.seller_account,
    vendor: selectedRow.vendor,
    purchase_order: [selectedRow.po_no],
    packing_list_no: "",
    invoice_date: today,
    products: selectedRow.products.map((product) => ({
      product: product.product,
      unit: product.unit,
      quantity: product.pending_quantity,
    })),
  }));

  useEffect(() => {
    setDetails({
      seller_account: selectedRow.seller_account,
      vendor: selectedRow.vendor,
      purchase_order: [selectedRow.po_no],
      packing_list_no: details.packing_list_no,
      invoice_date: details.invoice_date,
      products: selectedRow.products.map((product, index) => ({
        id: product.id,
        product: product.product,
        unit: product.unit,
        quantity:
          (details.products[index] && details.products[index].quantity) ||
          product.pending_quantity,
      })),
    });
  }, [selectedRow]);

  const handleInput = useCallback((e) => {
    const { name, value } = e.target;
    setDetails((current) => ({ ...current, [name]: value }));
  }, []);

  const handleQuantityChange = useCallback((index, newQuantity) => {
    setDetails((current) => ({
      ...current,
      products: current.products.map((product, idx) =>
        idx === index ? { ...product, quantity: newQuantity } : product
      ),
    }));
  }, []);

  const createPackingListDetails = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...details,
        purchase_order: details.purchase_order, // This is already an array
      };
      const response = await InventoryServices.createPackingListData(
        dataToSend
      );
      if (response) {
        setOpenPopup(false);
      }
    } catch (error) {
      console.error("Creating Packing list error", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => setError(null), []);

  return (
    <Root>
      <CustomLoader open={loading} />
      <Box component="form" noValidate onSubmit={createPackingListDetails}>
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
            <CustomTextField
              fullWidth
              size="small"
              name="seller_account"
              label="Buyer Account"
              variant="outlined"
              value={details.seller_account}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Purchase Order Number"
              variant="outlined"
              value={details.purchase_order || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="packing_list_no"
              label="Invoice No"
              variant="outlined"
              value={details.packing_list_no || ""}
              onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              size="small"
              name="invoice_date"
              label="Invoice Date"
              variant="outlined"
              value={details.invoice_date || ""}
              onChange={handleInput}
              InputProps={{ inputProps: { max: today } }}
            />
          </Grid>
          {details.products.map((product, index) => (
            <React.Fragment key={product.id || index}>
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Id"
                  variant="outlined"
                  value={product.id || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Product"
                  variant="outlined"
                  value={product.product || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Unit"
                  variant="outlined"
                  value={product.unit || ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="quantity"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={product.quantity || ""}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </Grid>
            </React.Fragment>
          ))}
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
    </Root>
  );
};
