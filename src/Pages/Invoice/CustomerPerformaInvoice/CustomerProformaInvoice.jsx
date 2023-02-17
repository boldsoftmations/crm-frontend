import React, { useEffect, useState, useRef } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomerConfirmationPayment } from "./CustomerConfirmationPayment";
import { Popup } from "./../../../Components/Popup";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { CustomLoader } from "../../../Components/CustomLoader";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISOLogo.ico";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
// import "../CustomerPiStyle.css";
import { ErrorMessage } from "./../../../Components/ErrorMessage/ErrorMessage";

export const CustomerProformaInvoice = (props) => {
  const { idForEdit, setOpenPopup, getCustomerPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [hsnData, setHsnData] = useState([]);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [totalGst, setTotalGst] = useState("");
  const data = useSelector((state) => state.auth);
  const users = data.profile;
  useEffect(() => {
    getAllProformaInvoiceDetails();
  }, []);

  const getAllProformaInvoiceDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getCompanyPerformaInvoiceByIDData(
        idForEdit
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

  const SendForApprovalPI = async (e) => {
    try {
      e.preventDefault();
      const req = {
        proformainvoice: invoiceData.pi_number,
        approved_by: users.email,
        status: "Approved",
      };
      await InvoiceServices.sendForApprovalData(req);
      setOpenPopup(false);
      setOpen(false);
      getCustomerPIDetails();
    } catch (err) {
      setOpen(false);
      setErrMsg(
        err.response.data.errors.non_field_errors
          ? err.response.data.errors.non_field_errors
          : err.response.data.errors
      );
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `PI Number ${invoiceData.pi_number}`,
  });

  const TOTAL_GST_DATA = invoiceData.total - invoiceData.amount;
  const TOTAL_GST = TOTAL_GST_DATA.toFixed(2);
  return (
    <>
      <CustomLoader open={open} />
      <ErrorMessage errMsg={errMsg} />
      <div
        className="container-fluid mb-4"
        style={{ border: "1px Solid #000000" }}
      >
        <div className="row p-4">
          <div className="col-xs-6 ">
            {invoiceData.status !== "Pending Approval" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
              >
                Export
              </button>
            )}
          </div>
          <div className="col-xs-6">
            {users.is_staff === true &&
              invoiceData.status === "Pending Approval" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => {
                    SendForApprovalPI(e);
                    // SendForApprovalStatus(e);
                  }}
                >
                  Approve
                </button>
              )}
            {invoiceData.status === "Approved" &&
              users.groups[0] === "Accounts" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setOpenPopup2(true)}
                >
                  Confirmation Payment
                </button>
              )}
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
                          {invoiceData.seller_address},{invoiceData.seller_city}
                          ,{invoiceData.seller_state}-
                          {invoiceData.seller_state_code},<br />
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
                    <div className="col-md-6" style={{ ...typographyStyling }}>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Proforma Invoice No & Date :{" "}
                        </strong>{" "}
                        {invoiceData.pi_number} & {invoiceData.generation_date}
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
                          Customer Name :{" "}
                        </strong>{" "}
                        {invoiceData.company}
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
                        {invoiceData.company},
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
                        {invoiceData.billing_city} & {invoiceData.billing_state}
                        ,
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
                        {invoiceData.company},
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
                              HSN COCE
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
                              {invoiceData.seller_ifsc}{" "}
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
                          style={{ margin: 0, padding: 0, fontSize: "0.50rem" }}
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
      <Popup
        maxWidth={"md"}
        title={"Customer Confirmation of payment detail"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CustomerConfirmationPayment
          users={users}
          invoiceData={invoiceData}
          setOpenPopup={setOpenPopup2}
          getAllProformaInvoiceDetails={getAllProformaInvoiceDetails}
        />
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
