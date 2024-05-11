import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import ProductService from "../../../services/ProductService";
import LeadServices from "../../../services/LeadService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomLoader } from "../../../Components/CustomLoader";
import { MessageAlert } from "../../../Components/MessageAlert";
import CustomTextField from "../../../Components/CustomTextField";

export const LeadForecastCreate = memo(
  ({
    getleads,
    leadsByID,
    setOpenPopup,
    currentPage,
    filterQuery,
    filterSelectedQuery,
    searchQuery,
  }) => {
    const [leadForecast, setLeadForecast] = useState({
      lead: leadsByID,
      product: "",
      month: "",
      quantity: "",
    });
    const [open, setOpen] = useState(false);
    const [productOption, setProductOption] = useState([]);
    const [monthOptions, setMonthOptions] = useState([]);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    useEffect(() => {
      setMonthOptions(getMonthOptions());
      getProduct();
    }, []);

    const getMonthOptions = () => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let options = [];
      let currentDate = new Date();
      for (let i = 1; i <= 2; i++) {
        let futureDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + i,
          1
        );
        options.push(monthNames[futureDate.getMonth()]);
      }
      return options;
    };
    const getProduct = async () => {
      try {
        const res = await ProductService.getAllValidPriceList("all");
        setProductOption(res.data);
      } catch (err) {
        console.error("error product", err);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setLeadForecast({ ...leadForecast, [name]: value });
    };

    const handleSubmit = useCallback(
      async (e) => {
        try {
          e.preventDefault();
          setOpen(true);
          const response = await LeadServices.createLeadForecast(leadForecast);
          const successMessage =
            response.data.message || "Leads Created successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getleads(
              currentPage,
              filterQuery,
              filterSelectedQuery,
              searchQuery
            );
          }, 300);
        } catch (error) {
          handleError(error);
        } finally {
          setOpen(false);
        }
      },
      [leadForecast, currentPage, filterQuery, filterSelectedQuery, searchQuery]
    );

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={open} />
        <Box
          component="form"
          noValidate
          onSubmit={(e) => handleSubmit(e)}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomAutocomplete
                name="product"
                size="small"
                disablePortal
                id="combo-box-demo"
                onChange={(event, value) => {
                  setLeadForecast({ ...leadForecast, product: value });
                }}
                options={productOption.map((option) => option.product)}
                getOptionLabel={(option) => option}
                sx={{ minWidth: 300 }}
                label="Product Name"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomAutocomplete
                name="month"
                size="small"
                disablePortal
                id="month-autocomplete"
                value={leadForecast.month}
                onChange={(event, value) =>
                  setLeadForecast({ ...leadForecast, month: value })
                }
                options={monthOptions}
                sx={{ minWidth: 300 }}
                label="Month"
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                size="small"
                label="Quantity"
                name="quantity"
                type="number"
                value={leadForecast.quantity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, textAlign: "right" }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
);
