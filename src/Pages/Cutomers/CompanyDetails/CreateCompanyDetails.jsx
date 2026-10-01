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
  TextField,
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

  const [inputValue, setInputValue] = useState({});

  const [countryList, setCountryList] = useState([]);
  const [idForEdit, setIdForEdit] = useState("");
  const [assigned, setAssigned] = useState([]);

  const [postalVerificationStatus, setPostalVerificationStatus] = useState("");

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const dispatch = useDispatch();

  const handleClose = () => {
    setAlertMsg({
      message: "",
      severity: "",
      open: false,
    });
  };

  useEffect(() => {
    getCountries();
    getAssignedData();
  }, []);

  const getCountries = async () => {
    try {
      setOpen(true);

      const response = await MasterService.getAllMasterCountries("all");

      const countries = response.data || [];

      const india = countries.find((data) => data.name === "India");

      const internationalCountries = countries.filter(
        (data) => data.name !== "India",
      );

      setCountryList(internationalCountries);

      /*
       * Set India as the default Country Master object.
       * This allows Domestic also to use country.id with lookup API.
       */
      if (india) {
        setInputValue((prev) => ({
          ...prev,
          country: india,
        }));
      }
    } catch (error) {
      console.log("Error getting country data", error);
    } finally {
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedValue =
      name === "gst_number" || name === "pan_number"
        ? value.toUpperCase()
        : value;

    /*
     * If postal code changes, previous postal verification
     * is no longer valid.
     */
    if (name === "pincode") {
      setInputValue({
        ...inputValue,
        pincode: updatedValue,
        pin_code: "",
        state: "",
        city: "",
        zone: "",
      });

      setPostalVerificationStatus("");

      return;
    }

    setInputValue({
      ...inputValue,
      [name]: updatedValue,
    });
  };

  const handleSelectChange = async (name, value) => {
    /*
     * Customer origin type changed.
     */
    if (name === "origin_type") {
      if (value === "Domestic") {
        try {
          setOpen(true);

          const response = await MasterService.getAllMasterCountries("all");

          const countries = response.data || [];

          const india = countries.find((data) => data.name === "India");

          setInputValue({
            ...inputValue,
            origin_type: "Domestic",
            country: india || null,
            pincode: "",
            pin_code: "",
            state: "",
            city: "",
            zone: "",
          });

          setPostalVerificationStatus("");

          setCountryList(countries.filter((data) => data.name !== "India"));
        } catch (error) {
          console.log("Error getting India country data", error);
        } finally {
          setOpen(false);
        }

        return;
      }

      if (value === "International") {
        try {
          setOpen(true);

          const response = await MasterService.getAllMasterCountries("all");

          const countries = response.data || [];

          const internationalCountries = countries.filter(
            (data) => data.name !== "India",
          );

          setCountryList(internationalCountries);

          setInputValue({
            ...inputValue,
            origin_type: "International",
            country: null,
            pincode: "",
            pin_code: "",
            state: "",
            city: "",
            zone: "",
          });

          setPostalVerificationStatus("");
        } catch (error) {
          console.log("Error getting international country data", error);
        } finally {
          setOpen(false);
        }

        return;
      }
    }

    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  /*
   * Postal Code Lookup API
   *
   * This is NOT the old ValidatePincode API.
   * It uses:
   * country_id + postal_code
   */
  const validatePostalCode = async () => {
    try {
      setOpen(true);

      if (!inputValue.pincode) {
        setAlertMsg({
          message: "Please enter postal code before validation",
          severity: "error",
          open: true,
        });

        return;
      }

      const countryId =
        inputValue.country && inputValue.country.id
          ? inputValue.country.id
          : "";

      if (!countryId) {
        setAlertMsg({
          message: "Please select country before validating postal code",
          severity: "error",
          open: true,
        });

        return;
      }

      const postalCode = inputValue.pincode;

      console.log("Postal Code Lookup:", {
        country_id: countryId,
        postal_code: postalCode,
      });

      const response = await MasterService.ValidatePincode(
        countryId,
        postalCode,
      );

      /*
       * Lookup did not find a valid Postal Master record.
       */
      if (!response.data || !response.data.id) {
        setPostalVerificationStatus("No Match");

        setInputValue({
          ...inputValue,
          pin_code: "",
          state: "",
          city: "",
          zone: "",
        });

        setAlertMsg({
          message: "This postal code does not exist in the Postal Code Master",
          severity: "error",
          open: true,
        });

        return;
      }

      /*
       * Exact canonical Postal Master record found.
       */
      setPostalVerificationStatus("Verified");

      setInputValue({
        ...inputValue,
        pin_code: response.data.id,
        state: response.data.state_name,
        city: response.data.city_name,
        zone: response.data.zone_name,
      });

      setAlertMsg({
        message: "Postal code validated successfully",
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.log("Postal code lookup error", error);

      setPostalVerificationStatus("Needs Review");

      setInputValue({
        ...inputValue,
        pin_code: "",
        state: "",
        city: "",
        zone: "",
      });

      setAlertMsg({
        message: "Error validating postal code",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const getAssignedData = async () => {
    try {
      setOpen(true);

      const res = await LeadServices.getAllAssignedUser();

      setAssigned(res.data || []);
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };

  const GST_NO = (gst_no) =>
    /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/.test(
      gst_no,
    );

  const PAN_NO = (pan_no) =>
    /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(pan_no);

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();

      /*
       * First check postal verification.
       */
      if (!inputValue.pin_code) {
        setAlertMsg({
          message:
            "Please validate the postal code before creating the customer",
          severity: "error",
          open: true,
        });

        return;
      }

      if (
        !inputValue.name ||
        !inputValue.business_type ||
        !inputValue.pincode ||
        !inputValue.type_of_customer ||
        !inputValue.origin_type ||
        !inputValue.city ||
        !inputValue.state ||
        !inputValue.address ||
        (inputValue.type_of_customer === "Industrial Customer" &&
          !inputValue.industrial_list) ||
        (inputValue.type_of_customer === "Distribution Customer" &&
          !inputValue.distribution_type) ||
        (inputValue.type_of_customer === "Distribution Customer" &&
          (!inputValue.category || inputValue.category.length === 0))
      ) {
        setAlertMsg({
          message: "Please fill all the required fields",
          severity: "error",
          open: true,
        });

        return;
      }

      /*
       * Additional GST/PAN validation.
       */
      if (inputValue.gst_number && !GST_NO(inputValue.gst_number)) {
        setAlertMsg({
          message: "Please enter a valid GST Number",
          severity: "error",
          open: true,
        });

        return;
      }

      if (inputValue.pan_number && !PAN_NO(inputValue.pan_number)) {
        setAlertMsg({
          message: "Please enter a valid PAN Number",
          severity: "error",
          open: true,
        });

        return;
      }

      setOpen(true);

      const req = {
        name: inputValue.name,
        address: inputValue.address,

        /*
         * Raw entered postal code.
         */
        pincode: inputValue.pincode,

        /*
         * Country name for existing backend contract.
         */
        country:
          inputValue.country && inputValue.country.name
            ? inputValue.country.name
            : "",

        state: inputValue.state,
        zone: inputValue.zone,
        city: inputValue.city,

        /*
         * Canonical Postal Master ID.
         */
        pin_code: inputValue.pin_code,

        gst_number: inputValue.gst_number || null,
        pan_number: inputValue.pan_number || null,
        business_type: inputValue.business_type,
        assigned_to: inputValue.assigned_to || [],
        type_of_customer: inputValue.type_of_customer,
        website: inputValue.website || "",
        estd_year: inputValue.estd_year || "",
        approx_annual_turnover: inputValue.approx_annual_turnover || "",
        purchase_decision_maker: inputValue.purchase_decision_maker || null,
        industrial_list: inputValue.industrial_list || null,
        distribution_type: inputValue.distribution_type || null,
        category: inputValue.category || [],
        main_distribution: inputValue.main_distribution || [],
        origin_type: inputValue.origin_type || null,
      };

      console.log("Create Company Payload:", req);

      const response = await CustomerServices.createCompanyData(req);

      setIdForEdit(response.data.company_id);

      getAllCompanyDetailsByID(response.data.company_id);

      setAlertMsg({
        message: "Company created successfully",
        severity: "success",
        open: true,
      });

      setTimeout(() => {
        setOpenPopup2(true);
      }, 700);
    } catch (error) {
      console.log("creating company detail error", error);

      setAlertMsg({
        message: "Error creating company",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const getAllCompanyDetailsByID = async (COMPANY_ID) => {
    try {
      setOpen(true);

      const response = await CustomerServices.getCompanyDataById(COMPANY_ID);

      dispatch(getCompanyName(response.data.name));
    } catch (err) {
      console.log("company data by id error", err);
    } finally {
      setOpen(false);
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
              value={inputValue.name || ""}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="business-type-label">Business Type</InputLabel>

              <Select
                labelId="business-type-label"
                id="business-type"
                label="Business Type"
                value={inputValue.business_type || ""}
                onChange={(e) =>
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

          {/* Postal Code */}

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CustomTextField
                fullWidth
                name="pincode"
                size="small"
                label="Postal Code"
                variant="outlined"
                value={inputValue.pincode || ""}
                onChange={handleInputChange}
                required
              />

              <Button
                type="button"
                onClick={validatePostalCode}
                variant="contained"
                sx={{ marginLeft: "1rem", whiteSpace: "nowrap" }}
              >
                Validate
              </Button>
            </Box>

            {postalVerificationStatus === "Verified" && (
              <Chip
                label="Verified"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}

            {postalVerificationStatus === "No Match" && (
              <Chip
                label="No Match"
                color="error"
                size="small"
                sx={{ mt: 1 }}
              />
            )}

            {postalVerificationStatus === "Needs Review" && (
              <Chip
                label="Needs Review"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Grid>

          {/* Country */}

          {inputValue.origin_type === "International" ? (
            <Grid item xs={12} sm={3}>
              <CustomAutocomplete
                size="small"
                options={countryList || []}
                value={inputValue.country || null}
                getOptionLabel={(option) =>
                  option && option.name ? option.name : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => {
                  setInputValue({
                    ...inputValue,
                    country: value,
                    pincode: "",
                    pin_code: "",
                    state: "",
                    city: "",
                    zone: "",
                  });

                  setPostalVerificationStatus("");
                }}
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
                value={
                  inputValue.country && inputValue.country.name
                    ? inputValue.country.name
                    : ""
                }
                disabled
                required
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
              required
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
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="gst_number"
              label="GST No."
              variant="outlined"
              value={inputValue.gst_number || ""}
              onChange={handleInputChange}
              error={
                inputValue.gst_number ? !GST_NO(inputValue.gst_number) : false
              }
              helperText={
                inputValue.gst_number && !GST_NO(inputValue.gst_number)
                  ? "Invalid GST Number"
                  : ""
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="pan_number"
              label="PAN No."
              variant="outlined"
              value={inputValue.pan_number || ""}
              onChange={handleInputChange}
              error={
                inputValue.pan_number ? !PAN_NO(inputValue.pan_number) : false
              }
              helperText={
                inputValue.pan_number && !PAN_NO(inputValue.pan_number)
                  ? "Invalid PAN Number"
                  : ""
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
              id="assigned-to"
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
              value={inputValue.address || ""}
              onChange={handleInputChange}
              required
            />
          </Grid>

          {/* KYC Details */}

          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="KYC Details" />
              </Divider>
            </Root>
          </Grid>

          <Grid item xs={12}>
            <FormControl required>
              <FormLabel id="origin-type-label">Customer Type</FormLabel>

              <RadioGroup
                row
                aria-labelledby="origin-type-label"
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
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl required>
              <FormLabel id="customer-type-label">Type of Customer</FormLabel>

              <RadioGroup
                row
                aria-labelledby="customer-type-label"
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
              value={inputValue.website || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={3}>
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

          <Grid item xs={12} sm={3}>
            <CustomTextField
              fullWidth
              name="purchase_decision_maker"
              size="small"
              label="Purchase Decision Maker"
              variant="outlined"
              value={inputValue.purchase_decision_maker || ""}
              onChange={handleInputChange}
              required
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
                randerInput={(params) => (
                  <TextField
                    {...params}
                    label="Industrial List"
                    variant="outlined"
                    required
                  />
                )}
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
                  (option) => option.label,
                )}
                label="Distribution Type"
                randerInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Distribution Type"
                    variant="outlined"
                  />
                )}
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
                id="category"
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
                id="main-distribution"
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
