import React, { useCallback, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
import { pdf } from "@react-pdf/renderer";
import { CustomLoader } from "../../../Components/CustomLoader";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import { MaterialTransferNoteCreate } from "./MaterialTransferNoteCreate";
import { MaterialTransferNoteUpdate } from "./MaterialTransferNoteUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import CustomTextField from "../../../Components/CustomTextField";
import { MaterialTransferNotePDF } from "./MaterialTransferNotePDF";
import { MaterialTransferAccept } from "./MaterialTransferAccept";

export const MaterialTransferNoteView = () => {
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openAcceptPopup, setOpenAcceptPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [materialTransferNote, setMaterialTransferNote] = useState([]);
  const [materialTransferNoteByID, setMaterialTransferNoteByID] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedFilter, setAcceptedFilter] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const [sellerOption, setSellerOption] = useState(null);
  const userData = useSelector((state) => state.auth.profile);
  const [exportData, setExportData] = useState([]);
  const csvLinkRef = useRef(null);

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

  const headers = [
    { label: "USER", key: "user" },
    { label: "SELLER UNIT", key: "seller_account" },
    { label: "DATE", key: "date" },
    { label: "PRODUCT", key: "product" },
    { label: "UNIT", key: "unit" },
    { label: "QUANTITY", key: "quantity" },
    { label: "ACCEPTED", key: "accepted" },
  ];

  const handleExport = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getAllMaterialTransferNoteData(
        "all",
        acceptedFilter,
        searchQuery
      );

      const data = response.data.map((row) => {
        return {
          user: row.user,
          seller_account: row.seller_account,
          date: row.created_on,
          product: row.product,
          unit: row.unit,
          quantity: row.quantity,
          accepted: row.accepted,
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

  const handlePrint = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <MaterialTransferNotePDF materialTransferNoteByID={data} />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `ID Number ${data.id}.pdf`;
      document.body.appendChild(link);

      // trigger the download
      link.click();

      // clean up the temporary link element
      document.body.removeChild(link);

      setOpen(false);
    } catch (error) {
      console.log("error exporting pdf", error);
    } finally {
      setOpen(false);
    }
  };

  const handleEdit = (item) => {
    setIDForEdit(item);
    setOpenUpdatePopup(true);
  };

  const handleDownloadPdf = (item) => {
    handlePrint(item);
    setMaterialTransferNoteByID(item);
  };

  const handleAccept = (item) => {
    setOpenAcceptPopup(true);
    setMaterialTransferNoteByID(item);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    setAcceptedFilter(value);
    getAllMaterialTransferNoteDetails(currentPage, value, searchQuery);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const data = userData.groups.includes("Production Delhi")
        ? "Delhi"
        : "Maharashtra";
      const response = await InvoiceServices.getfilterSellerAccountData(data);
      setSellerOption(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    getAllMaterialTransferNoteDetails(currentPage);
  }, [currentPage, getAllMaterialTransferNoteDetails]);

  const getAllMaterialTransferNoteDetails = useCallback(
    async (page, filter = acceptedFilter, search = searchQuery) => {
      try {
        setOpen(true);

        const response = await InventoryServices.getAllMaterialTransferNoteData(
          page,
          filter,
          search
        );

        setMaterialTransferNote(response.data.results);
        setPageCount(Math.ceil(response.data.count / 25));
        setOpen(false);
      } catch (error) {
        setOpen(false);
        console.log("error", error);
      }
    },
    [acceptedFilter, searchQuery]
  );

  const Tableheaders = [
    "ID",
    "USER",
    "SELLER UNIT",
    "DATE",
    "PRODUCT",
    "UNIT",
    "QUANTITY",
    "ACCEPTED",
    "ACTION",
  ];

  const Tabledata = materialTransferNote.map((row, i) => ({
    id: row.id,
    user: row.user,
    seller_account: row.seller_account,
    date: row.created_on,
    product: row.product,
    unit: row.unit,
    quantity: row.quantity,
    accepted: row.accepted,
  }));

  const isAcceptedEdit =
    userData.groups.includes("Accounts") ||
    userData.groups.includes("Production") ||
    userData.groups.includes("Production Delhi");

  const isAcceptedView =
    userData.groups.includes("Stores") ||
    userData.groups.includes("Stores Delhi");

  const filteredMaterialTransferNote = Object.keys(materialTransferNote)
    .filter((key) => !materialTransferNote[key].accepted)
    .reduce((obj, key) => {
      obj[key] = materialTransferNote[key];
      return obj;
    }, {});

  return (
    <>
      <CustomLoader open={open} />
      <div
        style={{
          padding: "16px",
          margin: "16px",
          boxShadow: "0px 3px 6px #00000029",
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(255, 255, 255)", // set background color to default Paper color
        }}
      >
        <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl sx={{ minWidth: "100px" }} fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Filter By Accepted
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="status"
                  label="Filter By Accepted"
                  value={acceptedFilter}
                  onChange={handleFilterChange}
                >
                  {AcceptedOption.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {acceptedFilter && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setAcceptedFilter("");
                      getAllMaterialTransferNoteDetails(1, "", searchQuery);
                    }}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <CustomTextField
                size="small"
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  getAllMaterialTransferNoteDetails(
                    currentPage,
                    acceptedFilter,
                    searchQuery
                  )
                } // Call `handleSearch` when the button is clicked
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setSearchQuery("");
                  getAllMaterialTransferNoteDetails(1, acceptedFilter, "");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              {/* Add Button */}
              {(userData.groups.includes("Production") ||
                userData.groups.includes("Director") ||
                userData.groups.includes("Production Delhi")) && (
                <Button
                  variant="contained"
                  onClick={() => setOpenCreatePopup(true)}
                >
                  Add
                </Button>
              )}
            </Grid>

            <Grid item xs={12} sm={3}>
              {/* Customer Header */}
              <h3
                style={{
                  textAlign: "left",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Material Transfer Note
              </h3>
            </Grid>
            <Grid item xs={12} sm={3}>
              {/* Download CSV Button */}
              <Button variant="contained" onClick={handleDownload}>
                Download CSV
              </Button>
              {exportData.length > 0 && (
                <CSVLink
                  data={exportData}
                  headers={headers}
                  ref={csvLinkRef}
                  filename="Material Transfer Note.csv"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                    height: "5vh",
                  }}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        <CustomTable
          headers={Tableheaders}
          data={Tabledata}
          openInPopup={
            isAcceptedView && filteredMaterialTransferNote ? handleAccept : null
          }
          openInPopup2={handleDownloadPdf}
          openInPopup3={
            isAcceptedEdit && filteredMaterialTransferNote ? handleEdit : null
          }
          openInPopup4={null}
          ButtonText={"Download"}
          ButtonText1={
            isAcceptedEdit && filteredMaterialTransferNote ? "Edit" : ""
          }
        />
        <CustomPagination
          currentPage={currentPage}
          pageCount={pageCount}
          handlePageClick={handlePageClick}
        />
      </div>

      <Popup
        fullScreen={true}
        title={"Create Material Transfer Note"}
        openPopup={openCreatePopup}
        setOpenPopup={setOpenCreatePopup}
      >
        <MaterialTransferNoteCreate
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          setOpenCreatePopup={setOpenCreatePopup}
          sellerOption={sellerOption}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Material Transfer Note"}
        openPopup={openUpdatePopup}
        setOpenPopup={setOpenUpdatePopup}
      >
        <MaterialTransferNoteUpdate
          setOpenUpdatePopup={setOpenUpdatePopup}
          sellerOption={sellerOption}
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"View Material Transfer Note"}
        openPopup={openAcceptPopup}
        setOpenPopup={setOpenAcceptPopup}
      >
        <MaterialTransferAccept
          materialTransferNoteByID={materialTransferNoteByID}
          setOpenAcceptPopup={setOpenAcceptPopup}
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
        />
      </Popup>
    </>
  );
};

const AcceptedOption = [
  { label: "Accepted", value: "true" },
  { label: "Not Accepted", value: "false" },
];
