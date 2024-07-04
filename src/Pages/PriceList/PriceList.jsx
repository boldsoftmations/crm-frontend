import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { CSVLink } from "react-csv";

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
  const [exportData, setExportData] = useState([]);
  const [file, setFile] = useState(null);
  const [hideButton, setHideButton] = useState(true);
  const [hideUploadBtn, setHideUploadBtn] = useState(false);

  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();
  const csvLinkRef = useRef(null);
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
    getProduct();
  }, []);

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPriceList(
        currentPage,
        filterQuery,
        searchQuery
      );
      const data = response.data.results.map((row) => {
        return {
          id: row.id,
          product: row.product,
          slab1: row.slab1,
          slab1_price: row.slab1_price,
          slab2: row.slab2,
          slab2_price: row.slab2_price,
          slab3_price: row.slab3_price,
          validity: row.validity,
          discontinued: row.discontinued,
        };
      });
      console.log("data", data);
      setOpen(false);
      return data;
    } catch (error) {
      handleError(error);
      console.log("while downloading Price list", error);
    } finally {
      setOpen(false);
    }
  };

  const getPriceList = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPriceList(
        currentPage,
        filterQuery,
        searchQuery
      );
      setPriceListData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterQuery, searchQuery]);

  useEffect(() => {
    getPriceList();
  }, [currentPage, filterQuery, searchQuery]);

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
  const headers = [
    { label: "ID", key: "id" },
    { label: "Product", key: "product" },
    { label: "Slab1", key: "slab1" },
    { label: "Slab1 Price", key: "slab1_price" },
    { label: "Slab2", key: "slab2" },
    { label: "Slab2 Price", key: "slab2_price" },
    { label: "Slab3 Price", key: "slab3_price" },
    { label: "Validity", key: "validity" },
    { label: "Discontinued", key: "discontinued" },
  ];
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
  //upload CSV file
  const fileInputRef = useRef();
  //function for handling file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
    setHideButton(false);
    setHideUploadBtn(true);
  };
  //function for choosing file
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  //function for submitting files
  const UploadCSVfile = async (e) => {
    e.preventDefault();
    if (!file) {
      handleError("Please select a csv file");
      setHideUploadBtn(false);
      setHideButton(true);
      return false;
    }
    if (file.name !== "Price List.csv") {
      return handleError("Please select a only Price List.csv file");
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setOpen(true);
      const response = await ProductService.uploadCSVFile(formData);
      if (response.data.status == "success") {
        handleSuccess("File uploaded successfully");
      } else {
        handleError("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      handleError(error);
    } finally {
      setOpen(false);
      setHideButton(true);
      setHideUploadBtn(false);
    }
  };

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
              <Grid item xs={12} sm={4} md={4} lg={4}>
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
                sm={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <form onSubmit={UploadCSVfile}>
                  {hideButton && (
                    <Button
                      type="button"
                      variant="contained"
                      color="info"
                      onClick={handleButtonClick}
                      style={{ marginRight: "10px" }}
                    >
                      Choose CSV File
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".csv"
                    style={{ display: "none" }}
                  />
                  {hideUploadBtn && (
                    <Button variant="contained" type="submit" color="info">
                      Please Upload
                    </Button>
                  )}
                </form>
                <Button
                  variant="contained"
                  color="secondary"
                  className="mx-3"
                  onClick={handleDownload}
                >
                  DownLoad CSV
                </Button>

                {exportData.length > 0 && (
                  <CSVLink
                    data={exportData}
                    headers={headers}
                    ref={csvLinkRef}
                    filename="Price List.csv"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      outline: "none",
                      visibility: "hidden",
                    }}
                  />
                )}

                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenPopup2(true)}
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
