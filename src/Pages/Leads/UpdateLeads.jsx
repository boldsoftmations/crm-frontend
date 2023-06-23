import React, { useState, useEffect } from "react";
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
  IconButton,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import CloseIcon from "@mui/icons-material/Close";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { ViewAllPotential } from "../Potential/ViewAllPotential";
import { LeadActivity } from "../FollowUp/LeadActivity";

export const UpdateLeads = (props) => {
  const {
    setOpenPopup,
    getAllleadsData,
    descriptionMenuData,
    assigned,
    product,
    leadsByID,
  } = props;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState([]);
  const [followup, setFollowup] = useState(null);
  const [potential, setPotential] = useState(null);
  const [error, setError] = useState(null);

  const getTargetDate = () => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.setDate(currentDate.getDate() + 3));
    return targetDate.toISOString().split("T")[0]; // Format targetDate as YYYY-MM-DD
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeads({ ...leads, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    if (name === "hot_lead") {
      setLeads({
        ...leads,
        [name]: value,
        target_date: value ? getTargetDate() : "", // Set target_date if hot_lead is true, otherwise clear the value
      });
    } else {
      setLeads({
        ...leads,
        [name]: value,
      });
    }
  };

  const handleSameAsAddress = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (leadsByID) getLeadsData(leadsByID);
  }, []);

  const getLeadsData = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await LeadServices.getLeadsById(recordForEdit);
      setFollowup(res.data.followup);
      setPotential(res.data.potential);
      setLeads(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const updateLeadsData = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);

      const data = {
        hot_lead: leads.hot_lead,
        pinned: leads.pinned,
        name: leads.name,
        alternate_contact_name: leads.alternate_contact_name,
        email: leads.email,
        alternate_email: leads.alternate_email,
        contact: leads.contact || null,
        alternate_contact: leads.alternate_contact || null,
        business_type: leads.business_type,
        business_mismatch: leads.business_mismatch || "No",
        interested: leads.interested || "Yes",
        references: leads.references,
        assigned_to: leads.assigned_to || null,
        description: leads.description || [],
        target_date: leads.target_date || null,
        type_of_customer: leads.type_of_customer,
        company: leads.company || null,
        gst_number: leads.gst_number || null,
        pan_number: leads.pan_number || null,
        address: leads.address,
        city: leads.city,
        state: leads.state,
        country: leads.country,
        pincode: leads.pincode,
        website: leads.website,
        shipping_address:
          checked === true ? leads.address : leads.shipping_address,
        shipping_city: checked === true ? leads.city : leads.shipping_city,
        shipping_state: checked === true ? leads.state : leads.shipping_state,
        shipping_pincode:
          checked === true ? leads.pincode : leads.shipping_pincode,
      };

      await LeadServices.updateLeads(leadsByID, data);

      setOpen(false);
      setOpenPopup(false);
      getAllleadsData();
    } catch (error) {
      console.log("error :>> ", error);
      setError(
        error.response.data.errors ? error.response.data.errors.assigned_to : ""
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
        onSubmit={(e) => updateLeadsData(e)}
        sx={{ mt: 1 }}
      >
        <Snackbar
          open={Boolean(error)}
          onClose={() => setError(null)}
          message={`Assigned To ${error}`}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={() => setError(null)}
            >
              <CloseIcon />
            </IconButton>
          }
        />
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
            <FormControlLabel
              control={
                <Switch
                  checked={leads.hot_lead || false}
                  onChange={(event) =>
                    handleSelectChange("hot_lead", event.target.checked)
                  }
                  name="validity"
                />
              }
              label="Hot Lead"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Name"
              variant="outlined"
              value={leads.name || ""}
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
              value={leads.alternate_contact_name || ""}
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
              value={leads.email || ""}
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
              value={leads.alternate_email || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Contact"
              value={leads.contact || ""}
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
              value={leads.alternate_contact || ""}
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
                value={leads.business_type || ""}
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
            <TextField
              fullWidth
              size="small"
              label="Lead Exists"
              variant="outlined"
              value={leads.lead_exists ? leads.lead_exists : ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Business Mismatch
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Business Mismatch"
                value={leads.business_mismatch || "No"}
                onChange={(e, value) =>
                  handleSelectChange("business_mismatch", e.target.value)
                }
              >
                {businessMismatchsOption.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Interested</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Interested"
                value={leads.interested || "Yes"}
                onChange={(e, value) =>
                  handleSelectChange("interested", e.target.value)
                }
              >
                {interestOption.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="References"
              variant="outlined"
              value={leads.references || ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={leads.assigned_to || ""}
              onChange={(event, value) =>
                handleSelectChange("assigned_to", value)
              }
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assigned To"
                  error={error} // Set the 'error' prop based on the error variable
                  helperText={error ? error : ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              size="small"
              value={leads.description || []}
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
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              name="target_date"
              size="small"
              label="Target Date"
              variant="outlined"
              value={leads.target_date || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
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
                  value={leads.type_of_customer || ""}
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
              multiline
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={leads.company || ""}
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
              value={leads.gst_number || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={leads.pan_number || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={leads.address || ""}
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
              value={leads.city || ""}
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
              value={leads.state || ""}
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
              value={leads.country || ""}
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
              value={leads.pincode || ""}
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
              value={leads.website || ""}
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
                checked === true
                  ? leads.address || ""
                  : leads.shipping_address || ""
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
                checked === true
                  ? leads.pincode || ""
                  : leads.shipping_pincode || ""
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
              value={
                checked === true ? leads.city || "" : leads.shipping_city || ""
              }
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
              value={checked ? leads.state || "" : leads.shipping_state || ""}
              options={StateOption.map((option) => option.value)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Shipping State" />
              )}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2, textAlign: "right" }}
        >
          Submit
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Query Product Name"
            variant="outlined"
            value={leads.query_product_name || ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            size="small"
            label="Query Meassage"
            variant="outlined"
            value={leads.query_message || ""}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LeadActivity
            getLeadByID={getLeadsData}
            followup={followup}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewAllPotential
            getLeadByID={getLeadsData}
            potential={potential}
            product={product}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>
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

const businessMismatchsOption = [
  {
    value: "yes",
    label: "Yes",
  },

  {
    value: "no",
    label: "No",
  },
];

const interestOption = [
  {
    value: "yes",
    label: "Yes",
  },

  {
    value: "no",
    label: "No",
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
];

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
