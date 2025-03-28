import { Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import InvoiceServices from "../../../services/InvoiceService";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CreateCreditNote = (props) => {
  const { recordForEdit } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const SalesInvoice = recordForEdit.ccf_details.invoices || [];

  const [inputValue, setInputValue] = useState({
    customer: recordForEdit.ccf_details.customer
      ? recordForEdit.ccf_details.customer
      : "",
    seller_account: recordForEdit.ccf_details.unit
      ? recordForEdit.ccf_details.unit
      : "",
    note_type: "Credit",
    sales_invoices: SalesInvoice || [],
    reason: "",
    gst_percentage: "",
    amount: null,
    total_amount: null,
    notes: "",
  });

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const calculateTotalAmount = (amount, gstPercentage) => {
    if (!amount || !gstPercentage) return "";
    const total =
      parseFloat(amount) + parseFloat(amount) * (gstPercentage / 100);
    return total.toFixed(2);
  };

  const handleInputChange = (name, value) => {
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
      total_amount:
        name === "amount" || name === "gst_percentage"
          ? calculateTotalAmount(
              name === "amount" ? value : prev.amount,
              name === "gst_percentage" ? value : prev.gst_percentage
            )
          : prev.total_amount,
    }));
  };

  const createDebitCreateNotes = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const payload = { ...inputValue };
      const response = await InvoiceServices.CreateDebitCreditNote(payload);
      if (response.status === 201 || response.status === 200) {
        const successMessage =
          response.data.message || "Debit/Credit Note Created Successfully";
        setAlertMsg({
          open: true,
          severity: "success",
          message: successMessage,
        });
        setTimeout(() => {
          navigate("/invoice/credit-debit-note");
        }, 300);
      }
    } catch (error) {
      setAlertMsg({
        open: true,
        severity: "success",
        message: "Error while creating Credit Note",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={createDebitCreateNotes}>
        <Grid container spacing={2}>
          {/* Seller Account */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Seller Account"
              name="seller_account"
              variant="outlined"
              value={inputValue.seller_account || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Customer */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Customer"
              variant="outlined"
              value={inputValue.customer || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Invoice No */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              fullWidth
              multiple
              size="small"
              disablePortal
              id="invoice-no"
              disabled
              options={SalesInvoice}
              value={inputValue.sales_invoices}
              getOptionLabel={(option) => option.invoice_number || ""}
              renderInput={(params) => (
                <CustomTextField {...params} label="Invoice No" />
              )}
            />
          </Grid>

          {/* Reason */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="reason"
              size="small"
              disablePortal
              id="reason"
              onChange={(event, value) => handleInputChange("reason", value)}
              options={creditReasonNote}
              getOptionLabel={(option) => option}
              fullWidth
              label="Reason"
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Amount"
              name="amount"
              variant="outlined"
              type="number"
              value={inputValue.amount || ""}
              onChange={(e) =>
                handleInputChange("amount", parseFloat(e.target.value) || "")
              }
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* GST Percentage */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="gst_percentage"
              size="small"
              disablePortal
              id="gst"
              onChange={(event, value) =>
                handleInputChange("gst_percentage", value || "")
              }
              options={GSTOptions}
              getOptionLabel={(option) => `${option}%`}
              fullWidth
              label="GST in Percent"
            />
          </Grid>

          {/* Total Amount */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Total Amount"
              name="total_amount"
              variant="outlined"
              type="number"
              value={inputValue.total_amount || ""}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Add Notes"
              name="notes"
              variant="outlined"
              type="text"
              value={inputValue.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
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
};

const creditReasonNote = ["Rate", "Discount", "Quality"];
const GSTOptions = ["0", "12", "18"];
