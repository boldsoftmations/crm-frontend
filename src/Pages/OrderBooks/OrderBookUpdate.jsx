import React, { useEffect, useState } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useSelector } from "react-redux";

export const OrderBookUpdate = (props) => {
  const { recordForEdit, setOpenPopup, getAllOrderBook } = props;
  const [open, setOpen] = useState(false);
  const [estimateDate, setEstimateDate] = useState(
    recordForEdit.estimated_date
  );
  const data = useSelector((state) => state.auth);
  const users = data.profile;
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
        estimated_date: estimateDate,
      };

      await InvoiceServices.updateOrderBookData(recordForEdit.id, data);

      setOpenPopup(false);
      setOpen(false);
      getAllOrderBook();
    } catch (err) {
      console.log("err update orderbook", err);
    }
  };
  return (
    <>
      <div>
        <CustomLoader open={open} />
      </div>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => updatesCustomerOrderBook(e)}
      >
        <Grid container spacing={2}>
          {/* <ErrorMessage errMsg={errMsg} errRef={errRef} /> */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Product"
              variant="outlined"
              value={recordForEdit.product ? recordForEdit.product : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
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
            <TextField
              fullWidth
              size="small"
              label="Requested Date"
              variant="outlined"
              value={
                recordForEdit.requested_date ? recordForEdit.requested_date : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
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
            />
          </Grid>
        </Grid>
        {(users.groups.includes("Production") ||
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
      };

      await InvoiceServices.updateOrderBookData(recordForEdit.id, data);

      setOpenPopup(false);
      setOpen(false);
      getAllOrderBook();
    } catch (err) {
      console.log("err update orderbook", err);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => updatesCustomerOrderBook(e)}
      >
        <Grid container spacing={2}>
          {/* <ErrorMessage errMsg={errMsg} errRef={errRef} /> */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Product"
              variant="outlined"
              value={recordForEdit.product ? recordForEdit.product : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Pending Quantity"
              variant="outlined"
              value={pendingQuantity || ""}
              onChange={(event) => setPendingQuantity(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Requested Date"
              variant="outlined"
              value={
                recordForEdit.requested_date ? recordForEdit.requested_date : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
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
        {users.groups.includes("Accounts") && (
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
