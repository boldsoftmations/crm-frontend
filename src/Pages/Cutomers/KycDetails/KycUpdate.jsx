import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
  Chip,
  Divider,
  FormControlLabel,
  Button,
  Box,
} from "@mui/material";
import Autocomplete from "@mui/lab/Autocomplete";
import Option from "../../../Options/Options";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomerServices from "../../../services/CustomerService";
import CustomTextField from "../../../Components/CustomTextField";

const KycUpdate = ({ recordForEdit }) => {
  const [contactData, setContactData] = useState([]);
  const [allCompetitors, setAllCompetitors] = useState([]);
  const [open, setOpen] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];
  const [inputValue, setInputValue] = useState([]);
  const [contactValue, setContactValue] = useState([]);
  // Fetch company details based on the active tab when the component mounts or the active tab changes
  useEffect(() => {
    if (recordForEdit) {
      getAllCompanyDetailsByID();
    }
  }, [recordForEdit]);

  useEffect(() => {
    getCompetitors();
  }, []);

  // Fetch competitors
  const getCompetitors = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllPaginateCompetitors("all");
      setAllCompetitors(response.data);
    } finally {
      setOpen(false);
    }
  };

  // Fetch company details based on ID
  const getAllCompanyDetailsByID = async () => {
    setOpen(true);
    try {
      const [contactResponse, kycResponse] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "contacts"),
        CustomerServices.getCompanyDataById(recordForEdit),
      ]);

      // Extract only the required fields for setInputValue
      const {
        website,
        estd_year,
        approx_annual_turnover,
        purchase_decision_maker,
        industrial_list,
        distribution_type,
        customer_serve_count,
        category,
        main_distribution,
        address,
        business_type,
        city,
        name,
        pan_number,
        pincode,
        state,
        type_of_customer,
      } = kycResponse.data;
      setInputValue({
        website,
        estd_year,
        approx_annual_turnover,
        purchase_decision_maker,
        industrial_list,
        distribution_type,
        customer_serve_count,
        category,
        main_distribution,
        address,
        business_type,
        city,
        name,
        pan_number,
        pincode,
        state,
        type_of_customer,
      });

      // Extract only the required fields for setContactData
      const filteredContacts = contactResponse.data.contacts.map((contact) => ({
        id: contact.id,
        name: contact.name,
        company: contact.company,
        contact: contact.contact,
        alternate_contact: contact.alternate_contact,
        designation: contact.designation,
        birth_date: contact.birth_date,
        marital_status: contact.marital_status,
        anniversary_date: contact.anniversary_date,
        religion: contact.religion,
      }));
      setContactData(filteredContacts);
      console.log("filteredContacts", filteredContacts);
      // Find the ID for the purchase decision maker
      const decisionMaker = filteredContacts.find(
        (item) => item.name === kycResponse.data.purchase_decision_maker
      );
      if (decisionMaker) {
        setContactValue(decisionMaker);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setOpen(false);
    }
  };

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle Contacts changes
  const handleContactsInputChange = (event) => {
    const { name, value } = event.target;
    setContactValue((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    if (name === "purchase_decision_maker") {
      setInputValue((prevState) => ({ ...prevState, [name]: value }));
      const filterID = contactData.find((item) => item.name === value);
      console.log("filterID", filterID);
      if (filterID) {
        // getPurchaseDecisionMakerDataByID(filterID.id);
        setContactValue(filterID);
      }
    } else {
      setInputValue((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Handle Contacts changes
  const handleContactsChange = (name, value) => {
    setContactValue((prevState) => ({ ...prevState, [name]: value }));
  };

  // Fetch purchase decision maker data by ID
  // const getPurchaseDecisionMakerDataByID = async (ID) => {
  //   try {
  //     setOpen(true);
  //     const contactResponse = await CustomerServices.getCompanyDataByIdWithType(
  //       ID,
  //       "contacts"
  //     );

  //     if (contactResponse.data && contactResponse.data.contacts) {
  //       const contact = contactResponse.data.contacts;
  //       setContactValue((prevState) => ({
  //         ...prevState,
  //         religion: contact.religion || "",
  //         birth_date: contact.birth_date || "",
  //         marital_status: contact.marital_status || "",
  //         anniversary_date: contact.anniversary_date || "",
  //       }));
  //     }
  //   } finally {
  //     setOpen(false);
  //   }
  // };

  // Update company details
  const UpdateCompanyDetails = async (e) => {
    e.preventDefault();
    try {
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
        assigned_to: inputValue.assigned_to || [],
        type_of_customer: inputValue.type_of_customer || null,
        website: inputValue.website || null,
        estd_year: inputValue.estd_year || null,
        approx_annual_turnover: inputValue.approx_annual_turnover || null,
        purchase_decision_maker: inputValue.purchase_decision_maker || null,
        industrial_list: inputValue.industrial_list || null,
        distribution_type: inputValue.distribution_type || null,
        customer_serve_count: inputValue.customer_serve_count || null,
        category: inputValue.category || [],
        main_distribution: inputValue.main_distribution || [],
        whatsapp_url: inputValue.whatsapp_url || null,
      };
      await CustomerServices.updateCompanyData(recordForEdit, req);
      UpdateContactDetails();
    } finally {
      setOpen(false);
    }
  };

  // Update contact details
  const UpdateContactDetails = async () => {
    try {
      setOpen(true);
      const req = {
        name: contactValue.name || null,
        company: contactValue.company || null,
        contact: contactValue.contact || null,
        alternate_contact: contactValue.alternate_contact || null,
        designation: contactValue.designation || null,
        birth_date: contactValue.birth_date || null,
        marital_status: contactValue.marital_status || null,
        anniversary_date: contactValue.anniversary_date || null,
        religion: contactValue.religion || null, // Fixed typo from 'relogion' to 'religion'
      };

      await CustomerServices.updateContactData(contactValue.id, req);
      getAllCompanyDetailsByID();
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      {/* Form for KYC Details */}
      <Box component="form" noValidate onSubmit={UpdateCompanyDetails}>
        <Grid container spacing={2}>
          {/* KYC Details */}
          <Grid item xs={12}>
            <Divider>
              <Chip label="KYC Details" />
            </Divider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="website"
              size="small"
              label="Website"
              variant="outlined"
              value={inputValue.website || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="estd_year"
              size="small"
              label="Established Year"
              placeholder="YYYY"
              value={inputValue.estd_year || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="approx_annual_turnover"
              size="small"
              label="Approx Annual Turnover"
              variant="outlined"
              value={inputValue.approx_annual_turnover || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleSelectChange("purchase_decision_maker", value)
              }
              value={inputValue.purchase_decision_maker || ""}
              options={contactData.map((option) => option.name)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <CustomTextField {...params} label="Purchase Decision Maker" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleContactsChange("religion", value)
              }
              value={contactValue.religion || ""}
              options={Option.religionsInIndia.map((option) => option)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <CustomTextField {...params} label="Religion" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              type="date"
              name="birth_date"
              size="small"
              label="Birth date"
              variant="outlined"
              value={contactValue.birth_date || ""}
              onChange={handleContactsInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: currentDate, // restrict to current and previous dates only
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleContactsChange("marital_status", value)
              }
              value={contactValue.marital_status || ""}
              options={Option.Marital_Status_Options.map((options) => options)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <CustomTextField {...params} label="Marital Status" />
              )}
            />
          </Grid>
          {contactValue.marital_status === "Married" && (
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type="date"
                name="anniversary_date"
                size="small"
                label="Anniversary Date"
                variant="outlined"
                value={contactValue.anniversary_date || ""}
                onChange={handleContactsInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: currentDate, // restrict to current and previous dates only
                }}
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Industrial Customer" && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                style={{
                  minWidth: 220,
                }}
                size="small"
                onChange={(event, value) =>
                  handleSelectChange("industrial_list", value)
                }
                value={inputValue.industrial_list || ""}
                options={Option.IndustriesList.map((option) => option.label)}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Industrial List" />
                )}
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                style={{
                  minWidth: 220,
                }}
                size="small"
                onChange={(event, value) =>
                  handleSelectChange("distribution_type", value)
                }
                value={inputValue.distribution_type || ""}
                options={Option.DistributionTypeOption.map(
                  (option) => option.label
                )}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Distribution Type" />
                )}
              />
            </Grid>
          )}
          {inputValue.distribution_type === "Wholeseller" && (
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type="number"
                name="customer_serve_count"
                size="small"
                label="Customer Serve Count"
                variant="outlined"
                value={inputValue.customer_serve_count || ""}
                onChange={handleInputChange}
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                size="small"
                value={inputValue.category || []}
                onChange={(event, newValue) => {
                  handleSelectChange("category", newValue);
                }}
                multiple
                limitTags={3}
                id="multiple-limit-tags"
                options={Option.CategoryOption.map((option) => option.label)}
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
                    label="Category"
                    placeholder="Category"
                  />
                )}
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <Autocomplete
                size="small"
                value={inputValue.main_distribution || []}
                onChange={(event, newValue) => {
                  handleSelectChange("main_distribution", newValue);
                }}
                multiple
                limitTags={3}
                id="multiple-limit-tags"
                options={allCompetitors.map((option) => option.name)}
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
                    label="Main Distribution"
                    placeholder="Main Distribution"
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="whatsapp_url"
              size="small"
              label="Whatsapp URL"
              value={inputValue.whatsapp_url || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Grid>
      </Box>
    </>
  );
};

export default KycUpdate;