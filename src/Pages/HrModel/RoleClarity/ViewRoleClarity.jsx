import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  styled,
  TableCell,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
  tableCellClasses,
  Typography,
} from "@mui/material";
import Hr from "../../../services/Hr";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import CreateRoleForm from "./CreateRoleClarity";
import DetailViewPage from "./DetailViewPage";

export const ViewRoleClarity = () => {
  const [roleClarity, setRoleClarity] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopUp] = useState(false);
  const [openPopupRoleClarity, setOpenPopupRoleClarity] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const getRoleClarityData = async () => {
    try {
      setLoader(true);
      const response = await Hr.getRoleClarity(currentPage, searchQuery);
      setRoleClarity(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching roleClarity:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getRoleClarityData();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handleView = (data) => {
    setSelectedRow(data);
    setOpenPopUp(true);
  };

  return (
    <Grid item xs={12}>
      <CustomLoader open={loader} />
      <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Role Clarity
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenPopupRoleClarity(true)}
            >
              Add
            </Button>
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
            marginTop: "20px",
          }}
        >
          <Table sx={{ minWidth: 1200 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">
                  Role Definition
                </StyledTableCell>
                <StyledTableCell align="center">
                  Responsibility Deliverable
                </StyledTableCell>
                <StyledTableCell align="center">
                  Tasks Activities{" "}
                </StyledTableCell>
                <StyledTableCell align="center">
                  Measurement metrics
                </StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roleClarity.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.role_definition}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.responsibility_deliverable}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.tasks_activities}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.measurement_metrics}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="outlined" onClick={() => handleView(row)}>
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
        <Popup
          fullScreen={true}
          title={"Role Details Page"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopUp}
        >
          <DetailViewPage data={selectedRow} />
        </Popup>

        <Popup
          fullScreen={true}
          title={"Create Role Clarity"}
          openPopup={openPopupRoleClarity}
          setOpenPopup={setOpenPopupRoleClarity}
        >
          <CreateRoleForm
            setOpenPopupRoleClarity={setOpenPopupRoleClarity}
            getRoleClarityData={getRoleClarityData}
          ></CreateRoleForm>
        </Popup>
      </Paper>
    </Grid>
  );
};
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
