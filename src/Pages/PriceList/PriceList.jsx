import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import ProductService from "../../services/ProductService";
import { useNotificationHandling } from "../../Components/useNotificationHandling ";
import { MessageAlert } from "../../Components/MessageAlert";
import { CustomLoader } from "../../Components/CustomLoader";
import CustomAutocomplete from "../../Components/CustomAutocomplete";
import SearchComponent from "../../Components/SearchComponent ";
import { CustomTable } from "../../Components/CustomTable";
import { CustomPagination } from "../../Components/CustomPagination";
import { Popup } from "../../Components/Popup";
import { UpdatePriceList } from "./UpdatePriceList";
import { CreatePriceList } from "./CreatePriceList";

export const PriceList = () => {
  const [priceListData, setPriceListData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [product, setProduct] = useState([]);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllProduct();
      setProduct(res.data);
      setOpen(false);
    } catch (err) {
      console.error("error Product in pricelist", err);
      setOpen(false);
    }
  };

  useEffect(() => {
    getPriceList(currentPage, filterQuery, searchQuery);
  }, [currentPage, filterQuery, searchQuery]);

  const getPriceList = useCallback(async (page, filter, query) => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPriceList(
        page,
        filter,
        query
      );
      setPriceListData(response.data.results);
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

  const handleFilter = (query) => {
    setFilterQuery(query);
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

  const Tabledata = priceListData.map((row) => ({
    id: row.id,
    product: row.product,
    slab1: row.slab1,
    slab1_price: row.slab1_price,
    slab2: row.slab2,
    slab2_price: row.slab2_price,
    slab3_price: row.slab3_price,
    validity: row.validity,
    discontinued: row.discontinued,
  }));

  const Tableheaders = [
    "ID",
    "Product",
    "Slab1",
    "Slab1 Price",
    "Slab2",
    "Slab2 Price",
    "Slab3 Price",
    "Validity",
    "Discontinued",
    "Action",
  ];

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
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Search Component and Filter */}
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    mt: 1,
                    alignItems: "center",
                  }}
                >
                  <CustomAutocomplete
                    sx={{ flexGrow: 1, mr: 1 }} // Give it flexibility to grow and a margin to the right
                    size="small"
                    value={filterQuery}
                    onChange={(event, value) => handleFilter(value)}
                    options={Filter_Option}
                    getOptionLabel={(option) => option}
                    label="Filter By Description"
                  />
                  <SearchComponent
                    sx={{ flexGrow: 1 }} // Allow SearchComponent to also take up available space
                    onSearch={handleSearch}
                    onReset={handleReset}
                  />
                </Box>
              </Grid>

              {/* Title Text */}
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                sx={{ textAlign: "center" }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                  }}
                >
                  Price List
                </h3>
              </Grid>

              {/* Add Button */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  onClick={() => setOpenPopup2(true)}
                  variant="contained"
                  color="success"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
            openInPopup2={null}
            openInPopup3={null}
            openInPopup4={null}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        title={"Create Price List"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreatePriceList
          getPriceList={getPriceList}
          setOpenPopup={setOpenPopup2}
          product={product}
          currentPage={currentPage}
          filterQuery={filterQuery}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        title={"Update Price List"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdatePriceList
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getPriceList={getPriceList}
          product={product}
          currentPage={currentPage}
          filterQuery={filterQuery}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};

const Filter_Option = ["valid", "expired"];
