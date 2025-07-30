import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import RuleIcon from "@mui/icons-material/Rule";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { Alert, AlertTitle } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "./../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const SalesInvoiceCreate = (props) => {
  const { setOpenPopup, getSalesInvoiceDetails } = props;
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [customerorderBookData, setCustomerOrderBookData] = useState();
  const [customerorderBookOption, setCustomerOrderBookOption] = useState([]);
  const [orderBookID, setOrderBookID] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [products, setProducts] = useState([
    {
      product: "",
      pending_quantity: "",
      quantity: "",
      rate: "",
      proforma_invoice: "",
      id: "",
      user: "",
      ready_date: "",
    },
  ]);
  const calculateTotalAmount = (products) => {
    return products
      .filter((product) => product.pending_quantity > 0)
      .reduce((acc, current) => {
        if (customerorderBookData.origin_type === "international") {
          const quantity = Number(current.quantity) || 0;
          const rate = Number(current.rate) || 0;
          const exchange_rate = Number(inputValue.exchange_rate) || 0;
          return acc + exchange_rate * rate * quantity;
        } else {
          const quantity = Number(current.quantity) || 0;
          const rate = Number(current.rate) || 0;
          return acc + quantity * rate;
        }
      }, 0);
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = parseFloat(event.target.value) || 0;

    setProducts(data);

    // Use the calculateTotalAmount function to update the total amount
    const updatedTotalAmount = calculateTotalAmount(data);
    setTotalAmount(updatedTotalAmount);
  };

  const currentDate = new Date().toISOString().split("T")[0];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const getsearchByCompany = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const response = await InvoiceServices.getAllOrderBookDataWithSearch(
        "all",
        "customer",
        inputValue.company
      );

      // Filter data where any product's pending_quantity is greater than 0
      const filteredData = response.data.filter(
        (order) =>
          order.products &&
          order.products.some((product) => product.pending_quantity > 0)
      );

      setCustomerOrderBookOption(filteredData);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
      alert(err.response.data.errors.proforma_invoice);
    }
  };

  const getCustomerWiseOrderBook = async (value) => {
    try {
      setOpen(true); // Show loading spinner

      const data = value;

      // Initialize arrays
      const productData = [];
      const ORDERBOOKID = [];

      // Iterate over data array
      data.map((name) => {
        // Update state with customer order book data
        setCustomerOrderBookData(name);

        // Add order book id to array
        ORDERBOOKID.push(name.id);

        // Update state with order book id array
        setOrderBookID(ORDERBOOKID);

        // Iterate over products array and push data to productData array
        return name.products.map((data) => {
          const product = {
            product: data.product,
            pending_quantity: data.pending_quantity,
            requested_date: data.requested_date,
            rate: data.rate,
            proforma_invoice: data.proforma_invoice,
            id: data.id,
            raised_by: data.raised_by,
            ready_date: data.ready_date,
          };

          // Push product data to array
          productData.push(product);

          // Return new product object
          return product;
        });
      });

      // Map over productData array and create new array with specific properties
      const arr = productData.map((fruit) => ({
        product: fruit.product,
        pending_quantity: fruit.pending_quantity,
        requested_date: fruit.requested_date,
        rate: fruit.rate,
        proforma_invoice: fruit.proforma_invoice,
        id: fruit.id,
        user: fruit.raised_by,
        ready_date: fruit.ready_date,
      }));

      // Update state with new array of product objects
      setProducts(arr);

      setOpen(false); // Hide loading spinner
    } catch (err) {
      setOpen(false); // Hide loading spinner
      console.log("err", err);

      alert(err.response.data.errors.proforma_invoice); // Display error message
    }
  };

  const createSalesInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      const PRODUCTS = products
        .filter(
          (product) =>
            Number(product.pending_quantity) > 0 && Number(product.quantity) > 0
        ) // Keep products where both pending_quantity and quantity are > 0
        .map(
          ({ pending_quantity, rate, requested_date, ready_date, ...rest }) =>
            rest
        ); // Exclude specified fields

      const req = {
        invoice_type: "customer",
        order_book: customerorderBookData.id,
        order_book_list: orderBookID,
        generation_date: inputValue.generation_date
          ? inputValue.generation_date
          : new Date().toISOString().split("T")[0],
        products: PRODUCTS,
        place_of_supply:
          inputValue.place_of_supply !== undefined
            ? inputValue.place_of_supply
            : customerorderBookData
            ? customerorderBookData.place_of_supply
            : "",
        transporter_name:
          inputValue.transporter_name !== undefined
            ? inputValue.transporter_name
            : customerorderBookData
            ? customerorderBookData.transporter_name
            : "",
        exchange_rate: inputValue.exchange_rate || null,
      };
      setOpen(true);
      if (inputValue.length !== 0) {
        await InvoiceServices.createSalesinvoiceData(req);
        setOpenPopup(false);
        getSalesInvoiceDetails();
      }
      setOpen(false);
    } catch (err) {
      setOpen(false);
      setErrorOpen(true);
      if (err.response && err.response.data) {
        if (err.response.status === 400) {
          setErrMsg(err.response.data.errors.non_field_errors);
        }
      } else {
        setErrMsg(err.response.data);
      }
    }
  };

  const handleClose = () => {
    setErrorOpen(false); // set errorOpen to false to close the Alert component
    setErrMsg("");
  };

  return (
    <div>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createSalesInvoiceDetails(e)}
      >
        <Snackbar
          open={errorOpen}
          autoHideDuration={10000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // set the position to top center
        >
          <Alert severity="error" onClose={handleClose} sx={{ width: "100%" }}>
            <AlertTitle>Error</AlertTitle>
            {errMsg}
          </Alert>
        </Snackbar>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              sx={{ minWidth: "8rem" }}
              name="company"
              size="small"
              label="search By Company Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputValue.company}
            />
            <Button onClick={(e) => getsearchByCompany(e)} variant="contained">
              Submit
            </Button>
          </Grid>
          {customerorderBookOption && customerorderBookOption.length > 0 && (
            <Grid item xs={12} sm={3}>
              <Autocomplete
                name="pi_number"
                multiple
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => getCustomerWiseOrderBook(value)}
                options={customerorderBookOption}
                // loading={loading}
                getOptionLabel={(option) =>
                  `${option.proforma_invoice} - ${option.company}`
                }
                sx={{ minWidth: 300 }}
                renderInput={(params) => (
                  <CustomTextField {...params} label="PI Number" />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="seller_state"
              size="small"
              label="Seller State"
              variant="outlined"
              value={
                customerorderBookData ? customerorderBookData.seller_state : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="seller_auto_number"
              size="small"
              label="Seller Auto Number"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.seller_auto_number
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={customerorderBookData ? customerorderBookData.company : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.shipping_address
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_state"
              size="small"
              label="Shipping State"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.shipping_state
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                customerorderBookData ? customerorderBookData.shipping_city : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="shipping_pincode"
              size="small"
              label="Shipping Pincode"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.shipping_pincode
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_address"
              size="small"
              label="Billing Address"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.billing_address
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_state"
              size="small"
              label="Billing State"
              variant="outlined"
              value={
                customerorderBookData ? customerorderBookData.billing_state : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_city"
              size="small"
              label="Billing City"
              variant="outlined"
              value={
                customerorderBookData ? customerorderBookData.billing_city : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="billing_pincode"
              size="small"
              label="Billing Pincode"
              variant="outlined"
              value={
                customerorderBookData
                  ? customerorderBookData.billing_pincode
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              required
              name="transporter_name"
              size="small"
              label="Transporter Name"
              variant="outlined"
              value={
                inputValue.transporter_name !== undefined
                  ? inputValue.transporter_name
                  : customerorderBookData
                  ? customerorderBookData.transporter_name
                  : ""
              }
              error={inputValue.transporter_name === ""}
              // helperText={inputValue.transporter_name !== "" && "this field is required"}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="place_of_supply"
              size="small"
              label="Place of Supply"
              variant="outlined"
              value={
                inputValue.place_of_supply !== undefined
                  ? inputValue.place_of_supply
                  : customerorderBookData
                  ? customerorderBookData.place_of_supply
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              name="generation_date"
              size="small"
              label="Generation Date"
              variant="outlined"
              value={
                inputValue.generation_date
                  ? inputValue.generation_date
                  : currentDate
              }
              onChange={handleInputChange}
              inputProps={{ max: currentDate }}
            />
          </Grid>
          {customerorderBookData &&
            customerorderBookData.origin_type === "international" && (
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  fullWidth
                  name="exchange_rate"
                  size="small"
                  label="Exchange Rate"
                  variant="outlined"
                  value={
                    inputValue.exchange_rate !== undefined
                      ? inputValue.exchange_rate
                      : customerorderBookData
                      ? customerorderBookData.exchange_rate
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </Grid>
            )}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products &&
            products.length > 0 &&
            products.map((input, index) => {
              if (Number(input.pending_quantity) <= 0) {
                // If pending_quantity is not greater than 0, do not render this product
                return null;
              }
              let amount;

              if (customerorderBookData.origin_type === "international") {
                amount =
                  Number(inputValue.exchange_rate) *
                  Number(input.rate) *
                  (Number(input.quantity) || 0);
              } else {
                amount =
                  (Number(input.quantity) || 0) * (Number(input.rate) || 0);
              }
              return (
                <React.Fragment key={index}>
                  {" "}
                  {/* Use React.Fragment with a key for each item */}
                  <Grid item xs={12} sm={2}>
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
                      name="pending_quantity"
                      size="small"
                      label="Pending Quantity"
                      variant="outlined"
                      value={input.pending_quantity}
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
                      onChange={(event) => handleFormChange(index, event)}
                      error={input.pending_quantity < input.quantity}
                      helperText={
                        input.pending_quantity < input.quantity
                          ? "Quantity must be less than or equal to pending quantity"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={1.5}>
                    <CustomTextField
                      fullWidth
                      name="rate"
                      size="small"
                      label="Rate"
                      variant="outlined"
                      value={input.rate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      name="amount"
                      size="small"
                      label="Amount"
                      variant="outlined"
                      value={amount.toFixed(2)}
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
                  <Grid item xs={12} sm={1.5}>
                    {input.ready_date == null ? (
                      <Typography variant="h6" sx={{ color: "red" }}>
                        <DangerousIcon /> Not Ready
                      </Typography>
                    ) : (
                      <Typography variant="h6" sx={{ color: "green" }}>
                        <RuleIcon /> Ready
                      </Typography>
                    )}
                  </Grid>
                </React.Fragment>
              );
            })}

          {/* Display the total amount */}
          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              name="totalAmount"
              size="small"
              label="Total Amount"
              variant="outlined"
              value={isNaN(totalAmount) ? "" : totalAmount.toFixed(2)}
              InputProps={{
                readOnly: true,
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
    </div>
  );
};

// const tfStyle = {
//   "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
//     color: "blue",
//     visibility: "visible",
//   },
// };
