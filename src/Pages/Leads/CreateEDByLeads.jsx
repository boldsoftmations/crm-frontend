import { Box, Button, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomerServices from "../../services/CustomerService";
import CustomSnackbar from "../../Components/CustomerSnackbar";

export const CreateEDCByLeads = (props) => {
  const { editforedc, setLoaderPopup } = props;
  console.log("editforEdc", editforedc);
  const [loader, setLoader] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [edcData, setEdcData] = useState([]);

  const [inputValue, setInputValue] = useState({
    type: "Lead",
    id: editforedc.lead_id,
    edc_customer: "",
  });

  const GetEdcData = useCallback(async () => {
    try {
      setLoader(true);
      const res = await CustomerServices.getAllEdc();
      setEdcData(res.data);
    } catch (error) {
      alertmsg({ severity: "error", message: "Failed", open: true });
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    GetEdcData();
  }, []);

  const handleInvoiceSelection = (event, value) => {
    setInputValue((prev) => ({
      ...prev,
      edc_customer: value,
    }));
  };

  const createEDC_Customer = async (e) => {
    try {
      e.preventDefault();
      const payload = { ...inputValue };
      setLoader(true);
      const response = await CustomerServices.CreateEDC_Customer(payload);
      setAlertMsg({
        message: response.data.message || "Assign EDC successfully",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        setLoaderPopup(false);
      }, 300);
    } catch (error) {
      let errmesg = error.response.data.message || "Assign EDC failed";
      setAlertMsg({
        message: errmesg,
        severity: "error",
        open: true,
      });
    } finally {
      setLoader(false); // Always close the loader
    }
  };
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader loader={loader} />
      <Box
        component="form"
        noValidate
        onSubmit={createEDC_Customer}
        style={{ minWidth: "550px" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <CustomAutocomplete
              name="edc"
              size="small"
              disablePortal
              id="combo-box-demo"
              options={edcData.map((option) => option.name)}
              getOptionLabel={(option) => option}
              onChange={handleInvoiceSelection}
              fullWidth
              label="EDC"
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
    </>
  );
};
