import React, { useState, useEffect, memo, useCallback } from "react";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Button,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Divider,
  Checkbox,
  Snackbar,
  IconButton,
  Switch,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { LeadActivity } from "../FollowUp/LeadActivity";
import Option from "../../Options/Options";
import CustomTextField from "../../Components/CustomTextField";
import CustomerServices from "../../services/CustomerService";
import ProductService from "../../services/ProductService";
import { LeadPotentialView } from "./LeadPotential/LeadPotentialView";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useSelector } from "react-redux";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";

export const UpdateLeads = memo((props) => {
  // Destructure props
  const {
    setOpenPopup,
    getAllleadsData,
    leadsByID,
    currentPage,
    filterQuery,
    filterSelectedQuery,
    searchQuery,
  } = props;
  // State variables
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState({
    estd_year: new Date().getFullYear().toString(),
  });
  const [followup, setFollowup] = useState(null);
  const [potential, setPotential] = useState(null);
  const [allCompetitors, setAllCompetitors] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const getTargetDate = () => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.setDate(currentDate.getDate() + 3));
    return targetDate.toISOString().split("T")[0]; // Format targetDate as YYYY-MM-DD
  };
  const data = useSelector((state) => state.auth);
  const users = data.profile;

  useEffect(() => {
    if (users && users.groups) {
      if (
        users.groups.includes("Sales Executive") ||
        users.groups.includes("Business Development Execution")
      ) {
        setAssigned(
          Array({
            email: users.email,
          })
        );
      } else {
        setAssigned(users.active_sales_user);
      }
    }
  }, [users.email]);
  // Event handlers
  const validatePinCode = async () => {
    try {
      setOpen(true);
      const Country = leads.country;
      const PINCODE = leads.pincode;
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
        setLeads({
          ...leads,
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
        setLeads({
          ...leads,
          state: response.data[0].state,
          city: response.data[0].city_name,
          country: response.data[0].country,
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;
    if (name === "gst_number" || name === "pan_number") {
      updatedValue = value.toUpperCase();
    }
    if (name === "name") {
      setLeads({
        ...leads,
        [name]: updatedValue,
        purchase_decision_maker: updatedValue,
      });
    } else {
      setLeads({ ...leads, [name]: updatedValue });
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "hot_lead") {
      setLeads({
        ...leads,
        [name]: value,
        target_date: value ? getTargetDate() : "",
      });
    } else {
      setLeads({
        ...leads,
        [name]: value,
      });
    }
  };

  const handleSameAsAddress = (event) => {
    setChecked(event.target.checked);
  };

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getCompetitors = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCompetitors("all");
      setAllCompetitors(response.data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("Error", err);
    }
  };

  useEffect(() => {
    getDescriptionNoData();
    getCompetitors();
  }, []);

  const getLeadsData = async (recordForEdit) => {
    try {
      setOpen(true);
      const res = await LeadServices.getLeadsById(recordForEdit);
      setFollowup(res.data.followup);
      setPotential(res.data.potential);
      setLeads(res.data);

      setOpen(false);
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (leadsByID) getLeadsData(leadsByID);
  }, []);
  // Update leads data
  const updateLeadsData = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);

        const data = {
          hot_lead: leads.hot_lead,
          pinned: leads.pinned,
          name: leads.name,
          alternate_contact_name: leads.alternate_contact_name,
          email: leads.email,
          alternate_email: leads.alternate_email,
          contact: leads.contact || null,
          alternate_contact: leads.alternate_contact || null,
          business_type: leads.business_type,
          business_mismatch: leads.business_mismatch || "No",
          interested: leads.interested || "Yes",
          references: leads.references,
          assigned_to: leads.assigned_to || null,
          description: leads.description || [],
          target_date: leads.target_date || null,
          company: leads.company || null,
          gst_number: leads.gst_number || null,
          pan_number: leads.pan_number || null,
          address: leads.address,
          origin_type: leads.origin_type || null,
          city: leads.city,
          state: leads.state,
          country: leads.country,
          pincode: leads.pincode || null,
          shipping_address:
            checked === true ? leads.address : leads.shipping_address,
          shipping_city: checked === true ? leads.city : leads.shipping_city,
          shipping_state: checked === true ? leads.state : leads.shipping_state,
          shipping_pincode:
            checked === true
              ? leads.pincode || null
              : leads.shipping_pincode || null,
          type_of_customer: leads.type_of_customer,
          website: leads.website,
          approx_annual_turnover: leads.approx_annual_turnover,
          industrial_list:
            leads.type_of_customer === "Industrial Customer"
              ? leads.industrial_list
              : null,
          category:
            leads.type_of_customer === "Distribution Customer"
              ? leads.category
              : null,
          distribution_type:
            leads.type_of_customer === "Distribution Customer"
              ? leads.distribution_type
              : null,
          main_distribution:
            leads.type_of_customer === "Distribution Customer"
              ? leads.main_distribution
              : null,
          estd_year: leads.estd_year || null,
          purchase_decision_maker: leads.purchase_decision_maker,
        };

        const response = await LeadServices.updateLeads(leadsByID, data);

        const successMessage =
          response.data.message || "Leads Updated successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getAllleadsData(
            currentPage,
            filterQuery,
            filterSelectedQuery,
            searchQuery
          );
        }, 300);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [leads, currentPage, filterQuery, filterSelectedQuery, searchQuery]
  );

  // Regular expressions for GST and PAN validation
  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => updateLeadsData(e)}
        sx={{ mt: 1 }}
      >
        <Grid container spacing={2}>
          {/* Create Basic Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Basic Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={leads.hot_lead || false}
                  onChange={(event) =>
                    handleSelectChange("hot_lead", event.target.checked)
                  }
                  name="validity"
                />
              }
              label="Hot Lead"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Name"
              variant="outlined"
              value={leads.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="alternate_contact_name"
              size="small"
              label="Alternate Contact Name"
              variant="outlined"
              value={leads.alternate_contact_name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="email"
              size="small"
              label="Email"
              variant="outlined"
              value={leads.email || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="alternate_email"
              size="small"
              label="Alternate Email"
              variant="outlined"
              value={leads.alternate_email || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Contact"
              value={leads.contact || ""}
              inputStyle={{
                height: "15px",
                minWidth: "300px",
              }}
              country={"in"}
              onChange={(newPhone) => {
                const formattedPhone = newPhone.startsWith("+")
                  ? newPhone
                  : "+" + newPhone;
                handleSelectChange("contact", formattedPhone);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Alternate Contact"
              value={leads.alternate_contact || ""}
              inputStyle={{
                height: "15px",
                minWidth: "300px",
              }}
              country={"in"}
              onChange={(newPhone) => {
                const formattedPhone = newPhone.startsWith("+")
                  ? newPhone
                  : "+" + newPhone;
                handleSelectChange("alternate_contact", formattedPhone);
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Business Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Busniess Type"
                value={leads.business_type || ""}
                onChange={(e, value) =>
                  handleSelectChange("business_type", e.target.value)
                }
              >
                {Option.LeadBusinessTypeData.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="Lead Exists"
              variant="outlined"
              value={leads.lead_exists ? leads.lead_exists : ""}
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
                value={leads.business_mismatch || "No"}
                onChange={(e, value) =>
                  handleSelectChange("business_mismatch", e.target.value)
                }
              >
                {Option.businessMismatchsOption.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Interested</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Interested"
                value={leads.interested || "Yes"}
                onChange={(e, value) =>
                  handleSelectChange("interested", e.target.value)
                }
              >
                {Option.interestOption.map((option, i) => (
                  <MenuItem key={i} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              size="small"
              label="References"
              variant="outlined"
              value={leads.references || ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              value={leads.assigned_to || ""}
              onChange={(event, value) =>
                handleSelectChange("assigned_to", value)
              }
              options={assigned.map((option) => option.email)}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <CustomTextField {...params} label="Assigned To" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              value={leads.description || []}
              onChange={(event, newValue) => {
                handleSelectChange("description", newValue);
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
                <CustomTextField
                  {...params}
                  label="Description"
                  placeholder="Description"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              type="date"
              name="target_date"
              size="small"
              label="Target Date"
              variant="outlined"
              value={leads.target_date || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {/* company Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Company Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              multiline
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={leads.company || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="gst_number"
              size="small"
              label="Gst Number"
              variant="outlined"
              value={leads.gst_number || ""}
              onChange={handleInputChange}
              error={leads.gst_number && !GST_NO(leads.gst_number)}
              helperText={
                leads.gst_number &&
                !GST_NO(leads.gst_number) &&
                "Invalid GST Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={leads.pan_number || ""}
              onChange={handleInputChange}
              error={leads.pan_number && !PAN_NO(leads.pan_number)}
              helperText={
                leads.pan_number &&
                !PAN_NO(leads.pan_number) &&
                "Invalid PAN Number"
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={leads.address || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="country"
              size="small"
              label="Country"
              variant="outlined"
              value={leads.country || null}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="State"
              variant="outlined"
              value={leads.state || null}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={leads.city || null}
              InputLabelProps={{ shrink: true }}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              sx={{ minWidth: "170px" }}
              name="pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={leads.pincode}
              onChange={handleInputChange}
            />
            <Button
              size="small"
              onClick={validatePinCode}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>

          {/* Craete Shipping Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Shipping Details" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleSameAsAddress}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Same as Billing Address"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                checked === true
                  ? leads.address || ""
                  : leads.shipping_address || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="shipping_pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={
                checked === true
                  ? leads.pincode || ""
                  : leads.shipping_pincode || ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                checked === true ? leads.city || "" : leads.shipping_city || ""
              }
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              sx={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleSelectChange("shipping_state", value)
              }
              name="shipping_state"
              value={checked ? leads.state || "" : leads.shipping_state || ""}
              options={Option.StateOption.map((option) => option.value)}
              getOptionLabel={(option) => option}
              label="Shipping State"
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
                  value={leads.origin_type || ""}
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
            <>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Type of Customer
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={leads.type_of_customer || ""}
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
            </>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="website"
              size="small"
              label="Website"
              variant="outlined"
              value={leads.website || ""}
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
              value={leads.estd_year || ""}
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
              value={leads.approx_annual_turnover || ""}
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
              value={leads.name || ""}
            />
          </Grid>
          {leads.type_of_customer === "Industrial Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                sx={{
                  minWidth: 220,
                }}
                size="small"
                onChange={(event, value) =>
                  handleSelectChange("industrial_list", value)
                }
                value={leads.industrial_list || ""}
                options={Option.IndustriesList.map((option) => option.label)}
                getOptionLabel={(option) => option}
                label="Industrial List"
              />
            </Grid>
          )}
          {leads.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                sx={{
                  minWidth: 220,
                }}
                size="small"
                onChange={(event, value) =>
                  handleSelectChange("distribution_type", value)
                }
                value={leads.distribution_type || ""}
                options={Option.DistributionTypeOption.map(
                  (option) => option.label
                )}
                getOptionLabel={(option) => option}
                label="Distribution Type"
              />
            </Grid>
          )}
          {leads.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                value={leads.category || []}
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
          {leads.type_of_customer === "Distribution Customer" && (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                value={leads.main_distribution || []}
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
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2, textAlign: "right" }}
        >
          Submit
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="Query Product Name"
            variant="outlined"
            value={leads.query_product_name || ""}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            multiline
            size="small"
            label="Query Meassage"
            variant="outlined"
            value={leads.query_message || ""}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LeadActivity
            getLeadByID={getLeadsData}
            followup={followup}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LeadPotentialView
            getLeadByID={getLeadsData}
            potential={potential}
            leadsByID={leadsByID}
          />
        </Grid>
      </Grid>
    </>
  );
});

const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
