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
import MasterService from "../../../services/MasterService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import validatePincode from "../../../utility/validatePincode";
import {
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const UpdateVendorDetails = (props) => {
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState(recordForEdit.type);
  const [inputValue, setInputValue] = useState({
    ...recordForEdit,
    pin_code: "",
  });
  const [errorMessage, setErrorMessage] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const dispatch = useDispatch();

  const [selectedCountry, setSelectedCountry] = useState(
    recordForEdit.type === "Domestic" ? { id: 1, name: "India" } : null,
  );

  // Do not trust saved pincode as verified — revalidate on load.
  const [isValidPincode, setIsValidPincode] = useState(false);

  useEffect(() => {
    dispatch(getVendorName(recordForEdit.name));

    const initPostal = async () => {
      try {
        setOpen(true);

        const response = await MasterService.getAllMasterCountries("all");
        const countries = Array.isArray(response.data)
          ? response.data
          : (response.data && response.data.results) || [];
        const internationalCountries = countries.filter(
          (item) => item && item.name !== "India",
        );
        setCountryList(internationalCountries);

        let countryForLookup =
          recordForEdit.type === "Domestic"
            ? { id: 1, name: "India" }
            : null;

        if (recordForEdit.type === "International" && recordForEdit.country) {
          const match = internationalCountries.find(
            (c) => c.name === recordForEdit.country,
          );
          if (match) {
            countryForLookup = match;
            setSelectedCountry(match);
          }
        } else if (recordForEdit.type === "Domestic") {
          setSelectedCountry({ id: 1, name: "India" });
        }

        if (
          recordForEdit.pincode &&
          countryForLookup &&
          countryForLookup.id
        ) {
          try {
            const postalData = await validatePincode(
              countryForLookup.id,
              recordForEdit.pincode,
            );
            setInputValue((prev) => ({
              ...applyPostalLookupSuccess(prev, postalData),
              pincode: postalData.pincode,
            }));
            setIsValidPincode(true);
          } catch (error) {
            setIsValidPincode(false);
            handleError({
              response: {
                data: {
                  message:
                    error.message ||
                    "Loaded postal code could not be verified. Please validate again.",
                },
              },
            });
          }
        }
      } catch (error) {
        console.log("Error initializing vendor postal data", error);
      } finally {
        setOpen(false);
      }
    };

    initPostal();
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);

    if (value === "Domestic") {
      setSelectedCountry({ id: 1, name: "India" });
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

    setIsValidPincode(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "pincode") {
      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        pincode: value,
      }));
      setIsValidPincode(false);
      return;
    }

    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      vendor_source: value ? value.name : "",
    }));
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

  const GST_NO = (gst_no) => gst_no.length <= 14;

  const canSubmit = Boolean(
    isValidPincode &&
      inputValue.pin_code &&
      inputValue.city &&
      inputValue.state,
  );

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

      const pin =
        pincodeValue !== null && pincodeValue !== undefined
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

  const handleValidateClick = () => {
    runPincodeValidation(inputValue.pincode);
  };

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();

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
      const req = {
        type: typeData,
        name: inputValue.name,
        vendor_source: inputValue.vendor_source,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state || "",
        city: inputValue.city || "",
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
              options={typeData === "International" ? countryList : []}
              getOptionLabel={(option) => (option && option.name) || ""}
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
          <Grid item xs={12} sm={3}>
            <Box display="flex" gap={1}>
              <CustomTextField
                fullWidth
                name="pincode"
                size="small"
                label={typeData === "Domestic" ? "Pin Code" : "Postal Code"}
                variant="outlined"
                value={inputValue.pincode ? inputValue.pincode : ""}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
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
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
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
              value={inputValue.city || ""}
              disabled
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
