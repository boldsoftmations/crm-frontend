import React, { useState, useRef } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
export const UpdateBankInventoryDetails = (props) => {
  const { setOpenPopup, getAllVendorDetailsByID, idForEdit, vendorData } =
    props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(idForEdit);
  const [bankData, setBankData] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const data = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });

    if (name === "ifsc_code") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        validateifsc(value);
      }, 500);
    }
  };

  const validateifsc = async (ifsc) => {
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      setBankData(response.data);
      setErrMsg("");
    } catch (error) {
      console.log("Creating Bank error ", error);
      if (error.response.status === 404) {
        setErrMsg("please enter valid ifsc code.");
      }
    }
  };

  const updateBankDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const accountNumberKey =
        vendorData.type === "International"
          ? "int_ca_no"
          : "current_account_no";

      const req = {
        vendor: data ? data.vendorName : "",
        // Use the determined account number key
        [accountNumberKey]:
          inputValue[accountNumberKey] || inputValue.current_account_no,
        ifsc_code: inputValue.ifsc_code ? inputValue.ifsc_code : "",
        bank_name:
          vendorData.type === "Domestic"
            ? bankData.BANK
              ? bankData.BANK
              : inputValue.bank_name
            : inputValue.bank_name,
        address:
          vendorData.type === "Domestic"
            ? bankData.ADDRESS
              ? bankData.ADDRESS
              : inputValue.address
            : inputValue.address,
        state:
          vendorData.type === "Domestic"
            ? bankData.STATE
              ? bankData.STATE
              : inputValue.state
            : inputValue.state,
        district:
          vendorData.type === "Domestic"
            ? bankData.DISTRICT
              ? bankData.DISTRICT
              : inputValue.district
            : inputValue.district,
        city:
          vendorData.type === "Domestic"
            ? bankData.CITY
              ? bankData.CITY
              : inputValue.city
            : inputValue.city,
        branch:
          vendorData.type === "Domestic"
            ? bankData.BRANCH
              ? bankData.BRANCH
              : inputValue.branch
            : inputValue.branch,
      };
      await InventoryServices.updateBankInventoryData(idForEdit.id, req);
      setOpenPopup(false);
      getAllVendorDetailsByID();
      setOpen(false);
    } catch (error) {
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => updateBankDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {vendorData.type === "Domestic" ? (
              <CustomTextField
                fullWidth
                name="ifsc_code"
                size="small"
                label="IFSC Code"
                variant="outlined"
                value={inputValue.ifsc_code ? inputValue.ifsc_code : ""}
                onChange={handleInputChange}
                onBlur={handleInputChange}
                error={errMsg && errMsg}
                helperText={errMsg && errMsg}
              />
            ) : (
              <CustomTextField
                fullWidth
                name="ifsc_code"
                size="small"
                label="Swift Code"
                variant="outlined"
                value={inputValue.ifsc_code ? inputValue.ifsc_code : ""}
                onChange={handleInputChange}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name={
                vendorData.type === "International"
                  ? "int_ca_no"
                  : "current_account_no"
              }
              label="Account No"
              variant="outlined"
              value={
                vendorData.type === "International"
                  ? inputValue.int_ca_no
                    ? inputValue.int_ca_no
                    : ""
                  : inputValue.current_account_no
                  ? inputValue.current_account_no
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={
                vendorData.type === "Domestic"
                  ? bankData.BANK
                    ? bankData.BANK
                    : inputValue.bank_name
                  : inputValue.bank_name
                  ? inputValue.bank_name
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="branch"
              label="Branch"
              variant="outlined"
              value={
                vendorData.type === "Domestic"
                  ? bankData.BRANCH
                    ? bankData.BRANCH
                    : inputValue.branch
                  : inputValue.branch
                  ? inputValue.branch
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="district"
              label="District"
              variant="outlined"
              value={
                vendorData.type === "Domestic"
                  ? bankData.DISTRICT
                    ? bankData.DISTRICT
                    : inputValue.district
                  : inputValue.district
                  ? inputValue.district
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={
                vendorData.type === "Domestic"
                  ? bankData.CITY
                    ? bankData.CITY
                    : inputValue.city
                  : inputValue.city
                  ? inputValue.city
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={
                vendorData.type === "Domestic"
                  ? bankData.STATE
                    ? bankData.STATE
                    : inputValue.state
                  : inputValue.state
                  ? inputValue.state
                  : ""
              }
              onChange={handleInputChange}
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
              value={
                vendorData.type === "Domestic"
                  ? bankData.ADDRESS
                    ? bankData.ADDRESS
                    : inputValue.address
                  : inputValue.address
                  ? inputValue.address
                  : ""
              }
              onChange={handleInputChange}
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
