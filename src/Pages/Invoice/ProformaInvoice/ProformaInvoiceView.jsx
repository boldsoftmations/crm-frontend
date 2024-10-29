import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import { pdf } from "@react-pdf/renderer";
import { useReactToPrint } from "react-to-print";
import InvoiceServices from "../../../services/InvoiceService";
import { PaymentConfirmationPi } from "./PaymentConfirmationPi";
import { Popup } from "../../../Components/Popup";
import { CustomLoader } from "../../../Components/CustomLoader";
import logo from "../../../Images/glutape logo.jpg";
import ISO from "../../../Images/ISO.png";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import { MyDocument } from "./MyDocument";
import { Button } from "@mui/material";
import { CheckPrice } from "./CheckPrice";
import { useNotificationHandling } from "../../../Components/useNotificationHandling ";
import { MessageAlert } from "../../../Components/MessageAlert";

export const ProformaInvoiceView = (props) => {
  const { idForEdit, setOpenPopup, getProformaInvoiceData } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [hsnData, setHsnData] = useState([]);
  const [open, setOpen] = useState(false);
  const [checkPricePopupOpen, setCheckPricePopupOpen] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  const componentRef = useRef();
  const { handleSuccess, handleError, handleCloseSnackbar, alertInfo } =
    useNotificationHandling();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `PI Number ${invoiceData.pi_number}`,
  });

  const handleCheckPrice = async () => {
    setOpen(true);
    try {
      const response = await InvoiceServices.checkPrice(invoiceData.pi_number);
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setPriceData(data);
      setCheckPricePopupOpen(true);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  const handleDownload = async (data) => {
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
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

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
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    getAllProformaInvoiceDetails();
  }, []);

  const str = invoiceData.amount_in_words ? invoiceData.amount_in_words : "";
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const AMOUNT_IN_WORDS = arr.join(" ");
  // from Pending Approval or Approved to Raised Status
  const SendRaisedPIConvertToPendingApproval = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        proformainvoice: idForEdit.pi_number,
        status: "Raised",
        address: invoiceData.address,
        buyer_order_no: invoiceData.buyer_order_no,
        city: invoiceData.city,
        contact: invoiceData.contact,
        delivery_terms: invoiceData.delivery_terms,
        company: invoiceData.company,
        lead: invoiceData.lead,
        payment_terms: invoiceData.payment_terms,
        pincode: invoiceData.pincode,
        place_of_supply: invoiceData.place_of_supply,
        raised_by: invoiceData.raised_by,
        seller_account: invoiceData.seller_account,
        state: invoiceData.state,
        type: invoiceData.type,
      };
      invoiceData.type === "Customer"
        ? await InvoiceServices.updateCustomerProformaInvoiceData(
            idForEdit.pi_number,
            req
          )
        : await InvoiceServices.updateLeadsProformaInvoiceData(
            idForEdit.pi_number,
            req
          );
      setOpenPopup(false);
      getProformaInvoiceData();
      setOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  // from Raised to Pending Approval Status
  const SendPendingApprovalPIConvertToApproved = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        proformainvoice: idForEdit.pi_number,
        status: "Pending Approval",
        address: invoiceData.address,
        buyer_order_no: invoiceData.buyer_order_no,
        city: invoiceData.city,
        contact: invoiceData.contact,
        delivery_terms: invoiceData.delivery_terms,
        company: invoiceData.company,
        lead: invoiceData.lead,
        payment_terms: invoiceData.payment_terms,
        pincode: invoiceData.pincode,
        place_of_supply: invoiceData.place_of_supply,
        raised_by: invoiceData.raised_by,
        seller_account: invoiceData.seller_account,
        state: invoiceData.state,
        type: invoiceData.type,
      };
      const response =
        invoiceData.type === "Customer"
          ? await InvoiceServices.updateCustomerProformaInvoiceData(
              idForEdit.pi_number,
              req
            )
          : await InvoiceServices.updateLeadsProformaInvoiceData(
              idForEdit.pi_number,
              req
            );
      const successMessage =
        response.data.message ||
        "send Pending_Approval_PI Convert To Approved successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getProformaInvoiceData();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  // from Pending Approval to Approved Status
  const SendForApprovedPI = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        proformainvoice: invoiceData.pi_number,
        approved_by: users.email,
        status: "Approved",
      };
      const response = await InvoiceServices.sendForApprovalData(req);
      const successMessage =
        response.data.message || "Send For Approved Pi successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getProformaInvoiceData();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };

  // from Pending Approval to Approved Status
  const SendForRejectPI = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        proformainvoice: invoiceData.pi_number,
        approved_by: users.email,
        status: "Reject",
      };
      const response = await InvoiceServices.sendForApprovalData(req);
      const successMessage =
        response.data.message || "Send For Approved Pi successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getProformaInvoiceData();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  const SendForDropPI = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      const req = {
        status: "Dropped",
        type: invoiceData.type,
        raised_by: invoiceData.raised_by,
        raised_by_first_name: invoiceData.raised_by_first_name,
        place_of_supply: invoiceData.place_of_supply,
        seller_account: invoiceData.seller_account,
        company: invoiceData.company,
        address: invoiceData.address,
        pincode: invoiceData.pincode,
        state: invoiceData.state,
        city: invoiceData.city,
        buyer_order_no: invoiceData.buyer_order_no,
        contact: invoiceData.contact,
        payment_terms: invoiceData.payment_terms,
        delivery_terms: invoiceData.delivery_terms,
      };
      const response = await InvoiceServices.sendForApprovalCompanyData(
        invoiceData.pi_number,
        req
      );
      const successMessage = response.data.message || "Pi Dropped successfully";
      handleSuccess(successMessage);

      setTimeout(() => {
        setOpenPopup(false);
        getProformaInvoiceData();
      }, 300);
    } catch (error) {
      handleError(error);
    } finally {
      setOpen(false);
    }
  };
  const TOTAL_GST_DATA = invoiceData.total - invoiceData.amount;
  const TOTAL_GST = TOTAL_GST_DATA.toFixed(2);
  return (
    <>
      <MessageAlert
        open={alertInfo.open}
        onClose={handleCloseSnackbar}
        severity={alertInfo.severity}
        message={alertInfo.message}
      />
      <CustomLoader open={open} />
      <div
        className="container-fluid mb-4"
        style={{ border: "1px Solid #000000" }}
      >
        <div className="row p-4">
          <div className="col-xs-6 ">
            {invoiceData &&
              invoiceData.status &&
              invoiceData.status !== "Pending Approval" &&
              invoiceData.status !== "Price Approval" &&
              invoiceData.status !== "Raised" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleDownload(e)}
                  startIcon={<DownloadIcon />}
                >
                  Download
                </Button>
              )}

            {invoiceData &&
              invoiceData.status &&
              invoiceData.status !== "Pending Approval" &&
              invoiceData.status !== "Price Approval" &&
              invoiceData.status !== "Raised" && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePrint}
                  startIcon={<PrintIcon />}
                >
                  Print
                </Button>
              )}
          </div>
          <div className="col-xs-6 ">
            {(users.groups.includes("Sales") ||
              users.groups.includes("Director") ||
              users.groups.includes("Customer Service") ||
              users.groups.includes("Accounts")) &&
              invoiceData.status === "Raised" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => SendPendingApprovalPIConvertToApproved(e)}
                >
                  Send For Approval
                </Button>
              )}
          </div>
          <div className="col-xs-6 ">
            {invoiceData.status === "Pending Approval" &&
              users.is_staff === true && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => SendRaisedPIConvertToPendingApproval(e)}
                >
                  Back To Raised
                </Button>
              )}
          </div>
          <div className="col-xs-6 ">
            {invoiceData.status === "Approved" &&
              users.groups.includes("Accounts") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => SendRaisedPIConvertToPendingApproval(e)}
                >
                  Back To Raised
                </Button>
              )}
          </div>
          <div className="col-xs-6">
            {users.is_staff === true &&
              invoiceData.status === "Pending Approval" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    SendForApprovedPI(e);
                    // SendForApprovalStatus(e);
                  }}
                >
                  Approve
                </Button>
              )}
          </div>
          <div className="col-xs-6">
            {(users.groups.includes("Accounts") ||
              users.groups.includes("Director") ||
              users.groups.includes("Accounts Billing Department")) &&
              invoiceData.status === "Price Approval" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    SendForApprovedPI(e);
                    // SendForApprovalStatus(e);
                  }}
                >
                  Approve
                </Button>
              )}
            {(users.groups.includes("Accounts") ||
              users.groups.includes("Director") ||
              users.groups.includes("Accounts Billing Department")) &&
              invoiceData.status === "Price Approval" && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    SendForRejectPI(e);
                    // SendForApprovalStatus(e);
                  }}
                >
                  Reject
                </Button>
              )}
            {(users.groups.includes("Accounts") ||
              users.groups.includes("Director")) &&
              invoiceData.status === "Price Approval" && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleCheckPrice}
                >
                  Check Price
                </Button>
              )}
          </div>
          <div className="col-xs-6">
            {invoiceData.status === "Approved" &&
              (users.groups.includes("Accounts") ||
                users.groups.includes("Director") ||
                users.groups.includes("Accounts Billing Department")) && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenPopup2(true)}
                >
                  Confirmation Payment
                </Button>
              )}
            {(users.groups.includes("Director") ||
              users.groups.includes("Sales Manager") ||
              users.groups.includes("Sales Executive") ||
              users.groups.includes("Sales Deputy Manager") ||
              users.groups.includes("Customer Service") ||
              users.groups.includes("Customer Relationship Manager") ||
              users.groups.includes("Customer Relationship Executive")) &&
              (invoiceData.status === "Price Approval" ||
                invoiceData.status === "Approved" ||
                invoiceData.status === "Raised") && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    SendForDropPI(e);
                  }}
                >
                  Drop
                </Button>
              )}
          </div>
        </div>
      </div>
      <div
        id="invoice"
        style={{ border: "1px Solid #000000" }}
        className="container-fluid m-0 p-2"
        ref={componentRef}
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
                          Proforma Tax Invoice / Sales Contract
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
                          {invoiceData.name_of_party},
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
                          {invoiceData.type_of_customer ===
                          "Exclusive Distribution Customer"
                            ? invoiceData.warehouse_person_name
                            : invoiceData.contact_person_name}
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
                  {invoiceData.origin_type === "domestic" && (
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
                  )}
                  <div
                    className="row mb-4"
                    style={{
                      ...typographyStyling,
                      borderBottom: "1px Solid #000000",
                    }}
                  >
                    <div className="col-md-5 text-right">
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
                    <div className="col-md-3 text-center d-flex align-items-end justify-content-center">
                      <div>
                        <p>For Buyer</p>
                        <p>----------------------------------------</p>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-end justify-content-center">
                      <div className="text-center">
                        For Glutape India Pvt. Ltd.
                        <br />
                        {invoiceData.approval
                          ? invoiceData.approval.approve_name
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          This is computer generated Proforma Invoice / Sales Contract
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
          setOpenPopup2={setOpenPopup}
          getProformaInvoiceData={getProformaInvoiceData}
        />
      </Popup>
      <Popup
        maxWidth={"lg"}
        openPopup={checkPricePopupOpen}
        setOpenPopup={setCheckPricePopupOpen}
        title="Price Information"
      >
        <CheckPrice priceData={priceData} />
      </Popup>
    </>
  );
};

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
