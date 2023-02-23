import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Chip,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useDispatch } from "react-redux";
import { getCompanyName } from "../../../Redux/Action/Action";
import axios from "axios";
import LeadServices from "../../../services/LeadService";
import { styled } from "@mui/material/styles";
import { Popup } from "./../../../Components/Popup";
import { CreateCustomerProformaInvoice } from "./../../Invoice/CustomerPerformaInvoice/CreateCustomerProformaInvoice";
import { CustomLoader } from "../../../Components/CustomLoader";
export const UpdateCompanyDetails = (props) => {
  const { setOpenPopup, getAllContactDetailsByID, recordForEdit } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState("");
  const [category, setCategory] = useState("");
  const [inputValue, setInputValue] = useState([]);
  const [businessType, setBusinessType] = useState("");
  const [pinCodeData, setPinCodeData] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setTypeData(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getLAssignedData();
  }, []);

  const getLAssignedData = async (id) => {
    try {
      setOpen(true);
      const res = await LeadServices.getAllAssignedUser();

      setAssigned(res.data);
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const validatePinCode = async () => {
    try {
      setOpen(true);
      const PINCODE = inputValue.pincode;
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${PINCODE}`
      );
      setPinCodeData(response.data[0].PostOffice[0]);
      setOpen(false);
    } catch (error) {
      console.log("Creating Bank error ", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllCompanyDetailsByID();
  }, []);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      console.log("response", response);
      setInputValue(response.data);
      dispatch(getCompanyName(response.data.name));
      setTypeData(response.data.type);
      setBusinessType(response.data.business_type);
      setCategory(response.data.category);
      setAssign(response.data.assigned_to);
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
        state: pinCodeData.State ? pinCodeData.State : inputValue.state,
        city: pinCodeData.District ? pinCodeData.District : inputValue.city,
        website: inputValue.website,
        estd_date: inputValue.estd_date,
        gst_number: inputValue.gst_number,
        pan_number: inputValue.pan_number,
        business_type: businessType,
        category: category,
        assigned_to: assign ? assign : "",
        total_sales_turnover: inputValue.total_sales_turnover,
      };
      await CustomerServices.updateCompanyData(recordForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllContactDetailsByID();
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
          <Grid item xs={12} sm={6}>
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
                    value="Industrial Customer"
                    control={<Radio />}
                    label="Industrial Customer"
                  />
                  <FormControlLabel
                    value="Distribution Customer"
                    control={<Radio />}
                    label="Distribution Customer"
                  />
                </RadioGroup>
              </FormControl>
            </>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end">
            {" "}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenPopup2(true)}
              // className={classes.button}
              style={{
                marginTop: "1em",
                marginRight: "1em",
              }}
            >
              Generate PI
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Busniess Type</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={businessType ? businessType : businessType}
                label="Busniess Type"
                onChange={(event) => setBusinessType(event.target.value)}
              >
                <MenuItem value={"Proprietor"}>Proprietor </MenuItem>
                <MenuItem value={"Private Limited"}>Private Limited</MenuItem>
                <MenuItem value={"Partnership"}>Partnership</MenuItem>
                <MenuItem value={"Limited"}>Limited</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ minWidth: "200px" }}
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              onClick={() => validatePinCode()}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={pinCodeData.State ? pinCodeData.State : inputValue.state}
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
                pinCodeData.District ? pinCodeData.District : inputValue.city
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
                  inputValue.gst_number ? inputValue.gst_number.toString() : ""
                )
                  ? "GST NO should be less than or equal to 15 Digit"
                  : ""
              }
            />
          </Grid>
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Category</InputLabel>
              <Select
                disabled={typeData === "industrial_customer"}
                labelId="demo-select-small"
                id="demo-select-small"
                value={category ? category : category}
                label="Category"
                onChange={(event) => setCategory(event.target.value)}
              >
                <MenuItem value={"Hardware & Electrical"}>
                  Hardware & Electrical
                </MenuItem>
                <MenuItem value={"Plywood"}>Plywood</MenuItem>
                <MenuItem value={"Plumbing"}>Plumbing</MenuItem>
                <MenuItem value={"Auto Retail"}>Auto Retail</MenuItem>
                <MenuItem value={"Stationary"}>Stationary</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
              <HelperText>Applicable Only For Distribution Customer</HelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size="small"
              value={assign}
              onChange={(event, newValue) => {
                setAssign(newValue);
              }}
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={assigned.map((option) => option.email)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign To"
                  placeholder="Assign To"
                />
              )}
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
      <Popup
        maxWidth={"xl"}
        title={"Create Customer Proforma Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateCustomerProformaInvoice
          CustomerData={inputValue}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </>
  );
};

const HelperText = styled(FormHelperText)(({ theme }) => ({
  padding: "0px",
  MuiFormHelperText: {
    root: {
      padding: 0,
      margin: 0,
    },
  },
}));
