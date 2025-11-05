import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomerServices from "../../../services/CustomerService";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CustomerPotentialCreate = ({
  recordForEdit,
  getCompanyDetailsByID,
  setOpenModal,
}) => {
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState({
    description: "",
    product: "",
    current_buying_quantity: "",
  });

  const [productList, setProductList] = useState([]); // All products from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered based on description
  const [selectedProduct, setSelectedProduct] = useState(null); // For selected product
  const [selectDis, setSelectDis] = useState(true); // Disable product until description selected

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  // Close snackbar
  const handleClose = () => setAlertMsg({ open: false });

  // Fetch all product data once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setOpen(true);
        const res = await CustomerServices.getAllDescription();
        setProductList(res.data || []);
        console.log("Fetched products:", res.data);
      } catch (err) {
        console.error("Error fetching product list:", err);
      } finally {
        setOpen(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle description selection
  const handleDescriptionChange = (event, value) => {
    setPotential((prev) => ({ ...prev, description: value, product: "" }));

    if (!value) {
      setFilteredProducts([]);
      setSelectDis(true);
      return;
    }

    // Filter products by matching description
    const matchedProducts = productList.filter(
      (item) => item.description && item.description.trim() === value.trim()
    );

    // Split comma-separated product_list values if any
    const separatedProducts = matchedProducts.flatMap((item) => {
      if (item.product_list && Array.isArray(item.product_list)) {
        return item.product_list.map((prod) => ({
          ...item,
          product_list: prod.trim(),
        }));
      }
      if (
        item.product_list &&
        typeof item.product_list === "string" &&
        item.product_list.includes(",")
      ) {
        return item.product_list.split(",").map((prod) => ({
          ...item,
          product_list: prod.trim(),
        }));
      }
      return [item];
    });

    setFilteredProducts(separatedProducts);
    setSelectDis(false);
  };

  // Handle product selection
  const handleProductChange = (event, value) => {
    setPotential((prev) => ({ ...prev, product: value }));

    const foundProduct = filteredProducts.find((item) =>
      item.product_list.includes(value)
    );

    if (foundProduct) {
      setSelectedProduct(foundProduct);
      console.log("Selected product:", foundProduct);
    }
  };

  // Handle text field input
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setPotential((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const data = {
        company: recordForEdit,
        ...potential,
      };
      await CustomerServices.createPotentialCustomer(data);

      setAlertMsg({
        message: "Potential customer created successfully!",
        severity: "success",
        open: true,
      });

      // Reset form
      setPotential({
        description: "",
        product: "",
        current_buying_quantity: "",
      });
      setFilteredProducts([]);
      setSelectDis(true);
      setSelectedProduct(null);

      setOpenModal(false);
      await getCompanyDetailsByID();
    } catch (error) {
      setAlertMsg({
        message:
          (error.response.data.message && error.response.data.message) ||
          "Error creating potential customer",
        severity: "error",
        open: true,
      });
      console.error("Error:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertMsg.open}
        message={alertMsg.message}
        severity={alertMsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Description */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              sx={{ minWidth: 180 }}
              size="small"
              onChange={handleDescriptionChange}
              value={potential.description}
              options={[
                ...new Set(
                  (productList || []).map((option) => option.description)
                ),
              ]}
              getOptionLabel={(option) => option || "No Options"}
              label="Description"
            />
          </Grid>

          {/* Product */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              sx={{ minWidth: 180 }}
              size="small"
              onChange={handleProductChange}
              value={potential.product}
              options={(filteredProducts || []).flatMap(
                (item) => item.product_list || []
              )}
              getOptionLabel={(option) => option || "No Options"}
              label="Product"
              disabled={selectDis}
            />
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="current_buying_quantity"
              size="small"
              label="Current Buying Quantity Monthly"
              variant="outlined"
              value={potential.current_buying_quantity}
              onChange={handleTextChange}
            />
          </Grid>
        </Grid>

        {/* Submit */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              sx={{ marginTop: "20px" }}
              fullWidth
              type="submit"
              variant="contained"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
