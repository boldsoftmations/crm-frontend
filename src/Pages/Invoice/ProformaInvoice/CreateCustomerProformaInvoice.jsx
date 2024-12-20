import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerServices from "../../../services/CustomerService";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { UpdateCompanyDetails } from "../../Cutomers/CompanyDetails/UpdateCompanyDetails";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import ProductService from "../../../services/ProductService";
import InventoryServices from "../../../services/InventoryService";

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    color: "blue",
    visibility: "visible",
  },
};

const getNextFiveDates = () => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 7); // Add i days to today's date
  return futureDate.toISOString().substring(0, 10);
};

const values = {
  someDate: getNextFiveDates(),
};

export const CreateCustomerProformaInvoice = (props) => {
  const { recordForEdit, rowData, setOpenPopup } = props;
  const [productOption, setProductOption] = useState([]);
  const [productDetails, setProductDetails] = useState(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const {
    handleAutocompleteChange,
    handleFormChange,
    addFields,
    removeFields,
    products,
  } = useDynamicFormFields(
    [
      {
        product: "",
        unit: "",
        quantity: "",
        rate: "",
        requested_date: values.someDate,
        special_instructions: "",
      },
    ],
    productOption,
    true
  );
  const constructPayload = () => {
    return products.map((input, index) => {
      return {
        ...input,
        rate:
          input.rate || (productDetails[index] && productDetails[index].rate),
        special_instructions:
          input.special_instructions ||
          (productDetails[index] && productDetails[index].special_instructions),
      };
    });
  };
  const navigate = useNavigate();
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [paymentTermData, setPaymentTermData] = useState("");
  const [deliveryTermData, setDeliveryTermData] = useState("");
  const [contactData, setContactData] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [checked, setChecked] = useState(true);
  const [priceApproval, setPriceApproval] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [edcData, setEdcData] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [customerLastPiData, setCustomerLastPiData] = useState(null);
  const { profile: users } = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
    setCustomerLastPiData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  let buyer_date = new Date().toISOString().slice(0, 10);
  const openInPopup = () => {
    setOpenPopup3(true);
    setOpenPopup2(false);
  };

  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      setOpenPopup(false); // Close the popup when the timer reaches 0
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [timeLeft, setOpenPopup]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const getProduct = useCallback(async () => {
    try {
      const res = await ProductService.getAllValidPriceList("all");
      setProductOption(res.data);
    } catch (err) {
      console.error("error potential", err);
    }
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerData(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };
  const getBillingAddressbyCustomer = async () => {
    try {
      const response = await InvoiceServices.getBillingAddressbyCustomer(
        rowData.name
      );
      setEdcData(response.data);
    } catch (error) {
      console.log("Error fetching customer billing address data:", error);
    }
  };
  useEffect(() => {
    getBillingAddressbyCustomer();
  }, [rowData]);

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
  }, []);

  const getContactsDetailsByID = async () => {
    try {
      const [contactResponse, warehouseResponse] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "contacts"),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "warehouse"),
      ]);
      setContactOptions(contactResponse.data.contacts);
      setWarehouseOptions(warehouseResponse.data.warehouse);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const getAllCompanyDetailsByID = async () => {
    try {
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      setCustomerData(response.data);
    } catch (err) {
      console.log("company data by id error", err);
    }
  };
  const handleSellerAccountChange = async (e, value, name) => {
    setSelectedSellerData(value);

    try {
      setOpen(true);
      const response = await CustomerServices.getCustomerLastPi(
        rowData && rowData.name,
        value.unit
      );

      setCustomerLastPiData(response.data || {});
    } catch (err) {
      console.error("error getting last pi", err);
    } finally {
      setOpen(false);
    }
  };
  const getCurrencyDetails = async () => {
    setOpen(true);
    try {
      const response = await InventoryServices.getCurrencyData();

      if (response && response.data) {
        // Filter out INR for international vendors
        const filteredCurrencyOptions = response.data;
        setCurrencyOption(filteredCurrencyOptions);

        // Set default currency to INR if vendor is Domestic and no currency is selected
        if (rowData.origin_type === "Domestic" && !inputValue.currency) {
          setInputValue((prevValues) => ({ ...prevValues, currency: "INR" }));
        }
      }
    } catch (err) {
      handleError(err);
      console.error("Error fetching currency data", err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllCompanyDetailsByID();
    getContactsDetailsByID();
    if (rowData.origin_type === "International") {
      getCurrencyDetails();
    }
  }, [openPopup3]);

  const createCustomerProformaInvoiceDetails = async (e) => {
    e.preventDefault();

    const isValidData =
      contactData.contact !== null &&
      warehouseData.address !== null &&
      warehouseData.state !== null &&
      warehouseData.city !== null &&
      warehouseData.pincode !== null;

    const payload = {
      type: "Customer",
      raised_by: users.email,
      raised_by_first_name: users.first_name,
      raised_by_last_name: users.last_name,
      seller_account: selectedSellerData.unit,
      seller_address: selectedSellerData.address,
      seller_pincode: selectedSellerData.pincode,
      seller_state: selectedSellerData.state,
      seller_city: selectedSellerData.city,
      seller_gst: selectedSellerData.gst_number,
      seller_pan: selectedSellerData.pan_number,
      seller_state_code: selectedSellerData.state_code,
      seller_cin: selectedSellerData.cin_number,
      seller_email: selectedSellerData.email,
      seller_contact: selectedSellerData.contact,
      seller_bank_name: selectedSellerData.bank_name,
      seller_account_no: selectedSellerData.current_account_no,
      seller_ifsc_code: selectedSellerData.ifsc_code,
      seller_branch: selectedSellerData.branch,
      company: customerData.id,
      company_name:
        rowData.type_of_customer === "Exclusive Distribution Customer"
          ? warehouseData.company
          : customerData.name,
      contact: contactData.contact,
      contact_person_name: contactData.name,
      alternate_contact: contactData.alternate_contact,
      gst_number: customerData.gst_number || null,
      pan_number: customerData.pan_number,
      billing_address: customerData.address,
      billing_state: customerData.state,
      billing_city: customerData.city,
      billing_pincode: customerData.pincode,
      address:
        rowData.type_of_customer === "Exclusive Distribution Customer"
          ? warehouseData.customer_address
          : warehouseData.address,
      pincode: warehouseData.pincode,
      state: warehouseData.state,
      city: warehouseData.city,
      place_of_supply:
        inputValue.place_of_supply ||
        (customerLastPiData && customerLastPiData.place_of_supply),
      transporter_name:
        inputValue.transporter_name ||
        (customerLastPiData && customerLastPiData.transporter_name),
      buyer_order_no: checked === true ? "verbal" : inputValue.buyer_order_no,
      buyer_order_date: inputValue.buyer_order_date
        ? inputValue.buyer_order_date
        : buyer_date,
      payment_terms:
        paymentTermData ||
        (customerLastPiData && customerLastPiData.payment_terms),
      delivery_terms:
        deliveryTermData ||
        (customerLastPiData && customerLastPiData.delivery_terms),
      status: priceApproval ? "Price Approval" : "Approved",
      price_approval: priceApproval,
      products: constructPayload(),
      warehouse_person_name: warehouseData.contact_name,
    };
    if (rowData.origin_type === "International") {
      payload.currency = inputValue.currency;
    } else {
      payload.currency = "INR";
    }

    try {
      setOpen(true);
      if (!isValidData) {
        setOpenPopup2(true);
        return; // Exit if data validation fails
      }

      // Perform the API call if data is valid
      const response = await InvoiceServices.createCustomerProformaInvoiceData(
        payload
      );
      const successMessage =
        response.data.message || "Proforma Invoice created successfully!";
      handleSuccess(successMessage);

      setTimeout(() => {
        navigate("/invoice/active-pi");
      }, 300);
    } catch (error) {
      handleError(error); // Handle errors from the API call
    } finally {
      setOpen(false); // Always close the loader
    }
  };

  return (
    <div>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <p>Time Left: {formatTime(timeLeft)}</p>
      <Box
        component="form"
        noValidate
        // onSubmit={formik.handleSubmit}
        onSubmit={(e) => createCustomerProformaInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={handleSellerAccountChange}
              options={sellerData.map((option) => option)}
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 300 }}
              label="Seller Account"
              style={tfStyle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="payment_terms"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setPaymentTermData(value)}
              options={paymentTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Payment Terms"
              value={
                paymentTermData === ""
                  ? customerLastPiData && customerLastPiData.payment_terms
                  : paymentTermData
              }
              style={tfStyle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="delivery_terms"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setDeliveryTermData(value)}
              options={deliveryTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Delivery Terms"
              value={
                deliveryTermData == ""
                  ? customerLastPiData && customerLastPiData.delivery_terms
                  : deliveryTermData
              }
              style={tfStyle}
            />
          </Grid>
          {rowData.origin_type === "International" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                disablePortal
                id="currency-autocomplete"
                value={
                  currencyOption.find((c) => c.name === inputValue.currency) ||
                  null
                }
                onChange={(event, value) =>
                  setInputValue({ ...inputValue, currency: value.name })
                }
                options={currencyOption.map((option) => option)}
                getOptionLabel={(option) => `${option.name} (${option.symbol})`}
                sx={{ minWidth: 300 }}
                label="Currency"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="CUSTOMER" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={customerData.name ? customerData.name : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl
              required
              fullWidth
              size="small"
              sx={{ padding: "0", margin: "0" }}
            >
              <InputLabel id="demo-simple-select-required-label">
                Contact Name
              </InputLabel>
              <Select
                labelId="demo-simple-select-required-label"
                id="demo-simple-select-required"
                label="Contact Name"
                value={
                  contactData || // Use the selected contactData
                  contactOptions.find(
                    (option) =>
                      option.name === customerLastPiData &&
                      customerLastPiData.contact_person_name
                  ) // Default to customerLastPiData if contactData is not set
                }
                onChange={(e) => setContactData(e.target.value)} // Handle changes to update contactData
                renderValue={(selected) => (selected ? selected.name : "")} // Display contact name as value
              >
                {contactOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option.name || "Please First Select Company"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>First select Company Name</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              disabled
              name="contact"
              size="small"
              label="Contact"
              variant="outlined"
              value={
                contactData && contactData.contact
                  ? contactData.contact
                  : customerLastPiData && customerLastPiData.contact
                  ? customerLastPiData.contact
                  : ""
              }
              InputLabelProps={{
                shrink: true, // This will ensure the label stays above the field
              }}
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              disabled
              name="alternate_contact"
              size="small"
              label="Alt. Contact"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.contact_number
                    ? warehouseData.contact_number
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              disabled
              multiline
              required
              name="address"
              size="small"
              label="Billing Address"
              variant="outlined"
              value={customerData.address ? customerData.address : ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              disabled
              required
              name="city"
              size="small"
              label="Billing City"
              variant="outlined"
              value={customerData.city ? customerData.city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              disabled
              required
              name="state"
              size="small"
              label="Billing State"
              variant="outlined"
              value={customerData.state ? customerData.state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              disabled
              required
              name="pincode"
              size="small"
              type={"number"}
              label="Billing Pin Code"
              variant="outlined"
              value={customerData.pincode ? customerData.pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Shipping Address
              </InputLabel>
              {rowData.type_of_customer == "Exclusive Distribution Customer" ? (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Shipping Address"
                  onChange={(e, value) => setWarehouseData(e.target.value)}
                >
                  {warehouseOptions &&
                    edcData.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option
                          ? option.customer_address
                          : "Please First Select Contact"}
                      </MenuItem>
                    ))}
                </Select>
              ) : (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Shipping Address"
                  onChange={(e, value) => setWarehouseData(e.target.value)}
                >
                  {warehouseOptions &&
                    warehouseOptions.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option
                          ? option.address
                          : "Please First Select Contact"}
                      </MenuItem>
                    ))}
                </Select>
              )}
              <HelperText>first select Contact</HelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              disabled
              name="city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.city
                    ? warehouseData.city
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              disabled
              name="state"
              size="small"
              label="Shipping State"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.state
                    ? warehouseData.state
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              disabled
              name="pincode"
              size="small"
              type={"number"}
              label="Shipping Pin Code"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.pincode
                    ? warehouseData.pincode
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              label="Verbal"
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                />
              }
            />

            <CustomTextField
              required
              name="buyer_order_no"
              size="small"
              label="Buyer Order No"
              variant="outlined"
              disabled={checked === true}
              value={
                checked === true
                  ? "Verbal"
                  : inputValue.buyer_order_no
                  ? inputValue.buyer_order_no
                  : ""
              }
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type={"date"}
              name="buyer_order_date"
              size="small"
              label="Buyer Order Date"
              variant="outlined"
              value={
                inputValue.buyer_order_date
                  ? inputValue.buyer_order_date
                  : buyer_date
              }
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="place_of_supply"
              size="small"
              label="Place of Supply"
              variant="outlined"
              InputLabelProps={{
                shrink: true, // This will ensure the label stays above the field
              }}
              value={
                inputValue.place_of_supply
                  ? inputValue.place_of_supply
                  : customerLastPiData && customerLastPiData.place_of_supply
              }
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
              InputLabelProps={{
                shrink: true, // This will ensure the label stays above the field
              }}
              value={
                inputValue.transporter_name
                  ? inputValue.transporter_name
                  : customerLastPiData && customerLastPiData.transporter_name
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
          <Grid item xs={12}>
            <FormControlLabel
              label="Price Approval"
              control={
                <Checkbox
                  checked={priceApproval}
                  onChange={(event) => setPriceApproval(event.target.checked)}
                />
              }
            />
          </Grid>
          {products.map((input, index) => {
            return (
              <>
                <Grid key={index} item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id={`combo-box-${index}`}
                    onChange={async (event, value) => {
                      // Handle product change
                      handleAutocompleteChange(index, event, value); // Update product state
                      if (!selectedSellerData) {
                        return alert("Please select seller unit first! ");
                      }
                      if (value) {
                        try {
                          setOpen(true);
                          const response =
                            await CustomerServices.getProductLastPi(
                              rowData && rowData.name,
                              selectedSellerData.unit,
                              value
                            );

                          setProductDetails((prev) => ({
                            ...prev,
                            [index]: response.data, // Store product details by index
                          }));
                        } catch (err) {
                          console.error("Error fetching product details:", err);
                        } finally {
                          setOpen(false);
                        }
                      }
                    }}
                    options={productOption.map((option) => option.product)}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
                    style={tfStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Available Quantity"
                    variant="outlined"
                    disabled
                    value={
                      productDetails &&
                      productDetails[index] &&
                      productDetails[index].available_qty
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
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
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    value={
                      input.rate // Use the rate if the user edited it
                        ? input.rate
                        : productDetails &&
                          productDetails[index] &&
                          productDetails[index].rate
                        ? parseFloat(productDetails[index].rate).toFixed(2) // Use productDetails if not edited
                        : ""
                    }
                    variant="outlined"
                    onChange={(event) => {
                      handleFormChange(index, event); // Track changes for user input
                      setProductDetails((prev) => ({
                        ...prev,
                        [index]: {
                          ...prev[index],
                          rate: event.target.value,
                        },
                      }));
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    type="number"
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={
                      input.quantity && input.rate
                        ? (input.quantity * input.rate).toFixed(2)
                        : input.quantity &&
                          productDetails[index] &&
                          productDetails[index].rate
                        ? (input.quantity * productDetails[index].rate).toFixed(
                            2
                          )
                        : "0.00"
                    }
                    disabled // The amount is calculated, so it should not be manually editable.
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    type={"date"}
                    name="requested_date"
                    size="small"
                    label="Request Date"
                    variant="outlined"
                    value={
                      input.requested_date
                        ? input.requested_date
                        : values.someDate
                    }
                    onChange={(event) => handleFormChange(index, event)}
                    InputLabelProps={{
                      shrink: true, // Ensures the label stays visible
                    }}
                    inputProps={{
                      min: new Date(
                        new Date().setDate(new Date().getDate() + 1)
                      )
                        .toISOString()
                        .substring(0, 10), // Prevent selecting past and current dates
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="special_instructions"
                    size="small"
                    label="Special Instructions"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={
                      input.special_instructions ||
                      (productDetails &&
                        productDetails[index] &&
                        productDetails[index].special_instructions)
                    }
                    onChange={(event) => {
                      handleFormChange(index, event);
                      setProductDetails((prev) => ({
                        ...prev,
                        [index]: {
                          ...prev[index],
                          special_instructions: event.target.value,
                        },
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4} alignContent="right">
                  {index !== 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} sm={4} alignContent="right">
            <Button
              onClick={addFields}
              variant="contained"
              sx={{ marginRight: "1em" }}
            >
              Add More...
            </Button>
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
      <Popup
        maxWidth={"xl"}
        title={"Update Lead Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <Typography>
          Kindly update all required field WareHouse Details in Company
        </Typography>
        <Button variant="contained" onClick={() => openInPopup()}>
          Update Customer
        </Button>
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <UpdateCompanyDetails
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup3}
        />
      </Popup>
    </div>
  );
};

const paymentTermsOptions = [
  { label: "100% Advance", value: "100%_advance" },
  {
    label: "50% Advance, Balance Before Dispatch",
    value: "50%_advance_balance_before_dispatch",
  },
  {
    label: "30% Advance, Balance Before Dispatch",
    value: "30%_advance_balance_before_dispatch",
  },
  { label: "7 days along with PDC", value: "7_days_with_pdc" },
  { label: "10 days along with PDC", value: "10_days_with_pdc" },
  { label: "15 days along with PDC", value: "15_days_with_pdc" },
  { label: "30 days along with PDC", value: "30_days_with_pdc" },
  { label: "45 days along with PDC", value: "45_days_with_pdc" },
  { label: "60 days along with PDC", value: "60_days_with_pdc" },
  { label: "7 days", value: "7_days" },
  { label: "15 days", value: "15_days" },
  { label: "30 days", value: "30_days" },
  {
    label: "10% Advance, balance against shipping document (export)",
    value: "10%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "20% Advance, balance against shipping document (export)",
    value: "20%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "30% Advance, balance against shipping document (export)",
    value: "30%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "40% Advance, balance against shipping document (export)",
    value: "40%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "50% Advance, balance against shipping document (export)",
    value: "50%_advance_balance_against_shipping_document_(export)",
  },
  { label: "LC at Sight (Export)", value: "lc_at_sight_(export)" },
  { label: "LC 45 days (Export)", value: "lc_45_days_(export)" },
  { label: "TT in advance (Export)", value: "tt_in_advance_(export)" },
  { label: "45 days", value: "45_days" },
  { label: "60 days", value: "60_days" },
  { label: "Against Delivery", value: "against_delivery" },
];

const deliveryTermsOptions = [
  {
    label: "Ex-Work (Freight to pay)",
    value: "ex_work_(freight_to_pay)",
  },
  {
    label: "Transporter Warehouse (Freight to Pay)",
    value: "transporter_warehouse_(freight_to_pay)",
  },
  {
    label: "Customer Door Delivery (Freight to Pay)",
    value: "customer_door_delivery_(freight_to_pay)",
  },
  {
    label: "Customer Door Delivery (Prepaid)",
    value: "customer_door_delivery_(prepaid)",
  },
  {
    label: "Transporter Warehouse (Prepaid)",
    value: "transporter_warehouse_(prepaid)",
  },
  {
    label: "Add actual freight in invoice",
    value: "add_actual_freight_in_invoice",
  },
  {
    label: "Courier (Freight to Pay)",
    value: "courier_(freight_to_pay)",
  },
  {
    label: "Courier (Freight Add in Invoice)",
    value: "courier_(freight_add_in_invoice",
  },
];

const HelperText = styled(FormHelperText)(() => ({
  padding: "0px",
}));
