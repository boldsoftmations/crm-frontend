import React, { useState,useEffect } from "react";
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
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
export const CreateContactDetails = (props) => {
  const { setOpenPopup, getAllContactDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [inputValue, setInputValue] = useState([]);
  const data = useSelector((state) => state.auth);
  const initialValues = { email: "", alternate_email: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  
  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);
  };

  const handlePhoneChange2 = (newPhone) => {
    setPhone2(newPhone);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setFormErrors(validate(formValues));
      let contact = phone.length === 12 ? `+${phone}` : phone;
      let contact2 = phone2.length === 12 ? `+${phone2}` : phone2;
      let panNumber =  inputValue.pan_no;
      const req = {
        company: data ? data.companyName : "",
        name: inputValue.name,
        designation: designation,
        contact: contact ? contact : "",
        alternate_contact: contact2 ? contact2 : "",
        email: formValues.email,
        alternate_email: formValues.alternate_email,
        pan_number: panNumber ,
        aadhaar: inputValue.aadhar_no,
      };
      setOpen(true);
 await CustomerServices.createContactData(req);

      setOpenPopup(false);
      setOpen(false);
      getAllContactDetailsByID();
    } catch (error) {
      console.log("error", error);
      setOpen(false);
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 ) {
      console.log(formValues);
    }
  }, [formErrors]);
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const adharnumberRegex = /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/i;
    const pannoregex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/i;
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.alternate_email) {
      errors.alternate_email = "Alternate Email is required!";
    } else if (!regex.test(values.alternate_email)) {
      errors.alternate_email = "This is not a valid alternate email format!";
    }
//  if (!pannoregex.test(values.pan_no)) {
//       errors.pan_no = "pan no is not valid";
//     }
//    if (!adharnumberRegex.test(values.aadhaar)) {
//       errors.aadhaar = "aadhaar is not valid";
//     }
    return errors;
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
      <Box component="form" noValidate onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="name"
              label="Name"
              variant="outlined"
              value={inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Designation</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={designation}
                label="Designation"
                onChange={(event) => setDesignation(event.target.value)}
              >
                <MenuItem value={"Owner"}>Owner </MenuItem>
                <MenuItem value={"Partner"}>Partner</MenuItem>
                <MenuItem value={"Director"}>Director</MenuItem>
                <MenuItem value={"Accounts"}>Accounts</MenuItem>
                <MenuItem value={"Purchase"}>Purchase</MenuItem>
                <MenuItem value={"Quality"}>Quality</MenuItem>
                <MenuItem value={"Stores"}>Stores</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <PhoneInput
              specialLabel="Contact"
              inputStyle={{
                height: "15px",
                width: "250px",
              }}
              country={"in"}
              onChange={handlePhoneChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneInput
              specialLabel="Alternate Contact"
              inputStyle={{
                height: "15px",
                width: "250px",
              }}
              country={"in"}
              onChange={handlePhoneChange2}
              // onChange={phone => console.log( phone )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="email"
              label="Email"
              variant="outlined"
              value={formValues.email}
              onChange={handleChange}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="alternate_email"
              label="Alt Email"
              variant="outlined"
              value={formValues.alternate_email}
              onChange={handleChange}
              error={Boolean(formErrors.alternate_email)}
              helperText={formErrors.alternate_email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled={
                designation !== "director" &&
                designation !== "owner" &&
                designation !== "partner"
              }
              size="small"
              name="pan_no"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_no}
              onChange={handleInputChange}
              helperText={
                formErrors.pan_no &&
                "Applicable Only if designation is Owner/Partner/Director"
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              disabled={
                designation !== "director" &&
                designation !== "owner" &&
                designation !== "partner"
              }
              size="small"
              type={"number"}
              name="aadhar_no"
              label="Aadhar No."
              variant="outlined"
              value={inputValue.aadhar_no}
              onChange={handleInputChange}
              helperText={
            
                "Applicable Only if designation is Owner/Partner/Director"
              }
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
