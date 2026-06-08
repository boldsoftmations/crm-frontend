import { Box, Button, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CustomTextField from "../../../Components/CustomTextField";
import CustomAutocomplete from "../../../Components/CustomAutocomplete";
import InvoiceService from "../../../services/InvoiceService";
import CustomerServices from "../../../services/CustomerService";

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
  const [transportList, setTransportList] = useState([]);

  console.log("Transporter name", idForEdit.transporter_name);
  console.log(idForEdit);

  // ✅ Set initial value when edit data comes
  useEffect(() => {
    if (idForEdit.transporter_name) {
      setTransporter(idForEdit.transporter_name);
    }
  }, [idForEdit]);

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

      getProformaInvoiceData();
      setOpenPopup(false);
    } catch (error) {
      handleError(error);
      console.log("Error while updating Proforma Invoice", error);
    }
  };

  const getTranportList = useCallback(async () => {
    try {
      const res = await CustomerServices.getTransportList(
        idForEdit && idForEdit.pincode,
      );
      console.log("idforedit data is:", idForEdit);
      console.log("data is :", res);
      const data = res && res.data ? res.data.results : [];
      setTransportList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Transport list error:", error);
      setTransportList([]);
    }
  }, [idForEdit]);

  useEffect(() => {
    getTranportList();
  }, []);

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
          <CustomAutocomplete
            fullWidth
            size="small"
            disablePortal
            id="transporter-autocomplete"
            options={transportList}
            value={transporter || ""}
            getOptionLabel={(option) =>
              typeof option === "object" && option !== null
                ? option.transporter || ""
                : option || ""
            }
            isOptionEqualToValue={(option, value) => {
              const optionVal =
                typeof option === "object" && option !== null
                  ? option.transporter || ""
                  : option || "";
              const selectedVal =
                typeof value === "object" && value !== null
                  ? value.transporter || ""
                  : value || "";
              return optionVal === selectedVal;
            }}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === "object") {
                setTransporter(newValue.transporter || "");
              } else {
                setTransporter(newValue || "");
              }
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Transporter Name"
                name="transporter"
              />
            )}
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
