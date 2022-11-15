import React, { useEffect, useState } from "react";

import "../CommonStyle.css";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import "../CommonStyle.css";
import LeadServices from "./../../services/LeadService";
import ProductService from "../../services/ProductService";
import { ViewAllFollowUp } from "./../FollowUp/ViewAllFollowUp";
import { ViewAllPotential } from "../Potential/ViewAllPotential";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
function getSteps() {
  return [
    <b style={{ color: "purple" }}>'Enter Basic Details'</b>,
    <b style={{ color: "purple" }}>'Enter Company Details'</b>,
    <b style={{ color: "purple" }}>'Review'</b>,
  ];
}

const businessType = [
  {
    value: "trader",
    name: "trader",
  },

  {
    value: "distributor",
    name: "distributor",
  },
  {
    value: "retailer",
    name: "retailer",
  },
  {
    value: "end_user",
    name: "end_user",
  },
];

const businessMismatchs = [
  {
    value: "yes",
    name: "Yes",
  },

  {
    value: "no",
    name: "No",
  },
];

const interest = [
  {
    value: "yes",
    name: "Yes",
  },

  {
    value: "no",
    name: "No",
  },
];

export const UpdateLeads = (props) => {
  const { recordForEdit, setOpenPopup, getleads } = props;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [businesTypes, setBusinesTypes] = useState("");
  const [interests, setInterests] = useState("");
  const [businessMismatch, setBusinessMismatch] = useState("");
  const [leads, setLeads] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);
  const [personName, setPersonName] = useState([]);
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
  };

  const handlePhoneChange2 = (newPhone) => {
    setPhone2(newPhone);
  };

  const assignValue = assign ? assign : assign;
  const interestedValue = interests ? interests : interests;
  const businessMismatchValue = businessMismatch
    ? businessMismatch
    : businessMismatch;
  const descriptionValue = personName ? personName : leads.description;

  const businesTypesValue = businesTypes ? businesTypes : businesTypes;
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeads({ ...leads, [name]: value });
  };

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDescriptionNoData();
  }, []);

  useEffect(() => {
    getLeadsData(recordForEdit);
  }, []);

  useEffect(() => {
    getLAssignedData();
  }, []);

  const getLeadsData = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await LeadServices.getLeadsById(recordForEdit);
      setAssign(res.data.assigned_to);
      setInterests(res.data.interested);
      setBusinesTypes(res.data.business_type);
      setBusinessMismatch(res.data.business_mismatch);
      setPersonName(res.data.description);
      setPhone( res.data.contact );
      setPhone2(res.data.alternate_contact);
      setLeads(res.data);
     
      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  const getLAssignedData = async () => {
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


  const updateLeadsData = async (e) => {
    if (activeStep === steps.length - 1) {
      try {
        e.preventDefault();
        setOpen(true);
        let contact1 = phone.length === 12 ? `+${phone}` : phone;
        let contact2 = phone2.length === 12 ? `+${phone2}` : phone2;
        const data = {
          name: leads.name,
          alternate_contact_name: leads.altContactName
            ? leads.altContactName
            : "",
          email: leads.email ? leads.email : "",
          alternate_email: leads.alternate_email ? leads.alternate_email : "",
          contact: contact1 ? contact1 : '',
          alternate_contact: contact2 ? contact2 : '',
          description: descriptionValue,
          target_date:leads.target_date,
          business_type: businesTypesValue ? businesTypesValue : "",
          business_mismatch: businessMismatchValue
            ? businessMismatchValue
            : "no",
          interested: interestedValue ? interestedValue : "yes",
          assigned_to: assignValue ? assignValue : "",
          references: leads.references,
          company: leads.company ? leads.company : "",
          gst_number: leads.gst_number ? leads.gst_number : "",
          address: leads.address ? leads.address : "",
          city: leads.city ? leads.city : "",
          state: leads.state ? leads.state : "",
          country: leads.country ? leads.country : "",
          pincode: leads.pincode,
        };

        await LeadServices.updateLeads(leads.lead_id, data);
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
            <div className="Auth-form-container">
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Create Basic Detail</h3>
              <Box component="form" noValidate sx={{ mt: 1 }}>
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
                      name="altContactName"
                      size="small"
                      label="Alternate Contact Name"
                      variant="outlined"
                      value={leads.altContactName ? leads.altContactName : ""}
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
                      value={phone ? phone : ''}
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
                      value={phone2 ? phone2 : ''}
                      onChange={handlePhoneChange2}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="businessTypes"
                      size="small"
                      label="Business Type"
                      variant="outlined"
                      value={businesTypesValue ? businesTypesValue : ""}
                      onChange={(e, value) => setBusinesTypes(e.target.value)}
                    >
                      {businessType.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      name="businessMismatch"
                      size="small"
                      label="Business Mismatch"
                      variant="outlined"
                      value={
                        businessMismatchValue ? businessMismatchValue : "No"
                      }
                      onChange={(e, value) =>
                        setBusinessMismatch(e.target.value)
                      }
                    >
                      {businessMismatchs.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      name="interested"
                      size="small"
                      label="Interested"
                      variant="outlined"
                      value={interestedValue ? interestedValue : "Yes"}
                      onChange={(e, value) => setInterests(e.target.value)}
                    >
                      {interest.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
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
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      name="assign"
                      size="small"
                      label="Assignied To"
                      variant="outlined"
                      value={assignValue ? assignValue : ""}
                      onChange={(e) => setAssign(e.target.value)}
                    >
                      {assigned.map((option) => (
                        <MenuItem key={option.emp_id} value={option.email}>
                          {`${option.first_name}  ${option.last_name}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                  <TextField
                  fullWidth
                  type="date"
                  name="target_date"
                  size="small"
                  label="Target Date"
                  variant="outlined"
                  value={
                    leads.target_date ? leads.target_date : ""
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
            <div className="Auth-form-container">
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Create Company Detail</h3>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="company"
                      size="small"
                      label="Company Name"
                      variant="outlined"
                      value={leads.company ? leads.company : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="gst_number"
                      size="small"
                      label="Gst Number"
                      variant="outlined"
                      value={leads.gst_number ? leads.gst_number : ""}
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
                    <TextField
                      fullWidth
                      required
                      name="state"
                      size="small"
                      label="State"
                      variant="outlined"
                      value={leads.state ? leads.state : ""}
                      onChange={handleInputChange}
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
                      name="pincode"
                      size="small"
                      label="Pin Code"
                      variant="outlined"
                      value={leads.pincode ? leads.pincode : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <div className="Auth-form-container">
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h3 className="Auth-form-title">Review Detail</h3>
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    Name : {leads.name}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Contact Name : {leads.altContactName}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Email : {leads.email}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Email : {leads.alternate_email}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Contact : {phone ? phone : ''}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Contact : {phone2 ? phone2 : ''}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Busniess Type : {businesTypes}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Busniess Mismatch :
                    {businessMismatchValue ? businessMismatchValue : ""}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Interested : {interestedValue ? interestedValue : ""}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Description : {descriptionValue ? descriptionValue : ""}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Target Date {leads.target_date}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Assign to : {assignValue}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Company Name : {leads.company}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Gst Number : {leads.gst_number}
                  </Grid>{" "}
                  <Grid item xs={12} sm={6}>
                    Address : {leads.address}
                  </Grid>{" "}
                  <Grid item xs={12} sm={6}>
                    City : {leads.city}
                  </Grid>{" "}
                  <Grid item xs={12} sm={6}>
                    State : {leads.state}
                  </Grid>{" "}
                  <Grid item xs={12} sm={6}>
                    Country : {leads.country}
                  </Grid>{" "}
                  <Grid item xs={12} sm={6}>
                    Pin Code : {leads.pincode}
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
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography>{getStepContent(activeStep)}</Typography>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {activeStep !== 0 && (
              <Button
                variant="contained"
                color="primary"
                disabled={activeStep === 0}
                onClick={handleBack}
                // className={classes.button}
                style={{
                  marginTop: "1em",
                  marginRight: "1em",
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => updateLeadsData(e)}
              // className={classes.button}
              style={{
                marginTop: "1em",
                marginRight: "1em",
              }}
            >
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </Paper>
      </Grid>

      <Grid container spacing={2}>
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
            <h3 className="Auth-form-title">View Query Product</h3>

            <TextField
              multiline
              fullWidth
              name="query_message"
              size="small"
              label="Query Message"
              variant="outlined"
              value={leads.query_message ? leads.query_message : ""}
              // onChange={handleInputChange}
            />
            <TextField
              multiline
              fullWidth
              name="query_product_name"
              size="small"
              label="Query Product Name"
              variant="outlined"
              value={leads.query_product_name ? leads.query_product_name : ""}
              sx={{ mt: 4 }}
              // onChange={handleInputChange}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewAllFollowUp recordForEdit={recordForEdit} />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewAllPotential recordForEdit={recordForEdit} />
        </Grid>
      </Grid>
    </div>
  );
};
