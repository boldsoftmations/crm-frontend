import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";

export const UpdateBankDetails = (props) => {
  const { setOpenPopup, getAllBankDetailsByID, idForEdit } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const data = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getAllBankDetailByID();
  }, [idForEdit]);

  const getAllBankDetailByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getBankDataById(idForEdit);
      console.log("response", response);

      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
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

  const updateBankDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        current_account_no: inputValue.current_account_no,
        ifsc_code: inputValue.ifsc_code,
        bank_name: bankData.BANK ? bankData.BANK : inputValue.bank_name,
        address: bankData.ADDRESS ? bankData.ADDRESS : inputValue.address,
        state: bankData.STATE ? bankData.STATE : inputValue.state,
        district: bankData.DISTRICT ? bankData.DISTRICT : inputValue.district,
        city: bankData.CITY ? bankData.CITY : inputValue.city,
        branch: bankData.BRANCH ? bankData.BRANCH : inputValue.branch,
        micr_code: bankData.MICR ? bankData.MICR : inputValue.micr_code,
      };
      await CustomerServices.updateBankData(idForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllBankDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Box component="form" noValidate onSubmit={(e) => updateBankDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="current_account_no"
              label="Account No"
              variant="outlined"
              value={
                inputValue.current_account_no
                  ? inputValue.current_account_no
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ minWidth: "400px" }}
              name="ifsc_code"
              size="small"
              label="IFSC Code"
              variant="outlined"
              value={inputValue.ifsc_code ? inputValue.ifsc_code : ""}
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={bankData.BANK ? bankData.BANK : inputValue.bank_name}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="branch"
              label="Branch"
              variant="outlined"
              value={bankData.BRANCH ? bankData.BRANCH : inputValue.branch}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="micr"
              label="MICR"
              variant="outlined"
              value={bankData.MICR ? bankData.MICR : inputValue.micr_code}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="district"
              label="District"
              variant="outlined"
              value={
                bankData.DISTRICT ? bankData.DISTRICT : inputValue.district
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={bankData.CITY ? bankData.CITY : inputValue.city}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={bankData.STATE ? bankData.STATE : inputValue.state}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={bankData.ADDRESS ? bankData.ADDRESS : inputValue.address}
              InputLabelProps={{
                shrink: true,
              }}
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
