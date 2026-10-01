import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomTextField from "../../../Components/CustomTextField";
import TransportSelector from "../../../Components/TransportSelector";
import InvoiceService from "../../../services/InvoiceService";
import CustomerServices from "../../../services/CustomerService";
import LeadServices from "../../../services/LeadService";
import { buildTransportPayload } from "../../../utility/Buildtransportpayload";

const normalizeTransportMode = (mode) => {
  if (mode === "Train") return "TRAIN";
  if (mode === "Bus") return "BUS";
  if (mode === "Air") return "AIR";
  if (mode === "Self Pickup") return "SELF_PICKUP";
  return mode || "";
};

const getRelationId = (value) => {
  if (value && typeof value === "object" && value.id) {
    return value.id;
  }
  return value || null;
};

const getInitialTransportSelection = (piData) => {
  if (!piData) {
    return null;
  }

  const mappingId = getRelationId(piData.transporter_mapping);
  const transporterId = getRelationId(piData.transporter);
  const verifiedPincodeId = getRelationId(piData.verified_pincode);
  let mode = normalizeTransportMode(piData.selected_transport_mode);

  if (
    !mode &&
    (mappingId || verifiedPincodeId || piData.transporter_name === "To Be Assigned")
  ) {
    mode = "SURFACE";
  }

  if (!mode) {
    return null;
  }

  return {
    mode: mode,
    transporterId: transporterId,
    transporterName: piData.transporter_name || null,
    mappingId: mappingId,
    verifiedPincodeId: verifiedPincodeId,
    assignmentStatus: piData.transporter_assignment_status || null,
  };
};

const UpdateProformaInvoice = ({
  getProformaInvoiceData,
  idForEdit,
  setOpenPopup,
  handleError,
  handleSuccess,
}) => {
  const sellerData = useSelector((state) => state.auth.sellerAccount);
  const [countryId, setCountryId] = useState("");
  const [transportSelection, setTransportSelection] = useState(
    getInitialTransportSelection(idForEdit),
  );

  const effectiveSeller = Array.isArray(sellerData)
    ? sellerData.find((item) => {
        if (!item) {
          return false;
        }

        if (idForEdit && idForEdit.seller_id) {
          return String(item.id) === String(idForEdit.seller_id);
        }

        if (idForEdit && idForEdit.seller_account) {
          return (
            String(item.id) === String(idForEdit.seller_account) ||
            item.unit === idForEdit.seller_account
          );
        }

        return false;
      }) || null
    : null;

  useEffect(() => {
    setTransportSelection(getInitialTransportSelection(idForEdit));
  }, [idForEdit]);

  useEffect(() => {
    let active = true;

    const loadDestinationCountry = async () => {
      if (!idForEdit) {
        return;
      }

      try {
        let response = null;

        if (idForEdit.type === "customer" && idForEdit.company) {
          response = await CustomerServices.getCompanyDataById(idForEdit.company);
        } else if (idForEdit.type === "lead" && idForEdit.lead) {
          response = await LeadServices.getLeadsById(idForEdit.lead);
        }

        if (!active || !response || !response.data) {
          return;
        }

        setCountryId(response.data.country_id || "");
      } catch (error) {
        if (active) {
          console.error("Unable to load PI destination country:", error);
          setCountryId("");
        }
      }
    };

    loadDestinationCountry();

    return () => {
      active = false;
    };
  }, [idForEdit]);

  const handleSubmit = async () => {
    if (!transportSelection || !transportSelection.mode) {
      handleError("Please select a Transport Method.");
      return;
    }

    if (
      (transportSelection.mode === "COURIER" ||
        transportSelection.mode === "LOCAL_AGGREGATOR") &&
      (!transportSelection.transporterId || !transportSelection.transporterName)
    ) {
      handleError(
        "Please select a transporter for the selected Transport Method.",
      );
      return;
    }

    if (transportSelection.mode === "SURFACE") {
      const isMappedSurface =
        transportSelection.transporterId && transportSelection.mappingId;
      const isToBeAssigned =
        transportSelection.transporterName === "To Be Assigned" &&
        transportSelection.assignmentStatus === "Unassigned";

      if (!isMappedSurface && !isToBeAssigned) {
        handleError(
          "Please wait for Surface transporter lookup, then select a mapped transporter or continue as To Be Assigned.",
        );
        return;
      }
    }

    try {
      const payload = buildTransportPayload(transportSelection);

      const response = await InvoiceService.updateAllPerformaInvoiceData(
        idForEdit.pi_number,
        payload,
      );
      const successMessage =
        response.data.message || "Transport details updated successfully";
      handleSuccess(successMessage);

      getProformaInvoiceData();
      setOpenPopup(false);
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
            value={idForEdit && idForEdit.pi_number ? idForEdit.pi_number : ""}
            disabled={true}
          />
        </Grid>

        <Grid item xs={12}>
          <TransportSelector
            countryId={countryId}
            pincode={idForEdit && idForEdit.pincode ? idForEdit.pincode : ""}
            unitId={effectiveSeller ? effectiveSeller.id : ""}
            unitCode={effectiveSeller ? effectiveSeller.unit : ""}
            value={transportSelection}
            onChange={setTransportSelection}
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
