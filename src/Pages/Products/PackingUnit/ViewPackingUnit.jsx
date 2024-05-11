import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import ProductService from "../../../services/ProductService";
import { CreatePackingUnit } from "./CreatePackingUnit";
import { UpdatePackingUnit } from "./UpdatePackingUnit";
import { Popup } from "./../../../Components/Popup";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";
import { MessageAlert } from "../../../Components/MessageAlert";
import { CustomPagination } from "../../../Components/CustomPagination";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const ViewPackingUnit = () => {
  const [packingUnit, setPackingUnit] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getPackingUnits(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getPackingUnits = useCallback(async (page, query) => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPackingUnit(page, query);
      setPackingUnit(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, []);

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

  const openInPopup = (item) => {
    setRecordForEdit(item);
    setOpenPopup(true);
  };

  const TableHeader = ["ID", "PACKING UNIT", "SHORT NAME", "ACTION"];
  const TableData = packingUnit.map((value) => value);
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              p: 2,
            }}
          >
            {/* Search Component on the left */}
            <Box sx={{ flexGrow: 1, flexBasis: "40%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            {/* Title Text centered */}
            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Packing Unit
              </h3>
            </Box>

            {/* Add Button on the right */}
            <Box
              sx={{
                flexGrow: 1,
                flexBasis: "40%",
                display: "flex",
                justifyContent: "flex-end",
                minWidth: "300px",
              }}
            >
              <Button
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
              >
                Add
              </Button>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Packing Unit"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreatePackingUnit
          getPackingUnits={getPackingUnits}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        title={"Update Packing Unit"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdatePackingUnit
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getPackingUnits={getPackingUnits}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
