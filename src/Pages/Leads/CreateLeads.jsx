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
import { useDispatch } from "react-redux";
import { getProfileUser } from "./../../Redux/Action/Action";
import ProductService from "../../services/ProductService";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
function getSteps() {
  return [
    <b style={{ color: "purple" }}>'Enter Basic Details'</b>,
    <b style={{ color: "purple" }}>'Enter Company Details'</b>,
    <b style={{ color: "purple" }}>'Review'</b>,
  ];
}

const BusinessTypeData = [
  {
    id: 1,
    value: "trader",
    name: "Trader",
  },

  {
    id: 2,
    value: "distributor",
    name: "Distributor",
  },
  {
    id: 3,
    value: "retailer",
    name: "Retailer",
  },
  {
    id: 4,
    value: "end_user",
    name: "End User",
  },
];

export const CreateLeads = (props) => {
  const { setOpenPopup, getleads } = props;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [reference, setReference] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);
  const [businesTypes, setBusinesTypes] = useState("");
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [phone, setPhone] = useState();
  const [phone2, setPhone2] = useState();
  const dispatch = useDispatch();

  const [users, setUsers] = useState("");
  const [personName, setPersonName] = useState([]);

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
  console.log("users", users);
  useEffect(() => {
    getReference();
  }, []);

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

  const getReference = async () => {
    try {
      const res = await LeadServices.getAllRefernces();

      setReferenceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await LeadServices.getProfile();

      dispatch(getProfileUser(res.data));
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
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
  const createLeadsData = async (e) => {
    if (activeStep === steps.length - 1) {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: leads.name,
          assigned_to: assign,
          alternate_contact_name: leads.altContactName,
          email: leads.email,
          alternate_email: leads.altEmail,
          contact: phone.phone,
          alternate_contact: phone2.phone2,
          business_type: businesTypes,
          company: leads.companyName,
          gst_number: leads.gstNumber,
          address: leads.address,
          city: leads.city,
          state: leads.state,
          country: leads.country,
          pincode: leads.pinCode,
          references: reference,
          description: personName,
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
                    <TextField
                      select
                      fullWidth
                      name="business_type"
                      size="small"
                      label="Business Type"
                      variant="outlined"
                      onChange={(e, value) => setBusinesTypes(value)}
                    >
                      {BusinessTypeData.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
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
                        <TextField required {...params} label="Reference" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="assigned"
                      size="small"
                      label="Assignied To"
                      variant="outlined"
                      onChange={(e, value) => setAssign(value)}
                    >
                      {assigned.map((option) => (
                        <MenuItem key={option.emp_id} value={option.email}>
                          {`${option.first_name}  ${option.last_name}`}
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
                      name="pinCode"
                      size="small"
                      label="Pin Code"
                      variant="outlined"
                      value={leads.pinCode ? leads.pinCode : ""}
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
              <Box
                component="form"
                noValidate
                onSubmit={createLeadsData}
                sx={{ mt: 1 }}
              >
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
                    Alt. Email : {leads.altEmail}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Contact : {leads.contact}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Contact : {leads.altContact}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Company Name : {leads.companyName}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Gst Number : {leads.gstNumber}
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
                    Pin Code : {leads.pinCode}
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
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography>{getStepContent(activeStep)}</Typography>
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
