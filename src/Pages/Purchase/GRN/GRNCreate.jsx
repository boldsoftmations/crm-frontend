import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
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

export const GRNCreate = memo(
  ({
    setOpenPopup,
    idForEdit,
    getAllPackingListDetails,
    currentPage,
    acceptedFilter,
    searchQuery,
  }) => {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState(
      idForEdit.products.map(({ product, unit, quantity }) => ({
        products: product,
        unit,
        order_quantity: quantity,
        qa_rejected: "",
        qa_accepted: "",
      }))
    );
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const calculateQA = (orderQty, rejectedQty) => {
      return !isNaN(orderQty) && !isNaN(rejectedQty)
        ? parseInt(orderQty, 10) - parseInt(rejectedQty, 10)
        : "";
    };

    const handleFormChange = (index, event) => {
      const { name, value } = event.target;
      console.log("name", name);
      console.log("value", value);
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
      console.log("updatedProducts", updatedProducts);
      setProducts(updatedProducts);
    };
    console.log("products", products);
    const createGrnDetails = useCallback(
      async (e) => {
        e.preventDefault();
        setOpen(true);

        const payload = {
          packing_list: idForEdit.id,
          grn_source: "Purchase",
          products: products.map((data) => ({
            order_quantity: data.order_quantity,
            products: data.products,
            qa_accepted: data.qa_accepted,
            qa_rejected: data.qa_rejected,
            unit: data.unit,
          })),
        };

        try {
          const response = await InventoryServices.createGRNData(payload);
          const successMessage =
            response.data.message || "GRN Created successfully";
          handleSuccess(successMessage);
          setTimeout(() => {
            setOpenPopup(false);
            getAllPackingListDetails(currentPage, acceptedFilter, searchQuery);
          }, 300);
        } catch (error) {
          handleError(error);
        } finally {
          setOpen(false);
        }
      },
      [
        products,
        idForEdit,
        handleSuccess,
        handleError,
        getAllPackingListDetails,
        currentPage,
        acceptedFilter,
        searchQuery,
        setOpen,
        setOpenPopup,
      ]
    );

    return (
      <div>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={open} />

        <Box component="form" noValidate onSubmit={(e) => createGrnDetails(e)}>
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

            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="Packing List ID"
                variant="outlined"
                value={idForEdit.id || ""}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                size="small"
                label="Buyer State"
                variant="outlined"
                value={idForEdit.seller_account || ""}
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
  }
);
