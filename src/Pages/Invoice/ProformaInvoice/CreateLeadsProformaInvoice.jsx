import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { UpdateLeads } from "../../Leads/UpdateLeads";
import LeadServices from "../../../services/LeadService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import useDynamicFormFields from "../../../Components/useDynamicFormFields ";
import ProductService from "../../../services/ProductService";

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

export const CreateLeadsProformaInvoice = (props) => {
  const { setOpenPopup, leadsByID } = props;
  const [productOption, setProductOption] = useState([]);
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
  const navigate = useNavigate();
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deliveryTermData, setDeliveryTermData] = useState([]);
  const [idForEdit, setIDForEdit] = useState();
  const [checked, setChecked] = useState(true);
  const [priceApproval, setPriceApproval] = useState(false);
  const [leads, setLeads] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const { profile: users } = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
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

  useEffect(() => {
    getAllSellerAccountsDetails();
    getProduct();
  }, []);

  const getLeadsData = async (recordForEdit) => {
    try {
      const res = await LeadServices.getLeadsById(recordForEdit);
      setLeads(res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (leadsByID) getLeadsData(leadsByID);
  }, []);

  const createLeadProformaInvoiceDetails = async (e) => {
    e.preventDefault();
    const payload = {
      type: "Lead",
      raised_by: users.email,
      raised_by_first_name: users.first_name,
      raised_by_last_name: users.last_name,
      seller_account: selectedSellerData.unit,
      seller_address: selectedSellerData.address,
      seller_pincode: selectedSellerData.pincode,
      seller_state: selectedSellerData.state,
      seller_city: selectedSellerData.city,
      seller_gst: selectedSellerData.gst_number || null,
      seller_pan: selectedSellerData.pan_number,
      seller_state_code: selectedSellerData.state_code,
      seller_cin: selectedSellerData.cin_number,
      seller_email: selectedSellerData.email,
      seller_contact: selectedSellerData.contact,
      seller_bank_name: selectedSellerData.bank_name,
      seller_account_no: selectedSellerData.current_account_no,
      seller_ifsc_code: selectedSellerData.ifsc_code,
      seller_branch: selectedSellerData.branch,
      lead: leads.lead_id,
      contact_person_name: leads.name,
      contact: leads.contact,
      alternate_contact: leads.alternate_contact,
      company_name: leads.company,
      gst_number: leads.gst_number || null,
      pan_number: leads.pan_number,
      billing_address: leads.address,
      billing_state: leads.state,
      billing_city: leads.city,
      billing_pincode: leads.pincode,
      address: leads.shipping_address,
      pincode: leads.shipping_pincode,
      state: leads.shipping_state,
      city: leads.shipping_city,
      place_of_supply: inputValue.place_of_supply,
      transporter_name: inputValue.transporter_name,
      buyer_order_no: checked === true ? "verbal" : inputValue.buyer_order_no,
      buyer_order_date: inputValue.buyer_order_date
        ? inputValue.buyer_order_date
        : values.someDate,
      payment_terms: paymentTermData,
      delivery_terms: deliveryTermData,
      status: priceApproval ? "Price Approval" : "Approved",
      price_approval: priceApproval,
      products: products,
    };
    try {
      setOpen(true);
      const isDataValid = validateLeadData(leads); // Custom validation function

      if (!isDataValid) {
        setIDForEdit(leads.lead_id);
        setOpenPopup2(true); // Assuming this opens a popup to edit lead details
        return;
      }
      const response = await InvoiceServices.createLeadsProformaInvoiceData(
        payload
      );
      const successMessage =
        response.data.message || "Proforma Invoice created successfully!";
      handleSuccess(successMessage);

      setTimeout(() => {
        navigate("/invoice/active-pi");
      }, 300);
    } catch (error) {
      handleError(error); // Using the custom hook's method to handle errors
      console.error("Creating Lead PI error", error);
    } finally {
      setOpen(false); // Close the loading indicator
    }
  };

  function validateLeadData(lead) {
    return (
      lead.contact !== null &&
      lead.address !== null &&
      lead.state !== null &&
      lead.city !== null &&
      lead.pincode !== null &&
      lead.shipping_address !== null &&
      lead.shipping_state !== null &&
      lead.shipping_city !== null &&
      lead.shipping_pincode !== null &&
      (lead.pan_number !== null || lead.gst_number !== null) &&
      lead.company != null
    );
  }

  return (
    <div>
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
        onSubmit={(e) => createLeadProformaInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setSelectedSellerData(value)}
              options={sellerData}
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
              style={tfStyle}
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
            <CustomTextField
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
            <CustomTextField
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
            <CustomTextField
              fullWidth
              name="alternate_contact"
              size="small"
              label="Alt. Contact"
              variant="outlined"
              value={leads.alternate_contact ? leads.alternate_contact : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              multiline
              required
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={leads.address ? leads.address : ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={leads.city ? leads.city : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={leads.state ? leads.state : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={leads.pincode ? leads.pincode : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
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
            <CustomTextField
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
            <CustomTextField
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
            <CustomTextField
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
                  : values.someDate
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
              value={inputValue.place_of_supply}
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
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    onChange={(event, value) =>
                      handleAutocompleteChange(index, event, value)
                    }
                    options={productOption.map((option) => option.product)}
                    getOptionLabel={(option) => option}
                    sx={{ minWidth: 300 }}
                    label="Product Name"
                    style={tfStyle}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
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
                    value={input.unit || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <CustomTextField
                    type={"number"}
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <CustomTextField
                    fullWidth
                    type={"number"}
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    value={(input.quantity * input.rate).toFixed(2)}
                    // onChange={(event) => handleFormChange(index, event)}
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
                    value={input.requested_date || values.someDate}
                    onChange={(event) => handleFormChange(index, event)}
                    InputLabelProps={{
                      shrink: true,
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
                    value={input.special_instructions || ""}
                    onChange={(event) => handleFormChange(index, event)}
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
          "Kindly update all Shipping Details & Laeds Details in required field"
        </Typography>
        <Button variant="contained" onClick={() => setOpenPopup(false)}>
          Update Leads
        </Button>
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <UpdateLeads
          // getAllleadsData={getAllleadsData}
          recordForEdit={idForEdit}
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
