import { Box, Grid, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import MasterService from "../../../services/MasterService";
import { CustomLoader } from "../../../Components/CustomLoader";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import CustomSnackbar from "../../../Components/CustomerSnackbar";

const ACTION_OPTIONS = ["KEEP", "MERGE", "REVIEW", "DEACTIVATE"];
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

const MergePincodeCreate = ({
  recordForEdit,
  setOpenMergePopup,
  getMasterPincode,
}) => {
  const [inputValue, setInputValue] = useState({
    old_pincode: "",
    canonical_pincode: "",
    action: "MERGE",
    status: "APPROVED",
    reason: "",
  });

  // What user types
  const [canonicalPincodeInput, setCanonicalPincodeInput] = useState("");

  const [isValidPincode, setIsValidPincode] = useState(false);

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (recordForEdit) {
      setInputValue((prev) => ({
        ...prev,
        old_pincode: recordForEdit && recordForEdit.id,
      }));
    }
  }, [recordForEdit]);

  const handleClose = () => {
    setAlertMsg((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const ValidatePincode = async () => {
    if (!canonicalPincodeInput.trim()) {
      setAlertMsg({
        open: true,
        severity: "warning",
        message: "Please enter a pincode.",
      });
      return;
    }

    try {
      setOpen(true);

      const response = await MasterService.ValidatePincode(
        recordForEdit.country,
        canonicalPincodeInput,
      );

      if (response && response.data) {
        const verified = response.data;

        setInputValue((prev) => ({
          ...prev,
          canonical_pincode: verified.id,
        }));

        setIsValidPincode(true);

        setAlertMsg({
          open: true,
          severity: "success",
          message: "Pincode verified successfully.",
        });
      } else {
        setIsValidPincode(false);

        setAlertMsg({
          open: true,
          severity: "error",
          message: "Invalid pincode.",
        });
      }
    } catch (error) {
      setIsValidPincode(false);

      setAlertMsg({
        open: true,
        severity: "error",
        message: "Invalid pincode.",
      });
    } finally {
      setOpen(false);
    }
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();

    try {
      setOpen(true);

      await MasterService.CreateMergePincode(inputValue);

      setAlertMsg({
        open: true,
        severity: "success",
        message: "Merge pincode created successfully.",
      });
      setOpenMergePopup(false);
      getMasterPincode();
    } catch (error) {
      setAlertMsg({
        open: true,
        severity: "error",
        message:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          "Something went wrong.",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />

      <CustomLoader open={open} />

      <Box component="form" noValidate onSubmit={onSubmitHandle} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Old Pincode"
              value={recordForEdit ? recordForEdit.pincode : ""}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                size="small"
                label="Canonical Pincode"
                value={canonicalPincodeInput}
                onChange={(e) => {
                  setCanonicalPincodeInput(e.target.value);

                  setIsValidPincode(false);

                  setInputValue((prev) => ({
                    ...prev,
                    canonical_pincode: "",
                  }));
                }}
                inputProps={{
                  readOnly: isValidPincode,
                }}
              />

              <Button
                variant="contained"
                onClick={ValidatePincode}
                disabled={isValidPincode}
              >
                Validate
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              options={ACTION_OPTIONS}
              value={inputValue.action}
              renderInput={(params) => (
                <TextField {...params} label="Action" size="small" />
              )}
              onChange={(event, newValue) => {
                setInputValue((prev) => ({
                  ...prev,
                  action: newValue || "",
                }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomAutocomplete
              options={STATUS_OPTIONS}
              value={inputValue.status}
              renderInput={(params) => (
                <TextField {...params} label="Status" size="small" />
              )}
              onChange={(event, newValue) => {
                setInputValue((prev) => ({
                  ...prev,
                  status: newValue || "",
                }));
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Reason"
              value={inputValue.reason}
              onChange={(e) =>
                setInputValue((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValidPincode}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default MergePincodeCreate;
