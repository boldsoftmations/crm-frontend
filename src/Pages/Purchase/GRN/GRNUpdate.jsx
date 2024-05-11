import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export const GRNUpdate = memo(
  ({
    setOpenPopup,
    getAllGRNDetails,
    idForEdit,
    currentPage,
    acceptedFilter,
    searchQuery,
  }) => {
    const [open, setOpen] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();
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
        const response = await InventoryServices.updateGRNData(
          idForEdit.grn_no,
          req
        );
        const successMessage =
          response.data.message || "Purchase Invoice updated successfully";
        handleSuccess(successMessage);
        setTimeout(() => {
          setOpenPopup(false);
          getAllGRNDetails(currentPage, acceptedFilter, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
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
          onSubmit={(e) => updateLeadProformaInvoiceDetails(e)}
        >
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
      </>
    );
  }
);
