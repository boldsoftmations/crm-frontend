import React, { useEffect, useState, useRef } from "react";
import { Button } from "@mui/material";
import logo from "../../Images/glutape logo.jpg";
import ISO from "../../Images/ISOLogo.ico";
import AllLogo from "../../Images/allLogo.jpg";
import MSME from "../../Images/MSME.jpeg";
import { CustomLoader } from "../../Components/CustomLoader";
import InvoiceServices from "../../services/InvoiceService";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

export const DebitCreditInvoiceNote = (props) => {
  const { invoiceNoteData } = props;
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);

  const getDebitCreditInvoiceNoteByID = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getDebitCreditNoteById(
        invoiceNoteData.id
      );
      console.log("data", response.data);
      setInvoices(response.data.invoices);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (invoiceNoteData) getDebitCreditInvoiceNoteByID();
  }, [invoiceNoteData.id]);

  const componentRef = useRef();
  const downloadPDF = () => {
    const input = componentRef.current; // Reference to the component you want to print
    html2canvas(input, {
      scale: 1, // Adjust for higher resolution, if needed
      useCORS: true, // Ensures that external resources like images are loaded in the canvas
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "p",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${invoiceNoteData.note_type} Invoice Note.pdf`); // Specify the file name for the download
      })
      .catch((err) => {
        console.error("Error generating PDF", err);
      })
      .finally(() => {
        setOpen(false); // Update state to hide loader or indicate completion
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${invoiceNoteData.id} ${invoiceNoteData.note_type} Note`,
  });

  const TOTAL_GST_DATA = invoiceNoteData.total_amount - invoiceNoteData.amount;
  const TOTAL_GST = TOTAL_GST_DATA.toFixed(2);

  return (
    <>
      <CustomLoader open={open} />
      <div
        className="container-fluid mb-2"
        style={{ border: "1px Solid #000000" }}
      >
        <div className="row p-2">
          <div className="col-xs-12 ">
            {" "}
            <Button
              variant="contained"
              style={{ marginRight: "10px" }}
              color="info"
              onClick={downloadPDF}
              startIcon={<DownloadIcon />}
            >
              DownLoad
            </Button>
            <Button variant="contained" color="secondary" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>
      </div>
      <div
        className="container-fluid m-0 p-0"
        style={{ border: "1px Solid #000000" }}
        ref={componentRef}
      >
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
                      <img src={logo} alt="" height="60" width="150" />
                    </div>
                    <div className="col-md-7" style={{ marginRight: "1rem" }}>
                      {/* seller Details */}
                      <div className="text-center address">
                        <strong style={{ ...typographyStyling }}>
                          Glutape India Private Limited
                        </strong>
                        <br />
                        <p style={{ fontSize: "0.50rem" }}>
                          {invoiceNoteData.seller_details.address}-
                          {invoiceNoteData.seller_details.pincode},
                          <br /> State Name :{" "}
                          {invoiceNoteData.seller_details.state}, Code :{" "}
                          {invoiceNoteData.seller_details.state_code}, <br />
                          CIN : {invoiceNoteData.seller_details.cin_number},
                          Email : contact@glutape.com
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
                        {invoiceNoteData.note_type} Note
                      </p>
                    </div>
                  </div>
                  <div
                    className="row"
                    // style={{ borderBottom: "1px Solid #000000" }}
                  >
                    <div className="col-md-6" style={{ ...typographyStyling }}>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          {invoiceNoteData.note_type} Note NO. & Date :{" "}
                        </strong>{" "}
                        {invoiceNoteData.note_no} &{" "}
                        {invoiceNoteData.creation_date}
                      </div>
                      <div>
                        <strong>Note : </strong>
                        <span>{invoiceNoteData.notes}</span>
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
                          Customer Name:{" "}
                        </strong>
                        {invoiceNoteData.buyer_details.name}
                      </div>
                      <div>
                        <strong>Address :</strong>
                        {invoiceNoteData.buyer_details.billing_address},{" "}
                        {invoiceNoteData.buyer_details.billing_pincode}
                      </div>
                      <div>
                        <strong>GSTIN/UIN : </strong>
                        <span>{invoiceNoteData.buyer_details.gst}</span>
                      </div>
                      <div>
                        <strong>PAN/IT NO : </strong>
                        <span>{invoiceNoteData.buyer_details.pan}</span>
                      </div>
                      <div>
                        <strong>State Name: </strong>
                        <span>
                          {invoiceNoteData.buyer_details.billing_state}
                        </span>
                      </div>
                      <div>
                        <strong>Code: </strong>
                        {/* <span>{invoiceNoteData.buyer_details.}</span> */}
                      </div>
                      <div>
                        <strong>Contact Person: </strong>
                        <span>{invoiceNoteData.buyer_details.name}</span>
                      </div>

                      <div>
                        <strong>Contact Person: </strong>
                        <span>{invoiceNoteData.buyer_details.contact}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Billed To */}
                <div
                  className="row"
                  style={{
                    ...typographyStyling,
                    borderBottom: "1px Solid #000000",
                  }}
                ></div>
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
                          <td className="text-left">
                            <strong style={{ ...typographyStyling }}>
                              DESCRIPTION
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
                        <tr>
                          <td className="text-start">1</td>
                          <td className="text-left">
                            Reason :
                            <span className="">
                              {invoiceNoteData.reason === "Rate"
                                ? `${invoiceNoteData.reason} Difference`
                                : `${invoiceNoteData.reason}`}
                            </span>
                            <br />
                            Sales Invoice No:{" "}
                            {invoices.map((invoice, index) => (
                              <span key={index} className="m-1">
                                {invoice}
                              </span>
                            ))}
                            <br />
                            Date : {invoiceNoteData.creation_date}
                            <br />
                          </td>
                          <td className="text-center">
                            {invoiceNoteData.amount}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2.5" className="text-right ">
                            <div
                              style={{
                                textAlign: "end",
                                fontSize: "18px",
                              }}
                            >
                              <strong
                                style={{
                                  ...typographyStyling,
                                }}
                              >
                                IGST Output
                              </strong>
                            </div>
                          </td>
                          <td colspan=".5" className="text-right">
                            <div
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <strong style={{ ...typographyStyling }}>
                                {TOTAL_GST}
                              </strong>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2.5" className="text-right ">
                            <div
                              style={{
                                textAlign: "end",
                                fontSize: "18px",
                              }}
                            >
                              <strong
                                style={{
                                  ...typographyStyling,
                                }}
                              >
                                TOTAl AMOUNT
                              </strong>
                            </div>
                          </td>
                          <td colspan=".5" className="text-right">
                            <div
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <strong style={{ ...typographyStyling }}>
                                {invoiceNoteData.total_amount}
                              </strong>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  className="row mb-2"
                  style={{
                    ...typographyStyling,
                    borderBottom: "1px Solid #000000",
                  }}
                >
                  <div className="col-md-8">
                    <strong>Amount Chargeable (in words) :-</strong>
                    <br />
                    <strong>Company's PAN : </strong>
                    <span>{invoiceNoteData.seller_details.pan}</span>
                    <br />
                  </div>
                  <div className="col-md-4 text-right">
                    <ul style={{ listStyle: "none", fontSize: "12px" }}>
                      <strong style={{ fontSize: "14px" }}>
                        Company's Bank Details
                      </strong>
                      <li>
                        Bank Name :{" "}
                        <span>{invoiceNoteData.seller_details.bank_name}</span>
                      </li>
                      <li>
                        A/c No. :{" "}
                        <span>{invoiceNoteData.seller_details.account_no}</span>
                      </li>
                      <li>
                        Branch & IFS Code :{" "}
                        <span>{invoiceNoteData.seller_details.ifsc}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div
                  className="row mb-4"
                  style={{
                    ...typographyStyling,
                    borderBottom: "1px Solid #000000",
                  }}
                >
                  <div className="col-md-6 text-right">
                    <strong style={{ ...typographyStyling }}>
                      Terms and Condition :-
                    </strong>
                    {Information.map((data, i) => {
                      return (
                        <p
                          key={i}
                          style={{ margin: 0, padding: 0, fontSize: "0.50rem" }}
                        >
                          {data.id}
                          {data.text}
                          <br />
                        </p>
                      );
                    })}
                  </div>
                  <div className="col-md-6 text-end px-5">
                    <strong style={{ ...typographyStyling }}>
                      For Glutape India Limited -
                    </strong>
                    <br />
                    <span style={{ fontSize: "12px" }}>
                      {invoiceNoteData.seller_details.branch}
                    </span>
                    <br />
                    <span style={{ fontSize: "12px", paddingRight: "10px" }}>
                      Authorised Signatory
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 ">
                    <img
                      // className="p-2"
                      src={AllLogo}
                      alt=""
                      height="50"
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
    </>
  );
};

const typographyStyling = {
  fontSize: "0.80rem",
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
    text: "Validity of this Sales Invoice is 3 Days from Date of Proforma Invoice.",
  },
];
