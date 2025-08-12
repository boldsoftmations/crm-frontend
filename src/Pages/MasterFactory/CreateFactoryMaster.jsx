import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import MasterService from "../../services/MasterService";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { CustomLoader } from "../../Components/CustomLoader";
import InvoiceServices from "../../services/InvoiceService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
const CreateFactoryMaster = ({ setOpenPopup, getAllMasterBeat }) => {
  const [inputValue, setInputValue] = useState({
    model: "",
    seller_unit: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [sellerData, setSellerData] = useState([]);

  const handleCloseSnackbar = () => {
    setAlertMsg((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.model.trim() || !inputValue.seller_unit.trim()) {
      setAlertMsg({
        message: "Model name is required",
        severity: "warning",
        open: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await MasterService.CreateFactoryModel({
        model: inputValue.model.trim(),
        seller_unit: inputValue.seller_unit.trim(),
      });
      console.log(response);

      if (response.status === 200) {
        setAlertMsg({
          message: response.message || "Model created successfully",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getAllMasterBeat();
          setOpenPopup(false);
        }, 500);
      } else {
        setAlertMsg({
          message: response.message || "Failed to create Model",
          severity: "error",
          open: true,
        });
      }
    } catch (error) {
      setAlertMsg({
        message: error.response.data.message || "Something went wrong",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
      setInputValue({
        model: "",
        seller_unit: "",
      });
    }
  };
  const getAllSellerAccountsDetails = async () => {
    try {
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerData(response.data);
      console.log("data", response.data);
    } catch (error) {
      console.log("Error fetching seller account data:", error);
    }
  };
  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const HandleInput = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleAutocompleteChange = (e, value) => {
    setInputValue({
      ...inputValue,
      seller_unit: value.unit,
    });
  };

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleCloseSnackbar}
      />
      <CustomLoader open={loading} />

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label=" Machine model Name"
              name="model"
              size="small"
              onChange={HandleInput}
              value={inputValue.model}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="seller_unit"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={handleAutocompleteChange}
              options={sellerData.map((option) => option)}
              getOptionLabel={(option) => option.unit}
              sx={{ minWidth: 300 }}
              label="Seller Unit"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default CreateFactoryMaster;
