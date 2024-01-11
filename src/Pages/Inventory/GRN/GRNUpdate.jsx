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
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const GRNUpdate = ({ setOpenPopup, getAllGRNDetails, idForEdit }) => {
  console.log("idForEdit", idForEdit);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState(
    idForEdit.products.map(
      ({ products, unit, order_quantity, qa_rejected, qa_accepted }) => ({
        products: products,
        unit,
        order_quantity: order_quantity,
        qa_rejected: qa_rejected,
        qa_accepted: qa_accepted,
      })
    )
  );

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...products];
    list[index][name] = value;

    // If qa_rejected and quantity values exist, update the qa_accepted value
    if (list[index].qa_rejected !== "" && list[index].order_quantity !== "") {
      list[index].qa_accepted =
        parseInt(list[index].order_quantity) -
        parseInt(list[index].qa_rejected);
    }

    setProducts(list);
  };

  const updateLeadProformaInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        packing_list: idForEdit.packing_list,
        vendor: idForEdit.vendor,
        products: products,
      };
      await InventoryServices.updateGRNData(idForEdit.grn_no, req);

      setOpenPopup(false);
      getAllGRNDetails();
      setOpen(false);
    } catch (error) {
      setError(
        error.response.data.errors
          ? error.response.data.errors.packing_list
            ? "Packing List" + error.response.data.errors.packing_list
            : error.response.data.errors.seller_account
            ? "Seller Account" + error.response.data.errors.seller_account
            : ""
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
        onSubmit={(e) => updateLeadProformaInvoiceDetails(e)}
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
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Vendor"
              variant="outlined"
              value={idForEdit.vendor || ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Packing List ID"
              variant="outlined"
              value={idForEdit.packing_list || ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Packing List No"
              variant="outlined"
              value={idForEdit.packing_list_no || ""}
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products.map((input, index) => {
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    name="products"
                    size="small"
                    label="Products"
                    variant="outlined"
                    value={input.products || ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="order_quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.order_quantity || ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="qa_rejected"
                    size="small"
                    label="QA Rejected"
                    variant="outlined"
                    value={input.qa_rejected || ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="qa_accepted"
                    size="small"
                    label="QA Accepted"
                    variant="outlined"
                    value={
                      input.qa_rejected !== "" &&
                      input.order_quantity !== "" &&
                      !isNaN(input.order_quantity) &&
                      !isNaN(input.qa_rejected)
                        ? parseInt(input.order_quantity) -
                          parseInt(input.qa_rejected)
                        : ""
                    }
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
              </>
            );
          })}
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
