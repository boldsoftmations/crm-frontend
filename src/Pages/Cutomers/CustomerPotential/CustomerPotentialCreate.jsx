import React, { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import ProductService from "../../../services/ProductService";
import CustomerServices from "../../../services/CustomerService";

const ProductAutocomplete = ({ products, onChange, potential }) => (
  <Autocomplete
    style={{ minWidth: 180 }}
    size="small"
    onChange={onChange}
    value={potential.product}
    options={products.map((option) => option.name)}
    getOptionLabel={(option) => `${option ? option : "No Options"}`}
    renderInput={(params) => (
      <CustomTextField {...params} label="Product Name" />
    )}
  />
);

export const CustomerPotentialCreate = ({
  recordForEdit,
  getCompanyDetailsByID,
  setOpenModal,
}) => {
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState({});
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setOpen(true);
        const res = await ProductService.getAllProduct();
        setProduct(res.data);
      } catch (err) {
        console.error("error potential", err);
      } finally {
        setOpen(false);
      }
    };

    fetchProduct();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  const handleAutocompleteChange = (_, value) => {
    setPotential({ ...potential, product: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const data = {
        company: recordForEdit,
        ...potential,
      };
      await CustomerServices.createPotentialCustomer(data);
      setOpenModal(false);
      await getCompanyDetailsByID();
    } catch (error) {
      console.error("error:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ProductAutocomplete
              products={product}
              potential={potential}
              onChange={handleAutocompleteChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="current_buying_quantity"
              size="small"
              label="Current Buying Quantity Monthly"
              variant="outlined"
              value={potential.current_buying_quantity || ""}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
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
