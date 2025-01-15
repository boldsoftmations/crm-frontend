import { Autocomplete, Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import InvoiceServices from "../../services/InvoiceService";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const CreateDebitCreditNote = (props) => {
  const { getDebitCreditNotesData, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [invoiceNoOption, setInvoiceNoOption] = useState([]);
  const [sellerUnitOptions, setSellerUnitOptions] = useState([]);

  const [inputValue, setInputValue] = useState({
    customer: "",
    seller_account: "",
    note_type: "",
    reason: "",
    sales_invoices: [],
    gst_percentage: "",
    amount: null,
    total_amount: null,
    notes: "",
  });

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const fetchInitialData = async () => {
    try {
      setOpen(true);
      const [sellerResponse, customerResponse] = await Promise.all([
        InvoiceServices.getAllPaginateSellerAccountData("all"),
        InvoiceServices.getCustomersList(),
      ]);
      setSellerUnitOptions(sellerResponse.data);
      setCustomer(customerResponse.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleInvoiceSelection = (event, value) => {
    const invoiceNumbers = value.map((v) => v.invoice_no);
    setInputValue((prev) => ({
      ...prev,
      sales_invoices: invoiceNumbers,
    }));
  };

  const handleSellerAccountChange = async (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      seller_account: value,
    }));
  };

  const handleCustomerchange = async (event, value) => {
    console.log(value);
    setInputValue((prev) => ({
      ...prev,
      customer: value,
    }));
    try {
      setOpen(true);
      const response = await InvoiceServices.getSalesReturnBySearchCompany(
        inputValue.seller_account,
        value
      );
      setInvoiceNoOption(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  const calculateTotalAmount = (amount, gstPercentage) => {
    if (!amount || !gstPercentage) return "";
    const total = amount + amount * (gstPercentage / 100);
    return total.toFixed(2);
  };

  const createDebitCreateNotes = async (e) => {
    try {
      e.preventDefault();
      const payload = { ...inputValue };
      setOpen(true);
      const response = await InvoiceServices.CreateDebitCreditNote(payload);
      const successMessage =
        response.data.message || "Debit/Credit Note Created Successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getDebitCreditNotesData();
      }, 300);
    } catch (error) {
      handleError(error); // Handle errors from the API call
    } finally {
      setOpen(false); // Always close the loader
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
      <Box component="form" noValidate onSubmit={createDebitCreateNotes}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={handleSellerAccountChange}
              options={sellerUnitOptions.map((option) => option.unit)}
              getOptionLabel={(option) => option}
              fullWidth
              label="Seller Account"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="customer"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={handleCustomerchange}
              options={customer}
              getOptionLabel={(option) => option}
              fullWidth
              label="Customer"
            />
          </Grid>
          {invoiceNoOption && invoiceNoOption.length > 0 && (
            <Grid item xs={12} sm={4}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={handleInvoiceSelection}
                options={invoiceNoOption}
                getOptionLabel={(option) => option.invoice_no || ""}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Invoice No" />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="note_type"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) =>
                setInputValue((prev) => ({
                  ...prev,
                  note_type: value,
                }))
              }
              options={notestypeOptions}
              getOptionLabel={(option) => option}
              fullWidth
              label="Note Type"
            />
          </Grid>

          {inputValue.note_type == "Debit" && (
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                name="reason"
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) =>
                  setInputValue((prev) => ({
                    ...prev,
                    reason: value,
                  }))
                }
                options={debitReasonNote}
                getOptionLabel={(option) => option}
                fullWidth
                label="Reason"
              />
            </Grid>
          )}

          {inputValue.note_type == "Credit" && (
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                name="reason"
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) =>
                  setInputValue((prev) => ({
                    ...prev,
                    reason: value,
                  }))
                }
                options={creditReasonNote}
                getOptionLabel={(option) => option}
                fullWidth
                label="Reason"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Amount"
              name="amount"
              variant="outlined"
              type="number"
              value={inputValue.amount || ""}
              onChange={(e) => {
                const value = e.target.value;
                const numericValue = value === "" ? "" : parseFloat(value);
                setInputValue((prev) => ({
                  ...prev,
                  amount: numericValue,
                  total_amount: calculateTotalAmount(
                    numericValue,
                    prev.gst_percentage
                  ),
                }));
              }}
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="gst_percentage"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => {
                setInputValue((prev) => ({
                  ...prev,
                  gst_percentage: value,
                  total_amount: calculateTotalAmount(prev.amount, value),
                }));
              }}
              options={GSTOptions}
              getOptionLabel={(option) => option}
              fullWidth
              label="GST in Percent"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Total Amount"
              name="total_amount"
              variant="outlined"
              type="number"
              value={inputValue.total_amount || ""}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="Add Notes"
              name="notes"
              variant="outlined"
              type="text"
              value={inputValue.notes || ""}
              onChange={(e) => {
                setInputValue((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </Grid>
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
const notestypeOptions = ["Debit", "Credit"];
const debitReasonNote = ["Rate", "Transport"];
const creditReasonNote = ["Rate", "Discount", "Quality"];
const GSTOptions = ["0", "12", "18"];
