import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { CustomTable } from "../../Components/CustomTable";
import { CSVLink } from "react-csv";
import { Box, Button, Grid, Paper } from "@mui/material";
import SearchComponent from "../../Components/SearchComponent ";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import ProductService from "../../services/ProductService";

export const PriceComparison = () => {
  const [open, setOpen] = useState(false);

  const [PriceComparisionData, setpriceComparisionData] = useState([]);

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
    { label: "ID", key: "id" },
    { label: "NAME", key: "name" },
    { label: "DESCRIPTION", key: "description__name" },
    { label: "SLAB 3 PRICE", key: "slab3_price" },
    { label: "RATE", key: "highest_rate" },
    { label: "SOURCE", key: "source" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      let response;
      if (searchQuery) {
        response = await ProductService.getPriceComparision(searchQuery);
      } else {
        response = await ProductService.getPriceComparision();
      }
      console.log(response);
      const data = response.data.data.map((row, index) => {
        return {
          id: index + 1,
          name: row.name,

          description__name: row.description__name,
          slab3_price: row.slab3_price,
          highest_rate: row.highest_rate,
          source: row.source,
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
    getAllPriceComparisionDataDetails();
  }, []);

  useEffect(() => {
    getAllPriceComparisionDataDetails(searchQuery);
  }, [searchQuery]);

  const getAllPriceComparisionDataDetails = useCallback(
    async (search = searchQuery) => {
      try {
        setOpen(true);
        const response = await ProductService.getPriceComparision(search);
        setpriceComparisionData(response.data.data);
      } catch (error) {
        handleError(error);
      } finally {
        setOpen(false);
      }
    },
    [searchQuery],
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  const Tableheaders = [
    "ID",
    "NAME",
    "DESCRIPTION",
    "SLAB 3 PRICE ",
    "RATE",
    "SOURCE",
  ];

  const Tabledata = PriceComparisionData.map((row, i) => ({
    id: i + 1,
    name: row.name,
    description__name: row.description__name,
    slab3_price: row.slab3_price,
    highest_rate: row.highest_rate,
    source: row.source,
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
            <Grid item sm={12} md={4}>
              <Box sx={{ flexGrow: 1, flexBasis: "40%", minWidth: "300px" }}>
                <SearchComponent
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Box>
            </Grid>
            <Grid item sm={12} md={4}>
              <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Price Comparision
                </h3>
              </Box>
            </Grid>
            <Grid item sm={12} md={4}>
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
          </Grid>
        </Box>
        <CustomTable
          headers={Tableheaders}
          data={Tabledata}
          Isviewable={false}
          openInPopup={null}
          openInPopup2={null}
        />
        \
      </Paper>
    </>
  );
};
