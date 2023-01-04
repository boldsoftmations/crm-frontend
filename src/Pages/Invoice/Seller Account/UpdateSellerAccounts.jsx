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
import InvoiceServices from "./../../../services/InvoiceService";

export const UpdateSellerAccounts = (props) => {
  const { setOpenPopup, getAllSellerAccountsDetails, idForEdit } = props;
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
      const response = await InvoiceServices.getSellerAccountDataById(
        idForEdit
      );
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
        name: inputValue.name,
        current_account_no: inputValue.current_account_no,
        address: inputValue.address,
        gst_number: inputValue.gst_number,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
        state_code: inputValue.state_code,
        cin_number: inputValue.cin_number,
        email: inputValue.email,
        pan_number: inputValue.pan_number,
        ifsc_code: inputValue.ifsc_code ? inputValue.ifsc_code : "",
        bank_name: bankData.BANK ? bankData.BANK : inputValue.bank_name,
        branch: bankData.BRANCH ? bankData.BRANCH : inputValue.branch,
      };
      await InvoiceServices.updateSellerAccountData(idForEdit, req);
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
              name="name"
              label="Company Name"
              variant="outlined"
              value={inputValue.name ? inputValue.name : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
            <TextField
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
          <Grid item xs={12}>
            <TextField
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

          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state ? inputValue.state : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city ? inputValue.city : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="state_code"
              size="small"
              label="State Code"
              variant="outlined"
              value={inputValue.state_code ? inputValue.state_code : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="cin_number"
              size="small"
              label="CIN Number"
              variant="outlined"
              value={inputValue.cin_number ? inputValue.cin_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="email"
              size="small"
              label="Email"
              variant="outlined"
              value={inputValue.email ? inputValue.email : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              multiline
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={inputValue.pan_number ? inputValue.pan_number : ""}
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
          <Grid item xs={12} sm={6}>
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
