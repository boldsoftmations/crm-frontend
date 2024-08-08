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
import CreateCompetancyAttribute from "./CreateCompentancyAttribute";
import { Popup } from "../../../Components/Popup";
import DetailView from "./DetailView";

export const ViewCompentancyAttribute = () => {
  const [competancyData, setCompetancyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openAttributePopUp, setOpenAttributePopUp] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openPopup, setOpenPopUp] = useState(false);

  const getCompetancyData = async () => {
    try {
      setLoader(true);
      const response = await Hr.getCompentancyAttribute();
      setCompetancyData(response.data.results);
      const total = response.data.count;
      setTotalPages(Math.ceil(total / 25));
    } catch (error) {
      console.error("Error fetching competancyData:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getCompetancyData();
  }, []);

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
    setOpenPopUp(true);
    setSelectedRow(data);
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
              Competency Attributes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAttributePopUp(true)}
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
                <StyledTableCell align="center">Role</StyledTableCell>
                <StyledTableCell align="center">Skill</StyledTableCell>
                <StyledTableCell align="center">Knowledge</StyledTableCell>
                <StyledTableCell align="center">Self-Image </StyledTableCell>
                <StyledTableCell align="center">Trait</StyledTableCell>
                <StyledTableCell align="center">Motive</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competancyData.map((row, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell align="center">{row.role}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.skill[0]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.knowledge[0]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.self_image[0]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.trait[0]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.motive[0]}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button onClick={() => handleView(row)}>View</Button>
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
          maxWidth="md"
          title="Create Competency
 Attribute"
          openPopup={openAttributePopUp}
          setOpenPopup={setOpenAttributePopUp}
        >
          <CreateCompetancyAttribute
            setOpenAttributePopUp={setOpenAttributePopUp}
            getCompetancyData={getCompetancyData}
          />
        </Popup>
        <Popup
          fullScreen={true}
          title="Competency Attribute"
          openPopup={openPopup}
          setOpenPopup={setOpenPopUp}
        >
          <DetailView setOpenPopUp={setOpenPopUp} data={selectedRow} />
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
