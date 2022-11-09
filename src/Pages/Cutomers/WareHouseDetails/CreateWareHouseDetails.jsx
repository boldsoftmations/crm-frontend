import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import { useSelector } from "react-redux";

export const CreateWareHouseDetails = (props) => {
  const { setOpenPopup, getWareHouseDetailsByID } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [contact, setContact] = useState([]);
  const [selectedcontact, setSelectedContact] = useState("");
  const data = useSelector((state) => state.auth);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getAllCompanyDetails();
  }, []);

  const getAllCompanyDetails = async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllContactData();
      setContact(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  console.log("selectedcontact :>> ", selectedcontact);

  const createWareHouseDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        company: data ? data.companyName : "",
        contact: selectedcontact.name,
        address: inputValue.address,
        pincode: inputValue.pincode,
        state: inputValue.state,
        city: inputValue.city,
      };
      await CustomerServices.createWareHouseData(req);
      setOpenPopup(false);
      setOpen(false);
      getWareHouseDetailsByID();
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
        onSubmit={(e) => createWareHouseDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              size="small"
              id="grouped-demo"
              onChange={(event, value) => setSelectedContact(value)}
              options={contact.map((option) => option)}
              groupBy={(option) => option.designation}
              getOptionLabel={(option) => option.name}
              // sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Contact" />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="pincode"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              onChange={handleInputChange}
              size="small"
              name="city"
              label="City"
              variant="outlined"
              value={inputValue.city}
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
