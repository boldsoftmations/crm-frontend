import { Autocomplete, Box, Button, Grid, linkClasses } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import InventoryServices from "../../services/InventoryService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import InvoiceServices from "../../services/InvoiceService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";

import { DecimalValidation } from "../../Components/Header/DecimalValidation";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

export const SalesReturnCreate = (props) => {
  const { setOpenPopup, getSalesReturnDetails } = props;
  const [open, setOpen] = useState(false);
  const [salesReturnData, setSalesReturnData] = useState();
  const [invoiceNoOption, setInvoiceNoOption] = useState([]);
  const [sellerUnitOptions, setSellerUnitOptions] = useState([]);
  const [inputValue, setInputValue] = useState({
    seller_unit: "",
    company: "",
    invoice_no: [],
  });
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      rate: "",
      amount: "",
      cost: "",
    },
  ]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;
    setProducts(data);
    console.log(products);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerUnitOptions(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getsearchByCompany = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const response = await InvoiceServices.getSalesReturnBySearchCompany(
        inputValue.seller_unit,
        inputValue.company
      );
      setInvoiceNoOption(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
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
        setSalesReturnData(name);

        // Add order book id to array
        ORDERBOOKID.push(name.id);

        // Iterate over products array and push data to productData array
        return name.products_si.map((data) => {
          const product = {
            product: data.product,
            quantity: data.quantity,
            rate: data.rate,
            amount: data.amount,
            max_decimal_digit: data.max_decimal_digit,
            type_of_unit: data.type_of_unit,
            unit: data.unit,
            cost: data.cost,
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
        quantity: fruit.quantity,
        rate: fruit.rate,
        amount: fruit.amount,
        max_decimal_digit: fruit.max_decimal_digit,
        type_of_unit: fruit.type_of_unit,
        unit: fruit.unit,
        cost: fruit.cost,
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

      // Map through the products to include only specific details
      const formattedProducts = products.map((product) => {
        const rate = Number(product.rate);
        const quantity = Number(product.quantity);
        console.log(!isNaN(rate), !isNaN(quantity));
        const amount = Math.round(rate * quantity * 100) / 100;

        return {
          product: product.product,
          quantity: product.quantity,
          rate,
          amount,
          cost: product.cost,
        };
      });

      console.log(products);
      const quantites = formattedProducts.map((item) => item.quantity);
      const decimalcounts = products.map((item) => item.max_decimal_digit);
      const numtypes = products.map((item) => item.type_of_unit);
      const unit = products.map((item) => item.unit);
      // const numtypes=
      console.log(quantites, decimalcounts, numtypes, unit);
      const hashDecimal = numtypes.some((item) => item === "decimal");
      if (hashDecimal) {
        const isValid = DecimalValidation({
          numTypes: numtypes,
          quantities: quantites,
          decimalCounts: decimalcounts,
          unit,
          handleError,
        });
        if (!isValid) {
          return;
        }
      }

      const req = {
        invoice_type: "Sales Return",
        sales_invoices: inputValue.invoice_no,
        gst_number: salesReturnData.buyer_details.gst_number,
        pan_number: salesReturnData.buyer_details.pan_number,
        address: salesReturnData.buyer_details.address,
        state: salesReturnData.buyer_details.state,
        city: salesReturnData.buyer_details.city,
        pincode: salesReturnData.buyer_details.pincode,
        country: salesReturnData.buyer_details.country,
        supplier_name: salesReturnData.buyer_details.supplier_name,
        seller_address: salesReturnData.seller_details.seller_address,
        seller_city: salesReturnData.seller_details.seller_city,
        seller_state: salesReturnData.seller_details.seller_state,
        seller_gst: salesReturnData.seller_details.seller_gst,
        seller_email: salesReturnData.seller_details.seller_email,
        seller_pan: salesReturnData.seller_details.seller_pan,
        seller_pincode: salesReturnData.seller_details.seller_pincode,
        seller_contact: salesReturnData.seller_details.seller_contact,
        seller_state_code: salesReturnData.seller_details.seller_state_code,
        seller_unit: inputValue.seller_unit,
        products_data: formattedProducts,
        user: salesReturnData.products_si[0].user,
      };

      setOpen(true);

      const response = await InventoryServices.createSalesReturn(req);
      const successMessage =
        response.data.message || "Sales Return Created successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getSalesReturnDetails();
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
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createSalesInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) =>
                setInputValue((prev) => ({
                  ...prev,
                  seller_unit: value,
                }))
              }
              options={sellerUnitOptions.map((option) => option.unit)}
              getOptionLabel={(option) => option}
              fullWidth
              label="Seller Account"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1, // Adjust gap between elements
              }}
            >
              <CustomTextField
                required
                sx={{ flexGrow: 1 }} // Makes the TextField flexible in taking available space
                fullWidth
                name="company"
                size="small"
                label="Search By Company"
                variant="outlined"
                onChange={(event) =>
                  setInputValue((prev) => ({
                    ...prev,
                    [event.target.name]: event.target.value,
                  }))
                }
                value={inputValue.company}
              />

              <Button
                onClick={(e) => getsearchByCompany(e)}
                variant="contained"
                sx={{ height: "40px" }} // Optional, adjust to align height with the TextField
              >
                Submit
              </Button>
            </Box>
          </Grid>

          {invoiceNoOption && invoiceNoOption.length > 0 && (
            <Grid item xs={12} sm={3}>
              <Autocomplete
                fullWidth
                multiple
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => {
                  const invoiceNumbers = value.map((v) => v.invoice_no);
                  setInputValue((prev) => ({
                    ...prev,
                    invoice_no: invoiceNumbers, // Storing only invoice numbers as an array
                  }));
                  getCustomerWiseOrderBook(value); // Passing the entire selected option object array
                }}
                options={invoiceNoOption}
                getOptionLabel={(option) => option.invoice_no || ""}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Invoice No" />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Supplier Name"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.buyer_details
                  ? salesReturnData.buyer_details.supplier_name
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              multiline
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.buyer_details
                  ? salesReturnData.buyer_details.address
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping State"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.buyer_details
                  ? salesReturnData.buyer_details.state
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.buyer_details
                  ? salesReturnData.buyer_details.city
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              disabled
              size="small"
              label="Shipping Pincode"
              variant="outlined"
              value={
                salesReturnData && salesReturnData.buyer_details
                  ? salesReturnData.buyer_details.pincode
                  : ""
              }
            />
          </Grid>

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

              const amount =
                (Number(input.quantity) || 0) * (Number(input.rate) || 0);

              return (
                <React.Fragment key={index}>
                  {" "}
                  {/* Use React.Fragment with a key for each item */}
                  <Grid item xs={12} sm={3}>
                    <CustomTextField
                      fullWidth
                      disabled
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
                      type="number"
                      label="Quantity"
                      variant="outlined"
                      value={
                        input.type_of_unit === "decimal"
                          ? input.quantity
                          : Math.round(input.quantity)
                      }
                      onChange={(event) => handleFormChange(index, event)}
                      error={input.pending_quantity < input.quantity}
                      helperText={
                        input.pending_quantity < input.quantity
                          ? "Quantity must be less than or equal to pending quantity"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <CustomTextField
                      fullWidth
                      disabled
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
                      disabled
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
                </React.Fragment>
              );
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
