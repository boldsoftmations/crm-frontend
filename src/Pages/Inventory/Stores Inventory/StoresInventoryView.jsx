import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { Popup } from "../../../Components/Popup";
import { StoresInventoryCreate } from "./StoresInventoryCreate";
import { Box, Button, Grid, Paper } from "@mui/material";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const StoresInventoryView = () => {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handleDownload = async () => {
    try {
      const data = await handleExport();
      setExportData(data);
      setTimeout(() => {
        csvLinkRef.current.link.click();
      });
      handleSuccess("CSV file downloaded successfully");
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
    getAllStoresInventoryDetails(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const getAllStoresInventoryDetails = useCallback(
    async (page, search = searchQuery) => {
      try {
        setOpen(true);
        const response = await InventoryServices.getAllStoresInventoryDetails(
          page,
          search
        );
        setStoresInventoryData(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 25));
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    []
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const Tableheaders = [
    "PRODUCT",
    "SOURCE",
    "SOURCE KEY",
    "SELLER STATE",
    "DESCRIPTION",
    "UNIT",
    "QUANTITY",
    "PENDING QUANTITY",
    "MFG. DATE",
    "EXPIRY DATE",
    "RATE",
    "AMOUNT",
  ];

  const Tabledata = storesInventoryData.map((row, i) => ({
    product: row.product,
    source: row.source,
    source_key: row.source_key,
    seller_account: row.seller_account,
    description: row.description,
    unit: row.unit,
    quantity:
      row.type_of_unit === "decimal" ? row.quantity : Math.floor(row.quantity),
    pending_quantity:
      row.type_of_unit === "decimal"
        ? row.pending_quantity
        : Math.floor(row.pending_quantity),
    created_on: row.created_on,
    expiry_date: row.expiry_date,
    rate: row.rate,
    amount: row.amount,
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
          <Grid container spacing={2} alignItems="center">
            <Box sx={{ flexGrow: 1, flexBasis: "40%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Stores Inventory
              </h3>
            </Box>

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
                onClick={handleDownload}
                variant="contained"
                sx={{ marginRight: 1 }}
              >
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
                    marginRight: 1,
                  }}
                />
              )}
              {/* {(userData.groups.includes("Accounts") ||
                userData.groups.includes("Director") ||
                userData.groups.includes("Production")) && (
                <Button
                  onClick={() => setOpenPopup(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              )} */}
            </Box>
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
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <Popup
          maxWidth="xl"
          title={"Create Stores Inventory"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <StoresInventoryCreate
            currentPage={currentPage}
            searchQuery={searchQuery}
            setOpenPopup={setOpenPopup}
            getAllStoresInventoryDetails={getAllStoresInventoryDetails}
          />
        </Popup>
      </Paper>
    </>
  );
};
