import React, { useState, useRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CreateAllVendorDetails } from "./CreateAllVendorDetails";
import { country } from "./../Country";

export const CreateVendorDetails = (props) => {
  const { getAllVendorDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState("Domestic");
  const [gstFocused, setGstFocused] = useState(false);
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
  });
  const [pinCodeData, setPinCodeData] = useState([]);
  const [idForEdit, setIdForEdit] = useState("");
  const timeoutRef = useRef(null);
  const handleChange = (event) => {
    const { value } = event.target;
    setTypeData(value);

    if (value === "Domestic") {
      setInputValue({ ...inputValue, country: "India" });
    }
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

    if (name === "pincode") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        validatePinCode(value);
      }, 500);
    }
  };

  console.log("inputValue", inputValue);
  const validatePinCode = async (pinCode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      setPinCodeData(response.data[0].PostOffice[0]);
    } catch (error) {
      console.log("Creating Bank error ", error);
    }
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

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();
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
      // setOpenPopup(false);
      setOpen(false);
      setOpenPopup2(true);
      // getAllVendorDetails();
    } catch (error) {
      console.log("createing company detail error", error);

      setOpen(false);
    }
  };

  return (
    <div>
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
            <Autocomplete
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Enter Country Name"}
                  variant="outlined"
                  name="country" // set the name attribute to "country"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
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
              <TextField
                fullWidth
                name="pincode"
                size="small"
                type={"number"}
                label="Pin Code"
                variant="outlined"
                value={inputValue.pincode}
                onChange={handleInputChange}
                onBlur={handleInputChange}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={3}>
            <TextField
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
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
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
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
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
            <TextField
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
              <TextField
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
              <TextField
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
            <TextField
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
            <TextField
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
    </div>
  );
};
