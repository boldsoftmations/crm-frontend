import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomTable } from "../../../Components/CustomTable";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import { Box, Button, Paper, Typography } from "@mui/material";

export const StoresInventoryConsView = () => {
  const [open, setOpen] = useState(false);
  const [storesInventoryData, setStoresInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  useEffect(() => {
    getAllStoresInventoryDetails();
  }, []);

  const getAllStoresInventoryDetails = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllConsStoresInventoryData();
      setStoresInventoryData(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = storesInventoryData.filter((row) =>
    row.product__name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const Tableheaders = ["PRODUCT", "SELLER UNIT", "UNIT", "QUANTITY"];

  const headers = [
    { label: "PRODUCT", key: "product" },
    { label: "SELLER UNIT", key: "seller_account" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
  ];

  const data = filteredData.map((row) => {
    return {
      product: row.product__name,
      seller_account: row.seller_account,
      unit: row.product__unit,
      quantity: row.quantity,
    };
  });

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
          <Box sx={{ flexGrow: 1, minWidth: "300px" }}>
            <SearchComponent onSearch={handleSearch} onReset={handleReset} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              flexGrow: 2,
              textAlign: "center",
              margin: "0",
              fontSize: "24px",
              color: "rgb(34, 34, 34)",
              fontWeight: 800,
              minWidth: "150px",
            }}
          >
            Stores Inventory Cons
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              minWidth: "300px",
            }}
          >
            <CSVLink
              data={data}
              headers={headers}
              filename={"Stores Inventory Consolidate.csv"}
              target="_blank"
              style={{ textDecoration: "none", outline: "none" }}
            >
              <Button variant="contained" sx={{ marginRight: 1 }}>
                Download CSV
              </Button>
            </CSVLink>
          </Box>
        </Box>
        <CustomTable headers={Tableheaders} data={data} />
      </Paper>
    </>
  );
};
