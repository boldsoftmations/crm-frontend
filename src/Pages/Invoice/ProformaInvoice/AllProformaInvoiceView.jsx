import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";
import InvoiceServices from "../../../services/InvoiceService";
import { PaymentConfirmationPi } from "./PaymentConfirmationPi";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISOLogo.ico";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import { ErrorMessage } from "../../../Components/ErrorMessage/ErrorMessage";

export const AllProformaInvoiceView = (props) => {
  const { idForEdit, setOpenPopup } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [hsnData, setHsnData] = useState([]);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const data = useSelector((state) => state.auth);
  const users = data.profile;

  const handlePrint = async (data) => {
    try {
      setOpen(true);

      // create a new jsPDF instance
      const pdfDoc = new jsPDF();

      // generate the PDF document
      const pdfData = await pdf(
        <MyDocument
          productData={productData}
          invoiceData={invoiceData}
          hsnData={hsnData}
          AMOUNT_IN_WORDS={AMOUNT_IN_WORDS}
          TOTAL_GST={TOTAL_GST}
        />,
        pdfDoc,
        {
          // set options here if needed
        }
      ).toBlob();

      // create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfData);
      link.download = `PI Number ${invoiceData.pi_number}.pdf`;
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

  useEffect(() => {
    getAllProformaInvoiceDetails();
  }, []);

  const getAllProformaInvoiceDetails = async () => {
    try {
      setOpen(true);
      const response =
        idForEdit.type === "Customer"
          ? await InvoiceServices.getCompanyPerformaInvoiceByIDData(
              idForEdit.pi_number
            )
          : await InvoiceServices.getLeadsPerformaInvoiceByIDData(
              idForEdit.pi_number
            );
      setInvoiceData(response.data);
      setProductData(response.data.products);
      setHsnData(response.data.hsn_table);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };
  const str = invoiceData.amount_in_words ? invoiceData.amount_in_words : "";
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const AMOUNT_IN_WORDS = arr.join(" ");

  const componentRef = useRef();

  const TOTAL_GST_DATA = invoiceData.total - invoiceData.amount;
  const TOTAL_GST = TOTAL_GST_DATA.toFixed(2);
  return (
    <>
      <CustomLoader open={open} />
      <ErrorMessage errMsg={errMsg} />
      <div
        id="invoice"
        style={{ border: "1px Solid #000000" }}
        className="container-fluid m-0 p-2"
      >
        <div className="m-2 p-0" style={{ border: "1px Solid #000000" }}>
          <div className="row">
            {/* <!-- BEGIN INVOICE --> */}
            <div className="col-xs-12">
              <div className="grid invoice" style={{ padding: "10px" }}>
                <div className="grid-body">
                  <div className="invoice-title">
                    <div
                      className="row"
                      style={{ borderBottom: "1px Solid #000000" }}
                    >
                      <div className="col-md-2 align-self-center logos">
                        <img src={logo} alt="" Height="60" width="150" />
                      </div>
                      <div className="col-md-7" style={{ marginRight: "1rem" }}>
                        {/* seller Details */}
                        <div className="text-center address">
                          <strong style={{ ...typographyStyling }}>
                            Glutape India Private Limited
                          </strong>
                          <br />
                          <p style={{ fontSize: "0.50rem" }}>
                            {invoiceData.seller_address},
                            {invoiceData.seller_city},{invoiceData.seller_state}
                            -{invoiceData.seller_state_code},<br />
                            {invoiceData.seller_pincode}, CIN No ;-
                            {invoiceData.seller_cin}, P.No :- <br />
                            {invoiceData.seller_contact} E:
                            {invoiceData.seller_email},W:www.glutape.com
                          </p>
                        </div>
                      </div>
                      <div className="col-md-1 d-flex align-items-center justify-content-end msme">
                        <img src={MSME} alt="" height="50" width="90" />
                      </div>
                      <div className="col-md-1 d-flex align-items-center justify-content-start iso">
                        <img src={ISO} alt="" height="35" width="90" />
                      </div>
                    </div>
                    {/* <hr /> */}
                    <div className="row">
                      <div
                        className="col-md-12"
                        style={{ borderBottom: "1px Solid #000000" }}
                      >
                        <p className="text-center fs-6 fw-bold p-0 m-0">
                          Proforma Invoice
                        </p>
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ borderBottom: "1px Solid #000000" }}
                    >
                      <div
                        className="col-md-6"
                        style={{ ...typographyStyling }}
                      >
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Proforma Invoice No & Date :{" "}
                          </strong>{" "}
                          {invoiceData.pi_number} &{" "}
                          {invoiceData.generation_date}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Sales Person :{" "}
                          </strong>{" "}
                          {invoiceData.raised_by_first_name}&nbsp;&nbsp;
                          {invoiceData.raised_by_last_name}
                        </div>

                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Valid Until :{" "}
                          </strong>{" "}
                          {invoiceData.validity}
                        </div>
                      </div>

                      <div
                        className="col-md-6"
                        style={{
                          ...typographyStyling,
                          borderLeft: "1px Solid #000000",
                        }}
                      >
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Place of Supply :{" "}
                          </strong>
                          {invoiceData.place_of_supply}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Transporter Name :{" "}
                          </strong>
                          {invoiceData.transporter_name}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Buyer Order No & Date :{" "}
                          </strong>
                          {invoiceData.buyer_order_no} &{" "}
                          {invoiceData.buyer_order_date}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Amount Receive :{" "}
                          </strong>
                          {invoiceData.amount_recieved}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Payment Terms :{" "}
                          </strong>{" "}
                          {invoiceData.payment_terms}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Delivery Terms :{" "}
                          </strong>{" "}
                          {invoiceData.delivery_terms}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-6">
                      <address>
                        <strong style={{ ...typographyStyling }}>
                          Billed To:
                        </strong>
                        <br />
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Company :{" "}
                          </strong>
                          {invoiceData.company_name},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Address :{" "}
                          </strong>
                          {invoiceData.billing_address},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            City & State:{" "}
                          </strong>
                          {invoiceData.billing_city} &{" "}
                          {invoiceData.billing_state},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Pin Code :{" "}
                          </strong>
                          {invoiceData.billing_pincode}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Gst Number :{" "}
                          </strong>
                          {invoiceData.gst_number}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Pan Number :{" "}
                          </strong>
                          {invoiceData.pan_number}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Contact :{" "}
                          </strong>
                          {invoiceData.contact}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Contact Person Name:{" "}
                          </strong>
                          {invoiceData.contact_person_name}
                        </div>
                      </address>
                    </div>
                    <div
                      className="col-md-6 justify-content-end"
                      style={{ borderLeft: "1px Solid #000000" }}
                    >
                      <address className="justify-content-end">
                        <strong style={{ ...typographyStyling }}>
                          Shipped To:
                        </strong>
                        <br />
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Company :{" "}
                          </strong>
                          {invoiceData.company_name},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Address :{" "}
                          </strong>
                          {invoiceData.address}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            City & State:{" "}
                          </strong>
                          {invoiceData.city} & {invoiceData.state},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Pin Code :{" "}
                          </strong>
                          {invoiceData.pincode}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Gst Number :{" "}
                          </strong>
                          {invoiceData.gst_number}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Pan Number :{" "}
                          </strong>
                          {invoiceData.pan_number}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Contact :{" "}
                          </strong>
                          {invoiceData.contact}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Contact Person Name:{" "}
                          </strong>
                          {invoiceData.contact_person_name}
                        </div>
                      </address>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-12">
                      <table className="table">
                        <thead>
                          <tr className="line">
                            <td className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                SR.NO
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                DESCRIPTION OF GOODS
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                BRAND
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                HSN CODE
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                REQUESTED DATE
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                QTY
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                UNIT
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                RATE
                              </strong>
                            </td>
                            <td className="text-center">
                              <strong style={{ ...typographyStyling }}>
                                AMOUNT
                              </strong>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {productData.map((row, i) => (
                            <tr key={i}>
                              <td className="text-start">{i + 1}</td>
                              <td className="text-center">
                                {row.description}
                                <br />
                                {row.product}
                              </td>
                              <td className="text-center">{row.brand}</td>
                              <td className="text-center">{row.hsn_code}</td>
                              <td className="text-center">
                                {row.requested_date}
                              </td>
                              <td className="text-center">{row.quantity}</td>
                              <td className="text-center">{row.unit}</td>
                              <td className="text-center">{row.rate}</td>
                              <td className="text-center">{row.amount}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colspan="4.5" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                Company Bank Details :{" "}
                              </strong>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Company Name :{" "}
                                </strong>
                                Glutape India Pvt Ltd
                              </div>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Bank :{" "}
                                </strong>
                                {invoiceData.seller_bank_name}{" "}
                              </div>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Account No :{" "}
                                </strong>
                                {invoiceData.seller_account_no}{" "}
                              </div>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Branch & IFSC Code :{" "}
                                </strong>
                                {invoiceData.seller_branch} &{" "}
                                {invoiceData.seller_ifsc_code}{" "}
                              </div>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Gst Number :{" "}
                                </strong>
                                {invoiceData.seller_gst}
                              </div>
                              <div>
                                <strong style={{ ...typographyStyling }}>
                                  Pan Number :{" "}
                                </strong>
                                {invoiceData.seller_pan}
                              </div>
                            </td>
                            <td colspan="3">
                              <strong style={{ ...typographyStyling }}>
                                Taxable Amount
                              </strong>
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                CGST Amount
                              </strong>{" "}
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                SGST Amount
                              </strong>{" "}
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                IGST Amount
                              </strong>
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                Round Off
                              </strong>
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                Total Amount
                              </strong>
                            </td>
                            <td colspan="0.5" className="text-right">
                              <span>{invoiceData.amount}</span>
                              <br />
                              <span>
                                {invoiceData.cgst ? invoiceData.cgst : "-"}
                              </span>
                              <br />
                              <span>
                                {invoiceData.sgst ? invoiceData.sgst : "-"}
                              </span>
                              <br />
                              <span>
                                {invoiceData.igst ? invoiceData.igst : "-"}
                              </span>
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.round_off}
                              </strong>
                              <br />
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.round_off_total}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="row mb-4"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-8 text-right">
                      <strong>Amount in Words :-</strong>&nbsp;&nbsp;
                      {AMOUNT_IN_WORDS}
                    </div>
                  </div>
                  <div
                    className="row mb-4"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-8 text-right table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>HSN</th>
                            <th>TAXABLE AMOUNT</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>IGST</th>
                            <th>GST %</th>
                            <th>TOTAL GST</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hsnData.map((row, i) => (
                            <tr key={i}>
                              <td>{row.hsn_code}</td>
                              <td>{row.amount}</td>
                              <td>{row.cgst}</td>
                              <td>{row.sgst}</td>
                              <td>{row.igst}</td>
                              <td>{row.gst_percentage}</td>
                              <td>{row.total_gst}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colspan="1" className="text-end">
                              <strong style={{ ...typographyStyling }}>
                                Total :
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.amount}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.cgst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.sgst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {invoiceData.igst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {/* {invoiceData.igst} */}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {TOTAL_GST}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className="row mb-4"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-8 text-right">
                      <strong style={{ ...typographyStyling }}>
                        Terms and Condition :-
                      </strong>
                      {Information.map((data, i) => {
                        return (
                          <p
                            key={i}
                            style={{
                              margin: 0,
                              padding: 0,
                              fontSize: "0.50rem",
                            }}
                          >
                            {data.id}
                            {data.text}
                            <br />
                          </p>
                        );
                      })}
                    </div>
                    <div className="col-md-4 d-flex align-items-end justify-content-center">
                      <div className="text-center">
                        {invoiceData.approval
                          ? invoiceData.approval.approver_first_name
                          : ""}
                        &nbsp;&nbsp;
                        {invoiceData.approval
                          ? invoiceData.approval.approver_last_name
                          : ""}
                        <br />
                        {invoiceData.approval
                          ? invoiceData.approval.approval_date
                          : ""}
                        <br />
                        <strong style={{ ...typographyStyling }}>
                          Authorising Signatory
                        </strong>
                        <br />
                        <strong style={{ ...typographyStyling }}>
                          [Digitally Signed]
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 ">
                      <img
                        // className="p-2"
                        src={AllLogo}
                        alt=""
                        height="60"
                        width="100%"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- END INVOICE --> */}
          </div>
        </div>
      </div>
      <Popup
        maxWidth={"md"}
        title={"Customer Confirmation of payment detail"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <PaymentConfirmationPi
          users={users}
          invoiceData={invoiceData}
          setOpenPopup={setOpenPopup2}
          getAllProformaInvoiceDetails={getAllProformaInvoiceDetails}
        />
      </Popup>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    border: "1pt solid #000000",
    overflow: "hidden",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  cell: {
    flex: 1,
    flexGrow: 1,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  logo: {
    height: "auto",
    width: "80pt",
  },
  logo2: {
    height: "auto",
    width: "50pt",
  },
  alllogo: {
    height: "auto",
    width: "100%",
  },
  lightText: {
    color: "#777", // set the color to a light gray color
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  outerText: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "left",
    fontFamily: "Helvetica",
    marginLeft: "5pt",
  },
  innerText: {
    fontSize: 8,
    color: "#777777",
    fontSize: 10,
    fontFamily: "Helvetica",
    marginLeft: "5pt",
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
});

const MyDocument = ({
  productData,
  invoiceData,
  hsnData,
  AMOUNT_IN_WORDS,
  TOTAL_GST,
}) => (
  <Document>
    <Page style={{ fontFamily: "Helvetica", fontSize: "12pt" }}>
      <View style={{ padding: "20pt" }}>
        <View style={style.container}>
          {/* HEADERS */}
          <View style={style.row}>
            <View style={{ marginRight: "20pt" }}>
              <Image source={logo} style={style.logo} />
            </View>
            <View
              style={{
                ...style.cell,
                alignItems: "center",
                textAlign: "center",
                padding: 0,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                Glutape India Private Limited
              </Text>
              <Text style={{ color: "#777777", fontSize: 5 }}>
                {invoiceData.seller_address}, {invoiceData.seller_city}, {"\n"}
                {invoiceData.seller_state}-{invoiceData.seller_state_code},
                {invoiceData.seller_pincode}, CIN No;- {invoiceData.seller_cin},
                P.No:- {invoiceData.seller_contact}
                {"\n"}
                E: {invoiceData.seller_email}, W: www.glutape.com
              </Text>
            </View>
            <View style={{ marginLeft: "20pt" }}>
              <Image source={MSME} style={style.logo2} />
            </View>
            <View style={{ marginLeft: "20pt" }}>
              <Image source={ISO} style={style.logo2} />
            </View>
          </View>
          <View style={style.row}>
            <View
              style={{
                ...style.cell,
                alignItems: "center",
                padding: 0,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                Proforma Invoice
              </Text>
            </View>
          </View>
          {/* PI DETAILS */}
          {/* PI AND DATE & PLACE OF SUPPLY */}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                Proforma Invoice No & Date :
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.pi_number} &{" "}
                {moment(invoiceData.generation_date).format("DD-MM-YYYY")}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Place of Supply :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.place_of_supply}
              </Text>
            </View>
          </View>
          {/* SALES PERSON AND TRASNPORTER NAME */}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Sales Person :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.raised_by_first_name}
                {invoiceData.raised_by_last_name}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Transporter Name :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.transporter_name}
              </Text>
            </View>
          </View>
          {/* VALID UNTIL & BUYER ORDER NO */}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Valid Until :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {moment(invoiceData.validity).format("DD-MM-YYYY")}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                Buyer Order No & Date :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.buyer_order_no} & {invoiceData.buyer_order_date}
              </Text>
            </View>
          </View>
          {/* AMOUN T RECEIVED */}
          <View style={style.row}>
            <View z></View>
            <View style={{ ...style.cell }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Amount Receive :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.amount_recieved}
              </Text>
            </View>
          </View>
          {/* PAYMENT TERMS*/}
          <View style={style.row}>
            <View style={{ ...style.cell }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Payment Terms :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.payment_terms}
              </Text>
            </View>
          </View>
          {/* DELIVERY TERMS */}
          <View style={style.row}>
            <View style={{ ...style.cell }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}></View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Delivery Terms :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.delivery_terms}
              </Text>
            </View>
          </View>

          {/* BILLED  AND SHIPPED TO*/}
          {/* BILLED TO */}
          <View style={{ ...style.row, ...style.header }}>
            <View style={style.cell}>
              <Text
                style={{
                  ...style.outerText,
                  ...style.borderRight,
                  textAlign: "center",
                }}
              >
                Billed To
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.outerText, textAlign: "center" }}>
                Shipped To{" "}
              </Text>
            </View>
          </View>
          {/* BILLED TO COMPANY*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Company :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.company_name}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Company :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.company_name}
              </Text>
            </View>
          </View>
          {/* BILLED TO ADDRESS*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Address :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.billing_address}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Address :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>{invoiceData.address}</Text>
            </View>
          </View>
          {/* BILLED TO CITY & STATE*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>City & State:</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.billing_city} &{invoiceData.billing_state}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>City & State:</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.city} &{invoiceData.state}
              </Text>
            </View>
          </View>
          {/* BILLED TO PINCODE*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Pin Code :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.billing_pincode}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}> Pin Code :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>{invoiceData.pincode}</Text>
            </View>
          </View>
          {/* BILLED TO GST NUMBER*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Gst Number :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.gst_number}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Gst Number :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.gst_number}
              </Text>
            </View>
          </View>
          {/* BILLED TO PAN NUMBER*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Pan Number :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.pan_number}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Pan Number :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.pan_number}
              </Text>
            </View>
          </View>
          {/* BILLED TO CONTACT*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Contact :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>{invoiceData.contact}</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Contact :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>{invoiceData.contact}</Text>
            </View>
          </View>
          {/* BILLED TO CONTACT PERSON*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Contact Person :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.contact_person_name}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Contact Person :</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.contact_person_name}
              </Text>
            </View>
          </View>
          {/* PRODUCT  */}
          <View style={{ ...style.row, ...style.header }}>
            <View
              style={{
                ...style.cell,
                marginLeft: "4pt",
                textAlign: "left",
              }}
            >
              <Text>Product</Text>
            </View>
            <View
              style={{
                ...style.cell,
                flex: 0.5,
                flexGrow: 0.5,
                textAlign: "center",
              }}
            >
              <Text>HSN Code</Text>
            </View>
            <View
              style={{
                ...style.cell,
                flex: 0.5,
                flexGrow: 0.5,
                textAlign: "center",
              }}
            >
              <Text>Quantity</Text>
            </View>
            <View
              style={{
                ...style.cell,
                flex: 0.5,
                flexGrow: 0.5,
                textAlign: "center",
              }}
            >
              <Text>Unit</Text>
            </View>
            <View
              style={{
                ...style.cell,
                flex: 0.5,
                flexGrow: 0.5,
                textAlign: "center",
              }}
            >
              <Text>Rate</Text>
            </View>
            <View
              style={{
                ...style.cell,
                flex: 0.5,
                flexGrow: 0.5,
                textAlign: "center",
              }}
            >
              <Text>Amount</Text>
            </View>
          </View>

          {productData.map((historyRow, i) => (
            <View style={{ ...style.row, paddingVertical: 5 }} key={i}>
              <View
                style={{
                  ...style.cell,
                  textAlign: "left",
                  marginLeft: "4pt",
                  width: 80,
                }}
              >
                <Text style={{ ...style.lightText }}>
                  {historyRow.description}
                  {"\n"}
                  {historyRow.product}
                </Text>
              </View>
              <View
                style={{
                  ...style.cell,
                  flex: 0.5,
                  flexGrow: 0.5,
                  textAlign: "center",
                }}
              >
                <Text style={style.lightText}>{historyRow.hsn_code}</Text>
              </View>
              <View
                style={{
                  ...style.cell,
                  flex: 0.5,
                  flexGrow: 0.5,
                  textAlign: "center",
                }}
              >
                <Text style={style.lightText}>{historyRow.quantity}</Text>
              </View>
              <View
                style={{
                  ...style.cell,
                  flex: 0.5,
                  flexGrow: 0.5,
                  textAlign: "center",
                }}
              >
                <Text style={style.lightText}>{historyRow.unit}</Text>
              </View>
              <View
                style={{
                  ...style.cell,
                  flex: 0.5,
                  flexGrow: 0.5,
                  textAlign: "center",
                }}
              >
                <Text style={style.lightText}>{historyRow.rate}</Text>
              </View>
              <View
                style={{
                  ...style.cell,
                  flex: 0.5,
                  flexGrow: 0.5,
                  textAlign: "center",
                }}
              >
                <Text style={style.lightText}>{historyRow.amount}</Text>
              </View>
            </View>
          ))}
          {/* COMPANY DETAIL AND TOTAL GST AMOUNT */}
          <View style={{ ...style.row }}>
            <View style={{ ...style.cell, ...style.header }}>
              <Text
                style={{
                  ...style.outerText,

                  textAlign: "center",
                }}
              >
                Company Bank Details
              </Text>
            </View>
            <View
              style={{ ...style.cell, ...style.header, ...style.borderRight }}
            ></View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                Taxable Amount :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.amount}
              </Text>
            </View>
          </View>
          {/*  COMPANY & Taxable Amount*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Company :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>Glutape India Pvt Ltd</Text>
            </View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                CGST Amount :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.cgst ? invoiceData.cgst : "-"}
              </Text>
            </View>
          </View>
          {/* Bank & CGST Amount*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Bank :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.seller_bank_name}
              </Text>
            </View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                SGST Amount :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.sgst ? invoiceData.sgst : "-"}
              </Text>
            </View>
          </View>
          {/* >Account No & CITY & SGST Amount*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Account No :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.seller_account_no}
              </Text>
            </View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                IGST Amount :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.igst ? invoiceData.igst : "-"}
              </Text>
            </View>
          </View>
          {/* Branch and IFSC Code & IGST Amount*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Branch & IFSC Code :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.seller_branch} &{invoiceData.seller_ifsc_code}
              </Text>
            </View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                Round Off :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.round_off}
              </Text>
            </View>
          </View>
          {/* Round Off & GST NUMBER*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Gst Number :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.seller_gst}
              </Text>
            </View>
            <View style={{ ...style.cell }}>
              <Text style={{ ...style.outerText, textAlign: "right" }}>
                Total Amount :
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.innerText, textAlign: "center" }}>
                {invoiceData.round_off_total}
              </Text>
            </View>
          </View>
          {/* Total Amount & PAN NUMBER*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Pan Number :</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.innerText }}>
                {invoiceData.seller_pan}
              </Text>
            </View>
            <View style={{ ...style.cell }}></View>
            <View style={style.cell}></View>
          </View>

          {/* AMOUNTS IN WORDS */}
          <View style={{ ...style.row }}>
            <View
              style={{
                ...style.cell,
                padding: "5pt",
              }}
            >
              <Text style={style.outerText}>
                Amount in Words :-
                <Text style={style.innerText}> &nbsp;{AMOUNT_IN_WORDS}</Text>
              </Text>
            </View>
          </View>
          <View>
            <Text>{"\n"}</Text>
          </View>
          {/* HSN TABLE */}
          <View style={{ ...style.row, ...style.header }}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>HSN</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>TAXABLE AMOUNT</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>CGST</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>SGST</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>IGST</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>GST</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.outerText }}>TOTAL GST</Text>
            </View>
          </View>
          {/* HSN TABLE DATA*/}
          {hsnData.map((historyRow, i) => (
            <View style={style.row} key={i}>
              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>
                  {historyRow.hsn_code}
                </Text>
              </View>

              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>{historyRow.amount}</Text>
              </View>

              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>{historyRow.cgst}</Text>
              </View>

              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>{historyRow.sgst}</Text>
              </View>

              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>{historyRow.igst}</Text>
              </View>

              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.innerText }}>
                  {historyRow.gst_percentage}
                </Text>
              </View>

              <View style={style.cell}>
                <Text style={{ ...style.innerText }}>
                  {historyRow.total_gst}
                </Text>
              </View>
            </View>
          ))}

          {/* HSN TABLE DATA TOTAL AND TAX*/}
          <View style={style.row}>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>Total</Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                {invoiceData.amount || "-"}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                {invoiceData.cgst || "-"}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                {invoiceData.sgst || "-"}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>
                {invoiceData.igst | "-"}
              </Text>
            </View>
            <View style={{ ...style.cell, ...style.borderRight }}>
              <Text style={{ ...style.outerText }}>-</Text>
            </View>
            <View style={style.cell}>
              <Text style={{ ...style.outerText }}>{TOTAL_GST | "-"}</Text>
            </View>
          </View>
          <View>
            <Text>{"\n"}</Text>
          </View>
          {/* TERMS AND CONDITION */}
          <View style={style.row}>
            <View
              style={{
                ...style.cell,
                marginLeft: "4pt",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 8 }}>
                Terms and Condition :-
              </Text>
              {Information.map((data, i) => (
                <Text key={i} style={{ color: "#777777", fontSize: 5 }}>
                  {data.id} {data.text}
                </Text>
              ))}
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={style.innerText}>
                {" "}
                {invoiceData.approval
                  ? invoiceData.approval.approver_first_name
                  : ""}
                {invoiceData.approval
                  ? invoiceData.approval.approver_last_name
                  : ""}
              </Text>

              <Text style={style.innerText}>
                {" "}
                {invoiceData.approval ? invoiceData.approval.approval_date : ""}
              </Text>
              <Text style={{ ...style.outerText }}> Authorising Signatory</Text>
              <Text style={{ ...style.outerText }}> [Digitally Signed]</Text>
            </View>
          </View>
          {/* FOOTERS */}
          <View style={style.row}>
            <View
              style={{
                ...style.cell,
                alignItems: "center",
                padding: 0,
              }}
            >
              <Image source={AllLogo} style={style.alllogo} />
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const Information = [
  {
    id: "1)",
    text: "Material once sold will not be taken back.",
  },
  {
    id: "2)",
    text: "Material is delivered at owner's risk and with no liability of transportation damage to Glutape India Pvt Ltd. ",
  },
  {
    id: "3)",
    text: "Our risk and Responsibility ceases as soon as the goods leave our premises.",
  },
  {
    id: "4)",
    text: "In case the cargo is insured, a claim against insurance will be settled once the insurance claim gets sanctioned from the respective insurance company",
  },
  {
    id: "5)",
    text: "Please test Material before using.",
  },
  {
    id: "6)",
    text: "No allowance for storage of difference in quality will be allowed unless the same is given to us within 24 hour of receipt insurance company.",
  },
  {
    id: "7)",
    text: "Subjects to mumbai, Maharashtra jurisdiction only.",
  },
  {
    id: "8)",
    text: "Validity of this Proforma Invoice is 3 Days from Date of Proforma Invoice.",
  },
];

const typographyStyling = {
  fontSize: "0.80rem",
};