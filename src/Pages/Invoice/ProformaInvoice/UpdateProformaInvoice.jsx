import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from "../../../Components/CustomTextField";
import InvoiceService from "../../../services/InvoiceService";
// import { useSelector } from "react-redux";

const UpdateProformaInvoice = ({
  getProformaInvoiceData,
  idForEdit,
  setOpenPopup,
  handleError,
  handleSuccess,
}) => {
  const [transporter, setTransporter] = useState(
    idForEdit.transporter_name || "",
  );

  console.log("Transporter name", idForEdit.transporter_name);
  console.log(idForEdit);
  // const isInGroups = (...groups) => {
  //   groups.some((group) => userData.groups.includes(group));
  // };

  // ✅ Set initial value when edit data comes
  useEffect(() => {
    if (idForEdit.transporter_name) {
      setTransporter(idForEdit.transporter_name);
    }
  }, [idForEdit]);

  const handleChange = (e) => {
    setTransporter(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const payload = { transporter_name: transporter };

      const response = await InvoiceService.updateAllPerformaInvoiceData(
        idForEdit.pi_number,
        payload,
      );
      const successMessage =
        response.data.message || "Transport Name updated successfully";
      handleSuccess(successMessage);
      // console.log(response.data.message);

      getProformaInvoiceData();

      setOpenPopup(false); // move here
    } catch (error) {
      handleError(error);
      console.log("Error while updating Proforma Invoice", error);
    }
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            size="small"
            label="PI Number"
            value={idForEdit.pi_number || ""}
            disabled={true}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextField
            fullWidth
            size="small"
            name="transporter"
            label="Transporter Name"
            value={transporter || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateProformaInvoice;
