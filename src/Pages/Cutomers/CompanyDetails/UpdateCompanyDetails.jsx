import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyName } from "../../../Redux/Action/Action";
import axios from "axios";
import LeadServices from "../../../services/LeadService";
import { styled } from "@mui/material/styles";
import { CustomLoader } from "../../../Components/CustomLoader";
import { ViewCustomerFollowUp } from "../../FollowUp/ViewCustomerFollowUp";
import { CustomerAllPotential } from "../../Potential/CustomerAllPotential";
import Option from "../../../Options/Options";

export const UpdateCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails, recordForEdit, product } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [followUpData, setFollowUpData] = useState([]);
  const [potential, setPotential] = useState(null);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

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
    getAssignedData();
  }, []);

  const getAssignedData = async (id) => {
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

  const validatePinCode = async () => {
    try {
      setOpen(true);
      const PINCODE = inputValue.pincode;
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${PINCODE}`
      );
      setInputValue({
        ...inputValue,
        state: response.data[0].PostOffice[0].State,
        city: response.data[0].PostOffice[0].District,
      });
      setOpen(false);
    } catch (error) {
      console.log("Creating Bank error ", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllCompanyDetailsByID();
  }, []);

  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(recordForEdit);
      setInputValue(response.data);
      dispatch(getCompanyName(response.data.name));
      setFollowUpData(response.data.followup);
      setPotential(response.data.potential);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

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
        category: inputValue.category || null,
        assigned_to: inputValue.assigned_to || null,
        type_of_customer: inputValue.type_of_customer || null,
        website: inputValue.website || null,
        estd_year: inputValue.estd_year || null,
        approx_annual_turnover: inputValue.approx_annual_turnover || null,
        purchase_decision_maker: inputValue.purchase_decision_maker || [],
        industrial_list: inputValue.industrial_list || null,
        distribution_type: inputValue.distribution_type || null,
        main_distribution: inputValue.main_distribution || [],
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

  const contactsData = inputValue.contacts || []; // Handle cases when inputValue.contacts is undefined or null

  return (
    <>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateCompanyDetails(e)}
      >
        <Grid container spacing={2}>
          {/* Company Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Company Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Company Name"
              variant="outlined"
              value={inputValue.name || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Busniess Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Busniess Type"
                value={inputValue.business_type || ""}
                onChange={(e, value) =>
                  handleSelectChange("business_type", e.target.value)
                }
              >
                {Option.CustomerBusinessTypeData.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              sx={{ minWidth: "200px" }}
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode || ""}
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

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="gst_number"
              label="GST No."
              variant="outlined"
              value={inputValue.gst_number || ""}
              onChange={handleInputChange}
              error={inputValue.gst_number && !GST_NO(inputValue.gst_number)}
              helperText={
                inputValue.gst_number &&
                !GST_NO(inputValue.gst_number) &&
                "Invalid GST Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              size="small"
              name="pan_number"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_number || ""}
              onChange={handleInputChange}
              error={inputValue.pan_number && !PAN_NO(inputValue.pan_number)}
              helperText={
                inputValue.pan_number &&
                !PAN_NO(inputValue.pan_number) &&
                "Invalid PAN Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              size="small"
              value={inputValue.assigned_to || []}
              onChange={(event, newValue) => {
                handleSelectChange("assigned_to", newValue);
              }}
              multiple
              limitTags={3}
              id="multiple-limit-tags"
              options={assigned.map((option) => option.email)}
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
                  label="Assign To"
                  placeholder="Assign To"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address ? inputValue.address : ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* kyc Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="KYC Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              // type="number"
              name="estd_year"
              size="small"
              label="Established Year"
              placeholder="YYYY"
              // inputProps={{
              //   min: "1900",
              //   max: "2099",
              // }}
              value={inputValue.estd_year || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
          <Grid item xs={12} sm={3}>
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
          {inputValue.type_of_customer === "Industrial Customer" && (
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
                onChange={(event, newValue) => {
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
        {userData.groups.toString() === "Accounts" && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        )}
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ViewCustomerFollowUp
            recordForEdit={recordForEdit}
            followUpData={followUpData}
            getAllCompanyDetailsByID={getAllCompanyDetailsByID}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomerAllPotential
            getAllleadsData={getAllCompanyDetails}
            potential={potential}
            product={product}
            recordForEdit={recordForEdit}
          />
        </Grid>
      </Grid>
    </>
  );
};

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
