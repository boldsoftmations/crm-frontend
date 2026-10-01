import React from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Box, Grid, Button, TextField, Checkbox } from "@mui/material";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import MasterService from "../../../services/MasterService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

export const CreateAlias = ({
  recordForEdit,
  getMasterPincode,
  setOpenAlisaPopup,
}) => {
  const [open, setOpen] = React.useState(false);
  //pincode ,alias name,alias type,
  const [inputValue, setInputValue] = React.useState({
    postal_code: recordForEdit.pincode || "",
    alias_name: "",
    alias_type: "",
    source: "Manual",
    is_active: true,
    is_primary: true,
  });
  const [alertmsg, setAlertMsg] = React.useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const aliasDropDown = [
    "Area",
    "Village",
    "Sector",
    "Landmark",
    "Industrial Area",
  ];

  const handleOnChnage = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      setOpen(true);
      e.preventDefault();
      await MasterService.CreateMasterPincode(inputValue);
      setAlertMsg({
        message: "Alias created successfully!",
        severity: "success",
        open: true,
      });
      setOpenAlisaPopup(false);
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    } finally {
      setOpen(false);
      getMasterPincode();
    }
  };

  const Source = ["Manual", "India Post", "Customer"];

  const isDisabled =
    !inputValue.alias_name.trim() ||
    !inputValue.alias_type ||
    !inputValue.source;
  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pin Code"
              name="postal_code"
              size="small"
              value={inputValue.postal_code}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  postal_code: e.target.value,
                }))
              }
              required
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              name="alias_type"
              size="small"
              label="Alias Type"
              value={inputValue.alias_type}
              options={aliasDropDown}
              optionLabel={(option) => option}
              fullWidth
              onChange={(e, newValue) =>
                setInputValue((prev) => ({ ...prev, alias_type: newValue }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <CustomAutocomplete
              name="source"
              size="small"
              label="Source"
              value={inputValue.source}
              options={Source}
              optionLabel={(option) => option}
              fullWidth
              onChange={(e, newValue) =>
                setInputValue((prev) => ({ ...prev, source: newValue }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Alias Name"
              name="alias_name"
              size="small"
              value={inputValue.alias_name}
              onChange={handleOnChnage}
            />
          </Grid>

          <Grid item xs={12}>
            <Checkbox
              checked={inputValue.is_active}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              name="status"
            />
            <label>Active</label>

            <Checkbox
              checked={inputValue.is_primary}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  is_primary: e.target.checked,
                }))
              }
              name="primary"
            />
            <label>Primary</label>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
            >
              Create Alias
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
