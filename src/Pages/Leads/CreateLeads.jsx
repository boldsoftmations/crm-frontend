import React, { useEffect, useState } from "react";
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
  Typography,
  Select
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import "../CommonStyle.css";
import LeadServices from "./../../services/LeadService";
import ProductService from "../../services/ProductService";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import axios from "axios";
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

export const CreateLeads = (props) => {
  const { setOpenPopup, getleads } = props;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [reference, setReference] = useState();
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);
  const [businesTypes, setBusinesTypes] = useState();
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [phone, setPhone] = useState();
  const [phone2, setPhone2] = useState();
  const [typeData, setTypeData] = useState("");
  const [pinCodeData, setPinCodeData] = useState([]);
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    setTypeData(event.target.value);
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
 
  useEffect(() => {
    getReference();
  }, []);

  useEffect(() => {
    getLAssignedData();
  }, []);

  const validatePinCode = async () => {
    try {
      setOpen(true);
      const PINCODE = leads.shipping_pincode;
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

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  console.log("assign", assign);

  useEffect(() => {
    getDescriptionNoData();
  }, []);
  const createLeadsData = async (e) => {
    if (activeStep === steps.length - 1) {
      try {
        e.preventDefault();
        setOpen(true);
        let REFERENCE = reference;
        let contact1 = phone ? `+${phone}` : phone;
        let contact2 = phone2 ? `+${phone2}` : phone2;
        console.log("assign :>> ", assign ? assign.emp_id : "");
        const data = {
          name: leads.name,
          assigned_to: assign ? assign.email : "",
          alternate_contact_name: leads.altContactName,
          email: leads.email,
          alternate_email: leads.altEmail ? leads.altEmail : "",
          contact: contact1,
          alternate_contact: contact2,
          business_type: businesTypes,
          company: leads.companyName,
          gst_number: leads.gstNumber,
          pan_number: leads.pan_number,
          address: leads.address,
          city: leads.city,
          state: leads.state,
          country: leads.country,
          pincode: leads.pinCode,
          website: leads.website,
          references: REFERENCE,
          description: personName,
          type_of_customer: typeData,
          shipping_address: leads.shipping_address,
          shipping_city: pinCodeData.District,
          shipping_state: pinCodeData.State,
          shipping_pincode: leads.shipping_pincode,
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
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Busniess Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Busniess Type"
                        onChange={(e, value) =>
                          setBusinesTypes(e.target.value)
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
                  
                  {referenceData &&
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
    }
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
            <div className="Auth-form-container" style={{ backgroundColor:'#aaa9ac'}}>
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
                    <TextField
                      fullWidth
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
              <h3 className="Auth-form-title">Create Shipping Detail</h3>
              <Box
                component="form"
                noValidate
                onSubmit={createLeadsData}
                sx={{ mt: 1 }}
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
                        leads.shipping_address ? leads.shipping_address : ""
                      }
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      sx={{ minWidth: "300px" }}
                      name="shipping_pincode"
                      size="small"
                      type={"number"}
                      label="Pin Code"
                      variant="outlined"
                      value={leads.shipping_pincode}
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping_city"
                      size="small"
                      label="Shipping City"
                      variant="outlined"
                      value={pinCodeData.District ? pinCodeData.District : ""}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping_state"
                      size="small"
                      label="Shipping State"
                      variant="outlined"
                      value={pinCodeData.State ? pinCodeData.State : ""}
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
                    Contact : {phone}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Contact : {phone2}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Business Type : {businesTypes}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Reference : {reference}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Company Name : {leads.companyName}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Gst Number : {leads.gstNumber}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Pan Number : {leads.pan_number}
                  </Grid>
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
                  <Grid item xs={12} sm={6}>
                    Assigned to :{" "}
                    {assign.first_name
                      ? `${assign.first_name}  ${assign.last_name}`
                      : ""}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    type : {typeData}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Shipping Address : {leads.shipping_address}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Shipping City : {pinCodeData.District}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Shipping State : {pinCodeData.State}
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
