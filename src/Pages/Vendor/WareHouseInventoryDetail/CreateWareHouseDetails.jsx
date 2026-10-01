import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import validatePincode from "../../../utility/validatePincode";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
export const CreateWareHouseInventoryDetails = (props) => {
  const { setOpenPopup, getAllVendorDetailsByID, contactData, vendorData } =
    props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [pinCodeData, setPinCodeData] = useState(null);
  const [selectedcontact, setSelectedContact] = useState("");
  const data = useSelector((state) => state.auth);
  // const timeoutRef = useRef(null);
  const [validCheck, setValidCheck] = useState(true);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setAlertMsg({ ...alertmsg, open: false });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setInputValue({
      ...inputValue,
      [name]: value,
    });

    if (name === "pincode") {
      setPinCodeData(null);
      setValidCheck(false);
    }
  };

  const validatePinCode = async () => {
    try {
      setOpen(true);

      const PINCODE = inputValue.pincode;

      if (!PINCODE || PINCODE.trim().length !== 6) {
        setAlertMsg({
          message: "Please enter a valid 6-digit Pin Code",
          severity: "warning",
          open: true,
        });
        return;
      }

      const response = await validatePincode(vendorData.country_id, PINCODE);

      setPinCodeData(response);

      setValidCheck(true);

      setAlertMsg({
        message: "Pin Code is valid",
        severity: "success",
        open: true,
      });
    } catch (error) {
      setPinCodeData(null);

      setValidCheck(false);

      setAlertMsg({
        message: error.message,
        severity: "warning",
        open: true,
      });
    } finally {
      setOpen(false);
    }
  };
  const createWareHouseDetails = async (e) => {
    if (vendorData.type === "Domestic" && !validCheck) {
      setAlertMsg({
        message: "Please validate the Pin Code first.",
        severity: "warning",
        open: true,
      });
      return;
    }
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        vendor: data ? data.vendorName : "",
        contact: selectedcontact.id,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: pinCodeData ? pinCodeData.state_name : "",
        city: pinCodeData ? pinCodeData.city_name : "",
      };
      await InventoryServices.createWareHouseInventoryData(req);
      setOpenPopup(false);
      getAllVendorDetailsByID();
      setOpen(false);
    } catch (error) {
      console.log("createing company detail error", error);
      setOpen(false);
    }
  };

  return (
    <div>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />

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
              label="Contact"
            />
          </Grid>
          {vendorData.type === "Domestic" ? (
            <>
              <Grid item xs={12} sm={8}>
                <CustomTextField
                  fullWidth
                  name="pincode"
                  size="small"
                  label="Pin Code"
                  variant="outlined"
                  value={inputValue.pincode || ""}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={validatePinCode}
                  disabled={!inputValue.pincode}
                  sx={{ height: "40px" }}
                >
                  Validate
                </Button>
              </Grid>
            </>
          ) : null}
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

          {pinCodeData ? (
            <>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="state"
                  label="State"
                  variant="outlined"
                  value={pinCodeData ? pinCodeData.state_name : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  size="small"
                  name="city"
                  label="City"
                  variant="outlined"
                  value={pinCodeData ? pinCodeData.city_name : ""}
                />
              </Grid>
            </>
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
