import React, { useState, useEffect } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import InvoiceServices from "./../../../services/InvoiceService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CloseIcon from "@mui/icons-material/Close";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const UpdateSellerAccounts = (props) => {
  const { setOpenPopup, getAllSellerAccountsDetails, idForEdit } = props;
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [bankData, setBankData] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [cvPreview, setCvPreview] = useState(null);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getAllBankDetailByID();
  }, [idForEdit]);

  const getAllBankDetailByID = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getSellerAccountDataById(
        idForEdit
      );
      console.log("response", response);
      setInputValue(response.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const validateifsc = async () => {
    try {
      setOpen(true);
      const ifsc = inputValue.ifsc_code;
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      setBankData(response.data);
      setErrMsg("");
      setOpen(false);
    } catch (error) {
      console.log("Creating Bank error ", error);
      setOpen(false);
      if (error.response.status === 404) {
        setErrMsg("please enter valid ifsc code.");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file && validFileTypes.includes(file.type)) {
      setInputValue((prevData) => ({
        ...prevData,
        company_profile: file,
      }));
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setCvPreview(fileURL);
      } else {
        setCvPreview(null); // Clear preview if not a PDF
      }
    } else {
      setAlertMsg({
        open: true,
        message: "Invalid file type. Please upload a PDF or DOC file",
        severity: "error",
      });
      event.target.value = null; // Reset file input
    }
  };

  const handleRemoveCv = () => {
    setInputValue((prevData) => ({
      ...prevData,
      company_profile: null,
    }));
    setCvPreview(null);
  };

  const updateBankDetails = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const formDataToSend = new FormData();

      // Append only fields with values to 'formDataToSend'
      Object.keys(inputValue).forEach((key) => {
        if (inputValue[key]) {
          // Check if the key is 'company_profile' and not of file type
          if (key === "company_profile" && !(inputValue[key] instanceof File)) {
            // Skip adding 'company_profile' if it's not a file
            return;
          }
          formDataToSend.append(key, inputValue[key]);
        }
      });

      await InvoiceServices.updateSellerAccountData(idForEdit, formDataToSend);
      setAlertMsg({
        message: "Company details updated successfully",
        severity: "success",
        open: true,
      });
      getAllSellerAccountsDetails();
      setOpenPopup(false);
      setOpen(false);
    } catch (error) {
      console.log("updating company detail error", error);
      setAlertMsg({
        open: true,
        message:
          error.response.data.errors.company_profile[0] ||
          "Failed to update company details",
        severity: "error",
      });
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
      <Box component="form" noValidate onSubmit={(e) => updateBankDetails(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              name="name"
              label="Company Name"
              variant="outlined"
              value={inputValue.name ? inputValue.name : ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="current_account_no"
              label="Account No"
              variant="outlined"
              value={
                inputValue.current_account_no
                  ? inputValue.current_account_no
                  : ""
              }
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              multiline
              fullWidth
              name="gst_number"
              size="small"
              label="Gst Number"
              variant="outlined"
              value={inputValue.gst_number ? inputValue.gst_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="grn_prefix"
              size="small"
              label="GRN Prefix"
              variant="outlined"
              value={inputValue.grn_prefix ? inputValue.grn_prefix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              multiline
              fullWidth
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={inputValue.address ? inputValue.address : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="unit"
              size="small"
              label="Unit"
              variant="outlined"
              value={inputValue.unit ? inputValue.unit : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="pincode"
              size="small"
              label="Pin Code"
              variant="outlined"
              value={inputValue.pincode ? inputValue.pincode : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={inputValue.state ? inputValue.state : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={inputValue.city ? inputValue.city : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="state_code"
              size="small"
              label="State Code"
              variant="outlined"
              value={inputValue.state_code ? inputValue.state_code : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="cin_number"
              size="small"
              label="CIN Number"
              variant="outlined"
              value={inputValue.cin_number ? inputValue.cin_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="email"
              size="small"
              label="Email"
              variant="outlined"
              value={inputValue.email ? inputValue.email : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="pan_number"
              size="small"
              label="Pan Number"
              variant="outlined"
              value={inputValue.pan_number ? inputValue.pan_number : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="prefix"
              size="small"
              label="Prefix"
              variant="outlined"
              value={inputValue.prefix ? inputValue.prefix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              name="suffix"
              size="small"
              label="Suffix"
              variant="outlined"
              value={inputValue.suffix ? inputValue.suffix : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              // type={"number"}
              fullWidth
              name="contact"
              size="small"
              label="Contact"
              variant="outlined"
              value={inputValue.contact ? inputValue.contact : ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              sx={{ minWidth: "200px" }}
              name="ifsc_code"
              size="small"
              label="IFSC Code"
              variant="outlined"
              value={inputValue.ifsc_code ? inputValue.ifsc_code : ""}
              onChange={handleInputChange}
              error={errMsg && errMsg}
              helperText={errMsg && errMsg}
            />
            <Button
              onClick={() => validateifsc()}
              variant="contained"
              sx={{ marginLeft: "1rem" }}
            >
              Validate
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="bank_name"
              label="Bank Name"
              variant="outlined"
              value={bankData.BANK ? bankData.BANK : inputValue.bank_name}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTextField
              fullWidth
              size="small"
              name="branch"
              label="Branch"
              variant="outlined"
              value={bankData.BRANCH ? bankData.BRANCH : inputValue.branch}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="secondary"
              component="label"
              fullWidth
            >
              Choose file for company profile
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </Button>
            {cvPreview && (
              <Box mt={2} position="relative">
                <Typography variant="body1">Preview:</Typography>
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={handleRemoveCv}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <embed
                  src={cvPreview}
                  width="100%"
                  height="150px"
                  type="application/pdf"
                />
              </Box>
            )}
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
