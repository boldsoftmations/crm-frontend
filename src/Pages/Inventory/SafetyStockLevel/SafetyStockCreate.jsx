import React, { useState, useEffect, useCallback, memo } from "react";
import { Box, Button, Grid } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import { useSelector } from "react-redux";
import InventoryServices from "../../../services/InventoryService";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";



export const SafetyStockCreate = memo(
  ({ setOpenPopup, onCreateSuccess, currentPage }) => {
    const { sellerData } = useSelector((state) => ({
      sellerData: state.auth.sellerAccount,
    }));
    console.log(sellerData);

    const [inputValues, setInputValues] = useState({
      seller_account: "",
      product: "",
      quantity: "",
    });
    const [loading, setLoading] = useState(false);
    const [productOption, setProductOption] = useState([]);
    const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
      useNotificationHandling();

    const handleInputChange = useCallback((event) => {
      const { name, value } = event.target;
      setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
    }, []);

    const handleAutocompleteChange = useCallback((fieldName, value) => {
      setInputValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
    }, []);

    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await ProductService.getAllProduct();
          setProductOption(response.data);
        } catch (error) {
          console.error("Error fetching products", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, []);

    const createSafetyStock = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        await InventoryServices.createSafetyStockData(inputValues);
        onCreateSuccess(currentPage);
        const successMessage = "Safety Stock Created Successfully";
        handleSuccess(successMessage);
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <MessageAlert
          open={alertInfo.open}
          onClose={handleCloseSnackbar}
          severity={alertInfo.severity}
          message={alertInfo.message}
        />
        <CustomLoader open={loading} />
        <Box component="form" noValidate onSubmit={createSafetyStock}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                size="small"
                disablePortal
                options={sellerData.map((option) => option.unit)}
                getOptionLabel={(option) => option}
                onChange={(event, value) =>
                  handleAutocompleteChange("seller_account", value)
                }
                label="Seller Account"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomAutocomplete
                size="small"
                disablePortal
                options={productOption.map((option) => option.name)}
                getOptionLabel={(option) => option}
                onChange={(event, value) =>
                  handleAutocompleteChange("product", value)
                }
                label="Product"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CustomTextField
                fullWidth
                name="quantity"
                size="small"
                label="Quantity"
                variant="outlined"
                value={inputValues.quantity}
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
      </>
    );
  }
);
