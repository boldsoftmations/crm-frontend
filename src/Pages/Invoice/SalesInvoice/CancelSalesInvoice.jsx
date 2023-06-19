import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import InvoiceServices from "../../../services/InvoiceService";

export const CancelSalesInvoice = (props) => {
  const { idForEdit, getSalesInvoiceDetails, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancel = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        cancelled: confirmCancel,
      };
      await InvoiceServices.cancelSalesInvoice(idForEdit, data);
      setOpenPopup(false);
      getSalesInvoiceDetails();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Typography variant="body1">
        Are you sure you want to cancel the sales invoice?
      </Typography>
      <Checkbox
        checked={confirmCancel}
        onChange={() => setConfirmCancel(!confirmCancel)}
        color="primary"
      />
      <Typography variant="body2" component="label" htmlFor="confirmCancel">
        Confirm cancellation
      </Typography>
      <br />
      <Button
        variant="contained"
        onClick={handleCancel}
        disabled={!confirmCancel}
      >
        Cancel Sales Invoice
      </Button>
    </div>
  );
};
