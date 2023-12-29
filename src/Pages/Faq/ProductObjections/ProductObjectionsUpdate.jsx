import React, { useEffect, useState } from "react";
import UserProfileService from "../../../services/UserProfileService";
import { Box, Button, Grid } from "@mui/material";
import { CustomLoader } from "../../../Components/CustomLoader";
import ProductService from "../../../services/ProductService";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";

export const ProductObjectionsUpdate = ({
  getProductObjectionDetails,
  setOpenPopup,
  recordForEdit,
}) => {
  const [productObjection, setProductObjection] = useState(
    recordForEdit || { description: "", question: "", answer: "" }
  );
  const [open, setOpen] = useState(false);
  const [descriptionMenuData, setDescriptionMenuData] = useState([]);
  useEffect(() => {
    getDescriptionNoData();
  }, []);

  const getDescriptionNoData = async () => {
    try {
      const res = await ProductService.getNoDescription();
      setDescriptionMenuData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setProductObjection({ ...productObjection, [name]: value });
  };

  const updateProductObjection = async (e) => {
    e.preventDefault();
    setOpen(true);
    try {
      await UserProfileService.updateProductObjectionData(productObjection.id, {
        description: productObjection.description,
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
            <CustomAutocomplete
              sx={{ minWidth: 180 }}
              size="small"
              onChange={(event, newValue) => {
                handleFormChange({
                  target: {
                    name: `description`,
                    value: newValue || "",
                  },
                });
              }}
              value={productObjection.description}
              options={descriptionMenuData.map((option) => option.name)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              label="Description"
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
