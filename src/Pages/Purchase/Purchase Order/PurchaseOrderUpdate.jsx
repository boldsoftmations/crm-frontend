import React, { memo, useCallback, useState } from "react";
import { Box, Button, Chip, Divider, Grid, Switch } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import InventoryServices from "../../../services/InventoryService";
import { styled } from "@mui/material/styles";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const PurchaseOrderUpdate = memo(
  ({
    selectedRow,
    getAllPurchaseOrderDetails,
    setOpenPopup,
    currentPage,
    acceptedFilter,
    searchQuery,
  }) => {
    const [inputValues, setInputValues] = useState(selectedRow);
    const [loading, setLoading] = useState(false);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const createPurchaseOrderDetails = useCallback(
      async (e) => {
        try {
          e.preventDefault();
          setLoading(true);
          const req = {
            created_by: inputValues.created_by,
            vendor: inputValues.vendor,
            vendor_type: inputValues.vendor_type,
            vendor_email: inputValues.vendor_email,
            vendor_contact_person: inputValues.vendor_contact_person,
            vendor_contact: inputValues.vendor_contact,
            seller_account: inputValues.seller_account,
            payment_terms: inputValues.payment_terms,
            delivery_terms: inputValues.delivery_terms,
            schedule_date: inputValues.schedule_date,
            currency: inputValues.currency,
            po_no: inputValues.po_no,
            po_date: inputValues.po_date,
            close_short: inputValues.close_short,
            products: inputValues.products || [],
          };

          const response = await InventoryServices.updatePurchaseOrderData(
            inputValues.id,
            req
          );
          const successMessage =
            response.data.message || "Purchase Order updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getAllPurchaseOrderDetails(
              currentPage,
              acceptedFilter,
              searchQuery
            );
          }, 300);
        } catch (error) {
          handleError(error); // Handle errors from the API call
        } finally {
          setLoading(false); // Always close the loader
        }
      },
      [inputValues, currentPage, acceptedFilter, searchQuery]
    );

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={loading} />

        <Box
          component="form"
          noValidate
          onSubmit={(e) => createPurchaseOrderDetails(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor"
                variant="outlined"
                value={inputValues.vendor || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Vendor Contact Person"
                variant="outlined"
                value={inputValues.vendor_contact_person || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Buyer Account"
                variant="outlined"
                value={inputValues.seller_account || ""}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Payment Terms"
                variant="outlined"
                value={inputValues.payment_terms || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Delivery Terms"
                variant="outlined"
                value={inputValues.delivery_terms || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                name="po_no"
                label="Purchase Order No."
                variant="outlined"
                value={inputValues.po_no || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="po_date"
                size="small"
                label="Purchase Order Date"
                variant="outlined"
                value={inputValues.po_date}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Currency"
                variant="outlined"
                value={inputValues.currency || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                name="schedule_date"
                size="small"
                label="Schedule Date"
                variant="outlined"
                value={inputValues.schedule_date}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Issued By"
                variant="outlined"
                value={inputValues.created_by || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Switch
                checked={inputValues.close_short}
                onChange={(event) =>
                  setInputValues({
                    ...inputValues,
                    close_short: event.target.checked,
                  })
                }
                name="close_short"
                inputProps={{ "aria-label": "controlled" }}
              />
              <span>Close Short</span>
            </Grid>
            <Grid item xs={12}>
              <Root>
                <Divider>
                  <Chip label="PRODUCT" />
                </Divider>
              </Root>
            </Grid>
            {inputValues.products.map((input, index) => {
              return (
                <>
                  <Grid key={index} item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      size="small"
                      label="Product"
                      variant="outlined"
                      value={input.product || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
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
                      name="quantity"
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
                      size="small"
                      label="Pending Quantity"
                      variant="outlined"
                      value={input.pending_quantity || ""}
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
                      value={input.rate || ""}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="amount"
                      size="small"
                      label="Amount"
                      variant="outlined"
                      value={input.amount || ""}
                      disabled
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={1} alignContent="right"></Grid> */}
                </>
              );
            })}

            {/* <Grid item xs={12} sm={2} alignContent="right"></Grid> */}
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

// Data structure for Payment Terms
// const paymentTerms = [
//   "100% Advance against PI",
//   "50% Advance, Balance Before Dispatch",
//   "30% Advance, Balance Before Dispatch",
//   "15 days with PDC (Post-Dated Check)",
//   "30 days with PDC",
//   "45 days with PDC",
//   "60 days with PDC",
//   "15 days credit",
//   "30 days credit",
//   "45 days credit",
//   "60 days credit",
//   "90 days credit",
//   "120 days credit",
//   "TT in 100% advance against PI",
//   "10% Advance, balance against bill of lading",
//   "15% Advance, balance against bill of lading",
//   "20% Advance, balance against bill of lading",
//   "30% Advance, balance against bill of lading",
//   "50% Advance, balance against bill of lading",
//   "60 days against documents",
//   "90 days against documents",
//   "120 days against documents",
//   "LC at Sight",
//   "LC 45 days",
//   "LC 60 days",
// ];

// Data structure for Delivery Terms
// const deliveryTerms = [
//   "Ex-Work",
//   "FOB (Free On Board)",
//   "CIF (Cost, Insurance, and Freight)",
//   "C & F (Cost and Freight)",
//   "Door Delivery (Prepaid)",
//   "Door Delivery to pay",
//   "Transporter Warehouse (Prepaid)",
//   "Transporter Warehouse to pay",
//   "Add actual freight in invoice",
//   "Ex - warehouse",
// ];
