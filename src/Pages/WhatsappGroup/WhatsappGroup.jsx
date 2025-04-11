import React, { useCallback, useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  Box,
  Paper,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomerServices from "../../services/CustomerService";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Popup } from "../../Components/Popup";
import { WhatsappGroupCreate } from "./WhatsappGroupCreate";

export const WhatsappGroup = () => {
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopupWhatsapp, setOpenPopupWhatsapp] = useState(false);
  const [error, setError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    getAllWhatsappGroup();
  }, [currentPage]);

  const getAllWhatsappGroup = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getWhatsappImageData(currentPage);
      setWhatsappGroupData(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }, []);

  useEffect(() => {
    if (error) {
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        setError(null);
      }, 1500);
    }
  }, [error]);

  const handleSendAgain = async (referenceId) => {
    try {
      setOpen(true);
      const res = {
        reference_id: referenceId,
      };
      await CustomerServices.resendWhatsappMessage(res);
    } catch (error) {
      console.log(error.message);
      if (error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setOpen(false);
    }
  };

  const handleBulkResend = async () => {
    try {
      setOpen(true);
      await CustomerServices.bulkResendMessage();
    } catch (error) {
      console.log(error.message);
      if (error.response) {
        setError(error.response.data.message);
      }
    } finally {
      setOpen(false);
    }
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const refreshData = async () => {
    await getAllWhatsappGroup();
  };

  return (
    <>
      <CustomLoader open={open} />
      <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
        <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1500}
            onClose={() => setOpenSnackbar(false)}
            message={error}
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Button
                color="success"
                variant="contained"
                onClick={() => setOpenPopupWhatsapp(true)}
                startIcon={<WhatsAppIcon />}
              >
                Whatsapp
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={10} sm={4}>
            <Button
              color="success"
              variant="contained"
              onClick={() => handleBulkResend()}
            >
              Bulk Resend
            </Button>
          </Grid>
        </Box>

        {Array.isArray(whatsappGroupData) &&
          whatsappGroupData.map((data, index) => (
            <Accordion key={data.id} sx={{ margin: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {data.type_of_customer} {data.type_of_customer ? "|" : ""}{" "}
                  Date: {formatDate(data.creation_date)} | All:{" "}
                  {data.messages_statistics.all} | Sent:{" "}
                  {data.messages_statistics.sent} | Failed:{" "}
                  {data.messages_statistics.unsent} | Queue:{" "}
                  {data.messages_statistics.queue} | Refrence ID:{" "}
                  {data.reference_id}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{data.message}</Typography>
              </AccordionDetails>
              <AccordionDetails>
                <Grid item xs={12} sm={1} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSendAgain(data.reference_id)}
                  >
                    Send Again
                  </Button>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        <Box sx={{ marginBottom: 4 }}>
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
          <Popup
            title={"Whatsapp Message Create"}
            openPopup={openPopupWhatsapp}
            setOpenPopup={setOpenPopupWhatsapp}
          >
            <WhatsappGroupCreate
              // getsetWhatsappGroupDetails={getsetWhatsappGroupDetails}
              setOpenPopup={setOpenPopupWhatsapp}
              refreshData={refreshData}
            />
          </Popup>
        </Box>
      </Paper>
    </>
  );
};
