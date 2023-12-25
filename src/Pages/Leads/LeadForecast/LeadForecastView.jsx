import React, { useEffect, useState } from "react";
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
import { LeadForecastCreate } from "./LeadForecastCreate";
import { LeadForecastUpdate } from "./LeadForecastUpdate";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import LeadServices from "../../../services/LeadService";
import { CustomPagination } from "../../../Components/CustomPagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const LeadForecastView = ({ recordForEdit }) => {
  const [open, setOpen] = useState(false);
  const [leadForecastData, setLeadForecastData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [leadForecastDataByID, setLeadForecastDataByID] = useState([]);
  const [selectedForecastId, setSelectedForecastId] = useState(null);
  const [quantity, setQuantity] = useState(null);
  const [currentRowData, setCurrentRowData] = useState(null);
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    getAllLeadDetails(currentPage);
  }, [currentPage, recordForEdit]);

  const getAllLeadDetails = async (page = 0) => {
    try {
      setOpen(true);
      const response = await LeadServices.getLeadForecast({ page });
      setLeadForecastData(response.data.results);
      const total = response.data.count;
      setPageCount(Math.ceil(total / 25));
      setOpen(false);
    } catch (err) {
      console.error("Error fetching lead forecast data:", err);
      setOpen(false);
    }
  };

  const closePopupAndUpdate = () => {
    setOpenPopup(false);
    getAllLeadDetails(currentPage);
  };
  return (
    <>
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
                        <Button
                          variant="contained"
                          onClick={() => {
                            setOpenPopup(true);
                            setCurrentRowData(row);
                            setLeadForecastDataByID(row);
                            setSelectedForecastId(row.id);
                            setQuantity(row.quantity);
                          }}
                        >
                          Edit
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
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
            leadForecastId={selectedForecastId}
            onUpdateSuccess={closePopupAndUpdate}
            initialQuantity={currentRowData.quantity}
            initialDate={currentRowData.anticipated_date}
          />
        </Popup>
      )}
    </>
  );
};
