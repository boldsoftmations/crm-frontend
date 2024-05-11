import React, { useState, useRef } from "react";
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
  // Typography,
} from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
export const UpdateContactInventoryDetails = (props) => {
  const { setOpenPopup, getAllVendorDetailsByID, IDForEdit, vendorData } =
    props;
  const [open, setOpen] = useState(false);
  const [designation, setDesignation] = useState(IDForEdit.designation);
  const [inputValue, setInputValue] = useState(IDForEdit);
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const handlePhoneNumberChange = (value) => {
    setPhone(value);
  };

  const handlePhoneNumberChange2 = (value) => {
    setPhone2(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  console.log("inputValue", inputValue);

  const UpdateContactDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      setOpen(true);
      let contact1 = phone ? "+" + phone : inputValue.contact;
      let contact2 = phone2 ? "+" + phone2 : inputValue.alternate_contact;

      console.log("contact1 :>> ", contact1);
      console.log("contact1 :>> ", contact2);
      let aadhaarNumber =
        designation === "director" ||
        designation === "owner" ||
        designation === "partner"
          ? inputValue.aadhaar
          : "";
      let panNumber =
        designation === "director" ||
        designation === "owner" ||
        designation === "partner"
          ? inputValue.pan_number
          : "";

      console.log("contact1 :>> ", contact2);
      const req = {
        name: inputValue.name ? inputValue.name : "",
        vendor: inputValue.vendor ? inputValue.vendor : "",
        designation: designation ? designation : "",
        email: inputValue.email ? inputValue.email : "",
        alternate_email: inputValue.alternate_email
          ? inputValue.alternate_email
          : "",
        contact: contact1 ? contact1 : "",
        alternate_contact: contact2 ? contact2 : null,
        pan_number: panNumber ? panNumber : null,
        aadhaar: aadhaarNumber ? aadhaarNumber : null,
      };
      await InventoryServices.updateContactInventoryData(inputValue.id, req);
      setOpenPopup(false);
      getAllVendorDetailsByID();
      setOpen(false);
    } catch (err) {
      console.log("createing company detail error", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.alternate_contact
            ? err.response.data.errors.alternate_contact
            : err.response.data.errors.contact
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <Box
        component="form"
        noValidate
        onSubmit={(e) => UpdateContactDetails(e)}
      >
        <Grid container spacing={2}>
          <p
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: errMsg ? "red" : "offscreen",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
            }}
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Grid item xs={12} sm={6}>
            <CustomTextField
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
              value={phone ? phone : inputValue.contact}
              onChange={handlePhoneNumberChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneInput
              specialLabel="Alternate Contact"
              inputStyle={{
                height: "15px",
                width: "250px",
              }}
              value={phone2 ? phone2 : inputValue.alternate_contact}
              onChange={handlePhoneNumberChange2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
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
            <CustomTextField
              fullWidth
              size="small"
              name="alternate_email"
              label="Alt Email"
              variant="outlined"
              value={
                inputValue.alternate_email ? inputValue.alternate_email : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          {vendorData.type === "Domestic" &&
          (designation === "director" ||
            designation === "owner" ||
            designation === "partner") ? (
            <Grid item xs={12} sm={6}>
              <CustomTextField
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
            </Grid>
          ) : null}
          {vendorData.type === "Domestic" &&
          (designation === "director" ||
            designation === "owner" ||
            designation === "partner") ? (
            <Grid item xs={12} sm={6}>
              <CustomTextField
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
            </Grid>
          ) : null}
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
