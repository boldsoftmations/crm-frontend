import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Button,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Divider,
  Checkbox,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { CustomLoader } from "./../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";

export const CreateLeads = (props) => {
  const {
    setOpenPopup,
    getleads,
    descriptionMenuData,
    referenceData,
    assigned,
  } = props;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "gst_number" || name === "pan_number"
        ? value.toUpperCase()
        : value;
    setLeads({ ...leads, [name]: updatedValue });
  };

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSelectChange = (name, value) => {
    setLeads({
      ...leads,
      [name]: value,
    });
  };

  const handleSameAsAddress = (event) => {
    setChecked(event.target.checked);
  };

  const createLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const data = {
        name: leads.name,
        alternate_contact_name: leads.alternate_contact_name,
        email: leads.email,
        alternate_email: leads.alternate_email,
        contact: leads.contact || null,
        alternate_contact: leads.alternate_contact || null,
        business_type: leads.business_type,
        description: leads.description || [],
        assigned_to: leads.assigned_to,
        references: leads.references,
        company: leads.company,
        gst_number: leads.gst_number || null,
        pan_number: leads.pan_number || null,
        address: leads.address,
        city: leads.city,
        state: leads.state,
        country: leads.country,
        pincode: leads.pincode || null,
        website: leads.website,
        type_of_customer: leads.type_of_customer,
        shipping_address:
          checked === true ? leads.address : leads.shipping_address,
        shipping_city: checked === true ? leads.city : leads.shipping_city,
        shipping_state: checked === true ? leads.state : leads.shipping_state,
        shipping_pincode:
          checked === true
            ? leads.pincode || null
            : leads.shipping_pincode || null,
      };

      await LeadServices.createLeads(data);
      // Set success message
      setSuccessMessage("Leads created successfully.");
      setErrorMessage(""); // Reset error message if it was previously set

      setOpenPopup(false);
      setOpen(false);
      getleads();
    } catch (error) {
      setErrorMessage("");
      // Handle the error response
      if (error.response && error.response.data && error.response.data.errors) {
        const errorData = error.response.data.errors;

        // Set error message based on the error data
        const errorMessage = Object.values(errorData).flat().join(" ");
        setErrorMessage(errorMessage);
      } else {
        setErrorMessage("An error occurred while creating leads.");
      }
      setSuccessMessage("");
      setOpen(false);
    }
  };

  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

  return (
    <>
      <CustomLoader open={open} />
      {/* Snackbar to display the error or success message */}
      <Snackbar
        open={errorMessage !== "" || successMessage !== ""}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        autoHideDuration={6000}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={errorMessage !== "" ? "error" : "success"}
          elevation={6}
          variant="filled"
        >
          {errorMessage !== "" ? errorMessage : successMessage}
        </MuiAlert>
      </Snackbar>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createLeadsData(e)}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          {/* Create Basic Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Basic Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Name"
              variant="outlined"
              value={leads.name ? leads.name : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="alternate_contact_name"
              size="small"
              label="Alternate Contact Name"
              variant="outlined"
              value={leads.alternate_contact_name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="email"
              size="small"
              label="Email"
              variant="outlined"
              value={leads.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="alternate_email"
              size="small"
              label="Alternate Email"
              variant="outlined"
              value={leads.alternate_email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Contact"
              inputStyle={{
                height: "15px",
                minWidth: "300px",
              }}
              country={"in"}
              onChange={(newPhone) => {
                const formattedPhone = newPhone.startsWith("+")
                  ? newPhone
                  : "+" + newPhone;
                handleSelectChange("contact", formattedPhone);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Alternate Contact"
              inputStyle={{
                height: "15px",
                minWidth: "300px",
              }}
              country={"in"}
              onChange={(newPhone) => {
                const formattedPhone = newPhone.startsWith("+")
                  ? newPhone
                  : "+" + newPhone;
                handleSelectChange("alternate_contact", formattedPhone);
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Busniess Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Busniess Type"
                onChange={(e, value) =>
                  handleSelectChange("business_type", e.target.value)
                }
              >
                {BusinessTypeData.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleSelectChange("references", value)
              }
              options={referenceData.map((option) => option.source)}
              getOptionLabel={(option) => `${option}`}
              renderInput={(params) => (
                <TextField {...params} label="Reference" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) =>
                handleSelectChange("assigned_to", value)
              }
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Assignied To" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              size="small"
              value={leads.description}
              onChange={(event, newValue) => {
                handleSelectChange("description", newValue);
              }}
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={descriptionMenuData.map((option) => option.name)}
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
                  label="Description"
                  placeholder="Description"
                />
              )}
            />
          </Grid>

          {/* company Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Company Details" />
              </Divider>
            </Root>
          </Grid>
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
                  value={leads.type_of_customer}
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
            </>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={leads.company}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="gst_number"
              size="small"
              label="Gst Number"
              variant="outlined"
              value={leads.gst_number}
              onChange={handleInputChange}
              error={leads.gst_number && !GST_NO(leads.gst_number)}
              helperText={
                leads.gst_number &&
                !GST_NO(leads.gst_number) &&
                "Invalid GST Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={leads.pan_number}
              onChange={handleInputChange}
              error={leads.pan_number && !PAN_NO(leads.pan_number)}
              helperText={
                leads.pan_number &&
                !PAN_NO(leads.pan_number) &&
                "Invalid PAN Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={leads.address}
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
              value={leads.city}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) => handleSelectChange("state", value)}
              name="state"
              value={leads.state}
              options={StateOption.map((option) => option.label)}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} label="State" />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="country"
              size="small"
              label="Country"
              variant="outlined"
              value={leads.country}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={leads.pincode}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="website"
              size="small"
              label="Website"
              variant="outlined"
              value={leads.website}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Craete Shipping Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Shipping Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleSameAsAddress}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Same as Billing Address"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                checked === true ? leads.address : leads.shipping_address || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="shipping_pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={
                checked === true ? leads.pincode : leads.shipping_pincode || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={checked === true ? leads.city : leads.shipping_city || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleSelectChange("shipping_state", value)
              }
              name="shipping_state"
              value={checked ? leads.state : leads.shipping_state || ""}
              options={StateOption.map((option) => option.value)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Shipping State" />
              )}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, textAlign: "right" }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

const BusinessTypeData = [
  {
    value: "trader",
    label: "Trader",
  },

  {
    value: "distributor",
    label: "Distributor",
  },
  {
    value: "retailer",
    label: "Retailer",
  },
  {
    value: "end_user",
    label: "End User",
  },
];

const StateOption = [
  {
    id: 1,
    value: "Andhra Pradesh",
    label: "Andhra Pradesh",
  },

  {
    id: 2,
    value: "Arunachal Pradesh",
    label: "Arunachal Pradesh",
  },
  {
    id: 3,
    value: "Assam",
    label: "Assam",
  },
  {
    id: 4,
    value: "Bihar",
    label: "Bihar",
  },
  {
    id: 5,
    value: "Chhattisgarh",
    label: "Chhattisgarh",
  },
  {
    id: 6,
    value: "Goa",
    label: "Goa",
  },
  {
    id: 7,
    value: "Gujarat",
    label: "Gujarat",
  },
  {
    id: 8,
    value: "Haryana",
    label: "Haryana",
  },
  {
    id: 9,
    value: "Himachal Pradesh",
    label: "Himachal Pradesh",
  },
  {
    id: 10,
    value: "Jharkhand",
    label: "Jharkhand",
  },
  {
    id: 11,
    value: "Karnataka",
    label: "Karnataka",
  },
  {
    id: 12,
    value: "Kerala",
    label: "Kerala",
  },
  {
    id: 13,
    value: "Madhya Pradesh",
    label: "Madhya Pradesh",
  },
  {
    id: 14,
    value: "Maharashtra",
    label: "Maharashtra",
  },
  {
    id: 15,
    value: "Manipur",
    label: "Manipur",
  },
  {
    id: 16,
    value: "Meghalaya",
    label: "Meghalaya",
  },
  {
    id: 17,
    value: "Mizoram",
    label: "Mizoram",
  },
  {
    id: 18,
    value: "Nagaland",
    label: "Nagaland",
  },
  {
    id: 19,
    value: "Odisha",
    label: "Odisha",
  },
  {
    id: 20,
    value: "Punjab",
    label: "Punjab",
  },
  {
    id: 21,
    value: "Rajasthan",
    label: "Rajasthan",
  },
  {
    id: 22,
    value: "Sikkim",
    label: "Sikkim",
  },
  {
    id: 23,
    value: "Tamil Nadu",
    label: "Tamil Nadu",
  },
  {
    id: 24,
    value: "Telangana",
    label: "Telangana",
  },
  {
    id: 25,
    value: "Tripura",
    label: "Tripura",
  },
  {
    id: 26,
    value: "Uttar Pradesh",
    label: "Uttar Pradesh",
  },
  {
    id: 27,
    value: "Uttarakhand",
    label: "Uttarakhand",
  },
  {
    id: 28,
    value: "West Bengal",
    label: "West Bengal",
  },
  {
    id: 28,
    value: "New Delhi",
    label: "New Delhi",
  },
];

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
