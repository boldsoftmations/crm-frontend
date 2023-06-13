import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "./../../../Components/CustomLoader";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const SalesInvoiceCreate = (props) => {
  const { setOpenPopup, getSalesInvoiceDetails, getAllCustomerWiseOrderBook } =
    props;
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
    },
  ]);

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;
    setProducts(data);
  };

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
      setCustomerOrderBookOption(response.data);
      console.log("response.data.results by company", response.data.results);
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
      const PRODUCTS = products.map(
        ({ pending_quantity, rate, requested_date, ...rest }) => rest
      );

      const req = {
        order_book: customerorderBookData.id,
        order_book_list: orderBookID,
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
      };

      setOpen(true);
      if (inputValue !== []) {
        await InvoiceServices.createSalesnvoiceData(req);
        setOpenPopup(false);
        getSalesInvoiceDetails();
        getAllCustomerWiseOrderBook();
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
            <TextField
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
                  <TextField
                    {...params}
                    label="PI Number"
                    // InputProps={{
                    //   ...params.InputProps,
                    //   endAdornment: (
                    //     <>
                    //       {loading ? (
                    //         <CircularProgress color="inherit" size={20} />
                    //       ) : null}
                    //       {params.InputProps.endAdornment}
                    //     </>
                    //   ),
                    // }}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <TextField
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
            <TextField
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
            <TextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={customerorderBookData ? customerorderBookData.company : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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
            <TextField
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

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products && products.length > 0
            ? products.map((input, index) => {
                return (
                  <>
                    <Grid key={index} item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        name="product"
                        size="small"
                        label="Product"
                        variant="outlined"
                        value={input.product}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        name="pending_quantity"
                        size="small"
                        label="Pending Quantity"
                        variant="outlined"
                        value={input.pending_quantity}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
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
                            ? "qunatity will less than pending quantity"
                            : ""
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        name="rate"
                        size="small"
                        label="Rate"
                        variant="outlined"
                        value={input.rate}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField
                        fullWidth
                        // type={"number"}
                        name="amount"
                        size="small"
                        label="Amount"
                        variant="outlined"
                        value={(input.quantity * input.rate).toFixed(2)}
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
                  </>
                );
              })
            : null}
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
