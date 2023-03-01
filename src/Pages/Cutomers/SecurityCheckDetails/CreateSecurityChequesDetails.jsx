import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";

export const CreateSecurityChequesDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const createSecurityChequeDetails = async (e) => {
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
      await CustomerServices.createSecurityChequeData(req);
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

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createSecurityChequeDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={inputValue.bank_name}
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
              value={inputValue.cheque_no}
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
              value={inputValue.micr_code}
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
              value={inputValue.address}
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
