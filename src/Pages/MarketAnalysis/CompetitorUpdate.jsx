import { Box, Button, Grid } from "@mui/material";
import React, { useRef, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import CustomerServices from "../../services/CustomerService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";

export const CompetitorUpdate = (props) => {
  const { recordForEdit, setOpenPopup, getCompetitors } = props;
  const [open, setOpen] = useState(false);
  const [competitors, setCompetitors] = useState(recordForEdit);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCompetitors({ ...competitors, [name]: value });
  };

  const CompetitorUpdate = async (e) => {
    try {
      e.preventDefault();
      setOpen(true);
      const data = {
        name: competitors.name,
      };
      if (recordForEdit) {
        await CustomerServices.updateCompetitors(competitors.id, data);
        handleSuccess("Competitor Updated Successfully");
        setTimeout(() => {
          setOpenPopup(false);
        }, 300);
        setOpen(false);
        getCompetitors();
      }
    } catch (err) {
      handleError(err);
      console.log("error update color :>> ", err);
      setOpen(false);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => CompetitorUpdate(e)}>
        <Grid container spacing={2}>
          <p
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: errMsg ? "red" : "offscreen",
              textAlign: "center",
              color: "white",
              textTransform: "capitalize",
            }}
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Id"
              variant="outlined"
              value={competitors.id || ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              name="name"
              size="small"
              label="Competitor"
              variant="outlined"
              value={competitors.name || ""}
              onChange={handleInputChange}
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
};
