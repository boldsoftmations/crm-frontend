import React, { useEffect, useState } from "react";
import { CustomTable } from "../../Components/CustomTable";
import { Box, Button, Grid, Paper } from "@mui/material";
import CustomerServices from "../../services/CustomerService";
import { CustomPagination } from "../../Components/CustomPagination";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomTextField from "../../Components/CustomTextField";

export const SalesPersonNotInGroup = () => {
  const [open, setOpen] = useState(false);
  const [whatsappGroupData, setWhatsappGroupData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getAllCustomerNotInGroupData(currentPage);
  }, [currentPage, searchQuery]);

  const getAllCustomerNotInGroupData = async () => {
    try {
      setOpen(true);
      const res = await CustomerServices.getSalesPersonNotInGroupData(
        currentPage,
        searchQuery
      );
      setWhatsappGroupData(res.data.results);
      setPageCount(Math.ceil(res.data.count / 25));
    } catch (err) {
      console.error(err);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setInputValue(event.target.value);
  };

  const Tabledata = Array.isArray(whatsappGroupData)
    ? whatsappGroupData.map((row) => ({
        company: row.name,
        whatsapp_group: row.whatsapp_group,
        sales_person_not_in_group: Array.isArray(
          row.member_details.not_user
        ) ? (
          row.member_details.not_user.map((assigned, id) => (
            <div
              key={id}
              style={{
                border: "1px solid #4caf50",
                borderRadius: "20px",
                color: "#4caf50",
              }}
            >
              {assigned}
            </div>
          ))
        ) : (
          <div
            style={{
              border: "1px solid #4caf50",
              borderRadius: "20px",
              color: "#4caf50",
            }}
          >
            row.member_details.not_user
          </div>
        ),
      }))
    : [];

  const Tableheaders = ["Company ", "Group ", "Sales Person Not In Group"];

  return (
    <>
      <CustomLoader open={open} />
      <Grid item xs={12}>
        <Paper sx={{ p: 2, m: 3, display: "flex", flexDirection: "column" }}>
          <Box display="flex" marginBottom="10px">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <CustomTextField
                  size="small"
                  label="Search"
                  variant="outlined"
                  value={inputValue}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSearchQuery(inputValue);
                    setCurrentPage(1);
                  }}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setInputValue("");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} alignItems={"center"}>
                <h3
                  style={{
                    textAlign: "center",
                    marginBottom: "1em",
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Sales Person Not In Group
                </h3>
              </Grid>
            </Grid>
          </Box>
          <CustomTable headers={Tableheaders} data={Tabledata} />
          <CustomPagination
            pageCount={pageCount}
            handlePageClick={handlePageClick}
          />
        </Paper>
      </Grid>
    </>
  );
};
