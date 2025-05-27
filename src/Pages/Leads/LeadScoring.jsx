import React, { useState, useEffect, useCallback } from "react";
import {
  Grid,
  Button,
  Paper,
  Box,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
} from "@mui/material";
import LeadServices from "../../services/LeadService";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import SearchComponent from "../../Components/SearchComponent ";
import { MessageAlert } from "../../Components/MessageAlert";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { UpdateLeads } from "./UpdateLeads";
import { Popup } from "../../Components/Popup";

export const LeadScoring = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAgenticLeadScoringData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await LeadServices.agenticLeadScoringData(
        currentPage,
        searchQuery
      );
      setCompanyData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getAgenticLeadScoringData();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tableheaders = [
    "company",
    "Name",
    "Stage",
    "Contact",
    "Alternate Contact",
    "Lead Score",
    "Assigned To",
    "reference",
    "Action",
  ];

  const openLeadbyId = (id) => {
    setRecordForEdit(id);
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
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search Component on the left */}
              <Grid item xs={12} md={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>

              {/* Title Text centered */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: { xs: "center", md: "center" } }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Agentic Lead Scoring
                </h3>
              </Grid>
            </Grid>
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
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {Tableheaders.map((header) => {
                    return (
                      <StyledTableCell align="center">{header}</StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {companyData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.alternate_contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.lead_score}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.reference}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        style={{ marginRight: "10px" }}
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() => openLeadbyId(row.lead_id)}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>

      <Popup
        fullScreen={true}
        title={"Update Leads"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateLeads
          leadsByID={recordForEdit}
          setOpenPopup={setOpenPopup}
          getAllleadsData={getAgenticLeadScoringData}
        />
      </Popup>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    backgroundColor: "#006BA1",
    color: theme.palette.common.white,
    fontWeight: "bold",
    textTransform: "uppercase",
    padding: 5,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 5,
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
