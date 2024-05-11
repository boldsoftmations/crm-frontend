import { Box, Button, Grid } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import ProductService from "../../../services/ProductService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomTextField from "../../../Components/CustomTextField";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

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

export const UpdateDescription = memo((props) => {
  const {
    recordForEdit,
    setOpenPopup,
    getDescriptions,
    currentPage,
    searchQuery,
  } = props;
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(recordForEdit);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDescription({ ...description, [name]: value });
  };

  const updatesdescription = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setOpen(true);
        const data = {
          name: description.name,
          consumable: description.consumable,
        };
        if (recordForEdit) {
          const response = await ProductService.updateDescription(
            description.id,
            data
          );
          const successMessage =
            response.data.message || "Description updated successfully";
          handleSuccess(successMessage);

          setTimeout(() => {
            setOpenPopup(false);
            getDescriptions(currentPage, searchQuery);
          }, 300);
        }
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

      <Box component="form" noValidate onSubmit={(e) => updatesdescription(e)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={recordForEdit.id || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Description"
              variant="outlined"
              value={description.name || ""}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Consumable"
              variant="outlined"
              value={description.consumable || ""}
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
          Update
        </Button>
      </Box>
    </>
  );
});
