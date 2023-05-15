import React, { useEffect, useRef, useState } from "react";
import { CustomTable } from "../../../Components/CustomTable";
import { CustomLoader } from "../../../Components/CustomLoader";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CSVLink } from "react-csv";
import InventoryServices from "../../../services/InventoryService";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";

export const WeeklyProductionReport = () => {
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [weeklyProductionReportData, setWeeklyProductionReportData] = useState(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    getAllWeeklyProductionReportDetails();
  }, []);

  const getAllWeeklyProductionReportDetails = async () => {
    try {
      setOpen(true);
      const response =
        await InventoryServices.getAllWeeklyProductionReportData();

      setWeeklyProductionReportData(response.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setOpen(false);
    }
  };

  const handleErrorResponse = (err) => {
    if (!err.response) {
      setErrMsg(
        "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
      );
    } else if (err.response.status === 400) {
      setErrMsg(
        err.response.data.errors.name ||
          err.response.data.errors.non_field_errors
      );
    } else if (err.response.status === 401) {
      setErrMsg(err.response.data.errors.code);
    } else if (err.response.status === 404 || !err.response.data) {
      setErrMsg("Data not found or request was null/empty");
    } else {
      setErrMsg("Server Error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleResetClick = () => {
    setSearchQuery("");
  };

  // Filter the productionInventoryData based on the search query
  const filteredData = weeklyProductionReportData.filter((row) =>
    row.product__name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headers = [
    { label: "Seller Unit", key: "seller_account__unit" },
    { label: "Product", key: "product__name" },
    {
      label: "Product Unit",
      key: "product__unit__name",
    },

    { label: "Brand", key: "product__brand__name" },
    {
      label: "Week",
      key: "week",
    },
    {
      label: "Total Quantity",
      key: "total_quantity",
    },
  ];
  //   export to excel data
  let data = weeklyProductionReportData.map((row) => {
    return {
      seller_account__unit: row.seller_account__unit,
      product__name: row.product__name,
      product__unit__name: row.product__unit__name,
      product__brand__name: row.product__brand__name,
      week: row.week,
      total_quantity: row.total_quantity,
    };
  });

  const TableHeader = [
    "Seller Unit",
    "Product",
    "PRODUCT Unit",
    "Brand",
    "Week",
    "Total Quantity",
  ];

  const TableData = filteredData.map((row) => ({
    seller_account__unit: row.seller_account__unit,
    product__name: row.product__name,
    product__unit__name: row.product__unit__name,
    product__brand__name: row.product__brand__name,
    week: row.week,
    total_quantity: row.total_quantity,
  }));
  return (
    <>
      <CustomLoader open={open} />

      <Grid item xs={12}>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={0.9}>
              {" "}
              <TextField
                label="Search By Product"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery && (
                        <IconButton onClick={handleResetClick}>
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Weekly Production Report
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <CSVLink
                data={data}
                headers={headers}
                filename={"Weekly Production Report.csv"}
                target="_blank"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  height: "5vh",
                }}
              >
                <Button color="success" variant="contained">
                  Export to Excel
                </Button>
              </CSVLink>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable headers={TableHeader} data={TableData} />
        </Paper>
      </Grid>
    </>
  );
};
