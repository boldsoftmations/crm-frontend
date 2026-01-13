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
import UploadCSV from "./UploadCSV";
import CustomTextField from "../../Components/CustomTextField";
import CustomSnackbar from "../../Components/CustomerSnackbar";
import MasterService from "../../services/MasterService";

export const PriceList = () => {
  const [priceListData, setPriceListData] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupUpdateValidity, setOpenPopupUpdateValidity] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [product, setProduct] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [openCSVFile, setOpenCSVFile] = useState(false);
  const [validityDate, setValidityDate] = useState(null);

  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const [alertmsg, setAlertMsg] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const handleClose = () => {
    setAlertMsg({ open: false });
  };

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
  const [ZoneOption, setZoneOption] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null); // UI
  const [zoneFilter, setZoneFilter] = useState(""); // ID

  useEffect(() => {
    getProduct();
  }, []);

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPriceList(
        "all",
        filterQuery,
        searchQuery,
        zoneFilter
      );
      const data = response.data.map((row) => {
        return {
          id: row.id,
          product: row.product,
          zone: row.zone,
          slab1: row.slab1,
          slab1_price: row.slab1_price,
          slab2: row.slab2,
          slab2_price: row.slab2_price,
          slab3_price: row.slab3_price,
          validity: row.validity,
          discontinued: row.discontinued,

          description: row.description,
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

  const handleZone = async () => {
    const res = await MasterService.getZoneMasterList();
    setZoneOption(res.data.results);
  };
  useEffect(() => {
    handleZone();
  }, []);

  const getPriceList = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllPriceList(
        currentPage,
        filterQuery,
        searchQuery,
        zoneFilter
      );
      setPriceListData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, filterQuery, searchQuery, zoneFilter]);

  useEffect(() => {
    getPriceList();
  }, [currentPage, filterQuery, searchQuery, zoneFilter]);

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
    zone: row.zone,
    slab1: row.type_of_unit === "decimal" ? row.slab1 : Math.floor(row.slab1),
    slab1_price: row.slab1_price,
    slab2: row.type_of_unit === "decimal" ? row.slab2 : Math.floor(row.slab2),
    slab2_price: row.slab2_price,
    slab3_price: row.slab3_price,
    validity: row.validity,
    discontinued: row.discontinued,
    description: row.description,
  }));

  const Tableheaders = [
    "ID",
    "Product",
    "Zone",
    "Slab1",
    "Price1",
    "Slab2",
    "Price2",
    "Slab3 Price",
    "Validity",
    "Discontinued",
    "Description",
    "Action",
  ];
  const headers = [
    { label: "ID", key: "id" },
    { label: "Product", key: "product" },
    { label: "Zone", key: "zone" },
    { label: "Slab1", key: "slab1" },
    { label: "Price1", key: "slab1_price" },
    { label: "Slab2", key: "slab2" },
    { label: "Price2", key: "slab2_price" },
    { label: "Slab3 Price", key: "slab3_price" },
    { label: "Validity", key: "validity" },
    { label: "Discontinued", key: "discontinued" },
    { label: "Description", key: "description" },
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

  //update validity data

  const handleValidityDateChange = (event) => {
    setValidityDate(event.target.value);
  };
  const updateProductValidity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        validity: validityDate,
      };
      console.log(payload);
      const response = await ProductService.updatePriceListValidity(payload);
      const successMessage =
        response.data.message || "Product Updated successfully";
      setAlertMsg({ open: true, message: successMessage, severity: "success" });
      setTimeout(() => {
        setOpenPopupUpdateValidity(false);
        getPriceList(currentPage, filterQuery, searchQuery);
      }, 300);
    } catch (error) {
      handleError(error); // Handle errors from the API call
    }
  };
  const handleZoneFilter = (selectedOption) => {
    setSelectedZone(selectedOption); // 👈 keep object for UI
    setZoneFilter((selectedOption && selectedOption.id) || ""); // 👈 store ID for API

    console.log("Selected ID:", selectedOption && selectedOption.id);
  };

  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomSnackbar
        open={alertmsg.open}
        message={alertmsg.message}
        severity={alertmsg.severity}
        onClose={handleClose}
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
                </Box>
              </Grid>

              {/* Title Text */}
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
                    sx={{ flexGrow: 1, mr: 1 }}
                    size="small"
                    value={selectedZone} // 👈 object, not ID
                    onChange={(event, value) => handleZoneFilter(value)}
                    options={ZoneOption}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    label="Filter By Zone"
                  />
                </Box>
              </Grid>

              {/* Add Button */}
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => setOpenCSVFile(true)}
                    // style={{ marginRight: "10px" }}
                  >
                    Upload CSV File
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
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
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <SearchComponent
                  sx={{ flexGrow: 1 }} // Allow SearchComponent to also take up available space
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "rgb(34, 34, 34)",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  Price List
                </h3>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => setOpenPopup2(true)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={() => setOpenPopupUpdateValidity(true)}
                  >
                    Update Validity
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={openInPopup}
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
          selectedZone={selectedZone}
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
      <Popup
        title={"Upload Price List CSV file"}
        openPopup={openCSVFile}
        setOpenPopup={setOpenCSVFile}
      >
        <UploadCSV
          setOpenCSVFile={setOpenCSVFile}
          getProduct={getProduct}
        ></UploadCSV>
      </Popup>
      <Popup
        title={"Update Product Validity Date"}
        openPopup={openPopupUpdateValidity}
        setOpenPopup={setOpenPopupUpdateValidity}
      >
        <Grid container spacing={2} minWidth={350}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              variant="outlined"
              size="small"
              type="date"
              label="Validity Date"
              name="validity"
              InputLabelProps={{
                shrink: true,
              }}
              value={validityDate}
              onChange={handleValidityDateChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              onClick={updateProductValidity}
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Popup>
    </>
  );
};

const Filter_Option = ["valid", "expired"];
