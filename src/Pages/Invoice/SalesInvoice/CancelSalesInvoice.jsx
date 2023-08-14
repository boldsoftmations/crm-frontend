import { Button, Checkbox, Typography } from "@mui/material";
import React, { useState } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";

export const CancelSalesInvoice = (props) => {
  const { idForEdit, getSalesInvoiceDetails, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleCancel = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        generation_date: idForEdit.generation_date,
        cancelled: confirmCancel,
      };
      await InvoiceServices.cancelSalesInvoice(idForEdit.invoice_no, data);
      setOpenPopup(false);
      getSalesInvoiceDetails();
      setOpen(false);
    } catch (error) {
      console.log(error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
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
