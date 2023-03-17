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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InvoiceServices from "../../../services/InvoiceService";
import LeadServices from "../../../services/LeadService";
import ProductService from "../../../services/ProductService";

export const UpdateLeadsProformaInvoice = (props) => {
  const { idForEdit, getAllLeadsPIDetails, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [leadPIdataByID, setLeadPIdataByID] = useState([]);
  const [validationPrice, setValidationPrice] = useState("");
  const [productData, setProductData] = useState("");
  const [productOption, setProductOption] = useState([]);
  const [inputValue, setInputValue] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deliveryTermData, setDeliveryTermData] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [leads, setLeads] = useState([]);
  const [checked, setChecked] = useState(true);
  const [unit, setUnit] = useState("");
  const [productEdit, setProductEdit] = useState(false);
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
  console.log("users", users);
  const sellerData = data.sellerAccount;
  console.log("sellerData", sellerData);
  const handleFormChange = (index, event) => {
    console.log("index", index);
    console.log("event", event.target);
    setProductData(event.target.textContent);
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

  function searchUnit(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].product === nameKey) {
        return myArray[i].id;
      }
    }
  }

  const ID = searchUnit(productData, productOption);

  useEffect(() => {
    if (ID) getPriceListData(ID);
  }, [ID]);

  const getPriceListData = async () => {
    try {
      const response = await ProductService.getPriceListById(ID);
      setUnit(response.data.unit);
    } catch (error) {
      console.log("error", error);
    }
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
    getLeadProformaInvoiceDetailsByID();
  }, []);

  const getLeadProformaInvoiceDetailsByID = async (e) => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getLeadsProformaInvoiceDataByID(
        idForEdit
      );
      setLeadPIdataByID(response.data);
      setPaymentTermData(response.data.payment_terms);
      setDeliveryTermData(response.data.delivery_terms);
      getLeadsData(response.data.lead);
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

  //   useEffect(() => {
  //     if (leadPIdataByID.lead) getLeadsData();
  //   }, []);

  const getLeadsData = async (value) => {
    try {
      setOpen(true);
      const data = value;
      const res = await LeadServices.getLeadsById(data);
      setLeads(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
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
        type: "Lead",
        raised_by: users.email,
        raised_by_first_name: leadPIdataByID.raised_by_first_name,
        raised_by_last_name: leadPIdataByID.raised_by_last_name,
        seller_account: selectedSellerData.gst_number
          ? selectedSellerData.gst_number
          : leadPIdataByID.seller_account,
        seller_address: selectedSellerData.address
          ? selectedSellerData.address
          : leadPIdataByID.seller_address,
        seller_pincode: selectedSellerData.pincode
          ? selectedSellerData.pincode
          : leadPIdataByID.seller_pincode,
        seller_state: selectedSellerData.state
          ? selectedSellerData.state
          : leadPIdataByID.seller_state,
        seller_city: selectedSellerData.city
          ? selectedSellerData.city
          : leadPIdataByID.seller_city,
        seller_gst: selectedSellerData.gst_number
          ? selectedSellerData.gst_number
          : leadPIdataByID.seller_gst,
        seller_pan: selectedSellerData.pan_number
          ? selectedSellerData.pan_number
          : leadPIdataByID.seller_pan,
        seller_state_code: selectedSellerData.state_code
          ? selectedSellerData.state_code
          : leadPIdataByID.seller_state_code,
        seller_cin: selectedSellerData.cin_number
          ? selectedSellerData.cin_number
          : leadPIdataByID.seller_cin,
        seller_email: selectedSellerData.email
          ? selectedSellerData.email
          : leadPIdataByID.seller_email,
        seller_contact: selectedSellerData.contact
          ? selectedSellerData.contact
          : leadPIdataByID.seller_contact,
        seller_bank_name: selectedSellerData.bank_name
          ? selectedSellerData.bank_name
          : leadPIdataByID.seller_bank_name,
        seller_account_no: selectedSellerData.current_account_no
          ? selectedSellerData.current_account_no
          : leadPIdataByID.seller_account_no,
        seller_ifsc_code: selectedSellerData.ifsc_code
          ? selectedSellerData.ifsc_code
          : leadPIdataByID.seller_ifsc_code,
        seller_branch: selectedSellerData.branch
          ? selectedSellerData.branch
          : leadPIdataByID.seller_branch,
        lead: leads.lead_id,
        contact_person_name: leads.name,
        contact: leads.contact,
        alternate_contact: leads.alternate_contact,
        company_name: leadPIdataByID.company_name
          ? leadPIdataByID.company_name
          : leads.company,
        gst_number: leads.gst_number,
        pan_number: leads.pan_number,
        billing_address: leads.address,
        billing_state: leads.state,
        billing_city: leads.city,
        billing_pincode: leads.pincode,
        address: leads.shipping_address,
        pincode: leads.shipping_pincode,
        state: leads.shipping_state,
        city: leads.shipping_city,
        place_of_supply: leadPIdataByID.place_of_supply
          ? leadPIdataByID.place_of_supply
          : inputValue.place_of_supply,
        transporter_name: leadPIdataByID.transporter_name
          ? leadPIdataByID.transporter_name
          : inputValue.transporter_name,
        buyer_order_no: checked === true ? "verbal" : inputValue.buyer_order_no,
        buyer_order_date: inputValue.buyer_order_date
          ? inputValue.buyer_order_date
          : values.someDate,
        payment_terms: paymentTermData,
        delivery_terms: deliveryTermData,
        status: "Raised",
        products: productList,
      };
      await InvoiceServices.updateLeadsProformaInvoiceData(
        leadPIdataByID.pi_number,
        req
      );
      setOpenPopup(false);
      getAllLeadsPIDetails();
      setOpen(false);
    } catch (err) {
      if (err.response.status === 400) {
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
                leadPIdataByID.seller_state ? leadPIdataByID.seller_state : ""
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
              getOptionLabel={(option) => option.state}
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
                <Chip label="LEAD" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="Lead ID"
              size="small"
              label="Lead ID"
              variant="outlined"
              value={leads.lead_id ? leads.lead_id : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="contact"
              size="small"
              label="Contact"
              variant="outlined"
              value={leads.contact ? leads.contact : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="alternate_contact"
              size="small"
              label="Alt. Contact"
              variant="outlined"
              value={leads.alternate_contact ? leads.alternate_contact : ""}
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
              value={leads.address ? leads.address : ""}
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
              value={leads.city ? leads.city : ""}
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
              value={leads.state ? leads.state : ""}
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
              value={leads.pincode ? leads.pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={leads.shipping_address ? leads.shipping_address : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              name="shipping_pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={leads.shipping_pincode ? leads.shipping_pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={leads.shipping_city ? leads.shipping_city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_state"
              size="small"
              label="Shipping State"
              variant="outlined"
              value={leads.shipping_state ? leads.shipping_state : ""}
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
              disabled={checked === true}
              value={
                checked === true
                  ? "Verbal"
                  : inputValue.buyer_order_no
                  ? inputValue.buyer_order_no
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
                inputValue.buyer_order_date
                  ? inputValue.buyer_order_date
                  : values.someDate
              }
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
                leadPIdataByID.place_of_supply
                  ? leadPIdataByID.place_of_supply
                  : inputValue.place_of_supply
              }
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
                leadPIdataByID.transporter_name
                  ? leadPIdataByID.transporter_name
                  : inputValue.transporter_name
              }
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
                    onChange={(event, value) => handleFormChange(index, event)}
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
                    value={input.unit ? input.unit : unit}
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
