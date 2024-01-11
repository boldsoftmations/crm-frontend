import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "./../../../Components/CustomLoader";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PackingListUpdate = ({
  setOpenPopup,
  getAllPackingListDetails,
  idForEdit,
}) => {
  console.log("idForEdit", idForEdit);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [packingListDetails, setPackingListDetails] = useState(idForEdit);
  const [products, setProducts] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Initialize products state with packingListDetails data
    if (packingListDetails && packingListDetails.products) {
      const initialProducts = packingListDetails.products.map((p) => ({
        ...p,
        quantity: p.quantity || 0,
      }));
      setProducts(initialProducts);
    }
  }, [packingListDetails]);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = products.map((product, idx) =>
      idx === index ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    const updatedRow = { ...packingListDetails, [name]: value };
    setPackingListDetails(updatedRow);
  };

  const updatePackingListDetails = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        purchase_order: packingListDetails.purchase_order || null,

        packing_list_no: packingListDetails.packing_list_no || null,
        invoice_date: packingListDetails.invoice_date,
        seller_account: packingListDetails.seller_account || null,
        products: products || [], // Send updated products
      };
      await InventoryServices.updatePackingListData(packingListDetails.id, req);
      setOpenPopup(false);
      getAllPackingListDetails();
    } catch (error) {
      console.error("Creating Packing list error", error);
      setError(error.message || "An error occurred");
    } finally {
      setOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };
  return (
    <div>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={updatePackingListDetails}>
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
              value={packingListDetails.seller_account || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Purchase Order Number"
              variant="outlined"
              value={packingListDetails.purchase_order || ""}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              name="packing_list_no"
              label="Invoice No"
              variant="outlined"
              value={packingListDetails.packing_list_no || ""}
              // onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              // type="date"
              size="small"
              name="invoice_date"
              label="Invoice Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={packingListDetails.invoice_date}
              // InputProps={{ inputProps: { max: today } }}
              // onChange={handleInput}
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products.map((product, index) => (
            <React.Fragment key={product.id || index}>
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
    </div>
  );
};
