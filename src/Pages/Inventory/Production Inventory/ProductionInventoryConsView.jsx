import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import { CustomTable } from "../../../Components/CustomTable";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { Box, Button, Grid, Paper } from "@mui/material";

export const ProductionInventoryConsView = () => {
  const [open, setOpen] = useState(false);
  const [productionInventoryData, setProductionInventoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getAllProductionInventoryDetails = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getAllConsProductionInventoryData();

      setProductionInventoryData(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllProductionInventoryDetails();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = productionInventoryData.filter((row) =>
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
                  Production Inventory Cons
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CSVLink
                  data={data}
                  headers={headers}
                  filename={"my-file.csv"}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                >
                  <Button variant="contained" color="success">
                    Export to Excel
                  </Button>
                </CSVLink>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={data}
            openInPopup={null}
            openInPopup2={null}
          />
        </Paper>
      </Grid>
    </>
  );
};
