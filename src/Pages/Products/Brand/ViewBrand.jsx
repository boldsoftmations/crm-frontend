import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateBrand } from "./CreateBrand";
import { UpdateBrand } from "./UpdateBrand";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomPagination } from "../../../Components/CustomPagination";
import { MessageAlert } from "../../../Components/MessageAlert";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import SearchComponent from "../../../Components/SearchComponent ";

export const ViewBrand = () => {
  const [brand, setBrand] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const {
    handleError,
    handleCloseSnackbar,
    alertInfo, // Make sure this line is added
  } = useNotificationHandling();

  useEffect(() => {
    getBrandList(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getBrandList = useCallback(async (page, query) => {
    try {
      setOpen(true);
      const response = await ProductService.getAllBrand(page, query);
      setBrand(response.data.results);
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

  const TableHeader = ["ID", "BRAND", "SHORT NAME", "ACTION"];
  const TableData = brand.map((value) => value);
  return (
    <>
      <MessageAlert
        open={alertInfo.open} // Updated to use alertInfo.open
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity} // Updated to use alertInfo.severity
        message={alertInfo.message} // Updated to use alertInfo.message
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
                Brand
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
        title={"Create Brand"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
        currentPage={currentPage}
        searchQuery={searchQuery}
      >
        <CreateBrand getBrandList={getBrandList} setOpenPopup={setOpenPopup2} />
      </Popup>
      <Popup
        title={"Update Brand"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateBrand
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getBrandList={getBrandList}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
