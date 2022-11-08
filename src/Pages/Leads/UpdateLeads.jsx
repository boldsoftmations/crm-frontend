import React, { useEffect, useState } from "react";

import "../CommonStyle.css";

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { CircularProgress } from "@mui/material";
import { Backdrop } from "@mui/material";
import "../CommonStyle.css";
import LeadServices from "./../../services/LeadService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductService from "../../services/ProductService";
import { ViewAllFollowUp } from "./../FollowUp/ViewAllFollowUp";
import { ViewAllPotential } from "../Potential/ViewAllPotential";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      minWidth: 250,
    },
  },
};

function getStyles(desc, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(desc) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export const UpdateLeads = (props) => {
  const { recordForEdit, setOpenPopup, getleads } = props;
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [open, setOpen] = useState(false);
  const [businesTypes, setBusinesTypes] = useState("");
  const [interests, setInterests] = useState("");
  const [businessMismatch, setBusinessMismatch] = useState("");
  const [leads, setLeads] = useState([]);
  const [description, setDescription] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [assign, setAssign] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const desc = useSelector((state) => state.auth);
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleDelete = (data) => {
    console.log("You clicked the delete icon.", data);
  };
  const assignValue = assign ? assign : assign;
  const interestedValue = interests ? interests : interests;
  const businessMismatchValue = businessMismatch
    ? businessMismatch
    : businessMismatch;
  const descriptionValue = personName ? personName : leads.description;

  const businesTypesValue = businesTypes ? businesTypes : businesTypes;
  const menuList = [
    {
      auto_number: 1000,
      consumable: "yes",
      id: 4,
      name: "Tape",
    },
  ];
  const auth = () => {
    const user = desc.description ? desc.description : menuList;
    return user;
  };
  const descMenu = auth();

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
        const data = {
          name: leads.name,
          alternate_contact_name: leads.altContactName
            ? leads.altContactName
            : "",
          email: leads.email ? leads.email : "",
          alternate_email: leads.alternate_email ? leads.alternate_email : "",
          contact: leads.contact,
          alternate_contact: leads.alternate_contact,
          description: descriptionValue,
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
                    <TextField
                      fullWidth
                      required
                      name="contact"
                      size="small"
                      label="Contact"
                      variant="outlined"
                      value={leads.contact ? leads.contact : ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="alternate_contact"
                      size="small"
                      label="Alternate Contact"
                      variant="outlined"
                      value={
                        leads.alternate_contact ? leads.alternate_contact : ""
                      }
                      onChange={handleInputChange}
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
                    <FormControl fullWidth sx={{ minWidth: 200 }}>
                      <InputLabel id="demo-multiple-chip-label">
                        Description
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={personName}
                        onChange={handleChange}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            fullWidth
                            label="Description"
                            required
                            sx={{ minHeight: "40px" }}
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value, i) => (
                              <Chip
                                size="small"
                                key={i}
                                label={value}
                                color="primary"
                                deleteIcon={(value) => handleDelete(value)}
                                // onDelete={handleDelete}
                              />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                      >
                        {descriptionMenuData.map((desc, i) => (
                          <MenuItem
                            key={i}
                            value={desc.name}
                            style={getStyles(desc, personName, theme)}
                          >
                            <Checkbox
                              checked={personName.indexOf(desc.name) > -1}
                            />
                            <ListItemText primary={desc.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      name="assign"
                      size="medium"
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
                    Contact : {leads.contact}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    Alt. Contact : {leads.alternate_contact}
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
