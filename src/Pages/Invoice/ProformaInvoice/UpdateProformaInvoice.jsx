import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from "../../../Components/CustomTextField";
import InvoiceService from "../../../services/InvoiceService";
import { useSelector } from "react-redux";

const UpdateProformaInvoice = ({
  getProformaInvoiceData,
  idForEdit,
  setOpenPopup3,
}) => {
  const [transporter, setTransporter] = useState(idForEdit.transporter || "");
  const userData = useSelector((state) => state.auth.profile);
  const isInGroups = (...groups) => {
    groups.some((group) => userData.groups.includes(group));
  };

  // ✅ Set initial value when edit data comes
  useEffect(() => {
    if (idForEdit.transporter) {
      setTransporter(idForEdit.transporter);
    }
  }, [idForEdit]);

  const handleChange = (e) => {
    setTransporter(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const payload = { transporter_name: transporter };
      await InvoiceService.updateAllPerformaInvoiceData(
        idForEdit.pi_number,
        payload,
      );
      getProformaInvoiceData();
      setOpenPopup3(false);
    } catch (error) {
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
            value={transporter}
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
