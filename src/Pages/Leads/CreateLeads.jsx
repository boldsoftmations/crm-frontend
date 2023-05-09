import React, { useState } from "react";
import "../CommonStyle.css";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Select,
  Checkbox,
} from "@mui/material";
import "../CommonStyle.css";
import LeadServices from "./../../services/LeadService";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { CustomLoader } from "../../Components/CustomLoader";

export const CreateLeads = (props) => {
  const {
    setOpenPopup,
    getleads,
    descriptionMenuData,
    referenceData,
    assigned,
  } = props;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [reference, setReference] = useState();
  const [assign, setAssign] = useState([]);
  const [stateSelected, setStateSelected] = useState("");
  const [shippingStateSelected, setShippingStateSelected] = useState("");
  const [businesTypes, setBusinesTypes] = useState();
  const [phone, setPhone] = useState();
  const [phone2, setPhone2] = useState();
  const [typeData, setTypeData] = useState("");
  const [personName, setPersonName] = useState([]);
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    setTypeData(event.target.value);
  };

  const handleSameAsAddress = (event) => {
    setChecked(event.target.checked);
  };

  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
  };

  const handlePhoneChange2 = (newPhone) => {
    setPhone2(newPhone);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeads({ ...leads, [name]: value });
  };

  const createLeadsData = async (e) => {
    if (activeStep === steps.length - 1) {
      try {
        e.preventDefault();
        setOpen(true);
        let REFERENCE = reference;
        let contact1 = phone ? `+${phone}` : phone;
        let contact2 = phone2 ? `+${phone2}` : phone2;

        const data = {
          name: leads.name,
          assigned_to: assign ? assign.email : null,
          alternate_contact_name: leads.alternate_contact_name,
          email: leads.email,
          alternate_email: leads.alternate_email ? leads.alternate_email : null,
          contact: contact1,
          alternate_contact: contact2,
          business_type: businesTypes,
          company: leads.companyName,
          gst_number: leads.gstNumber || null,
          pan_number: leads.pan_number,
          address: leads.address,
          city: leads.city,
          state: stateSelected,
          country: leads.country,
          pincode: leads.pinCode,
          website: leads.website,
          references: REFERENCE,
          description: personName,
          type_of_customer: typeData,
          shipping_address:
            checked === true ? leads.address : leads.shipping_address,
          shipping_city:
            checked === true
              ? leads.city
              : leads.shipping_city
              ? leads.shipping_city
              : "",
          shipping_state:
            checked === true ? stateSelected : shippingStateSelected,
          shipping_pincode:
            checked === true ? leads.pinCode : leads.shipping_pincode,
        };

        await LeadServices.createLeads(data);

        setOpenPopup(false);
        setOpen(false);
        getleads();
      } catch (error) {
        console.log("error :>> ", error);
        setOpen(false);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <CustomLoader open={open} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Create Basic Detail</h3>
              <Box
                component="form"
                noValidate
                onSubmit={(e) => createLeadsData(e)}
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="alternate_contact_name"
                      size="small"
                      label="Alternate Contact Name"
                      variant="outlined"
                      value={
                        leads.alternate_contact_name
                          ? leads.alternate_contact_name
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      size="small"
                      label="Email"
                      variant="outlined"
                      value={leads.email ? leads.email : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="alternate_email"
                      size="small"
                      label="Alternate Email"
                      variant="outlined"
                      value={leads.alternate_email ? leads.alternate_email : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PhoneInput
                      specialLabel="Contact"
                      inputStyle={{
                        backgroundColor: "#F5F5F5",
                        height: "15px",
                        minWidth: "500px",
                      }}
                      country={"in"}
                      onChange={handlePhoneChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PhoneInput
                      specialLabel="Alternate Contact"
                      inputStyle={{
                        backgroundColor: "#F5F5F5",
                        height: "15px",
                        minWidth: "500px",
                      }}
                      country={"in"}
                      onChange={handlePhoneChange2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Busniess Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Busniess Type"
                        onChange={(e, value) => setBusinesTypes(e.target.value)}
                      >
                        {BusinessTypeData.map((option, i) => (
                          <MenuItem key={i} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {referenceData && (
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        style={{
                          minWidth: 220,
                        }}
                        size="small"
                        onChange={(event, value) => setReference(value)}
                        name="source"
                        options={referenceData.map((option) => option.source)}
                        getOptionLabel={(option) => `${option}`}
                        renderInput={(params) => (
                          <TextField {...params} label="Reference" />
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      fullWidth
                      size="small"
                      id="grouped-demo"
                      onChange={(event, value) => setAssign(value)}
                      options={assigned.map((option) => option)}
                      getOptionLabel={(option) =>
                        `${option.first_name}  ${option.last_name}`
                      }
                      // sx={{ minWidth: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Assignied To" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      value={personName}
                      onChange={(event, newValue) => {
                        setPersonName(newValue);
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
                </Grid>
              </Box>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <CustomLoader open={open} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Create Company Detail</h3>
              <Box
                component="form"
                noValidate
                onSubmit={createLeadsData}
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="companyName"
                      size="small"
                      label="Company Name"
                      variant="outlined"
                      value={leads.companyName ? leads.companyName : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="gstNumber"
                      size="small"
                      label="Gst Number"
                      variant="outlined"
                      value={leads.gstNumber ? leads.gstNumber : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="pan_number"
                      size="small"
                      label="Pan Number"
                      variant="outlined"
                      value={leads.pan_number ? leads.pan_number : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="address"
                      size="small"
                      label="Address"
                      variant="outlined"
                      value={leads.address ? leads.address : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="city"
                      size="small"
                      label="City"
                      variant="outlined"
                      value={leads.city ? leads.city : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      style={{
                        minWidth: 220,
                      }}
                      size="small"
                      onChange={(event, value) => setStateSelected(value)}
                      name="state"
                      value={stateSelected}
                      options={StateOption.map((option) => option.label)}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="State" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="country"
                      size="small"
                      label="Country"
                      variant="outlined"
                      value={leads.country ? leads.country : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="pinCode"
                      size="small"
                      label="Pin Code"
                      variant="outlined"
                      value={leads.pinCode ? leads.pinCode : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="website"
                      size="small"
                      label="Website"
                      variant="outlined"
                      value={leads.website ? leads.website : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
                {/* <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textAlign: "right" }}
                >
                  Submit
                </Button> */}
              </Box>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <CustomLoader open={open} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Create Shipping Detail</h3>
              <Box
                component="form"
                noValidate
                onSubmit={createLeadsData}
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping_address"
                      size="small"
                      label="Shipping Address"
                      variant="outlined"
                      value={
                        checked === true
                          ? leads.address
                          : leads.shipping_address
                      }
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullwidth
                      name="shipping_pincode"
                      size="small"
                      type={"number"}
                      label="Pin Code"
                      variant="outlined"
                      value={
                        checked === true
                          ? leads.pinCode
                          : leads.shipping_pincode
                      }
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping_city"
                      size="small"
                      label="Shipping City"
                      variant="outlined"
                      value={
                        checked === true
                          ? leads.city
                          : leads.shipping_city
                          ? leads.shipping_city
                          : ""
                      }
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fulWidth
                      name="shipping_state"
                      size="small"
                      label="Same as State"
                      variant="outlined"
                      value={
                        checked === true ? stateSelected : shippingStateSelected
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
                        setShippingStateSelected(value)
                      }
                      name="shipping_state"
                      value={shippingStateSelected}
                      options={StateOption.map((option) => option.value)}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Shipping State" />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <CustomLoader open={open} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Review Detail</h3>
              <Box
                component="form"
                noValidate
                onSubmit={createLeadsData}
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    Name : {leads.name}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Alt. Contact Name : {leads.alternate_contact_name}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Email : {leads.email}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Alt. Email : {leads.alternate_email}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Contact : {phone}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Alt. Contact : {phone2}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Business Type : {businesTypes}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Reference : {reference}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Company Name : {leads.companyName}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Gst Number : {leads.gstNumber}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Pan Number : {leads.pan_number}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Address : {leads.address}
                  </Grid>{" "}
                  <Grid item xs={12} sm={4}>
                    City : {leads.city}
                  </Grid>{" "}
                  <Grid item xs={12} sm={4}>
                    State : {leads.state}
                  </Grid>{" "}
                  <Grid item xs={12} sm={4}>
                    Country : {leads.country}
                  </Grid>{" "}
                  <Grid item xs={12} sm={4}>
                    Pin Code : {leads.pinCode}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Assigned to :{" "}
                    {assign.first_name
                      ? `${assign.first_name}  ${assign.last_name}`
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    type : {typeData}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Shipping Address : {leads.shipping_address}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Shipping City : {leads.city}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Shipping State : {leads.State}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Shipping Pincode : {leads.shipping_pincode}
                  </Grid>{" "}
                </Grid>
                {/* <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textAlign: "right" }}
                >
                  Submit
                </Button> */}
              </Box>
            </Box>
          </>
        );
      default:
        return "Unknown step";
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            m: 4,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5F5F5",
          }}
        >
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>{getStepContent(activeStep)}</>
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep !== 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{
                    marginTop: "1em",
                    marginRight: "1em",
                  }}
                  // className={classes.button}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={createLeadsData}
                // className={classes.button}
                style={{
                  marginTop: "1em",
                  marginRight: "1em",
                }}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        </Paper>
      </Grid>
    </div>
  );
};

function getSteps() {
  return [
    <b style={{ color: "purple" }}>'Enter Basic Details'</b>,
    <b style={{ color: "purple" }}>'Enter Company Details'</b>,
    <b style={{ color: "purple" }}>'Enter Shipping Details'</b>,
    <b style={{ color: "purple" }}>'Review'</b>,
  ];
}

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
];
