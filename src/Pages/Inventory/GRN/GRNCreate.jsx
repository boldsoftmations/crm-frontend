import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { styled } from "@mui/material/styles";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const GRNCreate = ({ setOpenPopup, idForEdit, getAllVendorDetails }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(
    idForEdit.products.map(({ product, unit, quantity }) => ({
      products: product,
      unit,
      order_quantity: quantity,
      qa_rejected: "",
      qa_accepted: "",
    }))
  );
  const calculateQA = (orderQty, rejectedQty) => {
    return !isNaN(orderQty) && !isNaN(rejectedQty)
      ? parseInt(orderQty, 10) - parseInt(rejectedQty, 10)
      : "";
  };

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = products.map((item, idx) =>
      idx === index
        ? {
            ...item,
            [name]: value,
            qa_accepted:
              name === "qa_rejected"
                ? calculateQA(item.order_quantity, value)
                : item.qa_accepted,
          }
        : item
    );

    setProducts(updatedProducts);
  };

  const createGrnDetails = async (e) => {
    e.preventDefault();
    setOpen(true);

    try {
      const response = await InventoryServices.createGRNData({
        packing_list: idForEdit.id,
        products,
      });
      if (response) {
        getAllVendorDetails();
        setOpenPopup(false);
      }
    } catch (err) {
      setError("Error occurred while creating GRN.");
      console.error("Creating Packing list error", err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => createGrnDetails(e)}>
        <Snackbar
          open={Boolean(error)}
          onClose={() => setError(null)}
          message={error}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setError(null)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
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
              value={idForEdit.id || ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Invoice No"
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
                    size="small"
                    label="Products"
                    variant="outlined"
                    value={input.products || ""}
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
                    value={input.qa_rejected}
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
