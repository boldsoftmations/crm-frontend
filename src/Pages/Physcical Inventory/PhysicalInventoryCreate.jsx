import React, { memo, useCallback, useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import ProductService from "../../services/ProductService";
import InvoiceServices from "../../services/InvoiceService";
import InventoryServices from "../../services/InventoryService";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import CustomTextField from "../../Components/CustomTextField";
import { useSelector } from "react-redux";

export const PhysicalInventoryCreate = memo((props) => {
  const { currentPage, searchQuery, setOpenPopup, getPhysicalInventoryData } =
    props;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [sellerUnitOption, setSellerUnitOption] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const { profile: users } = useSelector((state) => state.auth);
  const fetchInventoryData = async (type) => {
    setOpen(true);
    try {
      const api =
        type === "Store"
          ? InventoryServices.getAllConsStoresInventoryData
          : InventoryServices.getAllConsProductionInventoryData;
      const response = await api();
      setInventoryData(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const getProduct = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllProduct();
      setProductOption(response.data);
    } catch (error) {
      console.error("error Product", error);
    } finally {
      setOpen(false);
    }
  };

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllPaginateSellerAccountData(
        "all"
      );
      setSellerUnitOption(response.data);
    } catch (error) {
      console.error("error Seller Account", error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getProduct();
    getAllSellerAccountsDetails();
  }, []);

  const handleInputChange = useCallback((name, value) => {
    setFormData((prevState) => {
      if (name === "type") {
        // Reset data when type changes
        setInventoryData([]);
        fetchInventoryData(value); // Fetch new inventory data based on type
      }
      return { ...prevState, [name]: value };
    });
  }, []);

  const handleProductChange = useCallback(
    (event, value) => {
      const selectedProduct = inventoryData.find(
        (data) =>
          data.product__name === value &&
          data.seller_account === formData.seller_unit
      );
      setFormData((prevState) => ({
        ...prevState,
        product: value,
        pending_quantity: selectedProduct ? selectedProduct.quantity : "0",
      }));
    },
    [inventoryData, formData.seller_unit]
  );

  const handleSellerUnitChange = useCallback(
    (event, value) => {
      const selectedSellerUnit = inventoryData.find(
        (data) =>
          data.seller_account === value &&
          data.product__name === formData.product
      );
      setFormData((prevState) => ({
        ...prevState,
        seller_unit: value,
        pending_quantity: selectedSellerUnit ? selectedSellerUnit.quantity : 0,
      }));
    },
    [inventoryData, formData.product]
  );

  const handlePhysicalQuantityChange = (event) => {
    const newPhysicalQuantity = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      physical_quantity: newPhysicalQuantity,
    }));
  };

  const calculateGNL = (physicalQuantity, pendingQuantity) => {
    const physical = parseInt(physicalQuantity, 10);
    const pending = parseInt(pendingQuantity, 10);
    const diff = physical - pending;
    return diff > 0 ? "Gain" : diff < 0 ? "Loss" : "No Change";
  };

  useEffect(() => {
    const gnl = calculateGNL(
      formData.physical_quantity,
      formData.pending_quantity
    );
    setFormData((prevState) => ({
      ...prevState,
      gnl: gnl,
    }));
  }, [formData.physical_quantity, formData.pending_quantity, calculateGNL]);

  const createPhysicalInventory = useCallback(
    async (e) => {
      e.preventDefault();
      setOpen(true);
      try {
        const payload = {
          ...formData,
          gnl: formData.gnl,
          rate: Number(formData.rate),
        };
        const response = await InventoryServices.createPhysical(payload);
        handleSuccess(
          response.data.message || "Physical Inventory Created successfully"
        );
        setTimeout(() => {
          setOpenPopup(false);
          getPhysicalInventoryData(currentPage, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [formData, currentPage, searchQuery]
  );
  const isAuthorizedAndPendingZero =
    users.groups.includes("Accounts") ||
    (users.groups.includes("Director") && formData.pending_quantity === "0");
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={createPhysicalInventory}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="type-selector"
              value={formData.type || ""}
              options={TYPE_OPTIONS}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleInputChange("type", value)}
              label="Type"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="seller-unit-selector"
              value={formData.seller_unit || ""}
              options={sellerUnitOption.map((data) => data.unit)}
              getOptionLabel={(option) => option}
              onChange={handleSellerUnitChange}
              label="Seller Unit"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="product-selector"
              value={formData.product || ""}
              options={productOption.map((data) => data.name)}
              getOptionLabel={(option) => option}
              onChange={handleProductChange}
              label="Product"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Pending Quantity"
              variant="outlined"
              value={formData.pending_quantity || ""}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          {isAuthorizedAndPendingZero && (
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                size="small"
                name="rate"
                type="number"
                label="Rate"
                variant="outlined"
                value={formData.rate}
                onChange={(event) =>
                  handleInputChange("rate", event.target.value)
                }
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Physical Quantity"
              variant="outlined"
              value={formData.physical_quantity || ""}
              onChange={handlePhysicalQuantityChange} // Use the updated handler
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Gain/Loss"
              variant="outlined"
              value={formData.gnl || ""}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              size="small"
              label="Reason"
              variant="outlined"
              value={formData.reason || ""}
              onChange={(event) =>
                handleInputChange("reason", event.target.value)
              }
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="small"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create
        </Button>
      </Box>
    </>
  );
});

const TYPE_OPTIONS = ["Store", "Production"];
