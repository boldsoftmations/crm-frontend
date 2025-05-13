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
import MasterService from "../../services/MasterService";
import { useSelector } from "react-redux";

export const LeadVisitPlan = () => {
  const [open, setOpen] = useState(false);
  const [openVisitLog, setOpenVisitLog] = useState(false);
  const [visitLogId, setVisitLogId] = useState(null);
  const [leadData, setLeadData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [beatList, setBeatList] = useState([]);
  const [inputValue, setInputvalue] = useState({
    visited_by: "",
    beatid: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;
  const assigned = userData.active_sales_user || [];

  const visitedPersonOptions = useMemo(
    () =>
      assigned
        .filter((option) => option.groups__name === "Field Sales Executive")
        .map((option) => option.name),
    [assigned]
  );

  const [query, setQuery] = useState({
    VisitedPerson: "",
    isCompleted: null,
  });
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllCompanyDetails = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getFieldsSalesPersonLeadVisitPlan(
        currentPage,
        search,
        query.VisitedPerson,
        query.isCompleted
      );
      setLeadData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
      setOpen(false);
    } catch (error) {
      handleError(error);
      console.log("while getting company details", error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, search, query.VisitedPerson, query.isCompleted]);

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
    () => ["Company", "Created By", "Visit Person", "Creation Date", "Action"],
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

  const getBeatList = useCallback(async () => {
    try {
      const res = await MasterService.getLeadBeatlist();
      setBeatList(res.data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (modalOpen === true) {
      getBeatList();
    }
  }, [modalOpen]);

  //assign beat to sales person
  const handleAssigned = async (e) => {
    try {
      setOpen(true);
      if (!inputValue.beatid || !inputValue.visited_by) {
        return alert("Please select both option");
      }
      const payload = {
        beat: inputValue.beatid,
        visited_by: inputValue.visited_by,
      };
      const response = await CustomerServices.AssignBeatLeadToSalesPerson(
        payload
      );
      const successMessage = response.data.message;
      handleSuccess(successMessage);

      setTimeout(() => {
        setModalOpen(false);
        getAllCompanyDetails();
      }, 300);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
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
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                >
                  Assign Sales Person
                </Button>
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
                  Lead Visit
                </h3>
              </Grid>
              <Grid item xs={12} md={2}>
                <CustomAutocomplete
                  size="small"
                  fullWidth
                  onChange={(event, value) =>
                    handleChange(value && value, "VisitedPerson")
                  }
                  options={visitedPersonOptions}
                  getOptionLabel={(option) => `${option}`}
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
                {leadData.map((row, i) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center">{row.lead}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.created_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.visited_by}
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
            title="Visit detail"
            maxWidth="md"
          >
            <CustomerVisitView
              visitLogId={visitLogId}
              setOpenVisitLog={setOpenVisitLog}
              type="lead"
            />
          </Popup>
          <Popup
            maxWidth={"xl"}
            title={"Assign to sales person"}
            openPopup={modalOpen}
            setOpenPopup={setModalOpen}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomAutocomplete
                  sx={{
                    minWidth: 260,
                  }}
                  size="small"
                  onChange={(e, value) =>
                    setInputvalue((prev) => ({
                      ...prev,
                      beatid: value && value.id,
                    }))
                  }
                  options={beatList}
                  getOptionLabel={(option) => `${option.beat__name}`}
                  label={"Select beat Name"}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomAutocomplete
                  sx={{
                    minWidth: 260,
                  }}
                  size="small"
                  onChange={(e, value) =>
                    setInputvalue((prev) => ({
                      ...prev,
                      visited_by: value && value.email,
                    }))
                  }
                  options={assigned}
                  getOptionLabel={(option) => `${option.name}`}
                  label={"Select sales person name"}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={handleAssigned}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
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
