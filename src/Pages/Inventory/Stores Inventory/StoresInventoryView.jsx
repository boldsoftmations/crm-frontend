import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { Popup } from "../../../Components/Popup";
import { StoresInventoryCreate } from "./StoresInventoryCreate";
import { Box, Button, Grid, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import CustomTextField from "../../../Components/CustomTextField";

export const StoresInventoryView = () => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const data = useSelector((state) => state.auth);
  const userData = data.profile;

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
    { label: "PRODUCT", key: "product" },
    { label: "SELLER STATE", key: "seller_account" },
    { label: "DESCRIPTION", key: "description" },
    { label: "DATE", key: "created_on" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "PENDING QUANTITY", key: "pending_quantity" },
    { label: "RATE", key: "rate" },
    { label: "AMOUNT", key: "amount" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await InventoryServices.getAllStoresInventoryDetails(
          "all",
          searchQuery
        );
      } else {
        response = await InventoryServices.getAllStoresInventoryDetails("all");
      }
      const data = response.data.map((row) => {
        return {
          product: row.product,
          seller_account: row.seller_account,
          description: row.description,
          created_on: row.created_on,
          unit: row.unit,
          quantity: row.quantity,
          pending_quantity: row.pending_quantity,
          rate: row.rate,
          amount: row.amount,
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
    getAllStoresInventoryDetails();
  }, []);

  useEffect(() => {
    getAllStoresInventoryDetails(currentPage);
  }, [currentPage, getAllStoresInventoryDetails]);

  const getAllStoresInventoryDetails = useCallback(
    async (page, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllStoresInventoryDetails(
          page,
          search
        );
        setStoresInventoryData(response.data.results);
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
    "PRODUCT",
    "SELLER STATE",
    "DESCRIPTION",
    "DATE",
    "UNIT",
    "QUANTITY",
    "PENDING QUANTITY",
    "RATE",
    "AMOUNT",
  ];

  const Tabledata = storesInventoryData.map((row, i) => ({
    product: row.product,
    seller_account: row.seller_account,
    description: row.description,
    created_on: row.created_on,
    unit: row.unit,
    quantity: row.quantity,
    pending_quantity: row.pending_quantity,
    rate: row.rate,
    amount: row.amount,
  }));

  return (
    <>
      <CustomLoader open={open} />
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
                  getAllStoresInventoryDetails(currentPage, searchQuery)
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
                  getAllStoresInventoryDetails(1, "");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Button onClick={handleDownload} variant="contained">
                Download CSV
              </Button>

              {exportData.length > 0 && (
                <CSVLink
                  data={[...exportData]}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Store Inventory.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Stores Inventory
              </h3>
            </Grid>
            <Grid item xs={12} sm={1}>
              {userData.groups.includes("Accounts") ||
                ("Prodction" && (
                  <Button
                    onClick={() => setOpenPopup(true)}
                    variant="contained"
                    color="success"
                  >
                    Add
                  </Button>
                ))}
            </Grid>
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
        <Popup
          maxWidth="xl"
          title={"Create Stores Inventory"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <StoresInventoryCreate
            setOpenPopup={setOpenPopup}
            getAllStoresInventoryDetails={getAllStoresInventoryDetails}
          />
        </Popup>
      </Paper>
    </>
  );
};
