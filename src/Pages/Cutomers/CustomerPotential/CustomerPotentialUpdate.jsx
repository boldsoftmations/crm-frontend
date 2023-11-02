import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import CustomerServices from "../../../services/CustomerService";

export const CustomerPotentialUpdate = ({
  idForEdit,
  getCompanyDetailsByID,
  setOpenModal,
}) => {
  const [open, setOpen] = useState(false);
  const [potential, setPotential] = useState(idForEdit);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPotential({ ...potential, [name]: value });
  };

  const handleAutocompleteChange = (_, value) => {
    setPotential({ ...potential, product: value });
  };
  console.log("potential", potential);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const data = {
        company: potential.company,
        product: potential.product,
        current_buying_quantity: potential.current_buying_quantity,
        remark: potential.remark,
      };
      await CustomerServices.updatePotentialCustomer(potential.id, data);
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
            <CustomTextField
              fullWidth
              disabled
              name="product"
              size="small"
              label="Product"
              variant="outlined"
              value={potential.product || ""}
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
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="remark"
              size="small"
              label="Remark"
              variant="outlined"
              value={potential.remark || ""}
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
