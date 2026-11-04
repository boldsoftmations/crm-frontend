import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import InvoiceServices from "./../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import validatePincode from "../../../utility/validatePincode";
import {
  getCountryIdForOrigin,
  applyPostalLookupSuccess,
  clearPostalFields,
} from "../../../utility/postalAddressHelpers";

export const CreateSellerAccounts = (props) => {
  const { setOpenPopup, getAllSellerAccountsDetails } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    pincode: "",
    pin_code: "",
    state: "",
    city: "",
  });
  const [bankData, setBankData] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "pincode") {
      setInputValue((prev) => ({
        ...clearPostalFields(prev),
        pincode: value,
      }));
      return;
    }
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const validatePinCode = async () => {
    try {
      const countryId = getCountryIdForOrigin("Domestic");

      if (!inputValue.pincode) {
        setAlertMsg({
          message: "Please enter postal code before validation",
          severity: "error",
          open: true,
        });
        return;
      }

      setOpen(true);
      const data = await validatePincode(countryId, inputValue.pincode);
      setInputValue((prev) => applyPostalLookupSuccess(prev, data));
      setAlertMsg({
        message: "Postal code validated successfully",
        severity: "success",
        open: true,
      });
    } catch (error) {
      setInputValue((prev) => clearPostalFields(prev));
      setAlertMsg({
        message: error.message || "Error validating postal code",
        severity: "error",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };

  const validateifsc = async () => {
    try {
      setOpen(true);
      const ifsc = inputValue.ifsc_code;
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      setBankData(response.data);
      setErrMsg("");
      setOpen(false);
    } catch (error) {
      console.log("Creating Bank error ", error);
      setOpen(false);
      if (error.response.status === 404) {
        setErrMsg("please enter valid ifsc code.");
      }
    }
  };

  const createBankDetails = async (e) => {
    try {
      e.preventDefault();

      if (!inputValue.pin_code || !inputValue.city || !inputValue.state) {
        setAlertMsg({
          message:
            "Please validate the postal code before creating the seller account",
          severity: "error",
          open: true,
        });
        return;
      }

      setOpen(true);
      const req = {
        name: inputValue.name,
        current_account_no: inputValue.current_account_no,
        address: inputValue.address,
        unit: inputValue.unit,
        gst_number: inputValue.gst_number,
        grn_prefix: inputValue.grn_prefix,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
        state_code: inputValue.state_code,
        cin_number: inputValue.cin_number,
        email: inputValue.email,
        pan_number: inputValue.pan_number,
        prefix: inputValue.prefix,
        suffix: inputValue.suffix,
        contact: `+91${inputValue.contact}`,
        ifsc_code: inputValue.ifsc_code,
        bank_name: bankData.BANK,
        branch: bankData.BRANCH,
      };
      await InvoiceServices.createSellerAccountData(req);
      setOpenPopup(false);
      setOpen(false);
      getAllSellerAccountsDetails();
    } catch (error) {
      console.log("createing company detail error", error);
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

      <Box component="form" noValidate onSubmit={(e) => createBankDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              multiline
              fullWidth
              size="small"
              name="name"
              label="Company Name"
              variant="outlined"
              value={inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="current_account_no"
              label="Account No"
              variant="outlined"
              value={inputValue.account_no}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              multiline
              fullWidth
              name="gst_number"
              size="small"
              label="Gst Number"
              variant="outlined"
              value={inputValue.gst_number ? inputValue.gst_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="grn_prefix"
              size="small"
              label="GRN Prefix"
              variant="outlined"
              value={inputValue.grn_prefix ? inputValue.grn_prefix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              multiline
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address ? inputValue.address : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={inputValue.unit ? inputValue.unit : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              sx={{ minWidth: "200px" }}
              name="pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
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
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state ? inputValue.state : ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city ? inputValue.city : ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="state_code"
              size="small"
              label="State Code"
              variant="outlined"
              value={inputValue.state_code ? inputValue.state_code : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="cin_number"
              size="small"
              label="CIN Number"
              variant="outlined"
              value={inputValue.cin_number ? inputValue.cin_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="email"
              size="small"
              label="Email"
              variant="outlined"
              value={inputValue.email ? inputValue.email : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={inputValue.pan_number ? inputValue.pan_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="prefix"
              size="small"
              label="Prefix"
              variant="outlined"
              value={inputValue.prefix ? inputValue.prefix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="suffix"
              size="small"
              label="Suffix"
              variant="outlined"
              value={inputValue.suffix ? inputValue.suffix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              type={"number"}
              fullWidth
              name="contact"
              size="small"
              label="Contact"
              variant="outlined"
              value={inputValue.contact}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              sx={{ minWidth: "200px" }}
              name="ifsc_code"
              size="small"
              label="IFSC Code"
              variant="outlined"
              value={inputValue.ifsc_code}
              onChange={handleInputChange}
              error={errMsg && errMsg}
              helperText={errMsg && errMsg}
            />
            <Button
              onClick={() => validateifsc()}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={bankData.BANK ? bankData.BANK : ""}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="branch"
              label="Branch"
              variant="outlined"
              value={bankData.BRANCH ? bankData.BRANCH : ""}
            />
          </Grid>
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
    </div>
  );
};
