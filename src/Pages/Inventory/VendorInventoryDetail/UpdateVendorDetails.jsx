import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getVendorName } from "../../../Redux/Action/Action";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { country } from "../Country";
export const UpdateVendorDetails = (props) => {
  const { setOpenPopup, getAllVendorDetails, recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState("");
  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const [inputValue, setInputValue] = useState({
    name: "",
    address: "",
    pincode: "",
    website: "",
    estd_date: today,
    gst_number: "",
    pan_number: "",
    total_sales_turnover: "",
    country: "",
  });
  const [pinCodeData, setPinCodeData] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
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

  useEffect(() => {
    getAllCompanyDetailsByID();
  }, []);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getVendorDataById(recordForEdit);
      setInputValue(response.data);
      dispatch(getVendorName(response.data.name));
      setTypeData(response.data.type);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const GST_NO = (gst_no) => gst_no.length <= 14;

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type: typeData,
        name: inputValue.name,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state:
          typeData === "Domestic"
            ? pinCodeData.State
              ? pinCodeData.State
              : inputValue.state
            : inputValue.state,
        city:
          typeData === "Domestic"
            ? pinCodeData.District
              ? pinCodeData.District
              : inputValue.city
            : inputValue.city,
        website: inputValue.website,
        estd_date: inputValue.estd_date,
        gst_number: inputValue.gst_number,
        pan_number: inputValue.pan_number,
        total_sales_turnover: inputValue.total_sales_turnover,
        country:
          typeData === "Domestic"
            ? { name: "India" }
            : inputValue.country
            ? { name: inputValue.country }
            : null,
      };
      await InventoryServices.updateVendorData(recordForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllVendorDetails();
    } catch (error) {
      console.log("createing company detail error", error);
      setErrorMessage(
        error.response.data.errors ? error.response.data.errors.pan_number : ""
      );
      setOpen(false);
    }
  };

  return (
    <>
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
          <Grid item xs={12} sm={2}>
            <TextField
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
              <TextField
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
                    : inputValue.state
                  : inputValue.state
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
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={
                typeData === "Domestic"
                  ? pinCodeData.District
                    ? pinCodeData.District
                    : inputValue.city
                  : inputValue.city
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
            <TextField
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
              <TextField
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
              <TextField
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
            <TextField
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
            <TextField
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
