import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { LeadForecastUpdate } from "./LeadForecastUpdate";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import LeadServices from "../../../services/LeadService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const LeadForecastView = () => {
  const [open, setOpen] = useState(false);
  const [leadForecastData, setLeadForecastData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentRowData, setCurrentRowData] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getAllLeadDetails();
  }, [currentPage]);

  const getAllLeadDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.getLeadForecast(currentPage);
      setLeadForecastData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openInPopup = (data) => {
    setCurrentRowData(data);
    setOpenPopup(true);
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
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}></Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Lead Forecast Details
              </h3>
            </Box>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 440,
              "&::-webkit-scrollbar": {
                width: 15,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f2f2f2",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa9ac",
              },
            }}
          >
            <Table
              sx={{ minWidth: 700 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Id</StyledTableCell>
                  <StyledTableCell align="center">Lead Id</StyledTableCell>
                  <StyledTableCell align="center">Sales Person</StyledTableCell>
                  <StyledTableCell align="center">Product</StyledTableCell>
                  <StyledTableCell align="center">Month</StyledTableCell>
                  <StyledTableCell align="center">Quantity</StyledTableCell>
                  <StyledTableCell align="center">
                    Estimated Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(leadForecastData) &&
                  leadForecastData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{row.id}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row.lead || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.updated_by}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.month}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.quantity || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.anticipated_date || null}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button onClick={() => openInPopup(row)}>Edit</Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      {currentRowData && (
        <Popup
          title={"Update Lead Forecast"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <LeadForecastUpdate
            getAllLeadDetails={getAllLeadDetails}
            setOpenPopup={setOpenPopup}
            leadForecastData={currentRowData}
            currentPage={currentPage}
          />
        </Popup>
      )}
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: 0, // Remove padding from header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 0, // Remove padding from body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
