import React, { useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Autocomplete, Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import ProductService from "../../../services/ProductService";

export const ProductObjectionsCreate = ({
  getProductObjectionDetails,
  setOpenPopup,
}) => {
  const [productObjection, setProductObjection] = useState([]);
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

  const createObjection = async (e) => {
    try {
      e.preventDefault();
      const req = {
        product: productObjection.product,
        question: productObjection.question,
        answer: productObjection.answer,
      };

      setOpen(true);
      await UserProfileService.createProductObjectionData(req);

      setOpenPopup(false);
      setOpen(false);
      getProductObjectionDetails();
    } catch (error) {
      setOpen(false);
      console.log("error create Objection", error);
    }
  };

  return (
    <>
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createObjection(e)}>
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
              value={productObjection.question || ""}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              name="answer"
              size="small"
              label="Answer"
              variant="outlined"
              value={productObjection.answer || ""}
              onChange={handleFormChange}
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
          Submit
        </Button>
      </Box>
    </>
  );
};
