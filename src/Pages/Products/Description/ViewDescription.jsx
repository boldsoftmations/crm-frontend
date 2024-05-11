import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import ProductService from "../../../services/ProductService";
import { Popup } from "./../../../Components/Popup";
import { CreateDescription } from "./CreateDescription";
import { UpdateDescription } from "./UpdateDescription";
import { CustomLoader } from "./../../../Components/CustomLoader";
import { CustomPagination } from "./../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";

export const ViewDescription = () => {
  const [description, setDescription] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
    } catch (error) {
      console.log("CSVLink Download error", error);
    }
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "DESCRIPTION", key: "name" },
    { label: "CONSUMABLE", key: "consumable" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await ProductService.getAllDescription("all", searchQuery);
      } else {
        response = await ProductService.getAllDescription("all");
      }
      const data = response.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          consumable: row.consumable,
        };
      });

      setOpen(false);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getDescriptions(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getDescriptions = useCallback(async (page, query) => {
    try {
      setOpen(true);
      const response = await ProductService.getAllDescription(page, query);
      setDescription(response.data.results);
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

  const TableHeader = ["ID", "DESCRIPTION", "CONSUMABLE", "ACTION"];

  const TableData = description.map((value) => ({
    id: value.id,
    name: value.name,
    consumable: value.consumable,
  }));
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
                Description
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
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Description.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
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
        title={"Create Description"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateDescription
          getDescriptions={getDescriptions}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        title={"Update Description"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateDescription
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getDescriptions={getDescriptions}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
