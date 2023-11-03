import React, { useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Autocomplete, Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";

export const ProductObjectionsUpdate = ({
  getProductObjectionDetails,
  setOpenPopup,
  recordForEdit,
}) => {
  const [productObjection, setProductObjection] = useState(
    recordForEdit || { product: "", question: "", answer: "" }
  );
  const [open, setOpen] = useState(false);
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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductObjection({ ...productObjection, [name]: value });
  };

  const updateProductObjection = async (e) => {
    e.preventDefault();
    setOpen(true);
    try {
      await UserProfileService.updateProductObjectionData(productObjection.id, {
        product: productObjection.product,
        question: productObjection.question,
        answer: productObjection.answer,
      });
      getProductObjectionDetails();
      setOpenPopup(false);
    } catch (error) {
      console.error("Error updating Objection", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box
        component="form"
        noValidate
        onSubmit={updateProductObjection}
        sx={{ mt: 2 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              style={{ minWidth: 180 }}
              size="small"
              onChange={(event, newValue) => {
                handleFormChange({
                  target: {
                    name: `product`,
                    value: newValue || "",
                  },
                });
              }}
              value={productObjection.product}
              options={product.map((option) => option.name)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              renderInput={(params) => (
                <CustomTextField {...params} label="Product" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="question"
              size="small"
              label="Question"
              variant="outlined"
              value={productObjection.question}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              minRows={4}
              name="answer"
              label="Answer"
              variant="outlined"
              value={productObjection.answer}
              onChange={handleFormChange}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Update Product Objection
        </Button>
      </Box>
    </>
  );
};
