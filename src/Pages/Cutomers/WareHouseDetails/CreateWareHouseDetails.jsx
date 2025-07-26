import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CreateWareHouseDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID, contactData } = props;
  const [open, setOpen] = useState(false);
  const [selectedcontact, setSelectedContact] = useState("");
  const [validCheck, setValidCheck] = useState(true);
  const data = useSelector((state) => state.auth);

  const [inputValue, setInputValue] = useState({
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
    setValidCheck(false);
  };
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const validatePinCode = async () => {
    try {
      setOpen(true);
      const PINCODE = inputValue.pincode;
      if (!PINCODE || PINCODE.trim().length < 2) {
        setInputValue({
          ...inputValue,
          state: "",
          city: "",
        });
        setAlertMsg({
          message: "Pin code is not valid",
          severity: "warning",
          open: true,
        });
        return;
      }
      const response = await MasterService.getCountryDataByPincode(
        "India",
        PINCODE
      );
      if (response.data.length === 0) {
        setAlertMsg({
          message:
            "This Pin Code does not exist ! First Create the Pin code in the master country",
          severity: "warning",
          open: true,
        });
        setInputValue({
          ...inputValue,
          state: "",
          city: "",
        });
      } else {
        setAlertMsg({
          message: "Pin code is valid",
          severity: "success",
          open: true,
        });

        setInputValue({
          ...inputValue,
          state: response.data[0].state,
          city: response.data[0].city_name,
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
  const createWareHouseDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedcontact.id,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
      };
      await CustomerServices.createWareHouseData(req);
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
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Box
        component="form"
        noValidate
        onSubmit={(e) => createWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomAutocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setSelectedContact(value)}
              options={contactData.map((option) => option)}
              groupBy={(option) => option.designation}
              getOptionLabel={(option) => `${option.name} ${option.contact}`}
              renderInput={(params) => (
                <CustomTextField {...params} label="Contact" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              onChange={handleInputChange}
              size="small"
              name="address"
              label="Address"
              variant="outlined"
              value={inputValue.address}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <CustomTextField
              sx={{ minWidth: "300px" }}
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              value={inputValue.pincode}
            />
            <Button
              onClick={validatePinCode}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
              disabled={validCheck}
            >
              Validate
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state || ""}
              onChange={handleInputChange}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={inputValue.city || ""}
              onChange={handleInputChange}
              disabled
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
