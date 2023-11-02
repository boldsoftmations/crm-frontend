import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Divider,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyName } from "../../../Redux/Action/Action";
import axios from "axios";
import LeadServices from "../../../services/LeadService";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ViewCustomerFollowUp } from "../../FollowUp/ViewCustomerFollowUp";
import Option from "../../../Options/Options";
import CustomTextField from "../../../Components/CustomTextField";

export const UpdateCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails, recordForEdit } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "gst_number" || name === "pan_number"
        ? value.toUpperCase()
        : value;
    setInputValue({ ...inputValue, [name]: updatedValue });
  };

  const handleSelectChange = (name, value) => {
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  useEffect(() => {
    getAssignedData();
  }, []);

  const getAssignedData = async (id) => {
    try {
      setOpen(true);
      const ALLOWED_ROLES = [
        "Director",
        "Customer Service",
        "Sales Manager",
        "Sales Deputy Manager",
        "Sales Assistant Deputy Manager",
        "Sales Executive",
        "Sales Manager without Leads",
      ];
      const res = await LeadServices.getAllAssignedUser();
      // Filter the data based on the ALLOWED_ROLES
      const filteredData = res.data.filter((employee) =>
        employee.groups.some((group) => ALLOWED_ROLES.includes(group))
      );
      setAssigned(filteredData);
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
      setInputValue({
        ...inputValue,
        state: response.data[0].PostOffice[0].State,
        city: response.data[0].PostOffice[0].District,
      });
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
      setInputValue(response.data);
      dispatch(getCompanyName(response.data.name));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

  const extractErrorMessages = (data) => {
    let messages = [];
    if (data.errors) {
      for (const [key, value] of Object.entries(data.errors)) {
        // Assuming each key has an array of messages, concatenate them.
        value.forEach((msg) => {
          messages.push(`${key}: ${msg}`);
        });
      }
    }
    return messages;
  };

  const UpdateCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        name: inputValue.name || null,
        address: inputValue.address || null,
        pincode: inputValue.pincode || null,
        state: inputValue.state || null,
        city: inputValue.city || null,
        gst_number: inputValue.gst_number || null,
        pan_number: inputValue.pan_number || null,
        business_type: inputValue.business_type || null,
        assigned_to: inputValue.assigned_to || null,
        status: inputValue.status || null,
        type_of_customer: inputValue.type_of_customer || null,
        website: inputValue.website || null,
        estd_year: inputValue.estd_year || null,
        approx_annual_turnover: inputValue.approx_annual_turnover || null,
        purchase_decision_maker: inputValue.purchase_decision_maker || null,
        industrial_list: inputValue.industrial_list || null,
        distribution_type: inputValue.distribution_type || null,
        category: inputValue.category || [],
        main_distribution: inputValue.main_distribution || [],
      };
      await CustomerServices.updateCompanyData(recordForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllCompanyDetails();
    } catch (error) {
      console.log("createing company detail error", error);
      const newErrors = extractErrorMessages(error.response.data);
      setErrorMessages(newErrors);
      setCurrentErrorIndex(0); // Reset the error index when new errors arrive
      setOpenSnackbar((prevOpen) => !prevOpen);
    } finally {
      setOpen(false);
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    if (currentErrorIndex < errorMessages.length - 1) {
      setCurrentErrorIndex((prevIndex) => prevIndex + 1);
    } else {
      setOpenSnackbar(false);
      setCurrentErrorIndex(0); // Reset for any future errors
    }
  }, [currentErrorIndex, errorMessages.length]);

  return (
    <>
      <CustomLoader open={open} />
      {/* Display errors */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {errorMessages[currentErrorIndex]}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateCompanyDetails(e)}
      >
        <Grid container spacing={2}>
          {/* Company Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Company Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Type of Customer
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={inputValue.type_of_customer || ""}
                onChange={(event) =>
                  handleSelectChange("type_of_customer", event.target.value)
                }
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Company Name"
              variant="outlined"
              value={inputValue.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Business Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Business Type"
                value={inputValue.business_type || ""}
                onChange={(e, value) =>
                  handleSelectChange("business_type", e.target.value)
                }
              >
                {Option.CustomerBusinessTypeData.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              sx={{ minWidth: "200px" }}
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode || ""}
              onChange={handleInputChange}
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
            <CustomTextField
              fullWidth
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="gst_number"
              size="small"
              label="GST No."
              variant="outlined"
              value={inputValue.gst_number || ""}
              onChange={handleInputChange}
              error={inputValue.gst_number && !GST_NO(inputValue.gst_number)}
              helperText={
                inputValue.gst_number &&
                !GST_NO(inputValue.gst_number) &&
                "Invalid GST Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              required
              size="small"
              name="pan_number"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_number || ""}
              onChange={handleInputChange}
              error={inputValue.pan_number && !PAN_NO(inputValue.pan_number)}
              helperText={
                inputValue.pan_number &&
                !PAN_NO(inputValue.pan_number) &&
                "Invalid PAN Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size="small"
              value={inputValue.assigned_to || []}
              onChange={(event, newValue) => {
                handleSelectChange("assigned_to", newValue);
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
                <CustomTextField
                  {...params}
                  label="Assign To"
                  placeholder="Assign To"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size="small"
              id="controllable-states-demo"
              value={inputValue.status || ""}
              onChange={(event, newValue) => {
                handleSelectChange("status", newValue);
              }}
              options={Option.CustomerStatusData}
              renderInput={(params) => (
                <CustomTextField {...params} label="Status" />
              )}
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
        {(userData.groups.includes("Director") ||
          userData.groups.includes("Accounts") ||
          userData.groups.includes("Sales Manager")) && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewCustomerFollowUp recordForEdit={recordForEdit} />
        </Grid>
      </Grid>
    </>
  );
};

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
