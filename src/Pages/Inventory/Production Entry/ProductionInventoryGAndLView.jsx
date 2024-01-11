import React, { useCallback, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomSearchWithButton } from "../../../Components/CustomSearchWithButton";
import { Box, Button, Grid, Paper } from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";

export const ProductionInventoryGAndLView = () => {
  const [open, setOpen] = useState(false);
  const [productionInventoryData, setProductionInventoryData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

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
    { label: "SELLER ACCOUNT", key: "seller_account" },
    { label: "PRODUCTION ENTRY", key: "production_entry" },
    { label: "PRODUCT", key: "product" },
    { label: "GAIN/LOSS", key: "gnl" },
    { label: "DATE", key: "date" },
    { label: "UNIT", key: "unit" },
    { label: "EXPECTED QUANTITY", key: "expected_quantity" },
    { label: "ACTUAL QUANTITY", key: "actual_quantity" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response =
          await InventoryServices.getProductionGAndLInventoryPaginateData(
            "all",
            searchQuery
          );
      } else {
        response =
          await InventoryServices.getProductionGAndLInventoryPaginateData(
            "all"
          );
      }
      const data = response.data.map((row) => {
        return {
          seller_account: row.seller_account,
          production_entry: row.production_entry,
          product: row.product,
          gnl: row.gnl,
          date: row.created_on,
          unit: row.unit,
          expected_quantity: row.expected_quantity,
          actual_quantity: row.actual_quantity,
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
    getAllProductionInventoryGAndLDetails(currentPage);
  }, [currentPage, getAllProductionInventoryGAndLDetails]);

  const getAllProductionInventoryGAndLDetails = useCallback(
    async (page, search = searchQuery) => {
      try {
        setOpen(true);
        const response =
          await InventoryServices.getAllProductionGAndLInventoryData(
            page,
            search
          );
        setProductionInventoryData(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.error("error", error);
      }
    },
    [searchQuery]
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const Tableheaders = [
    "SELLER ACCOUNT",
    "PRODUCTION ENTRY",
    "PRODUCT",
    "GAIN/LOSS",
    "DATE",
    "UNIT",
    "EXPECTED QUANTITY",
    "ACTUAL QUANTITY",
  ];

  const Tabledata = productionInventoryData.map((row, i) => ({
    seller_account: row.seller_account,
    production_entry: row.production_entry,
    product: row.product,
    gnl: row.gnl,
    date: row.created_on,
    unit: row.unit,
    expected_quantity: row.expected_quantity,
    actual_quantity: row.actual_quantity,
  }));

  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
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
                  onClick={() =>
                    getAllProductionInventoryGAndLDetails(
                      currentPage,
                      searchQuery
                    )
                  } // Call `handleSearch` when the button is clicked
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
                    getAllProductionInventoryGAndLDetails(1, "");
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Button variant="contained" onClick={handleDownload}>
                  Download CSV
                </Button>
                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Production Gain And Loss.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      height: "5vh",
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}></Grid>

              <Grid item xs={12} sm={3}>
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Production Gain And Loss
                </h3>
              </Grid>
              <Grid item xs={12} sm={3}></Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={null}
            openInPopup2={null}
          />

          <CustomPagination
            currentPage={currentPage}
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </>
  );
};
