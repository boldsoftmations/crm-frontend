import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import InvoiceServices from "../../../services/InvoiceService";
import ProductService from "../../../services/ProductService";

export const UpdateCustomerProformaInvoice = (props) => {
  const { idForEdit, getCustomerPIDetails, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [customerPIdataByID, setCustomerPIdataByID] = useState([]);
  const [validationPrice, setValidationPrice] = useState("");
  const [productOption, setProductOption] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deliveryTermData, setDeliveryTermData] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [checked, setChecked] = useState(
    customerPIdataByID.buyer_order_no === ""
  );
  const [productEdit, setProductEdit] = useState(false);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: "",
      rate: "",
      requested_date: values.someDate,
      special_instructions: "",
    },
  ]);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const sellerData = data.sellerAccount;

  const handleAutocompleteChange = (index, event, value) => {
    let data = [...products];
    const productObj = productOption.find((item) => item.product === value);
    console.log("productObj", productObj);
    data[index]["product"] = value;
    data[index]["unit"] = productObj ? productObj.unit : "";
    setProducts(data);
  };

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name ? event.target.name : "product"] = event
      .target.value
      ? event.target.value
      : event.target.textContent;
    setProducts(data);
    setProductEdit(true);
  };

  const addFields = () => {
    let newfield = {
      product: "",
      quantity: "",
      rate: "",
      requested_date: values.someDate,
      special_instructions: "",
    };
    setProducts([...products, newfield]);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllValidPriceList("all");
      setProductOption(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getCustomerProformaInvoiceDetailsByID();
  }, []);

  const getCustomerProformaInvoiceDetailsByID = async (e) => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getCustomerProformaInvoiceDataByID(
        idForEdit
      );
      setCustomerPIdataByID(response.data);
      setPaymentTermData(response.data.payment_terms);
      setDeliveryTermData(response.data.delivery_terms);
      getAllCompanyDetailsByID(response.data.company);

      var arr = [];
      var arr = response.data.products.map((fruit) => ({
        product: fruit.product,
        pending_quantity: fruit.pending_quantity,
        requested_date: fruit.requested_date,
        special_instructions: fruit.special_instructions,
        quantity: fruit.quantity,
        rate: fruit.rate,
        amount: fruit.amount,
        unit: fruit.unit,
      }));
      setProducts(arr);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  // All Company Details Api
  // useEffect(() => {
  //   if (recordForEdit) getAllCompanyDetailsByID();
  // }, [recordForEdit]);

  const getAllCompanyDetailsByID = async (value) => {
    try {
      setOpen(true);
      const data = value;
      const response = await CustomerServices.getCompanyDataById(data);
      setCustomerData(response.data);
      setContactOptions(response.data.contacts);
      setWarehouseOptions(response.data.warehouse);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const updateLeadProformaInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const productList = productEdit === true ? products : [];
      const req = {
        type: "Customer",
        raised_by: users.email,
        raised_by_first_name: users.first_name,
        raised_by_last_name: users.last_name,
        seller_account: selectedSellerData.unit
          ? selectedSellerData.unit
          : customerPIdataByID.seller_account,
        seller_address: selectedSellerData.address
          ? selectedSellerData.address
          : customerPIdataByID.seller_address,
        seller_pincode: selectedSellerData.pincode
          ? selectedSellerData.pincode
          : customerPIdataByID.seller_pincode,
        seller_state: selectedSellerData.state
          ? selectedSellerData.state
          : customerPIdataByID.seller_state,
        seller_city: selectedSellerData.city
          ? selectedSellerData.city
          : customerPIdataByID.seller_city,
        seller_gst: selectedSellerData.gst_number
          ? selectedSellerData.gst_number
          : customerPIdataByID.seller_gst,
        seller_pan: selectedSellerData.pan_number
          ? selectedSellerData.pan_number
          : customerPIdataByID.seller_pan,
        seller_state_code: selectedSellerData.state_code
          ? selectedSellerData.state_code
          : customerPIdataByID.seller_state_code,
        seller_cin: selectedSellerData.cin_number
          ? selectedSellerData.cin_number
          : customerPIdataByID.seller_cin,
        seller_email: selectedSellerData.email
          ? selectedSellerData.email
          : customerPIdataByID.seller_email,
        seller_contact: selectedSellerData.contact
          ? selectedSellerData.contact
          : customerPIdataByID.seller_contact,
        seller_bank_name: selectedSellerData.bank_name
          ? selectedSellerData.bank_name
          : customerPIdataByID.seller_bank_name,
        seller_account_no: selectedSellerData.current_account_no
          ? selectedSellerData.current_account_no
          : customerPIdataByID.seller_account_no,
        seller_ifsc_code: selectedSellerData.ifsc_code
          ? selectedSellerData.ifsc_code
          : customerPIdataByID.seller_ifsc_code,
        seller_branch: selectedSellerData.branch
          ? selectedSellerData.branch
          : customerPIdataByID.seller_branch,
        company: customerData.id,
        company_name: customerPIdataByID.company_name
          ? customerPIdataByID.company_name
          : customerData.name,
        contact: contactData.contact,
        contact_person_name: contactData.name,
        alternate_contact: contactData.alternate_contact,
        company_name: customerData.name,
        gst_number: customerData.gst_number || null,
        pan_number: customerData.pan_number,
        billing_address: customerData.address,
        billing_state: customerData.state,
        billing_city: customerData.city,
        billing_pincode: customerData.pincode,
        address: warehouseData.address,
        pincode: warehouseData.pincode,
        state: warehouseData.state,
        city: warehouseData.city,
        place_of_supply:
          inputValue.place_of_supply || customerPIdataByID.place_of_supply,
        transporter_name:
          inputValue.transporter_name || customerPIdataByID.transporter_name,
        buyer_order_no: checked
          ? "Verbal"
          : inputValue.buyer_order_no !== undefined
          ? inputValue.buyer_order_no
          : customerPIdataByID.buyer_order_no !== undefined
          ? customerPIdataByID.buyer_order_no
          : "",
        buyer_order_date:
          inputValue.buyer_order_date ||
          customerPIdataByID.buyer_order_date ||
          values.someDate,
        payment_terms: paymentTermData,
        delivery_terms: deliveryTermData,
        status: "Raised",
        products: productList,
      };
      await InvoiceServices.updateCustomerProformaInvoiceData(
        customerPIdataByID.pi_number,
        req
      );

      setOpenPopup(false);
      getCustomerPIDetails();
      setOpen(false);
    } catch (err) {
      if (err.response.status === 400) {
        alert(err.response.data.errors.address);
        // alert(err.response.data.contact);
        setErrorMessage(err.response.data.errors.buyer_order_no);
        setValidationPrice(
          err.response.data.errors.non_field_errors
            ? err.response.data.errors.non_field_errors
            : err.response.data.errors
        );
      }
    }
  };
  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateLeadProformaInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              size="small"
              label="Seller Account"
              variant="outlined"
              value={
                customerPIdataByID.seller_account
                  ? customerPIdataByID.seller_account
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Autocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={sellerData}
              // value={selectedSellerData}s
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Update Seller Account"
                  required
                  sx={tfStyle}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="payment_terms"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setPaymentTermData(value)}
              value={paymentTermData ? paymentTermData : ""}
              options={paymentTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Payment Terms"
                  required
                  sx={tfStyle}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="delivery_terms"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setDeliveryTermData(value)}
              value={deliveryTermData ? deliveryTermData : ""}
              options={deliveryTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Delivery Terms" sx={tfStyle} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="COMPANY" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
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
                onChange={(e, value) => setContactData(e.target.value)}
              >
                {contactOptions &&
                  contactOptions.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option
                        ? `${option.name} - ${option.contact}`
                        : "Please First Select Company"}
                    </MenuItem>
                  ))}
              </Select>
              <HelperText>first select Company Name</HelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              disabled
              name="alternate_contact"
              size="small"
              label="Alt. Contact"
              variant="outlined"
              value={
                contactData
                  ? contactData.alternate_contact
                    ? contactData.alternate_contact
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
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
            <TextField
              fullWidth
              required
              name="city"
              size="small"
              label="Billing City"
              variant="outlined"
              value={customerData.city ? customerData.city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="state"
              size="small"
              label="Billing State"
              variant="outlined"
              value={customerData.state ? customerData.state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
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
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Shipping Address"
                onChange={(e, value) => setWarehouseData(e.target.value)}
              >
                {warehouseOptions &&
                  warehouseOptions.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option ? option.address : "Please First Select Contact"}
                    </MenuItem>
                  ))}
              </Select>
              <HelperText>first select Contact</HelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
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
            <TextField
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
            <TextField
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

            <TextField
              required
              name="buyer_order_no"
              size="small"
              label="Buyer Order No"
              variant="outlined"
              disabled={checked}
              value={
                checked
                  ? "Verbal"
                  : inputValue.buyer_order_no !== undefined
                  ? inputValue.buyer_order_no
                  : customerPIdataByID.buyer_order_no !== undefined
                  ? customerPIdataByID.buyer_order_no
                  : ""
              }
              onChange={handleInputChange}
              error={errorMessage}
              helperText={errorMessage}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type={"date"}
              name="buyer_order_date"
              size="small"
              label="Buyer Order Date"
              variant="outlined"
              value={
                inputValue.buyer_order_date ||
                customerPIdataByID.buyer_order_date ||
                values.someDate
              }
              // value={
              //   inputValue.buyer_order_date
              //     ? inputValue.buyer_order_date
              //     : values.someDate
              // }
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="place_of_supply"
              size="small"
              label="Place of Supply"
              variant="outlined"
              value={
                inputValue.place_of_supply || customerPIdataByID.place_of_supply
              }
              // value={
              //   inputValue.place_of_supply
              //     ? inputValue.place_of_supply
              //     : customerPIdataByID.place_of_supply
              // }
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="transporter_name"
              size="small"
              label="Transporter Name"
              variant="outlined"
              value={
                inputValue.transporter_name ||
                customerPIdataByID.transporter_name
              }
              // value={
              //   customerPIdataByID.transporter_name
              //     ? customerPIdataByID.transporter_name
              //     : inputValue.transporter_name
              // }
              InputLabelProps={{
                shrink: true,
              }}
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
          <ErrorMessage errMsg={validationPrice} />
          {products.map((input, index) => {
            return (
              <>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    value={input.product ? input.product : ""}
                    options={productOption.map((option) => option.product)}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Name"
                        sx={tfStyle}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity ? input.quantity : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Unit"
                    variant="outlined"
                    value={input.unit ? input.unit : ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type={"number"}
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    // error={validationPrice}
                    // helperText={validationPrice}
                    value={input.rate ? input.rate : ""}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={"number"}
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={
                      input.quantity
                        ? (input.quantity * input.rate).toFixed(2)
                        : ""
                    }
                    // onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
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
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    fullWidth
                    name="special_instructions"
                    size="small"
                    label="Special Instructions"
                    variant="outlined"
                    value={
                      input.special_instructions
                        ? input.special_instructions
                        : ""
                    }
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} alignContent="right">
                  <Button
                    onClick={addFields}
                    variant="contained"
                    sx={{ marginRight: "1em" }}
                  >
                    Add More...
                  </Button>
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

const values = {
  someDate: new Date().toISOString().substring(0, 10),
};

const HelperText = styled(FormHelperText)(() => ({
  padding: "0px",
}));
