import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const CreateBankDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const data = useSelector((state) => state.auth);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  console.log("inputValue :>> ", inputValue);
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
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        current_account_no: inputValue.current_account_no,
        ifsc_code: inputValue.ifsc_code,
        bank_name: bankData.BANK,
        address: bankData.ADDRESS,
        state: bankData.STATE,
        district: bankData.DISTRICT,
        city: bankData.CITY,
        branch: bankData.BRANCH,
        micr_code: bankData.MICR,
      };
      await CustomerServices.createBankData(req);
      setOpenPopup(false);
      setOpen(false);
      getAllCompanyDetailsByID();
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={(e) => createBankDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <CustomTextField
              sx={{ minWidth: "400px" }}
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

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={bankData.BANK ? bankData.BANK : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="branch"
              label="Branch"
              variant="outlined"
              value={bankData.BRANCH ? bankData.BRANCH : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="micr_code"
              label="MICR"
              variant="outlined"
              value={bankData.MICR ? bankData.MICR : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="district"
              label="District"
              variant="outlined"
              value={bankData.DISTRICT ? bankData.DISTRICT : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={bankData.CITY ? bankData.CITY : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={bankData.STATE ? bankData.STATE : ""}
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
              value={bankData.ADDRESS ? bankData.ADDRESS : ""}
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
