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

export const PhysicalInventoryCreate = memo((props) => {
  const { currentPage, searchQuery, setOpenPopup, getPhysicalInventoryData } =
    props;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [productOption, setProductOption] = useState([]);
  const [sellerUnitOption, setSellerUnitOption] = useState([]);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prevState) => {
        // Directly handle the 'product' case to set both product and unit.
        if (name === "product") {
          const selectedProduct =
            productOption.find((p) => p.name === value) || {};
          const unit = selectedProduct.unit || "";
          return { ...prevState, [name]: value, unit };
        }
        // Handle all other inputs generically.
        return { ...prevState, [name]: value };
      });
    },
    [productOption]
  );

  useEffect(() => {
    getProduct();
    getAllSellerAccountsDetails();
  }, []);

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

  const createPhysicalInventory = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const payload = {
          type: formData.type,
          seller_unit: formData.seller_unit,
          product: formData.product,
          pending_quantity: formData.pending_quantity,
          physical_quantity: formData.physical_quantity,
        };

        const response = await InventoryServices.createPhysical(payload);
        const successMessage =
          response.data.message || "Physical Inventory Created successfully";
        handleSuccess(successMessage);

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
              id="combo-box-demo"
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
              id="combo-box-demo"
              value={formData.seller_unit || ""}
              options={sellerUnitOption.map((option) => option.unit)}
              getOptionLabel={(option) => option}
              onChange={(event, value) =>
                handleInputChange("seller_unit", value)
              }
              label="Seller Unit"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              size="small"
              disablePortal
              id="combo-box-demo"
              value={formData.product || ""}
              options={productOption.map((option) => option.name)}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleInputChange("product", value)}
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
              onChange={(event) =>
                handleInputChange("pending_quantity", event.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Physical Quantity"
              variant="outlined"
              value={formData.physical_quantity || ""}
              onChange={(event) =>
                handleInputChange("physical_quantity", event.target.value)
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
