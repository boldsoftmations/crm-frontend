import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { CustomPagination } from "../../Components/CustomPagination";
import CustomerServices from "../../services/CustomerService";
import { Popup } from "../../Components/Popup";
import { CustomerVisitView } from "./CustomerVIsitView";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import SearchComponent from "../../Components/SearchComponent ";

export const CompanyDetails = () => {
  const [open, setOpen] = useState(false);
  const [openVisitLog, setOpenVisitLog] = useState(false);
  const [visitLogId, setVisitLogId] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState({
    filterValue: "",
    VisitedPerson: "",
    isCompleted: false,
  });
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllCompanyDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getFieldsSalesPersonVisitPlan(
        currentPage,
        search,
        query.filterValue,
        query.VisitedPerson,
        query.isCompleted
      );
      setCompanyData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("while getting company details", error);
    } finally {
      setOpen(false);
    }
  }, [
    currentPage,
    search,
    query.filterValue,
    query.VisitedPerson,
    query.isCompleted,
  ]);

  useEffect(() => {
    getAllCompanyDetails();
  }, [getAllCompanyDetails]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setCurrentPage(1);
  };
  const Tableheaders = useMemo(
    () => [
      "Company",
      "Created By",
      "Visit Person",
      "Planned Date",
      "Creation Date",
      "Action",
    ],
    []
  );

  const handleOpen = (data) => {
    const { visit_log } = data;
    setVisitLogId(visit_log);
    setOpenVisitLog(true);
  };

  const handleChange = (value, name) => {
    setQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
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
      <div>
        <div
          style={{
            padding: "16px",
            margin: "16px",
            boxShadow: "0px 3px 6px #00000029",
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
          }}
        >
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, value) =>
                    handleChange(value, "filterValue")
                  }
                  options={["Today", "Upcoming", "Missed"]}
                  getOptionLabel={(option) => option}
                  label="Filter By Visit Plan"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <h3
                  style={{
                    textAlign: "center",
                    fontSize: "22px",
                    color: "rgba(7, 7, 7, 0.96)",
                    fontWeight: 700,
                  }}
                >
                  Company Visit List
                </h3>
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, value) =>
                    handleChange(value, "VisitedPerson")
                  }
                  options={["Aditya"]}
                  getOptionLabel={(option) => option}
                  label="Filter Sales Person"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, value) =>
                    handleChange(value && value.value, "isCompleted")
                  }
                  options={completeOptions}
                  getOptionLabel={(option) => option.name}
                  label="Visit Status"
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            sx={{
              maxHeight: 400,
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
                <StyledTableRow>
                  {Tableheaders.map((header, i) => (
                    <StyledTableCell key={i} align="center">
                      {header}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {companyData.map((row, i) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">
                      {row.company}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.created_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.visited_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.planned_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.creation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.visit_log && (
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          onClick={() => handleOpen(row)}
                        >
                          View
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // marginTop: "2em",
            }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
          <Popup
            openPopup={openVisitLog}
            setOpenPopup={setOpenVisitLog}
            title="Customer visit detail"
            maxWidth="md"
          >
            <CustomerVisitView
              visitLogId={visitLogId}
              setOpenVisitLog={setOpenVisitLog}
            />
          </Popup>
        </div>
      </div>
    </>
  );
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    padding: 10,
    fontSize: 12,
    backgroundColor: "#006BA1",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: 8, // Remove padding from body cells
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

const completeOptions = [
  {
    name: "Completed",
    value: true,
  },
  {
    name: "Not Completed",
    value: false,
  },
];
