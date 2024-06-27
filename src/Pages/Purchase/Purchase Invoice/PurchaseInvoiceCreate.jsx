import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useState } from "react";
import CustomTextField from "../../../Components/CustomTextField";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PurchaseInvoiceCreate = memo(
  ({ setOpenPopup, recordForEdit, getAllGRNDetails }) => {
    const [open, setOpen] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();
    const [products, setProducts] = useState(
      recordForEdit.products.map((product) => {
        // Log the rate of each product
        console.log("rate", product.rate);

        // Return the new product object
        return {
          product: product.products,
          quantity: product.qa_accepted,
          unit: product.unit,
          order_date: product.order_date,
          po_no: product.po_no,
          amount: "",
          rate: "",
        };
      })
    );
    console.log("products", products);

    const handleFormChange = (index, event) => {
      const { name, value } = event.target;
      const list = [...products];
      list[index][name] = value;
      if (list[index].quantity !== "" && list[index].rate !== "") {
        list[index].amount = (list[index].quantity * list[index].rate).toFixed(
          2
        );
      }

      setProducts(list);
    };

    const createPackingListDetails = async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const req = {
          grn: recordForEdit.grn_no,
          products_data: products,
          sales_invoice_no: [],
        };
        await InventoryServices.createPurchaseInvoiceData(req);
        console.log("createing Packing list");
        getAllGRNDetails();
        handleSuccess("Purchase Invoice created successfully");
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
        setOpen(false);
      } catch (error) {
        handleError(error);
        console.log("createing Packing list error", error);
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
          onSubmit={(e) => createPackingListDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor"
                variant="outlined"
                value={recordForEdit.vendor || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Grn No"
                variant="outlined"
                value={recordForEdit.grn_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Invoice No"
                variant="outlined"
                value={recordForEdit.packing_list_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Invoice Date"
                variant="outlined"
                value={recordForEdit.created_on || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Purchase Order No"
                variant="outlined"
                value={recordForEdit.po_no || ""}
                disabled
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
                      label="Product"
                      variant="outlined"
                      value={input.product || ""}
                      disabled
                    />
                  </Grid>
                  <Grid key={index} item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Unit"
                      variant="outlined"
                      value={input.unit || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Quantity"
                      variant="outlined"
                      value={input.quantity || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="rate"
                      size="small"
                      label="Rate"
                      variant="outlined"
                      value={input.rate}
                      onChange={(event) => handleFormChange(index, event)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="amount"
                      size="small"
                      label="Amount"
                      variant="outlined"
                      value={
                        input.quantity !== "" && input.rate !== ""
                          ? (input.quantity * input.rate).toFixed(2)
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
      </>
    );
  }
);
