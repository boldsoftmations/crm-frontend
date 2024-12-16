import React, { useCallback, useEffect, useState } from "react";
import {
  styled,
  TableCell,
  Paper,
  Button,
  Grid,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Table,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import CustomerServices from "../../../services/CustomerService";
import SearchComponent from "../../../Components/SearchComponent ";
import { CustomPagination } from "../../../Components/CustomPagination";
import { Popup } from "../../../Components/Popup";
import CapaDownload from "./CapaDownload";
import CapaImageView from "./CapaImagesView";
import { CustomLoader } from "../../../Components/CustomLoader";

export const CapaView = () => {
  const [open, setOpen] = useState(false);
  const [CCFData, setCCFData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [imageShow, setImageShow] = useState(false);
  const [imagesData, setImagesData] = useState(null);

  const getAllCAPAData = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCapaData(
        currentPage,
        searchQuery
      );
      console.log("data", response.data.results);
      setCCFData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getAllCAPAData();
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

  const handleGetData = (data) => {
    setRecordForEdit(data);
    setOpenPdf(true);
  };
  const handleImageShow = (data) => {
    setImageShow(true);
    setImagesData(data);
  };
  return (
    <>
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
                  Corrective & Preventive Action List
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
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">
                    complain_type
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CCFData.map((row, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="center">
                      {row.created_by}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.creation_date}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.complain_type}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => handleGetData(row)}
                      >
                        View
                      </Button>
                      <Button
                        color="secondary"
                        variant="outlined"
                        className="mx-3"
                        onClick={() => handleImageShow(row.document)}
                      >
                        Document View
                      </Button>
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

      <Popup
        fullScreen={true}
        title="Document Preview"
        openPopup={imageShow}
        setOpenPopup={setImageShow}
      >
        <CapaImageView imagesData={imagesData} setImageShow={setImageShow} />
      </Popup>
      <Popup
        fullScreen={true}
        title="Corrective And Preventive Action View"
        openPopup={openPdf}
        setOpenPopup={setOpenPdf}
      >
        <CapaDownload recordForEdit={recordForEdit} setOpenPdf={setOpenPdf} />
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
