import React, { useState } from "react";
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
  Typography,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import * as Yup from "yup";
import { useFormik } from "formik";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";
export const CreateContactDetails = (props) => {
  const { setOpenPopup, getAllBankDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [inputValue, setInputValue] = useState([]);
  const [message, setMessage] = useState("");
  const data = useSelector((state) => state.auth);

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

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),

    alternate_email: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      alternate_email: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        const req = {
          company: data ? data.companyName : "",
          name: inputValue.name,
          designation: designation,
          contact: phone.phone,
          alternate_contact: phone2.phone2,
          email: values.email,
          alternate_email: values.alternate_email,
          pan_number: inputValue.pan_no,
          aadhaar: inputValue.aadhar_no,
        };
        setOpen(true);
        const res = await CustomerServices.createContactData(req);
        setMessage(res.data.message);
        setOpenPopup(false);
        setOpen(false);
      } catch (error) {
        console.log("error", error);
        setOpen(false);
      }
    },
  });

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
      <Box component="form" noValidate onSubmit={formik.handleSubmit}>
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
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Designation</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={designation}
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
              value={phone}
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
              value={phone2}
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
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              name="alternate_email"
              label="Alt Email"
              variant="outlined"
              value={formik.values.alternate_email}
              onChange={formik.handleChange}
              error={
                formik.touched.alternate_email &&
                Boolean(formik.errors.alternate_email)
              }
              helperText={
                formik.touched.alternate_email && formik.errors.alternate_email
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
              onChange={handleInputChange}
              size="small"
              name="pan_no"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_no}
              helperText={
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
              onChange={handleInputChange}
              size="small"
              type={"number"}
              name="aadhar_no"
              label="Aadhar No."
              variant="outlined"
              value={inputValue.aadhar_no}
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
