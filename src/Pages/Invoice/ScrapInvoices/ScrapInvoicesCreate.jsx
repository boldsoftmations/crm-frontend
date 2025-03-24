import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useNotificationHandling } from "./../../../Components/useNotificationHandling ";
import InvoiceServices from "../../../services/InvoiceService";
import { MessageAlert } from "./../../../Components/MessageAlert";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const values = {
  someDate: new Date().toISOString().substring(0, 10),
};

const SupplierInvoicesCreate = ({
  getSalesReturnInventoryDetails,
  setOpenPopup,
  selectedRow,
}) => {
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(
    selectedRow.products.map((product) => ({
      ...product,
      rate: "", // Initialize rate as an empty string to be filled by the user
    }))
  );
  const [inputValue, setInputValue] = useState({
    invoice_type: "Scrap",
    batch_no: selectedRow.batch_no.join(", "),
    generation_date: new Date().toISOString().substring(0, 10),
    vendor: "",
    transporter_name: "",
    seller_unit: selectedRow.unit,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    let data = [...products];
    data[index] = {
      ...data[index],
      [name]: value,
    };

    // Calculate the amount if either 'rate' or 'quantity' changes
    if (name === "rate" || name === "quantity") {
      const rate = parseFloat(data[index].rate) || 0;
      const quantity = parseFloat(data[index].quantity) || 0;
      data[index].amount = (rate * quantity).toFixed(2); // Ensure amount is calculated as a string to two decimal places
    }

    setProducts(data);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const createSupplierInvoiceDetails = async (e) => {
    e.preventDefault();

    const payload = {
      invoice_type: inputValue.invoice_type,
      generation_date: inputValue.generation_date,
      sales_return: inputValue.sales_return,
      transporter_name: inputValue.transporter_name,
      vendor: inputValue.vendor,
      seller_unit: inputValue.seller_unit,
      products: products,
    };

    try {
      setOpen(true);
      const response = await InvoiceServices.createSalesinvoiceData(payload);
      handleSuccess(
        response.data.message || "Scrap Invoice created successfully!"
      );
      setOpenPopup(false);
      getSalesReturnInventoryDetails();
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
        onSubmit={(e) => createSupplierInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              label="Invoice No"
              variant="outlined"
              value={inputValue.batch_no}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="seller Unit"
              variant="outlined"
              value={inputValue.seller_unit}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type={"date"}
              name="generation_date"
              size="small"
              label="Generation Date"
              variant="outlined"
              value={inputValue.generation_date || values.someDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="vendor"
              size="small"
              label="Vendor"
              variant="outlined"
              value={inputValue.vendor}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="transporter_name"
              size="small"
              label="Transporter Name"
              variant="outlined"
              value={inputValue.transporter_name}
              onChange={handleInputChange}
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
              <React.Fragment key={index}>
                <Grid item xs={12} sm={5}>
                  <CustomTextField
                    fullWidth
                    name="product"
                    size="small"
                    label="Product"
                    variant="outlined"
                    value={input.product}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    value={input.rate}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={input.amount || "0.00"} // Ensure this reads from the correct source
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button
                    onClick={() => removeFields(index)}
                    variant="contained"
                  >
                    Remove
                  </Button>
                </Grid>
              </React.Fragment>
            ); // Close the return statement properly
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
    </>
  );
};

export default SupplierInvoicesCreate;
