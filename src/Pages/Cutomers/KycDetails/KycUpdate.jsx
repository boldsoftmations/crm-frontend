import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
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

const KycUpdate = ({
  setOpenPopup,
  getAllCompanyDetails,
  recordForEdit,
  contactsData,
}) => {
  const [inputValue, setInputValue] = useState([]);
  const [open, setOpen] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "gst_number" || name === "pan_number"
        ? value.toUpperCase()
        : value;
    setInputValue({ ...inputValue, [name]: updatedValue });
  };

  const handleSelectChange = (name, value) => {
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  useEffect(() => {
    getAllCompanyDetailsByID();
  }, []);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
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
        category: inputValue.category || [],
        main_distribution: inputValue.main_distribution || [],
        birth_date: inputValue.birth_date || null,
        anniversary_date: inputValue.anniversary_date || null,
      };
      await CustomerServices.updateCompanyData(recordForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllCompanyDetails();
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
            <TextField
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
            <TextField
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
            <TextField
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
              options={contactsData.map((option) => option.name)}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Purchase Decision Maker" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="birth_date"
              size="small"
              label="Enter Birth date"
              variant="outlined"
              value={inputValue.birth_date || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="anniversary_date"
              size="small"
              label="Enter Aniversary Date"
              variant="outlined"
              value={inputValue.anniversary_date || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
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
                  <TextField {...params} label="Industrial List" />
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
                  <TextField {...params} label="Distribution Type" />
                )}
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
                  <TextField
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
                onChange={(newValue) => {
                  handleSelectChange("main_distribution", newValue);
                }}
                multiple
                limitTags={3}
                id="multiple-limit-tags"
                options={Option.MainDistribution.map((option) => option.label)}
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
