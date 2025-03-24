import { Box, Button, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import CustomerServices from "../../../services/CustomerService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CreateEDC = (props) => {
  const { assignCustomerData, getAllEDC, closeModal } = props;
  const [loader, setLoader] = useState(false);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [Edc_List, setEdc_List] = useState([]);
  const [inputValue, setInputValue] = useState({
    type: "Customer",
    edc_customer: assignCustomerData.name,
    id: "",
  });

  const { handleError } =
    useNotificationHandling();

  const GetEdcData = useCallback(async () => {
    try {
      setLoader(true);
      const res = await CustomerServices.EDC_List();
      console.log(res.data);
      setEdc_List(res.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    GetEdcData();
  }, []);

  const handleInvoiceSelection = (event, value) => {
    if (value) {
      setInputValue((prev) => ({
        ...prev,
        id: value.id,
      }));
    }
  };

  const createEDC_Customer = async (e) => {
    try {
      e.preventDefault();
      const payload = { ...inputValue };
      setLoader(true);
      const response = await CustomerServices.CreateEDC_Customer(payload);
      setAlertMsg({
        message:
          response.data.message || "Exclusive Customer created successfully",
        severity: "success",
        open: true,
      });
      getAllEDC();
      closeModal(false);
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
              options={Edc_List}
              getOptionLabel={(option) => option.name}
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
