import React, { useState } from "react";
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
import { CreateAllVendorDetails } from "./CreateAllVendorDetails";
import { country } from "../../Inventory/Country";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import validatePincode from "../../../utility/validatePincode";

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
  const [pinCodeData, setPinCodeData] = useState([]);
  const [idForEdit, setIdForEdit] = useState("");
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [selectedCountry, setSelectedCountry] = useState({
    id: 1,
    name: "India",
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);

    if (value === "Domestic") {
      setSelectedCountry({
        id: 1,
        name: "India",
      });

      setInputValue((prev) => ({
        ...prev,
        country: "India",
      }));
    } else {
      setSelectedCountry(null);

      setInputValue((prev) => ({
        ...prev,
        country: "",
      }));
    }

    // type switch hone par pincode aur uska validation state reset karna zaroori hai,
    // warna Domestic -> International -> Domestic wapas aane par purana isValidPincode
    // stale reh jata tha aur bina dobara validate kiye Submit enable ho jata tha
    setInputValue((prev) => ({
      ...prev,
      pincode: "",
    }));
    setIsValidPincode(false);
    setPinCodeData([]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name) {
      setInputValue({ ...inputValue, [name]: value });
    } else {
      setInputValue({
        ...inputValue,
        country: event.target.textContent,
      });
    }

    // pincode change hote hi purana validation invalid maan lo -
    // jab tak user dobara "Validate" na dabaye, process/submit allow nahi hoga
    if (name === "pincode") {
      setIsValidPincode(false);
      setPinCodeData([]);
    }
  };

  // core validation logic - hamesha ek explicit pincode value leta hai,
  // kabhi bhi stale state (inputValue.pincode) par depend nahi karta
  const runPincodeValidation = async (pincodeValue) => {
    try {
      if (!pincodeValue || pincodeValue.length !== 6) {
        handleError({
          response: {
            data: {
              message: "Please enter a valid 6-digit pincode.",
            },
          },
        });
        return;
      }

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

      setOpen(true);

      const verified = await validatePincode(selectedCountry.id, pincodeValue);

      setPinCodeData({
        State: verified.state_name,
        District: verified.city_name,
      });

      setInputValue((prev) => ({
        ...prev,
        pincode: verified.pincode,
      }));

      setIsValidPincode(true);

      handleSuccess("Pincode verified successfully.");
    } catch (error) {
      setPinCodeData([]);
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

  // Domestic ke liye pincode validate hona zaroori hai, International ke liye zaroorat nahi
  // (kyunki International me pincode field dikhta hi nahi)
  const canSubmit = typeData === "Domestic" ? isValidPincode : true;

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();

      // extra safety guard - agar kisi tarah (Enter key, programmatic submit) se
      // form submit ho jaye bina Validate kiye, to yaha rok denge
      if (typeData === "Domestic" && !isValidPincode) {
        handleError({
          response: {
            data: {
              message: "Please validate the pincode before submitting.",
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
        address: inputValue.address,
        pincode: inputValue.pincode || null,
        state:
          typeData === "Domestic"
            ? pinCodeData
              ? pinCodeData.State
              : ""
            : inputValue.state,
        city:
          typeData === "Domestic"
            ? pinCodeData
              ? pinCodeData.District
              : ""
            : inputValue.city,
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
      ...prev,
      pincode: "",
    }));

    setPinCodeData([]);
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
              options={typeData === "International" ? country : []}
              getOptionLabel={(option) => option.name}
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
              onChange={(event, value) => handleInputChange(event, value)}
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
          {typeData === "Domestic" ? (
            <Grid item xs={12} sm={4}>
              <Box display="flex" gap={1}>
                <CustomTextField
                  fullWidth
                  name="pincode"
                  size="small"
                  type="number"
                  label="Pin Code"
                  variant="outlined"
                  value={inputValue.pincode}
                  onChange={handleInputChange}
                  InputProps={{
                    readOnly: isValidPincode,
                  }}
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
          ) : null}
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={
                typeData === "Domestic"
                  ? pinCodeData.State
                    ? pinCodeData.State
                    : ""
                  : inputValue.state
              }
              onChange={handleInputChange}
              InputProps={{
                readOnly: typeData === "Domestic",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={
                typeData === "Domestic"
                  ? pinCodeData.District
                    ? pinCodeData.District
                    : ""
                  : inputValue.city
              }
              onChange={handleInputChange}
              InputProps={{
                readOnly: typeData === "Domestic",
              }}
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
