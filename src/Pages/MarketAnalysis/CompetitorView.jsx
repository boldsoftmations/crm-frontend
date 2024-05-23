import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CompetitorUpdate } from "./CompetitorUpdate";
import { Popup } from "./../../Components/Popup";
import { CustomLoader } from "./../../Components/CustomLoader";
import { CustomPagination } from "./../../Components/CustomPagination";
import { CustomTable } from "../../Components/CustomTable";
import CustomerServices from "../../services/CustomerService";
import { CompetitorCreate } from "./CompetitorCreate";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import SearchComponent from "../../Components/SearchComponent ";

export const CompetitorView = () => {
  const [allCompetitors, setAllCompetitors] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getCompetitors = useCallback(async () => {
    try {
      setOpen(true);
      const response = await CustomerServices.getAllCompetitors(
        currentPage,
        searchQuery
      );
      setAllCompetitors(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]); // Ensure dependencies are correctly listed

  useEffect(() => {
    getCompetitors();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page with new search
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page with no search query
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };
  const TableHeader = ["ID", "Competitor", "ACTION"];
  const TableData = allCompetitors && allCompetitors.map((value) => value);

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
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    textAlign: "left",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Competitor
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Competitor"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CompetitorCreate
          getCompetitors={getCompetitors}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
      <Popup
        title={"Update Competitor"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CompetitorUpdate
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getCompetitors={getCompetitors}
        />
      </Popup>
    </>
  );
};
