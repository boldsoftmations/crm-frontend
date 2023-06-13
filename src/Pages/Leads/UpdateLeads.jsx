import React, { useEffect, useState } from "react";

import "../CommonStyle.css";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import "../CommonStyle.css";
import LeadServices from "./../../services/LeadService";
import { LeadActivity } from "../FollowUp/LeadActivity";
import { ViewAllPotential } from "../Potential/ViewAllPotential";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Popup } from "./../../Components/Popup";
import { CreateLeadsProformaInvoice } from "../Invoice/ProformaInvoice/CreateLeadsProformaInvoice";
import { CustomLoader } from "../../Components/CustomLoader";

function getSteps() {
  return [
    <b style={{ color: "purple" }}>Enter Basic Details</b>,
    <b style={{ color: "purple" }}>Enter Customer Details</b>,
    <b style={{ color: "purple" }}>Enter Shipping Details</b>,
    <b style={{ color: "purple" }}>Review</b>,
  ];
}

export const UpdateLeads = (props) => {
  const {
    leadsByID,
    setOpenPopup,
    getAllleadsData,
    descriptionMenuData,
    assigned,
    product,
  } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [businesTypes, setBusinesTypes] = useState("");
  const [interests, setInterests] = useState("");
  const [businessMismatch, setBusinessMismatch] = useState("");
  const [leads, setLeads] = useState([]);
  const [assign, setAssign] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState([]);
  const [phone, setPhone] = useState();
  const [phone2, setPhone2] = useState();
  const [typeData, setTypeData] = useState("");
  const [checked, setChecked] = useState(false);
  const [followup, setFollowup] = useState(null);
  const [potential, setPotential] = useState(null);
  console.log("leadsByID", leadsByID);
  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
  };

  const handlePhoneChange2 = (newPhone) => {
    setPhone2(newPhone);
  };

  const handleChange = (event) => {
    setTypeData(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLeads({ ...leads, [name]: value });
  };

  useEffect(() => {
    if (leadsByID) getLeadsData(leadsByID);
  }, []);

  const getLeadsData = async (recordForEdit) => {
    try {
      setOpen(true);
      console.log("recordForEdit", recordForEdit);
      const res = await LeadServices.getLeadsById(recordForEdit);
      setAssign(res.data.assigned_to);
      setInterests(res.data.interested);
      setBusinesTypes(res.data.business_type);
      setBusinessMismatch(res.data.business_mismatch);
      setDescriptionValue(res.data.description);
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
    if (activeStep === steps.length - 1) {
      try {
        e.preventDefault();
        setOpen(true);
        const contact1 = phone !== undefined ? `+${phone}` : leadsByID.contact;
        const contact2 =
          phone2 !== undefined ? `+${phone2}` : leadsByID.alternate_contact;
        const data = {
          name: leads.name,
          alternate_contact_name: leads.alternate_contact_name
            ? leads.alternate_contact_name
            : null,
          email: leads.email ? leads.email : null,
          alternate_email: leads.alternate_email ? leads.alternate_email : null,
          contact: contact1 || null,
          alternate_contact: contact2 || null,
          description: descriptionValue ? descriptionValue : null,
          target_date: leads.target_date,
          business_type: businesTypes ? businesTypes : null,
          business_mismatch: businessMismatch ? businessMismatch : "No",
          interested: interests ? interests : "Yes",
          assigned_to: assign ? assign : null,
          references: leads.references,
          company: leads.company ? leads.company : null,
          gst_number: leads.gst_number ? leads.gst_number : null,
          pan_number: leads.pan_number ? leads.pan_number : null,
          address: leads.address ? leads.address : null,
          city: leads.city ? leads.city : null,
          state: leads.state ? leads.state : null,
          country: leads.country ? leads.country : null,
          pincode: leads.pincode,
          website: leads.website,
          type_of_customer: typeData ? typeData : leads.type_of_customer,
          shipping_address:
            checked === true ? leads.address : leads.shipping_address,
          shipping_city:
            checked === true
              ? leads.city
              : leads.shipping_city
              ? leads.shipping_city
              : "",
          shipping_state:
            checked === true
              ? leads.state
              : leads.shipping_state
              ? leads.shipping_state
              : "",
          shipping_pincode:
            checked === true ? leads.pincode : leads.shipping_pincode,
          lead_exists: leads.lead_exists,
        };

        await LeadServices.updateLeads(leads.lead_id, data);
        getAllleadsData();
        setOpenPopup(false);
        setOpen(false);
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
                      value={
                        phone
                          ? `+${phone}`
                          : leadsByID.contact
                          ? leadsByID.contact
                          : ""
                      }
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
                      value={
                        phone2
                          ? `+${phone2}`
                          : leadsByID.alternate_contact
                          ? leadsByID.alternate_contact
                          : ""
                      }
                      onChange={handlePhoneChange2}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Autocomplete
                      style={{
                        minWidth: 220,
                      }}
                      size="small"
                      onChange={(event, value) => setBusinesTypes(value)}
                      value={businesTypes ? businesTypes : ""}
                      name="business_type"
                      options={businessTypeOption.map((option) => option.label)}
                      getOptionLabel={(option) => `${option}`}
                      renderInput={(params) => (
                        <TextField {...params} label="Business Types" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="lead_exists"
                      size="small"
                      label="Lead Exists"
                      variant="outlined"
                      value={leads.lead_exists ? leads.lead_exists : ""}
                      onChange={handleInputChange}
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
                        value={businessMismatch ? businessMismatch : "No"}
                        onChange={(e, value) =>
                          setBusinessMismatch(e.target.value)
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
                      <InputLabel id="demo-simple-select-label">
                        Interested
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Interested"
                        value={interests ? interests : "Yes"}
                        onChange={(e, value) => setInterests(e.target.value)}
                      >
                        {interestOption.map((option, i) => (
                          <MenuItem key={i} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      value={descriptionValue ? descriptionValue : ""}
                      onChange={(event, newValue) => {
                        setDescriptionValue(newValue);
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
                    <Autocomplete
                      style={{
                        minWidth: 220,
                      }}
                      size="small"
                      onChange={(event, value) => setAssign(value)}
                      value={assign ? assign : ""}
                      name="assign"
                      options={assigned.map((option) => option.email)}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Assignied To" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      name="references"
                      size="small"
                      label="References"
                      variant="outlined"
                      value={leads.references ? leads.references : ""}
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
                      value={leads.target_date ? leads.target_date : ""}
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
            <CustomLoader open={open} />
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
                onSubmit={updateLeadsData}
                sx={{ mt: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => setChecked(event.target.checked)}
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
                          value={typeData ? typeData : leads.type_of_customer}
                          defaultValue={leads.type_of_customer}
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
                      fullWidth
                      name="shipping_pincode"
                      size="small"
                      type={"number"}
                      label="Pin Code"
                      variant="outlined"
                      value={
                        checked === true
                          ? leads.pincode
                          : leads.shipping_pincode
                          ? leads.shipping_pincode
                          : ""
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="shipping_state"
                      size="small"
                      label="Shipping State"
                      variant="outlined"
                      value={
                        checked === true
                          ? leads.state
                          : leads.shipping_state
                          ? leads.shipping_state
                          : ""
                      }
                      onChange={handleInputChange}
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
              <Box component="form" noValidate sx={{ mt: 1 }}>
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
                    Contact : {phone ? `+${phone}` : leadsByID.contact}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Alt. Contact :{" "}
                    {phone2 ? `+${phone2}` : leadsByID.alternate_contact}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Busniess Type : {businesTypes}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Busniess Mismatch :
                    {businessMismatch ? businessMismatch : "No"}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Interested : {interests ? interests : ""}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Description : {descriptionValue ? descriptionValue : ""}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    References : {leads.references ? leads.references : ""}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Target Date {leads.target_date}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Assign to : {assign ? assign : ""}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Company Name : {leads.company}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Gst Number : {leads.gst_number}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Pan Number : {leads.pan_number}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    Address : {leads.address}
                  </Grid>
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
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Typography>{getStepContent(activeStep)}</Typography>

          {/* <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={activeStep !== steps.length - 1}
                onClick={(e) => createLeadProformaInvoiceDetails(e)}
                // className={classes.button}
                style={{
                  marginTop: "1em",
                  marginRight: "1em",
                }}
              >
                Generate PI
              </Button>
            </div> */}
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
              PI
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
          <LeadActivity
            getAllleadsData={getLeadsData}
            followup={followup}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewAllPotential
            getAllleadsData={getLeadsData}
            potential={potential}
            product={product}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>
      <Popup
        fullScreen={true}
        title={"Create Leads Proforma Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateLeadsProformaInvoice
          leads={leads}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </div>
  );
};

const businessTypeOption = [
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
