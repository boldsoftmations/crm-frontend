import React, { useState, useEffect } from "react";
import {
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
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CustomerServices from "../../../services/CustomerService";
import { Popup } from "./../../../Components/Popup";
import { CreateAllCompanyDetails } from "./CreateAllCompanyDetails";
import LeadServices from "../../../services/LeadService";
import { CustomLoader } from "../../../Components/CustomLoader";
import Option from "../../../Options/Options";
import CustomTextField from "../../../Components/CustomTextField";
import { useDispatch } from "react-redux";
import { getCompanyName } from "../../../Redux/Action/Action";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CreateCompanyDetails = (props) => {
  const { getAllCompanyDetails, setOpenPopup } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [idForEdit, setIdForEdit] = useState("");
  const [assigned, setAssigned] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const dispatch = useDispatch();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "gst_number" || name === "pan_number"
        ? value.toUpperCase()
        : value;
    setInputValue({ ...inputValue, [name]: updatedValue });
  };

  const handleSelectChange = async (name, value) => {
    setInputValue({
      ...inputValue,
      [name]: value,
    });
    if (value === "International") {
      try {
        setOpen(true);
        const response = await MasterService.getAllMasterCountries("all");
        const RemoveIndia = response.data.filter((data) => {
          return data.name !== "India";
        });
        setCountryList(RemoveIndia);
      } catch {
        console.log("Error in getting country data by pincode");
      } finally {
        setOpen(false);
      }
    }
  };

  const validatePinCode = async () => {
    try {
      setOpen(true);
      if (!inputValue.origin_type) {
        setAlertMsg({
          message:
            "Please select customer origin type before validating pincode",
          severity: "error",
          open: true,
        });
        return;
      }
      if (inputValue.origin_type === "International" && !inputValue.country) {
        setAlertMsg({
          message: "Please select country before validating pincode",
          severity: "error",
          open: true,
        });
        return;
      }

      const PINCODE = inputValue.pincode;
      const Country = inputValue.country;
      const response = await MasterService.getCountryDataByPincode(
        Country,
        PINCODE
      );
      if (response.data.length === 0) {
        setAlertMsg({
          message:
            "This Pin Code does not exist ! First Create the Pin code in the master country",
          severity: "error",
          open: true,
        });
        setInputValue({
          ...inputValue,
          state: "",
          city: "",
          country: "",
        });
      } else {
        setAlertMsg({
          message: "Pin code is valid",
          severity: "success",
          open: true,
        });
        setInputValue({
          ...inputValue,
          state: response.data[0].state,
          city: response.data[0].city_name,
          country: response.data[0].country,
          pin_code: response.data[0].id,
          zone: response.data[0].zone,
        });
      }
    } catch (error) {
      console.log("error", error);
      setAlertMsg({
        message: "Error fetching country data by pincode",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
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

  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        name: inputValue.name,
        address: inputValue.address,
        pincode: inputValue.pincode,
        country: inputValue.country,
        state: inputValue.state,
        zone: inputValue.zone,
        city: inputValue.city,
        pin_code: inputValue.pin_code,
        gst_number: inputValue.gst_number || null,
        pan_number: inputValue.pan_number || null,
        business_type: inputValue.business_type,
        assigned_to: inputValue.assigned_to || [],
        type_of_customer: inputValue.type_of_customer,
        website: inputValue.website,
        estd_year: inputValue.estd_year,
        approx_annual_turnover: inputValue.approx_annual_turnover,
        purchase_decision_maker: inputValue.purchase_decision_maker || null,
        industrial_list: inputValue.industrial_list || null,
        distribution_type: inputValue.distribution_type || null,
        category: inputValue.category || [],
        main_distribution: inputValue.main_distribution || [],
        origin_type: inputValue.origin_type || null,
      };
      const response = await CustomerServices.createCompanyData(req);
      setIdForEdit(response.data.company_id);
      getAllCompanyDetailsByID(response.data.company_id);
      setOpen(false);
      setAlertMsg({
        message: "Company created successfully",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setOpenPopup2(true);
      }, 700);
      // getAllCompanyDetails();
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  const getAllCompanyDetailsByID = async (COMPANY_ID) => {
    try {
      setOpen(true);
      const response = await CustomerServices.getCompanyDataById(COMPANY_ID);
      dispatch(getCompanyName(response.data.name));
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createCompanyDetails(e)}
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
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Company Name"
              variant="outlined"
              value={inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Business Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Busniess Type"
                onChange={(e, value) =>
                  handleSelectChange("business_type", e.target.value)
                }
              >
                {Option.CustomerBusinessTypeData.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              sx={{ minWidth: "200px" }}
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode}
              onChange={handleInputChange}
            />
            <Button
              onClick={validatePinCode}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>
          {inputValue.origin_type === "International" ? (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                sx={{ minWidth: 220 }}
                size="small"
                onChange={(event, value) => {
                  handleSelectChange("country", value);
                }}
                value={inputValue.country || ""}
                options={
                  countryList && countryList.map((option) => option.name)
                }
                label="Country"
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={3}>
              <CustomTextField
                fullWidth
                size="small"
                label="Country"
                name="country"
                variant="outlined"
                value={inputValue.country || ""}
                disabled
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Zone"
              variant="outlined"
              value={inputValue.zone || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="gst_number"
              label="GST No."
              variant="outlined"
              value={inputValue.gst_number}
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
            <CustomTextField
              fullWidth
              required
              size="small"
              name="pan_number"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_number}
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
            <CustomAutocomplete
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
              label="Assign To"
              placeholder="Assign To"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              multiline
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address}
              onChange={handleInputChange}
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
          <Grid item xs={12}>
            <>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Customer Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={inputValue.origin_type || ""}
                  onChange={(event) =>
                    handleSelectChange("origin_type", event.target.value)
                  }
                >
                  <FormControlLabel
                    value="Domestic"
                    control={<Radio />}
                    label="Domestic"
                  />
                  <FormControlLabel
                    value="International"
                    control={<Radio />}
                    label="International"
                  />
                </RadioGroup>
              </FormControl>
            </>
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
            <CustomTextField
              fullWidth
              name="website"
              size="small"
              label="Website"
              variant="outlined"
              value={inputValue.website}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
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
            <CustomTextField
              fullWidth
              name="approx_annual_turnover"
              size="small"
              label="Approx Annual Turnover"
              variant="outlined"
              value={inputValue.approx_annual_turnover}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="purchase_decision_maker"
              size="small"
              label="Purchase Decision Maker"
              variant="outlined"
              value={inputValue.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          {inputValue.type_of_customer === "Industrial Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                sx={{ minWidth: 220 }}
                size="small"
                onChange={(event, value) => {
                  handleSelectChange("industrial_list", value);
                }}
                value={inputValue.industrial_list || ""}
                options={Option.IndustriesList.map((option) => option.label)}
                label="Industrial List"
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                sx={{ minWidth: 220 }}
                size="small"
                onChange={(event, value) => {
                  handleSelectChange("distribution_type", value);
                }}
                value={inputValue.distribution_type || ""}
                options={Option.DistributionTypeOption.map(
                  (option) => option.label
                )}
                label="Distribution Type"
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
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
                label="Category"
                placeholder="Category"
              />
            </Grid>
          )}
          {inputValue.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
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
                label="Main Distribution"
                placeholder="Main Distribution"
              />
            </Grid>
          )}
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      <Popup
        maxWidth={"lg"}
        title={"Create Customer"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup}
      >
        <CreateAllCompanyDetails
          setOpenPopup={setOpenPopup2}
          getAllCompanyDetails={getAllCompanyDetails}
          recordForEdit={idForEdit}
        />
      </Popup>
    </div>
  );
};

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
