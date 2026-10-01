import React, { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { getVendorName } from "../../../Redux/Action/Action";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import { country } from "../../Inventory/Country";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import validatePincode from "../../../utility/validatePincode";

export const UpdateVendorDetails = (props) => {
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState(recordForEdit.type);
  const [inputValue, setInputValue] = useState(recordForEdit);
  const [errorMessage, setErrorMessage] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const dispatch = useDispatch();

  // Domestic hamesha India hai (id:1). International ke liye, jo bhi
  // country pehle se record me tha usko `country` list me dhoondh ke
  // uski id nikal lo (name-only match).
  const findCountryByName = (name) => {
    if (!name) {
      return null;
    }
    const match = country.find((c) => c.name === name);
    return match ? match : null;
  };

  const [selectedCountry, setSelectedCountry] = useState(
    recordForEdit.type === "Domestic"
      ? { id: 1, name: "India" }
      : findCountryByName(recordForEdit.country),
  );

  // agar vendor ka record pehle se ek valid pincode ke saath saved hai,
  // to usse already-validated maan lo - jab tak user pincode edit na kare
  const [isValidPincode, setIsValidPincode] = useState(
    recordForEdit.type === "Domestic" && recordForEdit.pincode ? true : false,
  );

  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);

    if (value === "Domestic") {
      setSelectedCountry({ id: 1, name: "India" });
      setInputValue({ ...inputValue, country: "India" });
    } else {
      setSelectedCountry(null);
      setInputValue({ ...inputValue, country: "" });
    }

    // type switch hone par pincode invalid maan lo, dobara validate karna hoga
    setIsValidPincode(false);
  };

  const handleInputChange = (event) => {
    // ye ab sirf normal text/number/date fields ke liye hai
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });

    if (name === "pincode") {
      setIsValidPincode(false);
    }
  };

  const handleSourceChange = (event, value) => {
    setInputValue({
      ...inputValue,
      vendor_source: value ? value.name : "",
    });
  };

  // Country Autocomplete ke liye alag, sahi handler - MUI Autocomplete
  // onChange(event, value) deta hai jaha value poora {id, name} object hota hai
  const handleCountryChange = (event, value) => {
    setSelectedCountry(value);
    setInputValue({
      ...inputValue,
      country: value ? value.name : "",
    });
    setIsValidPincode(false);
  };

  useEffect(() => {
    dispatch(getVendorName(recordForEdit.name));
  }, []);

  const GST_NO = (gst_no) => gst_no.length <= 14;

  // Domestic ke liye pincode validate hona zaroori hai, International ke liye nahi
  const canSubmit = typeData === "Domestic" ? isValidPincode : true;

  const runPincodeValidation = async (pincodeValue) => {
    try {
      if (!pincodeValue || String(pincodeValue).length !== 6) {
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

      setInputValue((prev) => ({
        ...prev,
        pincode: verified.pincode,
        state: verified.state_name,
        city: verified.city_name,
      }));

      setIsValidPincode(true);
      handleSuccess("Pincode verified successfully.");
    } catch (error) {
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

  const handleValidateClick = () => {
    runPincodeValidation(inputValue.pincode);
  };

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();

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
      const req = {
        type: typeData,
        name: inputValue.name,
        vendor_source: inputValue.vendor_source,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: typeData === "Domestic" ? inputValue.state : "",
        city: typeData === "Domestic" ? inputValue.city : "",
        website: inputValue.website,
        estd_date: inputValue.estd_date,
        gst_number: inputValue.gst_number,
        pan_number: inputValue.pan_number,
        total_sales_turnover: inputValue.total_sales_turnover,
        country:
          typeData === "Domestic"
            ? "India"
            : inputValue.country
              ? inputValue.country
              : null,
      };
      await InventoryServices.updateVendorData(inputValue.id, req);
      handleSuccess("Vendor updated successfully");
      setTimeout(() => {
        setOpenPopup(false);
      }, 300);
      setOpen(false);
      getAllVendorDetails();
    } catch (error) {
      handleError(error);
      console.log("createing company detail error", error);
      setErrorMessage(
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors.pan_number
          : "",
      );
      setOpen(false);
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
        onSubmit={(e) => UpdateCompanyDetails(e)}
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
                  value={typeData ? typeData : ""}
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
              label={
                typeData === "International" ? "Enter Country Name" : "Country"
              }
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
          <Grid item xs={12} sm={2}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Company Name"
              variant="outlined"
              value={inputValue.name ? inputValue.name : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {typeData === "Domestic" ? (
            <Grid item xs={12} sm={3}>
              <Box display="flex" gap={1}>
                <CustomTextField
                  fullWidth
                  name="pincode"
                  size="small"
                  type={"number"}
                  label="Pin Code"
                  variant="outlined"
                  value={inputValue.pincode ? inputValue.pincode : ""}
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
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={
                typeData === "Domestic" && inputValue.state
                  ? inputValue.state
                  : ""
              }
              onChange={handleInputChange}
              InputProps={{
                readOnly: typeData === "Domestic",
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={
                typeData === "Domestic" && inputValue.city
                  ? inputValue.city
                  : ""
              }
              onChange={handleInputChange}
              InputProps={{
                readOnly: typeData === "Domestic",
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="website"
              label="website Url"
              variant="outlined"
              value={inputValue.website ? inputValue.website : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              type="date"
              name="estd_date"
              size="small"
              label="Estd.Date"
              variant="outlined"
              value={inputValue.estd_date ? inputValue.estd_date : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
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
                value={inputValue.gst_number ? inputValue.gst_number : ""}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={GST_NO(
                  inputValue.gst_number ? inputValue.gst_number.toString() : "",
                )}
                helperText={
                  GST_NO(
                    inputValue.gst_number
                      ? inputValue.gst_number.toString()
                      : "",
                  )
                    ? "GST NO should be less than or equal to 15 Digit"
                    : ""
                }
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
                value={inputValue.pan_number ? inputValue.pan_number : ""}
                onChange={handleInputChange}
                error={inputValue.pan_number === ""}
                helperText={errorMessage}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="total_sales_turnover"
              size="small"
              type={"number"}
              label="Total Sale"
              variant="outlined"
              value={
                inputValue.total_sales_turnover
                  ? inputValue.total_sales_turnover
                  : ""
              }
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address ? inputValue.address : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
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
    </>
  );
};
