import { Box, Button, Grid } from "@mui/material";
import React, { useRef, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";
import CustomerServices from "../../services/CustomerService";

export const CompetitorCreate = (props) => {
  const { setOpenPopup, getCompetitors } = props;
  const [Competitors, setCompetitors] = useState("");
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const CompetitorCreate = async (e) => {
    try {
      e.preventDefault();
      const req = {
        name: Competitors,
      };

      setOpen(true);
      await CustomerServices.createCompetitorAPI(req);

      setOpenPopup(false);
      setOpen(false);
      getCompetitors();
    } catch (err) {
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
      <CustomLoader open={open} />
      <Box component="form" noValidate onSubmit={(e) => CompetitorCreate(e)}>
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

          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              name="Competitors"
              size="small"
              label="Competitors"
              variant="outlined"
              value={Competitors}
              onChange={(e) => setCompetitors(e.target.value)}
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
