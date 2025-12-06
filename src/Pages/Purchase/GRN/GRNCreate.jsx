import { Box, Button, Chip, Divider, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { styled } from "@mui/material/styles";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { DecimalValidation } from "../../../Components/Header/DecimalValidation";
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
      idForEdit.products.map(
        ({ product, unit, quantity, max_decimal_digit, type_of_unit }) => ({
          products: product,
          unit,
          order_quantity: quantity,
          qa_rejected: "",
          qa_accepted: "",
          max_decimal_digit,
          type_of_unit,
        })
      )
    );
    console.log(products.map((data) => data.order_quantity));

    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const calculateQA = (orderQty, rejectedQty, type) => {
      if (isNaN(orderQty) || isNaN(rejectedQty)) return "";

      const diff = Number(orderQty) - Number(rejectedQty);

      return type === "decimal" ? diff.toFixed(2) : Math.round(diff);
    };

    const handleFormChange = (index, event) => {
      const { name, value } = event.target;
      console.log("name", name);
      console.log("value", value);
      // console.log(products && products.order_quantity, products.qa_rejected);

      const updatedProducts = products.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [name]: value,
              qa_accepted:
                name === "qa_rejected"
                  ? calculateQA(item.order_quantity, value, item.type_of_unit)
                  : item.qa_accepted,
            }
          : item
      );
      console.log("updatedProducts", updatedProducts);

      setProducts(updatedProducts);
      console.log("products", products);
    };
    console.log("products", products);
    const createGrnDetails = useCallback(
      async (e) => {
        e.preventDefault();

        // If any product has non-zero order quantity
        const hasValidOrderQty = products.some(
          (item) => Number(item.order_quantity) !== 0
        );

        // Rejecting FULL quantity is not allowed
        const isInvalidFullReject = products.some(
          (item) =>
            Number(item.qa_rejected) === Number(item.order_quantity) &&
            Number(item.order_quantity) !== 0
        );

        // Debug
        console.log("hasValidOrderQty", hasValidOrderQty);

        if (hasValidOrderQty) {
          // Rejected > Ordered → INVALID
          const isGreater = products.some(
            (item) => Number(item.qa_rejected) > Number(item.order_quantity)
          );

          if (isGreater) {
            handleError("Rejected quantity should be less than order quantity");
            return;
          }

          if (isInvalidFullReject) {
            handleError("This is not valid method to reject all the quantity");
            return;
          }
        }
        console.log(products);
        setOpen(true);
        const quantities = products.map((item) => item.qa_rejected);

        const numTypes = products.map((item) => item.type_of_unit);
        const unit = products.map((item) => item.unit);
        const decimalCounts = products.map((item) =>
          String(item.max_decimal_digit)
        );

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
                      value={
                        input.type_of_unit === "decimal"
                          ? input.order_quantity
                          : Math.floor(input.order_quantity) || ""
                      }
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
                      value={(() => {
                        const oq = input.order_quantity;
                        const qr = input.qa_rejected;

                        // Common validation
                        const isValid =
                          oq !== "" && qr !== "" && !isNaN(oq) && !isNaN(qr);

                        if (!isValid) return "";

                        const diff = Number(oq) - Number(qr);

                        // Decimal unit → return as is
                        if (input.type_of_unit === "decimal") {
                          return diff.toFixed(input.max_decimal_digit);
                        }

                        // Non-decimal unit → round whole number
                        return Math.round(diff);
                      })()}
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
