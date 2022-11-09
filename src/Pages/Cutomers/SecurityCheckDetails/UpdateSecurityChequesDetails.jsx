import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";

export const UpdateSecurityChequesDetails = (props) => {
  const { IDForEdit, getSecurityChequeDetailsByID, setOpenPopup } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getSecurityChequeDataByID();
  }, []);

  const getSecurityChequeDataByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getSecurityChequeDataById(
        IDForEdit
      );
      console.log("response update warehouse", response);
      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const UpdateSecurityChequeDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        bank_name: inputValue.bank_name,
        address: inputValue.address,
        micr_code: inputValue.micr_code,
        cheque_no: inputValue.cheque_no,
      };
      await CustomerServices.updateSecurityChequeData(IDForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getSecurityChequeDetailsByID();
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateSecurityChequeDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={inputValue.bank_name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth
              name="cheque_no"
              size="small"
              label="Cheque No."
              variant="outlined"
              value={inputValue.cheque_no || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="micr_code"
              label="MICR"
              variant="outlined"
              value={inputValue.micr_code || ""}
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
              value={inputValue.address || ""}
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
