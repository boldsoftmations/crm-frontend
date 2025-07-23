import React, { useState } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { CustomLoader } from "../../Components/CustomLoader";
import { Box, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const OrderBookUpdate = (props) => {
  const { recordForEdit, setOpenPopup, getAllOrderBook } = props;
  const [open, setOpen] = useState(false);
  const [estimateDate, setEstimateDate] = useState(
    recordForEdit.estimated_date
  );
  const [readyDate, setReadyDate] = useState(recordForEdit.ready_date);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const updatesCustomerOrderBook = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const data = {
        orderbook: recordForEdit.orderbook,
        product: recordForEdit.product,
        pending_quantity: recordForEdit.pending_quantity,
        quantity: recordForEdit.quantity,
        rate: recordForEdit.rate,
        amount: recordForEdit.amount,
        gst: recordForEdit.gst,
        total: recordForEdit.total,
      };
      // Add estimated_date only if readyDate is not present and estimateDate is valid
      if (!recordForEdit.estimated_date) {
        data.estimated_date = estimateDate;
      }
      // Add ready_date if it exists
      if (!recordForEdit.ready_date && readyDate) {
        data.ready_date = readyDate;
      }
      const response = await InvoiceServices.updateOrderBookData(
        recordForEdit.id,
        data
      );
      const successMessage =
        response.data.message || "Customer OrderBook updated successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getAllOrderBook();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
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
        onSubmit={(e) => updatesCustomerOrderBook(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Product"
              variant="outlined"
              value={recordForEdit.product ? recordForEdit.product : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Pending Quantity"
              variant="outlined"
              value={
                recordForEdit.pending_quantity
                  ? recordForEdit.pending_quantity
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Request Dispatch Date"
              variant="outlined"
              value={
                recordForEdit.requested_date ? recordForEdit.requested_date : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="date"
              name="estimated_date"
              size="small"
              label="Estimated Date"
              variant="outlined"
              value={estimateDate ? estimateDate : ""}
              onChange={(event) => setEstimateDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date(new Date().setDate(new Date().getDate()))
                  .toISOString()
                  .split("T")[0], // Converts the date to YYYY-MM-DD format
              }}
              disabled={recordForEdit && recordForEdit.estimated_date}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="date"
              name="ready_date"
              size="small"
              label="Ready Date"
              variant="outlined"
              value={readyDate ? readyDate : ""}
              onChange={(event) => setReadyDate(event.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toLocaleDateString("en-CA"), // Set the minimum to today
                max: new Date().toLocaleDateString("en-CA"), // Set the maximum to today
              }}
              disabled={recordForEdit && recordForEdit.ready_date}
            />
          </Grid>
        </Grid>
        {(users.groups.includes("Production") ||
          users.groups.includes("Director") ||
          users.groups.includes("Production Delhi")) && (
          <Button
            fullWidth
            type="submit"
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        )}
      </Box>
    </>
  );
};

export const OrderBookPeningQuantityUpdate = (props) => {
  const { recordForEdit, setOpenPopup, getAllOrderBook } = props;
  const [open, setOpen] = useState(false);
  const [pendingQuantity, setPendingQuantity] = useState(
    recordForEdit.pending_quantity
  );
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const updatesCustomerOrderBook = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        orderbook: recordForEdit.orderbook,
        product: recordForEdit.product,
        quantity: recordForEdit.quantity,
        rate: recordForEdit.rate,
        amount: recordForEdit.amount,
        gst: recordForEdit.gst,
        total: recordForEdit.total,
        pending_quantity: pendingQuantity,
        revision: recordForEdit.revision + 1,
      };

      const response = await InvoiceServices.updateOrderBookData(
        recordForEdit.id,
        data
      );
      const successMessage =
        response.data.message || "Customer OrderBook updated successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getAllOrderBook();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
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
        onSubmit={(e) => updatesCustomerOrderBook(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Product"
              variant="outlined"
              value={recordForEdit.product ? recordForEdit.product : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Pending Quantity by Product"
              variant="outlined"
              value={pendingQuantity || ""}
              onChange={(event) => {
                const newValue = event.target.value;

                if (newValue <= recordForEdit.pending_quantity) {
                  setPendingQuantity(newValue);
                }
              }}
              disabled={pendingQuantity > recordForEdit.pending_quantity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Requested Date"
              variant="outlined"
              value={
                recordForEdit.requested_date ? recordForEdit.requested_date : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              disabled
              name="estimated_date"
              size="small"
              label="Estimated Date"
              variant="outlined"
              value={
                recordForEdit.estimated_date ? recordForEdit.estimated_date : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        {(users.groups.includes("Accounts") ||
          users.groups.includes("Director")) && (
          <Button
            fullWidth
            type="submit"
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        )}
      </Box>
    </>
  );
};
