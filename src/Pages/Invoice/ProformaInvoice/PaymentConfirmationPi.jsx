import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const PaymentConfirmationPi = (props) => {
  const {
    getProformaInvoiceData,
    invoiceData,
    users,
    setOpenPopup,
    setOpenPopup2,
  } = props;
  const [inputValue, setInputValue] = useState({});
  const [open, setOpen] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const SendForApprovalStatus = async (e) => {
    try {
      e.preventDefault();
      const req = {
        type: invoiceData.type,
        raised_by: users.email,
        seller_account: invoiceData.seller_account,
        company: invoiceData.company,
        lead: invoiceData.lead,
        address: invoiceData.address,
        pincode: invoiceData.pincode,
        state: invoiceData.state,
        city: invoiceData.city,
        buyer_order_no: invoiceData.buyer_order_no,
        contact: invoiceData.contact,
        alternate_contact: invoiceData.alternate_contact,
        payment_terms: invoiceData.payment_terms,
        delivery_terms: invoiceData.delivery_terms,
        generation_date: invoiceData.generation_date,
        validity: invoiceData.validity,
        status: inputValue.status,
        amount_recieved: inputValue.amount_recieved || 0,
        amount: invoiceData.amount,
        place_of_supply: invoiceData.place_of_supply,
        sgst: invoiceData.sgst ? invoiceData.sgst : null,
        cgst: invoiceData.cgst ? invoiceData.cgst : null,
        igst: invoiceData.igst ? invoiceData.igst : null,
        total: invoiceData.total,
        gst_number: invoiceData.gst_number,
        pan_number: invoiceData.pan_number ? invoiceData.pan_number : null,
      };
      setOpen(true);
      if (invoiceData.type === "Customer") {
        await InvoiceServices.sendForApprovalCompanyData(
          invoiceData.pi_number,
          req
        );
      } else {
        await InvoiceServices.sendForApprovalLeadsData(
          invoiceData.pi_number,
          req
        );
      }
      setOpenPopup(false);
      setOpen(false);
      setOpenPopup2(false);
      getProformaInvoiceData();
    } catch (err) {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={SendForApprovalStatus}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl sx={{ minWidth: "400px" }} size="small">
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="status"
                label="Status"
                value={inputValue.status || ""}
                onChange={handleInputChange}
                sx={{
                  "& .MuiSelect-iconOutlined": {
                    display: inputValue.status ? "none" : "",
                  },
                  "&.Mui-focused .MuiIconButton-root": {
                    color: "primary.main",
                  },
                }}
              >
                {StatusOptions.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {inputValue.status === "Partially Paid" && (
            <>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  required
                  name="amount_recieved"
                  size="small"
                  label="Amount Received"
                  variant="outlined"
                  value={inputValue.amount_recieved || ""}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  required
                  name="balance_amount"
                  size="small"
                  label="Balance Amount"
                  variant="outlined"
                  value={
                    inputValue.amount_recieved
                      ? invoiceData.total - inputValue.amount_recieved
                      : ""
                  }
                />
              </Grid>
            </>
          )}
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
};

const StatusOptions = [
  { label: "Partially Paid", value: "partially_paid" },
  { label: "Fully Paid", value: "fully_paid" },
  { label: "Credit", value: "credit" },
];
