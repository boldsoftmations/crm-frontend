import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import CustomerServices from "../../../services/CustomerService";

export const CreateCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails } = props;
  const [open, setOpen] = useState(false);
  const [typeData, setTypeData] = useState("");
  const [category, setCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [inputValue, setInputValue] = useState([]);

  const handleChange = (event) => {
    setTypeData(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };
  console.log("inputValue", inputValue);
  console.log("typeData", typeData);
  console.log("category", category);
  console.log("businessType", businessType);

  const createCompanyDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const req = {
        type: typeData,
        name: inputValue.name,
        address: inputValue.address,
        pincode: inputValue.pin_code,
        state: inputValue.state,
        city: inputValue.city,
        website: inputValue.website_url,
        estd_date: inputValue.estd_date,
        gst_number: inputValue.gst_no,
        pan_number: inputValue.pan_no,
        business_type: businessType,
        category: category,
        total_sales_turnover: inputValue.total_sale,
      };
      await CustomerServices.createCompanyData(req);
      setOpenPopup(false);
      setOpen(false);
      getAllCompanyDetails();
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
        onSubmit={(e) => createCompanyDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={typeData}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="industrial_customer"
                    control={<Radio />}
                    label="Industrial Customer"
                  />
                  <FormControlLabel
                    value="distribution_customer"
                    control={<Radio />}
                    label="Distribution Customer"
                  />
                </RadioGroup>
              </FormControl>
            </>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="name"
              size="small"
              label="Company Name"
              variant="outlined"
              value={inputValue.name}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Busniess Type</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={businessType}
                label="Busniess Type"
                onChange={(event) => setBusinessType(event.target.value)}
              >
                <MenuItem value={"proprietor"}>Proprietor </MenuItem>
                <MenuItem value={"pvt_ltd"}>Pvt.Ltd</MenuItem>
                <MenuItem value={"partnership"}>Partnership</MenuItem>
                <MenuItem value={"limited"}>Limited</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="pin_code"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={inputValue.pin_code}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="state"
              label="State"
              variant="outlined"
              value={inputValue.state}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="website_url"
              label="website Url"
              variant="outlined"
              value={inputValue.website_url}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              name="estd_date"
              size="small"
              label="Estd.Date"
              variant="outlined"
              value={inputValue.estd_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="gst_no"
              label="GST No."
              variant="outlined"
              value={inputValue.gst_no}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              name="pan_no"
              label="Pan No."
              variant="outlined"
              value={inputValue.pan_no}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="total_sale"
              size="small"
              type={"number"}
              label="Total Sale"
              variant="outlined"
              value={inputValue.total_sale}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Category</InputLabel>
              <Select
                disabled={typeData === "industrial_customer"}
                labelId="demo-select-small"
                id="demo-select-small"
                value={category}
                label="Category"
                onChange={(event) => setCategory(event.target.value)}
              >
                <MenuItem value={"hardware"}>Hardware </MenuItem>
                <MenuItem value={"electrical"}>Electrical</MenuItem>
                <MenuItem value={"plywood"}>Plywood</MenuItem>
                <MenuItem value={"auto_retail"}>Auto Retail</MenuItem>
                <MenuItem value={"plumbing"}>Plumbing</MenuItem>
                <MenuItem value={"stationary"}>Stationary</MenuItem>
                <MenuItem value={"others"}>Others</MenuItem>
              </Select>
              <FormHelperText>
                Applicable Only For Distribution Customer
              </FormHelperText>
            </FormControl>
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
