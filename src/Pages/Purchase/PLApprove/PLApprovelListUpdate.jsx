import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";
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

export const PLApprovelListUpdate = ({
  setOpenPopup,
  getAllPackingListDetails,
  currentPage,
  searchQuery,
  idForEdit,
  acceptedFilter,
}) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Initialize products state with packingListDetails data
    if (idForEdit && idForEdit.products) {
      const initialProducts = idForEdit.products.map((p) => ({
        ...p,
        quantity: p.quantity || 0,
      }));
      setProducts(initialProducts);
    }
  }, [idForEdit]);

  const handleQuantityChange = (index, newQuantity) => {
    const updatedProducts = products.map((product, idx) =>
      idx === index ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
  };

  const updatePackingListDetails = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        id: idForEdit.id,
        created_on: idForEdit.created_on,
        seller_account: idForEdit.seller_account,
        packing_list_no: idForEdit.packing_list_no,
        invoice_date: idForEdit.invoice_date,
        accepted: false,
        purchase_order: idForEdit.purchase_order,
        products: products.map((p) => ({
          ...p,
          quantity: Number(p.quantity),
        })),
        po_orders: idForEdit.po_orders,
        grn_rejected: false,
        // Send updated products
      };
      await InventoryServices.updatePLApproveListData(idForEdit.id, req);
      setOpenPopup(false);
      getAllPackingListDetails(currentPage, acceptedFilter, searchQuery);
    } catch (error) {
      console.error("Updating Packing List Error:", error);
      setError(error || "An error occurred");
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
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error" // 👈 put severity here
            sx={{ width: "100%" }}
          >
            {error && error.response ? error.response.data.errors[0] : error}
          </Alert>
        </Snackbar>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="seller_account"
              label="Buyer Account"
              variant="outlined"
              value={idForEdit.seller_account || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Purchase Order Number"
              variant="outlined"
              value={idForEdit.purchase_order || ""}
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
              value={idForEdit.packing_list_no || ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              name="invoice_date"
              label="Invoice Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={idForEdit.invoice_date}
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
              <Grid item xs={12} sm={2}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="quantity"
                  label="Quantity"
                  variant="outlined"
                  type="number"
                  value={idForEdit.products[index].quantity}
                  disabled={true}
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
                  value={
                    (0 <= product.quantity &&
                      Number(product.quantity) &&
                      product.quantity) ||
                    ""
                  }
                  onChange={(e) =>
                    handleQuantityChange(index, Number(e.target.value))
                  }
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
          submit
        </Button>
      </Box>
    </div>
  );
};
