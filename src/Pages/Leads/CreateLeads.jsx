import React, { memo, useCallback, useEffect, useState } from "react";
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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { CustomLoader } from "./../../Components/CustomLoader";
import LeadServices from "../../services/LeadService";
import Option from "../../Options/Options";
import CustomTextField from "../../Components/CustomTextField";
import ProductService from "../../services/ProductService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { useSelector } from "react-redux";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import MasterService from "../../services/MasterService";

export const CreateLeads = memo((props) => {
  const {
    setOpenPopup,
    getleads,
    currentPage,
    filterQuery,
    filterSelectedQuery,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState({
    estd_year: new Date().getFullYear().toString(),
  });
  const [referenceData, setReferenceData] = useState([]);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [countryList, setCountryList] = useState([]);
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

  const validatePinCode = async () => {
    try {
      if (!leads.origin_type) {
        setAlertMsg({
          message:
            "Please select customer origin type before validating pincode",
          severity: "error",
          open: true,
        });
        return;
      }
      if (leads.origin_type === "International" && !leads.country) {
        setAlertMsg({
          message: "Please select country before validating pincode",
          severity: "error",
          open: true,
        });
        return;
      }
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

  const handleSelectChange = async (name, value) => {
    setLeads({
      ...leads,
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

  const getReference = async () => {
    try {
      const res = await LeadServices.getAllRefernces();

      setReferenceData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getDescriptionNoData();
    getReference();
  }, []);

  const createLeadsData = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);

        const data = {
          name: leads.name,
          alternate_contact_name: leads.alternate_contact_name,
          email: leads.email,
          alternate_email: leads.alternate_email,
          contact: leads.contact || null,
          alternate_contact: leads.alternate_contact || null,
          business_type: leads.business_type,
          description: leads.description || [],
          assigned_to: leads.assigned_to,
          references: leads.references,
          company: leads.company,
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
          estd_year: leads.estd_year,
          purchase_decision_maker: leads.purchase_decision_maker,
        };

        const response = await LeadServices.createLeads(data);
        // Set success message
        const successMessage =
          response.data.message || "Leads Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getleads(currentPage, filterQuery, filterSelectedQuery, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [leads, currentPage, filterQuery, filterSelectedQuery, searchQuery]
  );

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
      {/* Snackbar to display the error or success message */}

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createLeadsData(e)}
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
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Name"
              variant="outlined"
              value={leads.name ? leads.name : ""}
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
              value={leads.alternate_contact_name}
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
              value={leads.email}
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
              value={leads.alternate_email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <PhoneInput
              specialLabel="Contact"
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
                Busniess Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Busniess Type"
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
            <CustomAutocomplete
              style={{
                minWidth: 220,
              }}
              size="small"
              onChange={(event, value) =>
                handleSelectChange("references", value)
              }
              options={referenceData.map((option) => option.source)}
              getOptionLabel={(option) => `${option}`}
              label="Reference"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) =>
                handleSelectChange("assigned_to", value)
              }
              options={assigned.map((option) => option.email) || []}
              getOptionLabel={(option) => option}
              // sx={{ minWidth: 300 }}
              label="Assignied To"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              value={leads.description}
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

          {/* company Details */}
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="Company Details" />
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
          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="company"
              size="small"
              label="Company"
              variant="outlined"
              value={leads.company}
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
              value={leads.gst_number}
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
              value={leads.pan_number}
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
              value={leads.address}
              onChange={handleInputChange}
            />
          </Grid>

          {leads.origin_type === "International" ? (
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                sx={{ minWidth: 220 }}
                size="small"
                onChange={(event, value) => {
                  handleSelectChange("country", value);
                }}
                value={leads.country || ""}
                options={
                  countryList && countryList.map((option) => option.name)
                }
                label="Country"
              />
            </Grid>
          ) : (
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                size="small"
                label="Country"
                name="country"
                variant="outlined"
                value={leads.country || ""}
                disabled
              />
            </Grid>
          )}
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
                checked === true ? leads.address : leads.shipping_address || ""
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
                checked === true ? leads.pincode : leads.shipping_pincode || ""
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
              value={checked === true ? leads.city : leads.shipping_city || ""}
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
              value={checked ? leads.state : leads.shipping_state || ""}
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
                  value={leads.type_of_customer}
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
              value={leads.website}
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
              value={leads.approx_annual_turnover}
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
                value={leads ? leads.distribution_type : ""}
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
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, textAlign: "right" }}
        >
          Submit
        </Button>
      </Box>
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
