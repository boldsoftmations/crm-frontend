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
  const [inputValue, setInputValue] = useState({
    purchase_decision_maker: "",
    birth_date: "",
    marital_status: "",
    anniversary_date: "",
  });

  // State to store data for each purchase_decision_maker
  const [decisionMakerData, setDecisionMakerData] = useState({});

  // Fetch company details based on the active tab when the component mounts or the active tab changes
  useEffect(() => {
    if (recordForEdit) {
      getAllCompanyDetailsByID();
    }
  }, [recordForEdit]);

  useEffect(() => {
    getCompetitors();
  }, []);

  const getCompetitors = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllPaginateCompetitors("all");
      setAllCompetitors(response.data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error", err);
    }
  };

  // API call to fetch company details based on type
  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const [contactResponse, kycResponse] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "contacts"),
        CustomerServices.getCompanyDataById(recordForEdit),
      ]);
      setContactData(contactResponse.data.contacts);
      setInputValue(kycResponse.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevState) => ({ ...prevState, [name]: value }));

    // If there's a selected purchase_decision_maker, update decisionMakerData
    if (inputValue.purchase_decision_maker) {
      setDecisionMakerData((prevData) => ({
        ...prevData,
        [inputValue.purchase_decision_maker]: {
          ...prevData[inputValue.purchase_decision_maker],
          [name]: value,
        },
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "purchase_decision_maker") {
      // Save current data before switching
      const currentData = {
        ...inputValue,
      };
      delete currentData.purchase_decision_maker; // We don't want to store the decision maker's name in their data
      setDecisionMakerData((prevData) => ({
        ...prevData,
        [inputValue.purchase_decision_maker]: currentData,
      }));

      // Populate fields based on the new decision maker
      const newData = decisionMakerData[value] || {};
      setInputValue((prevState) => ({
        ...prevState, // Retain other fields
        purchase_decision_maker: value,
        birth_date: newData.birth_date || "",
        marital_status: newData.marital_status || "",
        anniversary_date: newData.anniversary_date || "",
      }));
    } else {
      setInputValue((prevState) => ({ ...prevState, [name]: value }));
    }
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
        birth_date: inputValue.birth_date || null,
        marital_status: inputValue.marital_status || null,
        anniversary_date: inputValue.anniversary_date || null,
      };
      await CustomerServices.updateCompanyData(recordForEdit, req);
      setOpen(false);
      getAllCompanyDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateCompanyDetails(e)}
      >
        <Grid container spacing={2}>
          {/* KYC Details */}
          <Grid item xs={12}>
            <Divider>
              <Chip label="KYC Details" />
            </Divider>
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
            <CustomTextField
              fullWidth
              type="date"
              name="birth_date"
              size="small"
              label="Birth date"
              variant="outlined"
              value={inputValue.birth_date || ""}
              onChange={handleInputChange}
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
                handleSelectChange("marital_status", value)
              }
              value={inputValue.marital_status || ""}
              options={Option.Marital_Status_Options.map((options) => options)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <CustomTextField {...params} label="Marital Status" />
              )}
            />
          </Grid>
          {inputValue.marital_status === "Married" && (
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type="date"
                name="anniversary_date"
                size="small"
                label="Anniversary Date"
                variant="outlined"
                value={inputValue.anniversary_date || ""}
                onChange={handleInputChange}
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
