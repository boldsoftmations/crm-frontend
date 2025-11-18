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
    product: null,
    current_buying_quantity: "",
  });

  const [productList, setProductList] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectDis, setSelectDis] = useState(true);
  const [mypotential, setMyPotential] = useState({ description: null });

  const [alertMsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => setAlertMsg({ open: false });

  // Fetch product descriptions ONCE
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setOpen(true);
        const res = await CustomerServices.getAllProductDescription();
        setProductList(res.data.results || []);
      } catch (err) {
        console.error("Error fetching product list:", err);
      } finally {
        setOpen(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle description selection
  const handleDescriptionChange = (event, selectedOption) => {
    if (!selectedOption) {
      setMyPotential({ description: null });
      setProductData([]);
      setSelectDis(true);
      return;
    }

    setMyPotential({ description: selectedOption });

    CustomerServices.getproductToDescription(selectedOption.id)
      .then((res) => {
        setProductData(res.data || []);
      })
      .catch((err) => console.error(err));

    setSelectDis(false);
    setPotential((prev) => ({ ...prev, product: null }));
  };

  // Handle product selection
  const handleProductChange = (event, value) => {
    setPotential((prev) => ({
      ...prev,
      product: value,
    }));
  };

  // Handle input fields
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setPotential((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);

      const payload = {
        company: recordForEdit,
        product: potential.product.name, // ID only
        current_buying_quantity: potential.current_buying_quantity,
      };
      console.log(payload);

      await CustomerServices.createPotentialCustomer(payload);

      setAlertMsg({
        message: "Potential customer created successfully!",
        severity: "success",
        open: true,
      });

      setPotential({
        product: null,
        current_buying_quantity: "",
      });

      setMyPotential({ description: null });
      setSelectDis(true);

      setOpenModal(false);
      await getCompanyDetailsByID();
    } catch (error) {
      setAlertMsg({
        message:
          (error.response && error.response.data.message) ||
          "Error creating potential customer",
        severity: "error",
        open: true,
      });
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
              name="description"
              value={mypotential.description}
              onChange={handleDescriptionChange}
              options={productList}
              getOptionLabel={(option) => (option && option.name) || ""}
              label="Description"
            />
          </Grid>

          {/* Product */}
          <Grid item xs={12} sm={6}>
            <CustomAutocomplete
              sx={{ minWidth: 180 }}
              size="small"
              value={potential.product}
              onChange={handleProductChange}
              options={productData}
              getOptionLabel={(option) =>
                (option && option.name) || "No Options"
              }
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
              value={potential.current_buying_quantity}
              onChange={handleTextChange}
            />
          </Grid>
        </Grid>

        {/* Submit */}
        <Grid container>
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
