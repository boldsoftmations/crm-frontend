import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { CSVDownload } from "react-csv";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import moment from "moment";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomSearch } from "../../../Components/CustomSearch";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";
import { Popup } from "../../../Components/Popup";
import InventoryServices from "../../../services/InventoryService";

import { useSelector } from "react-redux";
import { MaterialTransferNoteCreate } from "./MaterialTransferNoteCreate";
import { MaterialTransferNoteUpdate } from "./MaterialTransferNoteUpdate";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomPagination } from "../../../Components/CustomPagination";
import { CustomTable } from "../../../Components/CustomTable";

export const MaterialTransferNoteView = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [materialTransferNote, setMaterialTransferNote] = useState([]);
  const [materialTransferNoteByID, setMaterialTransferNoteByID] = useState([]);
  const [pageCount, setpageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterSelectedQuery, setFilterSelectedQuery] = useState("");
  const [idForEdit, setIDForEdit] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [sellerOption, setSellerOption] = useState(null);
  const users = useSelector((state) => state.auth.profile);
  const [exportData, setExportData] = useState([]);
  const [message, setMessage] = useState(null);
  const handleDownload = async () => {
    const data = await handleExport();
    setExportData(data);
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
      let response;
      if (filterSelectedQuery) {
        response =
          await InventoryServices.getAllMaterialTransferNoteDataPaginate(
            "all",
            filterSelectedQuery
          );
      } else {
        response = await InventoryServices.getMaterialTransferNotePaginateData(
          "all"
        );
      }
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

  const getResetData = async () => {
    setFilterSelectedQuery("");
    await getAllMaterialTransferNoteDetails();
  };

  const openInPopup3 = (item) => {
    setIDForEdit(item);
    setOpenPopup(true);
  };

  const openInPopup2 = (item) => {
    handlePrint(item);
    setMaterialTransferNoteByID(item);
  };

  const openInPopup = (item) => {
    setOpenPopup3(true);
    setMaterialTransferNoteByID(item);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = (event) => {
    setFilterSelectedQuery(event.target.value);
    getSearchData(event.target.value);
  };

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const data = users.groups.includes("Production Delhi")
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
    getAllMaterialTransferNoteDetails();
  }, []);

  const getAllMaterialTransferNoteDetails = async () => {
    try {
      setOpen(true);
      const response = currentPage
        ? await InventoryServices.getMaterialTransferNotePaginateData(
            currentPage
          )
        : await InventoryServices.getAllMaterialTransferNoteData();
      setMaterialTransferNote(response.data.results);
      const total = response.data.count;
      setpageCount(Math.ceil(total / 25));
    } catch (err) {
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
    } finally {
      setOpen(false);
    }
  };

  const getSearchData = async (value) => {
    try {
      setOpen(true);
      const filterSearch = value;
      if (filterSearch !== "") {
        const response =
          await InventoryServices.getAllSearchMaterialTransferNoteData(
            filterSearch
          );
        setMaterialTransferNote(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialTransferNoteDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error Search leads", error);
    } finally {
      setOpen(false);
    }
  };

  const handlePageClick = async (event, value) => {
    try {
      const page = value;
      setCurrentPage(page);
      setOpen(true);

      const response = filterSelectedQuery
        ? await InventoryServices.getAllMaterialTransferNoteDataPaginate(
            page,
            filterSelectedQuery
          )
        : await InventoryServices.getMaterialTransferNotePaginateData(page);

      if (response) {
        setMaterialTransferNote(response.data.results);
        const total = response.data.count;
        setpageCount(Math.ceil(total / 25));
      } else {
        await getAllMaterialTransferNoteDetails();
        setFilterSelectedQuery("");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setOpen(false);
    }
  };
  // Stores Accept Api
  const updateMaterialTransferNoteDetails = async (data) => {
    try {
      setOpen(true);
      const req = {
        seller_account: data.seller_account,
        user: data.user,
        accepted: true,
        product: data.product,
        quantity: data.quantity,
      };
      const response = await InventoryServices.updateMaterialTransferNoteData(
        data.id,
        req
      );

      setMessage(response.data.message);
      setOpenPopup(false);
      setOpenPopup3(false);
      getAllMaterialTransferNoteDetails();
      setOpen(false);
      // Show success snackbar
      setOpenSnackbar(true);
    } catch (error) {
      console.log("error Store Accepting", error);
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
        <MyDocument materialTransferNoteByID={data} />,
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
    users.groups.includes("Accounts") ||
    users.groups.includes("Production") ||
    users.groups.includes("Production Delhi");

  const isAcceptedView =
    users.groups.includes("Stores") || users.groups.includes("Stores Delhi");

  const filteredMaterialTransferNote = Object.keys(materialTransferNote)
    .filter((key) => !materialTransferNote[key].accepted)
    .reduce((obj, key) => {
      obj[key] = materialTransferNote[key];
      return obj;
    }, {});

  return (
    <>
      <CustomLoader open={open} />

      <div>
        <ErrorMessage errRef={errRef} errMsg={errMsg} />

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
          <div style={{ display: "flex" }}>
            <div style={{ flexGrow: 0.9 }}>
              <CustomSearch
                filterSelectedQuery={filterSelectedQuery}
                handleInputChange={handleInputChange}
                getResetData={getResetData}
              />
            </div>
            <div style={{ flexGrow: 2 }}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
                Material Transfer Note
              </h3>
            </div>
            <div style={{ flexGrow: 0.5 }} align="right">
              {users.groups.includes("Production") ||
              users.groups.includes("Production Delhi") ? (
                <div
                  className="btn btn-success"
                  style={{
                    display: "inline-block",
                    padding: "6px 16px",
                    margin: "10px",
                    fontSize: "0.875rem",
                    minWidth: "64px",
                    fontWeight: 500,
                    lineHeight: 1.75,
                    borderRadius: "4px",
                    letterSpacing: "0.02857em",
                    textTransform: "uppercase",
                    boxShadow:
                      "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
                  }}
                  onClick={() => setOpenPopup2(true)}
                >
                  Add
                </div>
              ) : null}
              <div
                className="btn btn-primary"
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  margin: "10px",
                  fontSize: "0.875rem",
                  minWidth: "64px",
                  fontWeight: 500,
                  lineHeight: 1.75,
                  borderRadius: "4px",
                  letterSpacing: "0.02857em",
                  textTransform: "uppercase",
                  boxShadow:
                    "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
                }}
                onClick={handleDownload}
              >
                Download CSV
              </div>
              {exportData.length > 0 && (
                <CSVDownload
                  data={exportData}
                  headers={headers}
                  target="_blank"
                />
              )}
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              borderRadius: "4px",
              display: openSnackbar ? "block" : "none",
              zIndex: 9999,
            }}
          >
            <span style={{ marginRight: "10px" }}>
              {message ? message : "Success"}
            </span>
            <button
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "0",
              }}
              onClick={handleSnackbarClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 7.293l2.146-2.147a.5.5 0 11.708.708L8.707 8l2.147 2.146a.5.5 0 01-.708.708L8 8.707l-2.146 2.147a.5.5 0 01-.708-.708L7.293 8 5.146 5.854a.5.5 0 01.708-.708L8 7.293z"
                />
              </svg>
            </button>
          </div>

          <CustomTable
            headers={Tableheaders}
            data={Tabledata}
            openInPopup={
              isAcceptedView && filteredMaterialTransferNote
                ? openInPopup
                : null
            }
            openInPopup2={openInPopup2}
            openInPopup3={
              isAcceptedEdit && filteredMaterialTransferNote
                ? openInPopup3
                : null
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
      </div>
      <Popup
        fullScreen={true}
        title={"Create Material Transfer Note"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <MaterialTransferNoteCreate
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          setOpenPopup={setOpenPopup2}
          sellerOption={sellerOption}
        />
      </Popup>
      <Popup
        fullScreen={true}
        title={"Update Material Transfer Note"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <MaterialTransferNoteUpdate
          setOpenPopup={setOpenPopup}
          sellerOption={sellerOption}
          getAllMaterialTransferNoteDetails={getAllMaterialTransferNoteDetails}
          idForEdit={idForEdit}
        />
      </Popup>
      <Popup
        maxWidth="xl"
        title={"View Material Transfer Note"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <div className="my-4">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  <strong>Date</strong>
                </td>
                <td>{materialTransferNoteByID.date}</td>
              </tr>
              <tr>
                <td>
                  <strong>Seller Unit</strong>
                </td>
                <td>{materialTransferNoteByID.seller_account}</td>
              </tr>
              <tr>
                <td>
                  <strong>Product</strong>
                </td>
                <td>{materialTransferNoteByID.product}</td>
              </tr>
              <tr>
                <td>
                  <strong>Quantity</strong>
                </td>
                <td>{materialTransferNoteByID.quantity}</td>
              </tr>
              <tr>
                <td>
                  <strong>User</strong>
                </td>
                <td>{materialTransferNoteByID.user}</td>
              </tr>
              <tr>
                <td>
                  <strong>Unit</strong>
                </td>
                <td>{materialTransferNoteByID.unit}</td>
              </tr>
            </tbody>
          </table>
          <div
            className="btn btn-success"
            style={{
              display: "inline-block",
              padding: "6px 16px",
              margin: "10px",
              fontSize: "0.875rem",
              minWidth: "64px",
              fontWeight: 500,
              lineHeight: 1.75,
              borderRadius: "4px",
              letterSpacing: "0.02857em",
              textTransform: "uppercase",
              boxShadow:
                "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)",
            }}
            onClick={() =>
              updateMaterialTransferNoteDetails(materialTransferNoteByID)
            }
          >
            Accept
          </div>
        </div>
      </Popup>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    // margin: "50pt",
    // padding: "10pt",
    border: "1pt solid #ccc",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    padding: "5pt",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    flexGrow: 1,
    textAlign: "center",
    padding: "5pt",
  },
  logo: {
    height: "auto",
    width: "100pt",
  },
  lightText: {
    color: "#777", // set the color to a light gray color
  },
});

const MyDocument = ({ materialTransferNoteByID }) => (
  <Document>
    <Page style={{ fontFamily: "Helvetica", fontSize: "12pt" }}>
      <View style={{ padding: "20pt" }}>
        <View style={style.container}>
          <View style={style.row}>
            <View style={style.cell}>
              <Image style={style.logo} src={logo} />
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: "18pt", fontWeight: "bold" }}>
                Material Transfer Note
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(materialTransferNoteByID.created_on).format(
                  "DD-MM-YYYY"
                )}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>User</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.user}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Accepted</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.accepted ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Seller Unit</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.seller_account}
              </Text>
            </View>
          </View>
          {/* Empty row */}
          <View style={style.row}>
            <View style={style.cell}></View>
            <View style={style.cell}></View>
          </View>
          <View style={{ ...style.row, ...style.header }}>
            <View style={style.cell}>
              <Text>PRODUCT</Text>
            </View>
            <View style={style.cell}>
              <Text>UNIT</Text>
            </View>
            <View style={style.cell}>
              <Text>QUANTITY</Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.product}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.unit}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.quantity}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
