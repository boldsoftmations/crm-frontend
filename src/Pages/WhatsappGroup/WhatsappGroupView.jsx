import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Button, Grid, Paper, Snackbar } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";

export const WhatsappGroupView = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    getAllWhatsappGroup();
  }, [currentPage]);

  const getAllWhatsappGroup = async (
    page = currentPage,
    searchValue = searchQuery
  ) => {
    try {
      setOpen(true);
      const res = await CustomerServices.getAllWhatsappGroupData(
        page,
        searchValue
      );
      setWhatsappGroupData(res.data.results);
      setPageCount(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    }
    setOpen(false);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await CustomerServices.deleteWhatsappData(id);
      setWhatsappGroupData((prevData) =>
        prevData.filter((row) => row.whatsapp_group_id !== id)
      );
      setSnackbarMessage("Group deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Error deleting group");
    } finally {
      getAllWhatsappGroup(currentPage, searchQuery);
    }
  };

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        whatsapp_group_id: row.id,
        name: row.name,
        whatsapp_group: row.whatsapp_group,
      }))
    : [];

  const Tableheaders = ["Group Id", "Company ", "Group Name", "Action"];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setCurrentPage(1);
                    getAllWhatsappGroup(1, searchQuery);
                  }}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                    getAllWhatsappGroup(1, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Customer Whatsapp Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openDeletePopup={handleDelete}
          />
          <CustomPagination
            key={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Paper>
      </Grid>
    </>
  );
};
