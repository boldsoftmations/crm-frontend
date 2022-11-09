import React, { useState, useEffect } from "react";
import MuiPhoneNumber from "material-ui-phone-number";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";

export const UpdateContactDetails = (props) => {
  const { setOpenPopup, getAllContactDetailsByID, IDForEdit } = props;
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState("");
  const [inputValue, setInputValue] = useState([]);
  const [phone, setPhone] = useState();
  const [phone2, setPhone2] = useState();

  const handlePhoneChange = (value) => {
    if (value) {
      setPhone({ phone: value });
    }
  };

  const handlePhoneChange2 = (value) => {
    if (value) {
      setPhone2({ phone2: value });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getAllContactDataByID();
  }, []);

  const getAllContactDataByID = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getContactDataById(IDForEdit);
      setInputValue(response.data);
      setPhone({ phone: response.data.contact });
      setPhone2({ phone2: response.data.alternate_contact });
      setDesignation(response.data.designation);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const UpdateContactDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        name: inputValue.name ? inputValue.name : "",
        company: inputValue.company ? inputValue.company : "",
        designation: designation ? designation : "",
        email: inputValue.email ? inputValue.email : "",
        alternate_email: inputValue.alternate_email
          ? inputValue.alternate_email
          : "",
        contact: phone ? phone.phone : "",
        alternate_contact: phone2 ? phone2.phone2 : "",
        pan_number: inputValue.pan_number ? inputValue.pan_number : "",
        aadhaar: inputValue.aadhaar ? inputValue.aadhaar : null,
      };
      await CustomerServices.updateContactData(IDForEdit, req);
      setOpenPopup(false);
      setOpen(false);
      getAllContactDetailsByID();
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
        onSubmit={(e) => UpdateContactDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="name"
              label="Name"
              variant="outlined"
              value={inputValue.name ? inputValue.name : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Designation</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={designation ? designation : designation}
                label="Designation"
                onChange={(event) => setDesignation(event.target.value)}
              >
                <MenuItem value={"owner"}>Owner </MenuItem>
                <MenuItem value={"partner"}>Partner</MenuItem>
                <MenuItem value={"director"}>Director</MenuItem>
                <MenuItem value={"accounts"}>Accounts</MenuItem>
                <MenuItem value={"purchase"}>Purchase</MenuItem>
                <MenuItem value={"quality"}>Quality</MenuItem>
                <MenuItem value={"stores"}>Stores</MenuItem>
              </Select>
              {/* <FormHelperText>
                Applicable Only For Distribution Customer
              </FormHelperText> */}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <MuiPhoneNumber
              name="phone"
              size="small"
              fullWidth
              variant="outlined"
              label="Phone Number"
              data-cy="user-phone"
              defaultCountry={"in"}
              value={phone ? phone.phone : ""}
              onChange={handlePhoneChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiPhoneNumber
              size="small"
              fullWidth
              name="phone"
              variant="outlined"
              label="Phone Number"
              data-cy="user-phone"
              defaultCountry={"in"}
              value={phone2 ? phone2.phone2 : ""}
              onChange={handlePhoneChange2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="email"
              label="Email"
              variant="outlined"
              value={inputValue.email ? inputValue.email : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="email"
              label="Alt Email"
              variant="outlined"
              value={
                inputValue.alternate_email ? inputValue.alternate_email : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {designation === "director" ||
            designation === "owner" ||
            designation === "partner" ? (
              <TextField
                fullWidth
                disabled={
                  designation !== "director" &&
                  designation !== "owner" &&
                  designation !== "partner"
                }
                onChange={handleInputChange}
                size="small"
                name="pan_number"
                label="Pan No."
                variant="outlined"
                value={inputValue.pan_number ? inputValue.pan_number : ""}
                helperText={
                  "Applicable Only if designation is Owner/Partner/Director"
                }
              />
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            {designation === "director" ||
            designation === "owner" ||
            designation === "partner" ? (
              <TextField
                fullWidth
                disabled={
                  designation !== "director" &&
                  designation !== "owner" &&
                  designation !== "partner"
                }
                onChange={handleInputChange}
                size="small"
                name="aadhar_no"
                label="Aadhar No."
                variant="outlined"
                value={inputValue.aadhaar ? inputValue.aadhaar : ""}
                helperText={
                  "Applicable Only if designation is Owner/Partner/Director"
                }
              />
            ) : null}
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
