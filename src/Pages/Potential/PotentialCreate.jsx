import React, { useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material";
import LeadServices from "../../services/LeadService";

export const PotentialCreate = (props) => {
  const { leadsByID, getAllleadsData, product, setOpenModal } = props;
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  const handleAutocompleteChange = (value) => {
    setPotential({ ...potential, ["product"]: value });
  };

  let handleSubmit = (event) => {
    try {
      event.preventDefault();
      setOpen(true);
      const data = {
        lead: leadsByID.lead_id,
        product: potential.product,
        current_brand: potential.current_brand,
        current_buying_price: potential.current_buying_price,
        current_buying_quantity: potential.current_buying_quantity,
        target_price: potential.target_price,
        quantity: potential.quantity,
      };
      setOpen(true);
      LeadServices.createPotentialLead(data);

      setOpenModal(false);
      getAllleadsData();
      setOpen(false);
    } catch (error) {
      console.log("error :>> ", error);
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
                  <TextField {...params} label="Product Name" />
                )}
              />
            </Grid>
            <Grid item xs={24} sm={4}>
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
