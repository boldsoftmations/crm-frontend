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
import { DecimalValidation } from "../../../utility/DecimalValidation";
import MasterService from "../../../services/MasterService";
import TransportSelector from "../../../Components/TransportSelector";
import { buildTransportPayload } from "../../../utility/Buildtransportpayload";

// ─── Styled components defined at top ────────────────────────────────────────
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const HelperText = styled(FormHelperText)(() => ({
  padding: "0px",
}));
// ─────────────────────────────────────────────────────────────────────────────

const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    color: "blue",
    visibility: "visible",
  },
};

const getNextFiveDates = () => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 7);
  return futureDate.toISOString().substring(0, 10);
};

const values = {
  someDate: getNextFiveDates(),
};

export const CreateCustomerProformaInvoice = (props) => {
  const { recordForEdit, rowData, setOpenPopup } = props;
  // console.log("data is: ", rowData);
  console.log("recordForEdit is: ", rowData);

  const [productOption, setProductOption] = useState([]);
  const [productDetails, setProductDetails] = useState(null);

  // One controlled transport selection drives PI transporter fields.
  // Surface uses Unit + Warehouse Pincode mapping. Courier/Local use the
  // Transporter Capability API. Bus/Train/Air/Self Pickup do not require a
  // transporter selection.
  const [transportSelection, setTransportSelection] = useState(null);

  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({});
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [paymentTermData, setPaymentTermData] = useState("");
  const [deliveryTermData, setDeliveryTermData] = useState("");
  const [contactData, setContactData] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [contactOptions, setContactOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [warehouseData, setWarehouseData] = useState(null);
  const [checked, setChecked] = useState(true);
  const [priceApproval, setPriceApproval] = useState(false);
  const [sellerData, setSellerData] = useState([]);
  const [edcData, setEdcData] = useState([]);
  const [currencyOption, setCurrencyOption] = useState([]);
  const [customerLastPiData, setCustomerLastPiData] = useState(null);
  const [packageList, setPackageList] = useState([]);
  const [timeLeft, setTimeLeft] = useState(5 * 60);

  // Resolve the contact from:
  // 1) manual selection,
  // 2) last PI contact (match by number or name), or
  // 3) the only available customer contact.
  //
  // This prevents the UI from showing a contact while contactData is still empty,
  // which previously caused `contact: null` in the Customer PI payload.
  const selectedContact =
    contactData ||
    contactOptions.find((option) => {
      if (!customerLastPiData || !option) {
        return false;
      }

      const sameContact =
        customerLastPiData.contact &&
        option.contact &&
        String(option.contact) === String(customerLastPiData.contact);

      const sameName =
        customerLastPiData.contact_person_name &&
        option.name &&
        option.name === customerLastPiData.contact_person_name;

      return Boolean(sameContact || sameName);
    }) ||
    (contactOptions.length === 1 ? contactOptions[0] : null);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const { profile: users } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
        quantity: "",
        rate: "",
        unit: "",
        packaging_type: "",
        max_decimal_digit: "",
        type_of_unit: "",
        requested_date: values.someDate,
        special_instructions: "",
      },
    ],
    productOption,
    true,
  );

  const buyer_date = new Date().toISOString().slice(0, 10);

  // getTranportList, its useEffect, and transportTypeOptions have all been
  // removed - TransportSelector (imported above) now owns the entire
  // fetch-on-address/unit-change lifecycle internally. See
  // src/Components/TransportSelector.jsx for that logic; this component
  // just renders it and reads transportSelection.

  // ─── Timer effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft <= 0) {
      setOpenPopup(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, setOpenPopup]);

  // Never keep a transporter selected for an old dispatch unit or shipping
  // address. We only clear here; the selector fetches again according to the
  // newly selected transport method.
  useEffect(() => {
    setTransportSelection(null);
  }, [
    selectedSellerData && selectedSellerData.id,
    selectedSellerData && selectedSellerData.unit,
    warehouseData && warehouseData.id,
    warehouseData && warehouseData.pincode,
    warehouseData && warehouseData.pin_code,
    warehouseData && warehouseData.pincode_id,
    warehouseData && warehouseData.country_id,
  ]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return (
      String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0")
    );
  };

  const constructPayload = () => {
    return products.map((input, index) => {
      const detailRate =
        productDetails && productDetails[index]
          ? productDetails[index].rate
          : "";
      const detailInstructions =
        productDetails && productDetails[index]
          ? productDetails[index].special_instructions
          : "";
      return {
        ...input,
        rate: input.rate || detailRate,
        special_instructions: input.special_instructions || detailInstructions,
        packaging_type: input.packaging_type
          ? "Special Packaging"
          : "Normal Packaging",
      };
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
    setCustomerLastPiData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const getAllMaterialDetailsByID = async () => {
    try {
      const response = await MasterService.getPackagingMaster("", "", false);
      setPackageList(response.data.results);
    } catch (err) {
      console.log("material data error", err);
    }
  };

  const getProduct = useCallback(async () => {
    try {
      const res = await ProductService.getProductPriceList();
      setProductOption(res.data.products);
    } catch (err) {
      console.error("error potential", err);
    }
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      const response =
        await InvoiceServices.getAllPaginateSellerAccountData("all");
      setSellerData(response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };

  const getBillingAddressbyCustomer = async () => {
    try {
      const response = await InvoiceServices.getBillingAddressbyCustomer(
        rowData.name,
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
    getAllMaterialDetailsByID();
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

  const handleSellerAccountChange = async (e, value) => {
    setSelectedSellerData(value);
    try {
      setOpen(true);
      const response = await CustomerServices.getCustomerLastPi(
        rowData && rowData.name,
        value.unit,
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
        setCurrencyOption(response.data);
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

    // Old generic Customer/Warehouse popup validation is intentionally disabled.
    // Contact is validated separately below so the PI payload never sends contact=null.

    if (!selectedContact || !selectedContact.contact) {
      handleError("Please select a valid Customer Contact.");
      return;
    }

    if (!transportSelection || !transportSelection.mode) {
      handleError("Please select a Transport Method.");
      return;
    }

    if (
      (transportSelection.mode === "COURIER" ||
        transportSelection.mode === "LOCAL_AGGREGATOR") &&
      (!transportSelection.transporterId || !transportSelection.transporterName)
    ) {
      handleError(
        "Please select a transporter for the selected Transport Method.",
      );
      return;
    }

    if (transportSelection.mode === "SURFACE") {
      const isMappedSurface =
        transportSelection.transporterId && transportSelection.mappingId;
      const isToBeAssigned =
        transportSelection.transporterName === "To Be Assigned" &&
        transportSelection.assignmentStatus === "Unassigned";

      if (!isMappedSurface && !isToBeAssigned) {
        handleError(
          "Please wait for Surface transporter lookup, then select a mapped transporter or continue as To Be Assigned.",
        );
        return;
      }
    }

    const numTypes = products.map((item) => item.type_of_unit);
    const quantities = products.map((item) => item.quantity);
    const decimalCounts = products.map((item) =>
      String(item.max_decimal_digit),
    );
    const unit = products.map((item) => item.unit);

    const isvalid = DecimalValidation({
      numTypes,
      quantities,
      decimalCounts,
      unit,
      handleError,
    });

    if (!isvalid) {
      return;
    }

    const unwantedInstructions = ["jhota", "jota", "shrink wrap", "strap"];
    const hasInvalidInstruction = products.some((item) =>
      unwantedInstructions.includes(
        (item.special_instructions || "").trim().toLowerCase(),
      ),
    );

    if (hasInvalidInstruction) {
      handleError("Please change the instruction or select special packaging");
      return;
    }

    const payload = {
      type: "Customer",
      raised_by: users.email,
      raised_by_first_name: users.first_name,
      raised_by_last_name: users.last_name,
      seller_account: selectedSellerData ? selectedSellerData.unit : "",
      seller_address: selectedSellerData ? selectedSellerData.address : "",
      seller_pincode: selectedSellerData ? selectedSellerData.pincode : "",
      seller_state: selectedSellerData ? selectedSellerData.state : "",
      seller_city: selectedSellerData ? selectedSellerData.city : "",
      seller_gst: selectedSellerData ? selectedSellerData.gst_number : "",
      seller_pan: selectedSellerData ? selectedSellerData.pan_number : "",
      seller_state_code: selectedSellerData
        ? selectedSellerData.state_code
        : "",
      seller_cin: selectedSellerData ? selectedSellerData.cin_number : "",
      seller_email: selectedSellerData ? selectedSellerData.email : "",
      seller_contact: selectedSellerData ? selectedSellerData.contact : "",
      seller_bank_name: selectedSellerData ? selectedSellerData.bank_name : "",
      seller_account_no: selectedSellerData
        ? selectedSellerData.current_account_no
        : "",
      seller_ifsc_code: selectedSellerData ? selectedSellerData.ifsc_code : "",
      seller_branch: selectedSellerData ? selectedSellerData.branch : "",
      company: customerData ? customerData.id : null,
      company_name:
        rowData.type_of_customer === "Exclusive Distribution Customer"
          ? warehouseData && warehouseData.company
            ? warehouseData.company
            : ""
          : customerData && customerData.name
            ? customerData.name
            : "",
      contact: selectedContact ? selectedContact.contact : null,
      contact_person_name: selectedContact ? selectedContact.name : null,
      alternate_contact: selectedContact
        ? selectedContact.alternate_contact
        : null,
      gst_number:
        customerData && customerData.gst_number
          ? customerData.gst_number
          : null,
      pan_number: customerData ? customerData.pan_number : null,
      billing_address: customerData ? customerData.address : null,
      billing_state: customerData ? customerData.state : null,
      billing_city: customerData ? customerData.city : null,
      billing_pincode: customerData ? customerData.pincode : null,
      address:
        rowData.type_of_customer === "Exclusive Distribution Customer"
          ? warehouseData && warehouseData.customer_address
            ? warehouseData.customer_address
            : ""
          : warehouseData && warehouseData.address
            ? warehouseData.address
            : "",
      pincode: warehouseData ? warehouseData.pincode : null,
      state: warehouseData ? warehouseData.state : null,
      city: warehouseData ? warehouseData.city : null,
      place_of_supply:
        inputValue.place_of_supply ||
        (customerLastPiData && customerLastPiData.place_of_supply
          ? customerLastPiData.place_of_supply
          : ""),
      buyer_order_no: checked === true ? "verbal" : inputValue.buyer_order_no,
      buyer_order_date: inputValue.buyer_order_date
        ? inputValue.buyer_order_date
        : buyer_date,
      payment_terms:
        paymentTermData ||
        (customerLastPiData && customerLastPiData.payment_terms
          ? customerLastPiData.payment_terms
          : ""),
      delivery_terms:
        deliveryTermData ||
        (customerLastPiData && customerLastPiData.delivery_terms
          ? customerLastPiData.delivery_terms
          : ""),
      status: priceApproval ? "Price Approval" : "Approved",
      price_approval: priceApproval,
      products: constructPayload(),
      warehouse_person_name: warehouseData ? warehouseData.contact_name : null,

      // Transport fields follow the final backend contract.
      // Surface no-map submits To Be Assigned + Unassigned and backend
      // creates the mapping request. Courier/Local save transporter_id.
      // Bus/Train/Air/Self Pickup send mode only with no transporter.
      ...buildTransportPayload(transportSelection),
    };

    if (rowData.origin_type === "International") {
      payload.currency = inputValue.currency;
    } else {
      payload.currency = "INR";
    }

    try {
      setOpen(true);
      const response =
        await InvoiceServices.createCustomerProformaInvoiceData(payload);
      const successMessage =
        response.data.message || "Proforma Invoice created successfully!";
      handleSuccess(successMessage);
      setTimeout(() => {
        navigate("/invoice/active-pi");
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
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
        onSubmit={(e) => createCustomerProformaInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          {/* ─── Seller / Terms ──────────────────────────────────────────── */}
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              name="seller_account"
              size="small"
              disablePortal
              id="combo-box-seller"
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
              id="combo-box-payment"
              onChange={(event, value) => setPaymentTermData(value)}
              options={paymentTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Payment Terms"
              value={
                paymentTermData === ""
                  ? customerLastPiData && customerLastPiData.payment_terms
                    ? customerLastPiData.payment_terms
                    : ""
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
              id="combo-box-delivery"
              onChange={(event, value) => setDeliveryTermData(value)}
              options={deliveryTermsOptions.map((option) => option.label)}
              getOptionLabel={(option) => option}
              sx={{ minWidth: 300 }}
              label="Delivery Terms"
              value={
                deliveryTermData === ""
                  ? customerLastPiData && customerLastPiData.delivery_terms
                    ? customerLastPiData.delivery_terms
                    : ""
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
                  value
                    ? setInputValue({ ...inputValue, currency: value.name })
                    : null
                }
                options={currencyOption.map((option) => option)}
                getOptionLabel={(option) =>
                  option.name + " (" + option.symbol + ")"
                }
                sx={{ minWidth: 300 }}
                label="Currency"
              />
            </Grid>
          )}
          {/* ─── Customer section ─────────────────────────────────────────── */}
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
              value={customerData && customerData.name ? customerData.name : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl
              required
              fullWidth
              size="small"
              sx={{ padding: "0", margin: "0" }}
            >
              <InputLabel id="contact-name-label">Contact Name</InputLabel>
              <Select
                labelId="contact-name-label"
                id="contact-name-select"
                label="Contact Name"
                value={selectedContact || ""}
                onChange={(e) => setContactData(e.target.value)}
                renderValue={(selected) =>
                  selected && selected.name ? selected.name : ""
                }
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
                selectedContact && selectedContact.contact
                  ? selectedContact.contact
                  : ""
              }
              InputLabelProps={{ shrink: true }}
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
                warehouseData && warehouseData.contact_number
                  ? warehouseData.contact_number
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
              value={
                customerData && customerData.address ? customerData.address : ""
              }
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
              value={customerData && customerData.city ? customerData.city : ""}
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
              value={
                customerData && customerData.state ? customerData.state : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              disabled
              required
              name="pincode"
              size="small"
              type="number"
              label="Billing Pin Code"
              variant="outlined"
              value={
                customerData && customerData.pincode ? customerData.pincode : ""
              }
            />
          </Grid>
          {/* ─── Shipping address ─────────────────────────────────────────── */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="shipping-address-label">
                Shipping Address
              </InputLabel>
              {rowData.type_of_customer ===
              "Exclusive Distribution Customer" ? (
                <Select
                  labelId="shipping-address-label"
                  id="shipping-address-select-edc"
                  label="Shipping Address"
                  onChange={(e) => setWarehouseData(e.target.value)}
                >
                  {edcData.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option && option.customer_address
                        ? option.customer_address
                        : "Please First Select Contact"}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  labelId="shipping-address-label"
                  id="shipping-address-select"
                  label="Shipping Address"
                  onChange={(e) => setWarehouseData(e.target.value)}
                >
                  {warehouseOptions.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option && option.address
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
                warehouseData && warehouseData.city ? warehouseData.city : ""
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
                warehouseData && warehouseData.state ? warehouseData.state : ""
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
              type="number"
              label="Shipping Pin Code"
              variant="outlined"
              value={
                warehouseData && warehouseData.pincode
                  ? warehouseData.pincode
                  : ""
              }
            />
          </Grid>

          {/* Method first. Surface uses Unit + Warehouse Pincode mapping;
              Courier/Local use transporter capabilities; direct methods do
              not require a transporter name. */}
          <Grid item xs={12} sm={4}>
            <TransportSelector
              countryId={
                warehouseData && warehouseData.country_id
                  ? warehouseData.country_id
                  : rowData.country_id
              }
              pincode={warehouseData ? warehouseData.pincode : ""}
              unitId={selectedSellerData ? selectedSellerData.id : ""}
              unitCode={selectedSellerData ? selectedSellerData.unit : ""}
              value={transportSelection}
              onChange={setTransportSelection}
            />
          </Grid>

          {/* ─── Order info ───────────────────────────────────────────────── */}
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type="date"
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="place_of_supply"
              size="small"
              label="Place of Supply"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={
                inputValue.place_of_supply
                  ? inputValue.place_of_supply
                  : customerLastPiData && customerLastPiData.place_of_supply
                    ? customerLastPiData.place_of_supply
                    : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          {/* ─── Products section ─────────────────────────────────────────── */}
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
            const detail =
              productDetails && productDetails[index]
                ? productDetails[index]
                : null;

            return (
              <React.Fragment key={index}>
                <Grid item xs={12} sm={4}>
                  <CustomAutocomplete
                    name="product"
                    size="small"
                    disablePortal
                    id={"combo-box-product-" + index}
                    onChange={async (event, value) => {
                      handleAutocompleteChange(index, event, value);
                      if (!selectedSellerData) {
                        return alert("Please select seller unit first!");
                      }
                      if (value) {
                        try {
                          setOpen(true);
                          const response =
                            await CustomerServices.getProductLastPi(
                              rowData && rowData.name,
                              selectedSellerData.unit,
                              value,
                            );
                          setProductDetails((prev) => ({
                            ...prev,
                            [index]: response.data,
                          }));
                        } catch (err) {
                          console.error("Error fetching product details:", err);
                        } finally {
                          setOpen(false);
                        }
                      }
                    }}
                    options={productOption.map(
                      (option) => option.product__name,
                    )}
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
                      detail && detail.available_qty ? detail.available_qty : ""
                    }
                    InputLabelProps={{ shrink: true }}
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
                    value={input.unit || ""}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    value={
                      input.rate
                        ? input.rate
                        : detail && detail.rate
                          ? parseFloat(detail.rate).toFixed(2)
                          : ""
                    }
                    variant="outlined"
                    onChange={(event) => {
                      handleFormChange(index, event);
                      setProductDetails((prev) => ({
                        ...prev,
                        [index]: {
                          ...(prev && prev[index] ? prev[index] : {}),
                          rate: event.target.value,
                        },
                      }));
                    }}
                    InputLabelProps={{ shrink: true }}
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
                    disabled
                    value={(() => {
                      const qty = parseFloat(input.quantity || 0);
                      const rate = parseFloat(
                        input.rate || (detail && detail.rate ? detail.rate : 0),
                      );
                      const packageItem = packageList.find(
                        (p) => p.name === input.packaging_type,
                      );
                      const charges = parseFloat(
                        packageItem && packageItem.charges
                          ? packageItem.charges
                          : 0,
                      );
                      const base = qty * rate;
                      const total = base + (base * charges) / 100;
                      return total.toFixed(2);
                    })()}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomTextField
                    fullWidth
                    type="date"
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
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date(
                        new Date().setDate(new Date().getDate() + 1),
                      )
                        .toISOString()
                        .substring(0, 10),
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
                    InputLabelProps={{ shrink: true }}
                    value={
                      input.special_instructions
                        ? input.special_instructions
                        : detail && detail.special_instructions
                          ? detail.special_instructions
                          : ""
                    }
                    onChange={(event) => {
                      handleFormChange(index, event);
                      setProductDetails((prev) => ({
                        ...prev,
                        [index]: {
                          ...(prev && prev[index] ? prev[index] : {}),
                          special_instructions: event.target.value,
                        },
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <FormControlLabel
                    label="Special Packaging"
                    control={
                      <Checkbox
                        checked={input.packaging_type || false}
                        onChange={(event) => {
                          handleFormChange(index, {
                            target: {
                              name: "packaging_type",
                              value: event.target.checked,
                            },
                          });
                        }}
                      />
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={2} alignContent="right">
                  {index !== 0 && (
                    <Button
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  )}
                </Grid>
              </React.Fragment>
            );
          })}
          <Grid item xs={12} sm={2} alignContent="right">
            <Button
              onClick={() => addFields()}
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

      {/* Old generic Customer/Warehouse update popup intentionally disabled. */}

      <Popup
        maxWidth="xl"
        title="Update Leads"
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
  { label: "Ex-Work (Freight to pay)", value: "ex_work_(freight_to_pay)" },
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
    value: "courier_(freight_add_in_invoice)",
  },
];
