import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import CustomerServices from "../../../services/CustomerService";
import CustomSnackbar from "../../../Components/CustomerSnackbar";
import { CustomLoader } from "../../../Components/CustomLoader";

const DeleteConfirmation = ({
  data,
  getAllCompanyDetailsByID,
  setOpendletePopup,
}) => {
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setAlertMsg({ open: false });
  };
  const handledeleteContact = async () => {
    try {
      const res = await CustomerServices.deleteCustomerContact(data.id);
      if (res.status === 200) {
        setAlertMsg({
          message: res.message || "Contact has been deleted!",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          getAllCompanyDetailsByID();
          setOpendletePopup(false);
        }, 500);
      }
    } catch (err) {
      console.log("Error while deleting contact", err);
      setAlertMsg({
        message: "Error while deleting contact!",
        severity: "error",
        open: true,
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
      <CustomLoader open={open}></CustomLoader>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 350,
          margin: "auto",
        }}
      >
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => setOpendletePopup(false)}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handledeleteContact}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DeleteConfirmation;
