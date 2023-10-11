import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { Autocomplete, Box, Button, Grid } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import CustomTextField from "../../Components/CustomTextField";
import ProductService from "../../services/ProductService";

export const CustomerPotentialCreate = (props) => {
  const { recordForEdit, getCompanyDetailsByID, setOpenModal } = props;
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState([]);
  const [product, setProduct] = useState([]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const handleAutocompleteChange = (value) => {
    setPotential({ ...potential, ["product"]: value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);
      const data = {
        company: recordForEdit,
        product: potential.product,
        current_brand: potential.current_brand,
        current_buying_price: potential.current_buying_price,
        current_buying_quantity: potential.current_buying_quantity,
        target_price: potential.target_price,
        quantity: potential.quantity,
      };

      await CustomerServices.createPotentialCustomer(data);
      setOpenModal(false);
      await getCompanyDetailsByID();
      setOpen(false);
    } catch (error) {
      console.log("error:", error);
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={(e) => handleSubmit(e)}
        >
          <Grid container spacing={2}>
            <Grid item xs={24} sm={4}>
              <Autocomplete
                style={{
                  minWidth: 180,
                }}
                size="small"
                onChange={(e, value) => handleAutocompleteChange(value)}
                options={product.map((option) => option.name)}
                getOptionLabel={(option) => `${option ? option : "No Options"}`}
                renderInput={(params) => (
                  <CustomTextField {...params} label="Product Name" />
                )}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="current_brand"
                size="small"
                label="Current Brand"
                variant="outlined"
                value={potential.current_brand ? potential.current_brand : ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="current_buying_price"
                size="small"
                label="Current Buying Price"
                variant="outlined"
                value={
                  potential.current_buying_price
                    ? potential.current_buying_price
                    : ""
                }
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="current_buying_quantity"
                size="small"
                label="Current Buying Quantity"
                variant="outlined"
                value={
                  potential.current_buying_quantity
                    ? potential.current_buying_quantity
                    : ""
                }
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="target_price"
                size="small"
                label="Target Price"
                variant="outlined"
                value={potential.target_price ? potential.target_price : ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <CustomTextField
                fullWidth
                name="quantity"
                size="small"
                label="Quantity"
                variant="outlined"
                value={potential.quantity ? potential.quantity : ""}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Grid container justifyContent={"flex-end"}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
