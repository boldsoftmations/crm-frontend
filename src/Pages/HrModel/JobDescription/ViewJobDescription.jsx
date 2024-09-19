import React, { useState, useEffect } from "react";
import {
  Container,
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
  Box,
  Grid,
} from "@mui/material";
import Hr from "../../../services/Hr";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import JobDescriptionForm from "./CreateJobDescription";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomLoader } from "../../../Components/CustomLoader";
import JobDescriptionDetail from "./ViewJdpdf";
import UpdateJobDescription from "./UpdateJobDescription";

const colors = {
  section1: "#f0f0f0",
  section2: "#e0f7fa",
  section3: "#ffecb3",
  section4: "#dcedc8",
};

export const ViewJobDescription = () => {
  const [jobDescription, setJobDescription] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openPopup2, setOpenPopup2] = useState(false);

  const getJobDescription = async () => {
    try {
      setLoader(true);
      const response = await Hr.getJobDescription(currentPage, searchQuery);
      setJobDescription(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching jobDescription:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getJobDescription();
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
    setOpenPopup2(true);
  };
  const handleEdit = (data) => {
    setSelectedRow(data);
    setOpenPopup(true);
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
              Job Description
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenPopup(true)}
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
                <StyledTableCell align="center">Job Title</StyledTableCell>

                <StyledTableCell align="center">
                  Occasional Duties
                </StyledTableCell>
                <StyledTableCell align="center">
                  Min Education Level
                </StyledTableCell>
                <StyledTableCell align="center">
                  Work Experience
                </StyledTableCell>
                <StyledTableCell align="center">
                  Special Skills and Abilities
                </StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobDescription.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">
                    {row.designation}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.occasional_duties}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.min_education_level}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.work_experience}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.ssa.join(" | ")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="text" onClick={() => handleView(row)}>
                      View
                    </Button>
                    <Button
                      variant="text"
                      color="success"
                      onClick={() => handleEdit(row)}
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
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <Popup
          fullScreen={true}
          title={"Create Job Description"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <JobDescriptionForm
            getJobDescription={getJobDescription}
            setOpenPopup={setOpenPopup}
          />
        </Popup>
        <Popup
          fullScreen={true}
          title={"Update Job Description"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <UpdateJobDescription
            data={selectedRow}
            getJobDescription={getJobDescription}
            setOpenPopup={setOpenPopup}
          />
        </Popup>
        <Popup
          fullScreen={true}
          title={"View Job Description"}
          openPopup={openPopup2}
          setOpenPopup={setOpenPopup2}
        >
          <JobDescriptionDetail job={selectedRow} />
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
