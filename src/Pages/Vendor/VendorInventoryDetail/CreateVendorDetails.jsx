import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";

import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import MasterService from "../../../services/MasterService";
import { CreateAllVendorDetails } from "./CreateAllVendorDetails";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import validatePincode from "../../../utility/validatePincode";
import {
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const CreateVendorDetails = (props) => {
  const { getAllVendorDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState("Domestic");
  const [gstFocused, setGstFocused] = useState(false);
  const [isValidPincode, setIsValidPincode] = useState(false);
  const [panFocused, setPanFocused] = useState(false);
  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const [inputValue, setInputValue] = useState({
    name: "",
    address: "",
    pincode: "",
    pin_code: "",
    city: "",
    state: "",
    website: "",
    estd_date: today,
    gst_number: "",
    pan_number: "",
    total_sales_turnover: "",
    country: "",
    vendor_source: "",
  });
  const [idForEdit, setIdForEdit] = useState("");
  const [countryList, setCountryList] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [selectedCountry, setSelectedCountry] = useState({
    id: 1,
    name: "India",
  });

  // Static Inventory/Country list has name/code only — ValidatePincode needs Country Master id.
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await MasterService.getAllMasterCountries("all");
        const countries = Array.isArray(response.data)
          ? response.data
          : (response.data && response.data.results) || [];
        setCountryList(
          countries.filter((item) => item && item.name !== "India"),
        );
      } catch (error) {
        console.log("Error loading master countries", error);
      }
    };

    loadCountries();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);

    if (value === "Domestic") {
      setSelectedCountry({
        id: 1,
        name: "India",
      });

      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        country: "India",
        pincode: "",
      }));
    } else {
      setSelectedCountry(null);

      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        country: "",
        pincode: "",
      }));
    }

    // type switch hone par pincode aur uska validation state reset karna zaroori hai,
    // warna Domestic -> International -> Domestic wapas aane par purana isValidPincode
    // stale reh jata tha aur bina dobara validate kiye Submit enable ho jata tha
    setIsValidPincode(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "pincode") {
      // pincode change hote hi purana validation invalid maan lo -
      // jab tak user dobara "Validate" na dabaye, process/submit allow nahi hoga
      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        pincode: value,
      }));
      setIsValidPincode(false);
      return;
    }

    if (name) {
      setInputValue((prev) => ({ ...prev, [name]: value }));
    } else {
      setInputValue((prev) => ({
        ...prev,
        country: event.target.textContent,
      }));
    }
  };

  const handleSourceChange = (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      vendor_source: value ? value.name : "",
    }));
  };

  // core validation logic - hamesha ek explicit pincode value leta hai,
  // kabhi bhi stale state (inputValue.pincode) par depend nahi karta
  const runPincodeValidation = async (pincodeValue) => {
    try {
      if (!selectedCountry || !selectedCountry.id) {
        handleError({
          response: {
            data: {
              message: "Please select a country first.",
            },
          },
        });
        return;
      }

      const pin = pincodeValue !== null && pincodeValue !== undefined
        ? String(pincodeValue).trim()
        : "";

      if (!pin) {
        handleError({
          response: {
            data: {
              message: "Please enter postal code before validation.",
            },
          },
        });
        return;
      }

      // Domestic India: keep 6-digit precheck. International: allow master format.
      if (typeData === "Domestic" && pin.length !== 6) {
        handleError({
          response: {
            data: {
              message: "Please enter a valid 6-digit pincode.",
            },
          },
        });
        return;
      }

      setOpen(true);

      const verified = await validatePincode(selectedCountry.id, pin);

      setInputValue((prev) => ({
        ...applyPostalLookupSuccess(prev, verified),
        pincode: verified.pincode,
      }));

      setIsValidPincode(true);

      handleSuccess("Pincode verified successfully.");
    } catch (error) {
      setInputValue((prev) => clearPostalFields(prev));
      setIsValidPincode(false);

      handleError({
        response: {
          data: {
            message: error.message || "Invalid pincode.",
          },
        },
      });
    } finally {
      setOpen(false);
    }
  };

  // "Validate" button hamesha current typed value se hi validate karega
  const handleValidateClick = () => {
    runPincodeValidation(inputValue.pincode);
  };

  // Function to validate GST number
  const GST_NO = (gstNumber) => {
    if (gstNumber.length > 15) {
      return true;
    }
    return false;
  };

  // Function to validate PAN number
  const validatePanNumber = (panNumber) => {
    const regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    if (regex.test(panNumber)) {
      return false;
    }
    return true;
  };

  const gstError =
    typeData === "Domestic" &&
    gstFocused &&
    (inputValue.gst_number === "" || GST_NO(inputValue.gst_number.toString()))
      ? "GST NO should be less than or equal to 15 Digit"
      : "";

  const panError =
    typeData === "Domestic" &&
    panFocused &&
    (inputValue.pan_number === "" || validatePanNumber(inputValue.pan_number))
      ? "Invalid PAN No."
      : "";

  // Domestic aur International dono ke liye country-bound verified postal lookup zaroori hai
  // (Create Company Details gold path)
  const canSubmit = Boolean(
    isValidPincode &&
      inputValue.pin_code &&
      inputValue.city &&
      inputValue.state,
  );

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();

      // extra safety guard - agar kisi tarah (Enter key, programmatic submit) se
      // form submit ho jaye bina Validate kiye, to yaha rok denge
      if (
        !isValidPincode ||
        !inputValue.pin_code ||
        !inputValue.city ||
        !inputValue.state
      ) {
        handleError({
          response: {
            data: {
              message: "Please validate the postal code before submitting.",
            },
          },
        });
        return;
      }

      setOpen(true);
      if (gstError || panError) {
        setOpen(false);
        return;
      }
      const req = {
        type: typeData,
        name: inputValue.name,
        vendor_source: inputValue.vendor_source,
        address: inputValue.address,
        pincode: inputValue.pincode || null,
        state: inputValue.state || "",
        city: inputValue.city || "",
        website: inputValue.website_url,
        estd_date: inputValue.estd_date || null,
        gst_number: inputValue.gst_number,
        pan_number: inputValue.pan_number,
        total_sales_turnover: inputValue.total_sale,
        country:
          typeData === "Domestic"
            ? "India"
            : inputValue.country
              ? inputValue.country
              : null,
      };
      const response = await InventoryServices.createVendorData(req);
      setIdForEdit(response.data.vendor_id);
      handleSuccess("Vendor created successfully");
      getAllVendorDetails();
      setOpen(false);
      setOpenPopup2(true);
    } catch (error) {
      handleError(error);
      console.log("createing company detail error", error);

      setOpen(false);
    }
  };

  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);

    setIsValidPincode(false);

    setInputValue((prev) => ({
      ...clearPostalFields(prev),
      country: value ? value.name : "",
      pincode: "",
    }));
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
        onSubmit={(e) => createCompanyDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={typeData}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="International"
                    control={<Radio />}
                    label="International"
                  />
                  <FormControlLabel
                    value="Domestic"
                    control={<Radio />}
                    label="Domestic"
                  />
                </RadioGroup>
              </FormControl>
            </>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              id="grouped-demo"
              options={typeData === "International" ? countryList : []}
              getOptionLabel={(option) => (option && option.name) || ""}
              value={
                typeData === "Domestic"
                  ? { id: 1, name: "India" }
                  : selectedCountry
              }
              onChange={handleCountryChange}
              label="Enter Country Name"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomAutocomplete
              size="small"
              id="custom-demo"
              options={[
                { name: "Vendor" },
                { name: "Job Worker" },
                { name: "Vendor/Job Worker" },
                { name: "Scrap" },
              ]}
              getOptionLabel={(option) => option.name}
              value={
                inputValue.vendor_source
                  ? { name: inputValue.vendor_source }
                  : null
              }
              onChange={handleSourceChange}
              label={"Source"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Vendor Name"
              variant="outlined"
              value={inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box display="flex" gap={1}>
              <CustomTextField
                fullWidth
                name="pincode"
                size="small"
                label={typeData === "Domestic" ? "Pin Code" : "Postal Code"}
                variant="outlined"
                value={inputValue.pincode}
                onChange={handleInputChange}
              />

              <Button
                type="button"
                variant="contained"
                onClick={handleValidateClick}
                disabled={isValidPincode}
              >
                Validate
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="website_url"
              label="website Url"
              variant="outlined"
              value={inputValue.website_url}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              name="estd_date"
              size="small"
              label="Estd.Date"
              variant="outlined"
              value={inputValue.estd_date}
              onChange={handleInputChange}
            />
          </Grid>
          {typeData === "Domestic" ? (
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                name="gst_number"
                label="GST No."
                variant="outlined"
                value={inputValue.gst_number}
                onChange={handleInputChange}
                error={gstError !== ""}
                helperText={gstError}
                onFocus={() => setGstFocused(true)}
                onBlur={() => setGstFocused(false)}
              />
            </Grid>
          ) : null}
          {typeData === "Domestic" ? (
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                required
                size="small"
                name="pan_number"
                label="Pan No."
                variant="outlined"
                value={inputValue.pan_number}
                onChange={handleInputChange}
                error={panError !== ""}
                helperText={panError}
                onFocus={() => setPanFocused(true)}
                onBlur={() => setPanFocused(false)}
              />
            </Grid>
          ) : null}

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="total_sale"
              size="small"
              type={"number"}
              label="Total Sale"
              variant="outlined"
              value={inputValue.total_sale}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              multiline
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!canSubmit}
        >
          Submit
        </Button>
      </Box>
      <Popup
        maxWidth={"lg"}
        title={"Create Customer"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateAllVendorDetails
          setOpenPopup={setOpenPopup2}
          getAllVendorDetails={getAllVendorDetails}
          recordForEdit={idForEdit}
        />
      </Popup>
    </>
  );
};
