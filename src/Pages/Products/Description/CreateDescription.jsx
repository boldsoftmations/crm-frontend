import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

// const consume = [
//   {
//     value: "yes",
//     name: "Yes",
//   },

//   {
//     value: "no",
//     name: "No",
//   },
// ];

export const CreateDescription = memo((props) => {
  const { setOpenPopup, getDescriptions, currentPage, searchQuery } = props;
  const [description, setDescription] = useState([]);
  const [open, setOpen] = useState(false);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDescription({ ...description, [name]: value });
  };

  const createdescription = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: description.name,
          consumable: description.consumable,
        };
        const response = await ProductService.createDescription(data);
        const successMessage =
          response.data.message || "Description Created successfully";
        handleSuccess(successMessage);

        setTimeout(() => {
          setOpenPopup(false);
          getDescriptions(currentPage, searchQuery);
        }, 300);
      } catch (error) {
        handleError(error); // Handle errors from the API call
      } finally {
        setOpen(false); // Always close the loader
      }
    },
    [description, currentPage, searchQuery]
  );

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => createdescription(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Description"
              variant="outlined"
              value={description.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-select-small">Consumable</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="Consumable"
                name="consumable"
                onChange={handleInputChange}
              >
                <MenuItem value={"Yes"}>Yes </MenuItem>
                <MenuItem value={"No"}>No </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
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
});
