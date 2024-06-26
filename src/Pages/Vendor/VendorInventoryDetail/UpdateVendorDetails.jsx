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

export const UpdateVendorDetails = (props) => {
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState(recordForEdit.type);
  const [inputValue, setInputValue] = useState(recordForEdit);
  // const [pinCodeData, setPinCodeData] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);
    if (value === "Domestic") {
      setInputValue({ ...inputValue, country: "India" });
    }
  };

  const handleInputChange = (event, newValue) => {
    // Direct handling for Autocomplete components
    if (
      typeof event === "string" &&
      newValue &&
      newValue.hasOwnProperty("name")
    ) {
      // For Autocomplete, 'event' is actually the field name in this case
      setInputValue({ ...inputValue, [event]: newValue.name });
    } else if (event.target) {
      // Handling regular input fields
      const { name, value } = event.target;
      setInputValue({ ...inputValue, [name]: value });
    }
  };

  // const validatePinCode = async (pinCode) => {
  //   try {
  //     const response = await axios.get(
  //       `https://api.postalpincode.in/pincode/${pinCode}`
  //     );
  //     setPinCodeData(response.data[0].PostOffice[0]);
  //   } catch (error) {
  //     console.log("Creating Bank error ", error);
  //   }
  // };

  useEffect(() => {
    dispatch(getVendorName(recordForEdit.name));
  }, []);

  const GST_NO = (gst_no) => gst_no.length <= 14;

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type: typeData,
        name: inputValue.name,
        vendor_source: inputValue.vendor_source,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: typeData === "Domestic" && inputValue.state,
        city: typeData === "Domestic" && inputValue.city,
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
        error.response.data.errors ? error.response.data.errors.pan_number : ""
      );
      setOpen(false);
    }
  };
  console.log("typeData", typeData);
  console.log(
    "value",
    typeData === "Domestic"
      ? inputValue.country
        ? inputValue.country
        : "India"
      : inputValue.country
      ? inputValue.country
      : null
  );
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
                  ? { name: "India" }
                  : inputValue.country
                  ? { name: inputValue.country }
                  : null
              }
              onChange={(event, value) => handleInputChange(event, value)}
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
              onChange={(event, value) =>
                handleInputChange("vendor_source", value)
              }
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
              value={inputValue.name ? inputValue.name : inputValue.name}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {typeData === "Domestic" ? (
            <Grid item xs={12} sm={2}>
              <CustomTextField
                fullWidth
                name="pincode"
                size="small"
                type={"number"}
                label="Pin Code"
                variant="outlined"
                value={inputValue.pincode ? inputValue.pincode : ""}
                onChange={handleInputChange}
                onBlur={handleInputChange}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={typeData === "Domestic" && inputValue.state}
              onChange={handleInputChange}
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
              value={typeData === "Domestic" && inputValue.city}
              onChange={handleInputChange}
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
                  inputValue.gst_number ? inputValue.gst_number.toString() : ""
                )}
                helperText={
                  GST_NO(
                    inputValue.gst_number
                      ? inputValue.gst_number.toString()
                      : ""
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
        >
          Submit
        </Button>
      </Box>
    </>
  );
};
