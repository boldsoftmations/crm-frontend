import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";

export const UpdateContactDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetailsByID, IDForEdit } = props;
  const [state, setState] = useState({
    open: false,
    inputValue: {
      name: "",
      contact: "",
      designation: "",
      alternate_contact: "",
      email: "",
      alternate_email: "",
      pan_number: "",
      aadhaar: "",
    },
    errMsg: "",
  });

  const errRef = useRef();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      inputValue: { ...prevState.inputValue, [name]: value },
    }));
  };

  useEffect(() => {
    getAllContactDataByID();
  }, []);

  const getAllContactDataByID = async () => {
    try {
      setState((prevState) => ({ ...prevState, open: true }));
      const response = await CustomerServices.getContactDataById(IDForEdit);
      setState((prevState) => ({
        ...prevState,
        inputValue: response.data,
        open: false,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, open: false }));
      console.log("company data by id error", err);
    }
  };

  const UpdateContactDetails = async (e) => {
    e.preventDefault();
    try {
      setState((prevState) => ({ ...prevState, open: true }));
      const { contact, alternate_contact, ...rest } = state.inputValue;
      // Ensure contact and alternate_contact are not null/undefined before accessing length
      const contact1 =
        contact && contact.length === 12 ? `+${contact}` : contact;
      const contact2 =
        alternate_contact && alternate_contact.length === 12
          ? `+${alternate_contact}`
          : alternate_contact;

      const req = {
        ...rest,
        contact: contact1,
        alternate_contact: contact2,
      };

      await CustomerServices.updateContactData(IDForEdit, req);
      setOpenPopup(false);
      setState((prevState) => ({ ...prevState, open: false }));
      getAllCompanyDetailsByID();
    } catch (err) {
      console.log("creating company detail error", err);
      setState((prevState) => ({ ...prevState, open: false }));
      // Handle error messages here...
    }
  };

  return (
    <div>
      <CustomLoader open={state.open} />

      <Box component="form" noValidate onSubmit={UpdateContactDetails}>
        <Grid container spacing={2}>
          <p
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: state.errMsg ? "red" : "offscreen",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
            }}
            ref={errRef}
            className={state.errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {state.errMsg}
          </p>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="name"
              label="Name"
              variant="outlined"
              value={state.inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Designation</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={state.inputValue.designation}
                label="Designation"
                onChange={(event) =>
                  setState((prevState) => ({
                    ...prevState,
                    inputValue: {
                      ...prevState.inputValue,
                      designation: event.target.value,
                    },
                  }))
                }
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
              value={state.inputValue.contact}
              onChange={(newPhone) =>
                setState((prevState) => ({
                  ...prevState,
                  inputValue: { ...prevState.inputValue, contact: newPhone },
                }))
              }
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
              value={state.inputValue.alternate_contact}
              onChange={(newPhone) =>
                setState((prevState) => ({
                  ...prevState,
                  inputValue: {
                    ...prevState.inputValue,
                    alternate_contact: newPhone,
                  },
                }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="email"
              label="Email"
              variant="outlined"
              value={state.inputValue.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              name="alternate_email"
              label="Alt Email"
              variant="outlined"
              value={state.inputValue.alternate_email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {state.inputValue.designation === "Director" ||
            state.inputValue.designation === "Owner" ||
            state.inputValue.designation === "Partner" ? (
              <CustomTextField
                fullWidth
                disabled={
                  !["Director", "Owner", "Partner"].includes(
                    state.inputValue.designation
                  )
                }
                onChange={handleInputChange}
                size="small"
                name="pan_number"
                label="Pan No."
                variant="outlined"
                value={state.inputValue.pan_number}
                helperText={
                  "Applicable Only if designation is Owner/Partner/Director"
                }
              />
            ) : null}
          </Grid>
          <Grid item xs={12} sm={6}>
            {state.inputValue.designation === "Director" ||
            state.inputValue.designation === "Owner" ||
            state.inputValue.designation === "Partner" ? (
              <CustomTextField
                fullWidth
                disabled={
                  !["Director", "Owner", "Partner"].includes(
                    state.inputValue.designation
                  )
                }
                onChange={handleInputChange}
                size="small"
                name="aadhaar"
                label="Aadhar No."
                variant="outlined"
                value={state.inputValue.aadhaar}
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
