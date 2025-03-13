import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
  Button,
} from "@mui/material";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomPagination } from "../../Components/CustomPagination";
import SearchComponent from "../../Components/SearchComponent ";
import LeadServices from "../../services/LeadService";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import { CSVLink } from "react-csv";

export const LeadsTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leadsData, setLeadsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStageValue, setFilterStageValue] = useState("");
  const [filterReferenceValue, setFilterReferenceValue] = useState("");
  const [exportData, setExportData] = useState("");
  const csvLinkRef = useRef(null);
  const [referenceData, setReferenceData] = useState([]);
  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getCandidateFollowup = async () => {
    try {
      setIsLoading(true);
      const response = await LeadServices.LeadsRecordDatas(
        currentPage,
        searchQuery,
        filterStageValue,
        filterReferenceValue
      );
      setLeadsData(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching leadsData:", error);
    }
  };
  const FetchData = async (value) => {
    try {
      setIsLoading(true);
      const res = await LeadServices.getAllRefernces();
      setReferenceData(res.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    getCandidateFollowup();
  }, [currentPage, searchQuery, filterStageValue, filterReferenceValue]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handleFilterChange = (search) => {
    setFilterStageValue(search);
    setCurrentPage(1);
  };
  const handleFilterReferenceType = (filterValue) => {
    setFilterReferenceValue(filterValue);
    setCurrentPage(1);
  };
  //csv download function
  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await LeadServices.LeadsRecordDatas(
        "all",
        searchQuery,
        filterStageValue,
        filterReferenceValue
      );
      const data = response.data.map((row) => {
        return {
          date_time: row.date_time,
          company: row.company,
          contact: row.contact,
          assigned_by: row.assigned_by,
          assigned_to: row.assigned_to,
          name: row.name,
          stage: row.stage,
          source: row.source,
          updation_date: row.updation_date,
        };
      });
      return data;
    } catch (error) {
      console.log("while downloading Price list", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "Creation Date", key: "date_time" },
    { label: "Company", key: "company" },
    { label: "Contact", key: "contact" },
    { label: "Assigned By", key: "assigned_by" },
    { label: "Assigned To", key: "assigned_to" },
    { label: "Name", key: "name" },
    { label: "Stage", key: "stage" },
    { label: "Source", key: "source" },
    { label: "Updation Date", key: "updation_date" },
    ,
  ];
  return (
    <>
      <CustomLoader open={isLoading} />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
      />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDownload}
              >
                DownLoad CSV
              </Button>

              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Lead Record.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    visibility: "hidden",
                  }}
                />
              )}
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" justifyContent="center" marginBottom="10px">
                <h3
                  style={{
                    fontSize: "22px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Leads Record
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomAutocomplete
                fullWidth
                name="stage"
                size="small"
                disablePortal
                id="combo-box-stage"
                value={filterStageValue}
                onChange={(e, value) => handleFilterChange(value)}
                options={Stage}
                getOptionLabel={(option) => option}
                label="Filter By Stage"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <CustomAutocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-stage"
                value={filterReferenceValue}
                onChange={(e, value) => handleFilterReferenceType(value)}
                options={referenceData.map((option) => option.source)}
                getOptionLabel={(option) => option}
                label="Filter By References"
              />
            </Grid>
          </Grid>

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
                  <StyledTableCell align="center">
                    Creation Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Company Name</StyledTableCell>
                  <StyledTableCell align="center">Contact</StyledTableCell>
                  <StyledTableCell align="center">Assigned By</StyledTableCell>
                  <StyledTableCell align="center">Assigned To</StyledTableCell>
                  <StyledTableCell align="center">
                    Contact Person
                  </StyledTableCell>
                  <StyledTableCell align="center">Stage</StyledTableCell>
                  <StyledTableCell align="center">Source</StyledTableCell>
                  <StyledTableCell align="center">Updated Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leadsData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.date_time}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.contact}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.assigned_to}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.stage}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.source}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.updation_date}
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
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
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

const Stage = [
  "new",
  "open",
  "opportunity",
  "potential",
  "interested",
  "converted",
  "not_interested",
  "close",
  "duplicate",
];
