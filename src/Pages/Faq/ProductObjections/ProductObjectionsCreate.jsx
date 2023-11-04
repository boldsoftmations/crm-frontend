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

  const createObjection = async (e) => {
    try {
      e.preventDefault();
      const req = {
        description: productObjection.description,
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
                    name: `description`,
                    value: newValue || "",
                  },
                });
              }}
              value={productObjection.description}
              options={descriptionMenuData.map((option) => option.name)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              renderInput={(params) => (
                <CustomTextField {...params} label="Description" />
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
