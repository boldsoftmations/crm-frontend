import React, { useEffect, useState } from "react";
import InvoiceServices from "../../services/InvoiceService";
import { ErrorMessage } from "../../Components/ErrorMessage/ErrorMessage";
import { CustomLoader } from "../../Components/CustomLoader";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useSelector } from "react-redux";

export const OrderBookUpdate = (props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getAllOrderBook,
    getAllOrderBookExport,
  } = props;
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
      getAllOrderBookExport();
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
              label="Quantity"
              variant="outlined"
              value={recordForEdit.quantity ? recordForEdit.quantity : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Rate"
              variant="outlined"
              value={recordForEdit.rate ? recordForEdit.rate : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Amount"
              variant="outlined"
              value={recordForEdit.amount ? recordForEdit.amount : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="GST"
              variant="outlined"
              value={recordForEdit.gst ? recordForEdit.gst : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Total"
              variant="outlined"
              value={recordForEdit.total ? recordForEdit.total : ""}
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
