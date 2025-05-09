import React, { useCallback, useEffect, useState } from "react";
import { Grid, Button, Paper, Box } from "@mui/material";
import "../../CommonStyle.css";
import ProductService from "../../../services/ProductService";
import { useDispatch } from "react-redux";
import {
  getBasicUnitData,
  getBrandData,
  getColourData,
  getPackingUnitData,
  getUnitData,
} from "../../../Redux/Action/Action";
import { getProductCodeData } from "../../../Redux/Action/Action";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import { MessageAlert } from "../../../Components/MessageAlert";
import SearchComponent from "../../../Components/SearchComponent ";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import { CreateSampleProduct } from "./CreateSampleProduct";
import { UpdateSampleProduct } from "./UpdateSampleProduct";

export const ViewSamleProduct = () => {
  const dispatch = useDispatch();
  const [sp, setSP] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const { handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const getPackingUnits = async () => {
    try {
      const res = await ProductService.getAllPackingUnit("all");
      dispatch(getPackingUnitData(res.data));
    } catch (err) {
      console.log("error PackingUnit sps", err);
    }
  };

  const getBrandList = async () => {
    try {
      const res = await ProductService.getAllBrand("all");
      dispatch(getBrandData(res.data));
    } catch (err) {
      console.log("error sps :>> ", err);
    }
  };

  const getColours = async () => {
    try {
      const res = await ProductService.getAllColour("all");
      dispatch(getColourData(res.data));
    } catch (err) {
      console.log("err Colour sps :>> ", err);
    }
  };

  const getproductCodes = async () => {
    try {
      const res = await ProductService.getAllProductCode("all");
      dispatch(getProductCodeData(res.data));
    } catch (err) {
      console.log("error ProductCode sps", err);
    }
  };

  const getUnits = async () => {
    try {
      const res = await ProductService.getAllUnit("all");
      dispatch(getUnitData(res.data));
    } catch (err) {
      console.log("error unit sps", err);
    }
  };

  const getBasicUnit = async () => {
    try {
      const res = await ProductService.getAllBasicUnit("all");
      dispatch(getBasicUnitData(res.data));
    } catch (err) {
      console.log("error :>> ", err);
    }
  };

  useEffect(() => {
    getPackingUnits();
    getBrandList();
    getColours();
    getproductCodes();
    getUnits();
    getBasicUnit();
  }, []);

  const getAllSampleProduct = useCallback(async () => {
    try {
      setOpen(true);
      const response = await ProductService.getAllSampleProduct(
        currentPage,
        searchQuery
      );
      setSP(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 25));
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    getAllSampleProduct();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
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
    const data = sp.find((data) => data.id === item.id);
    setRecordForEdit(data || {}); // Ensures an object is set, even if no match is found
    setOpenPopup(true);
  };

  const TableHeader = [
    "ID",
    "FINISH GOODS",
    "UNIT",
    "BRAND",
    "PRODUCT CODE",
    "DESCRIPTION",
    "HSN CODE",
    "ACTION",
  ];

  const TableData = sp.map((value) => ({
    id: value.id,
    name: value.name,
    unit: value.unit,
    brand: value.brand,
    productcode: value.productcode,
    description: value.description,
    hsn_code: value.hsn_code,
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
      <Grid item xs={12}>
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
            {/* Search Component on the left */}
            <Box sx={{ flexGrow: 1, flexBasis: "40%", minWidth: "300px" }}>
              <SearchComponent onSearch={handleSearch} onReset={handleReset} />
            </Box>

            {/* Title Text centered */}
            <Box sx={{ flexGrow: 2, textAlign: "center", minWidth: "150px" }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Sample Product
              </h3>
            </Box>

            {/* Add Button on the right */}
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
                onClick={() => setOpenPopup2(true)}
                variant="contained"
                color="success"
              >
                Add
              </Button>
            </Box>
          </Box>
          {/* CustomTable */}
          <CustomTable
            headers={TableHeader}
            data={TableData}
            openInPopup={openInPopup}
          />
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Create Sample Product"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CreateSampleProduct
          getAllSampleProduct={getAllSampleProduct}
          setOpenPopup={setOpenPopup2}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Sample"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UpdateSampleProduct
          recordForEdit={recordForEdit}
          setOpenPopup={setOpenPopup}
          getAllSampleProduct={getAllSampleProduct}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      </Popup>
    </>
  );
};
