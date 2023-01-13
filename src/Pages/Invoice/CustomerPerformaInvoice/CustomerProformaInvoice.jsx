import React, { useEffect, useState, useRef } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { CustomerConfirmationPayment } from "./CustomerConfirmationPayment";
import { Popup } from "./../../../Components/Popup";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { CustomLoader } from "../../../Components/CustomLoader";
import logo from " ../../../public/images.ico";
import ISO from "../../../Images/ISOLogo.ico";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/msme.ico";
import "../CustomerPiStyle.css";

export const CustomerProformaInvoice = (props) => {
  const { idForEdit, setOpenPopup, getCustomerPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [open, setOpen] = useState(false);
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
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

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
    }
  };
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `PI Number ${invoiceData.pi_number}`,
  });

  return (
    <>
      <CustomLoader open={open} />
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
      <div className="row" >
        {/* <!-- BEGIN INVOICE --> */}
        <div className="col-xs-12">
          <div className="grid invoice">
            <div className="grid-body">
              <div className="invoice-title"> 
                <div
                  className="row"
                  // style={{ borderBottom: "1px Solid #000000" }}
                >
                  <div className="col-md-2 align-self-center">
                    <img src={logo} alt="" height="50" width="120" />
                  </div>
                  <div className="col-md-7" style={{ marginRight: "1em" }}>
                    {/* seller Details */}
                    <div className="text-center">
                      <strong>Glutape India Private Limited</strong>
                      <br /> {invoiceData.seller_address},
                      {invoiceData.seller_city},{invoiceData.seller_state}-
                      {invoiceData.seller_state_code},
                      {invoiceData.seller_pincode}, CIN No ;-
                      {invoiceData.seller_cin}, P.No :-{" "}
                      {invoiceData.seller_contact} E:
                      {invoiceData.email},W:www.glutape.com
                    </div>
                  </div>
                  <div className="col-md-1 d-flex align-items-center justify-content-end">
                    <img src={MSME} alt="" height="35" width="90" />
                  </div>
                  <div className="col-md-1 d-flex align-items-center justify-content-start">
                    <img src={ISO} alt="" height="35" width="90" />
                  </div>
                </div>
                {/* <hr /> */}
                <div className="row">
                  <div
                    className="col-md-12"
                    style={{ borderBottom: "1px Solid #000000" }}
                  >
                    <p className="text-center fs-5 fw-bold p-0 m-0">
                      Proforma Invoice
                    </p>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ borderBottom: "1px Solid #000000" }}
                >
                  <div className="col-md-6">
                    <div>
                      <span className="fw-bold">Proforma Invoice : </span>{" "}
                      {invoiceData.pi_number}
                    </div>
                    <div>
                      <span className="fw-bold">Sales Person Name : </span>{" "}
                      {invoiceData.raised_by}
                    </div>
                    <div>
                      <span className="fw-bold">Proforma Invoice Date : </span>{" "}
                      {invoiceData.generation_date}
                    </div>
                    <div>
                      <span className="fw-bold">Customer Name : </span>{" "}
                      {invoiceData.company}
                    </div>
                    <div>
                      <span className="fw-bold">Valid Until : </span>{" "}
                      {invoiceData.validity}
                    </div>
                  </div>

                  <div
                    className="col-md-6"
                    style={{ borderLeft: "1px Solid #000000" }}
                  >
                    <div>
                      <span className="fw-bold">Place of Supply : </span>
                      Bhiwandi
                    </div>
                    <div>
                      <span className="fw-bold">Buyer Order No : </span>{" "}
                      {invoiceData.buyer_order_no}
                    </div>
                    <div>
                      <span className="fw-bold">Buyer Order Date : </span>{" "}
                      {invoiceData.buyer_order_no_date}
                    </div>
                    <div>
                      <span className="fw-bold">Payment Terms : </span>{" "}
                      {invoiceData.payment_terms}
                    </div>
                    <div>
                      <span className="fw-bold">Delivery Terms : </span>{" "}
                      {invoiceData.delivery_terms}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row"
                style={{ borderBottom: "1px Solid #000000" }}
              >
                <div className="col-md-6">
                  <address>
                    <strong>Billed To:</strong>
                    <br />
                    <div>
                      <span className="fw-bold">Company : </span>
                      {invoiceData.company},
                    </div>
                    <div>
                      <span className="fw-bold">Address : </span>
                      {invoiceData.billing_address},
                    </div>
                    <div>
                      <span className="fw-bold">City & State: </span>
                      {invoiceData.billing_city} & {invoiceData.billing_state},
                    </div>
                    <div>
                      <span className="fw-bold">Pin Code : </span>
                      {invoiceData.billing_pincode}
                    </div>
                  </address>
                </div>
                <div
                  className="col-md-6 justify-content-end"
                  style={{ borderLeft: "1px Solid #000000" }}
                >
                  <address className="justify-content-end">
                    <strong>Shipped To:</strong>
                    <br />
                    <div>
                      <span className="fw-bold">Company : </span>
                      {invoiceData.company},
                    </div>
                    <div>
                      <span className="fw-bold">Address : </span>
                      {invoiceData.address}
                    </div>
                    <div>
                      <span className="fw-bold">City & State: </span>
                      {invoiceData.city} & {invoiceData.state},
                    </div>
                    <div>
                      <span className="fw-bold">Pin Code : </span>
                      {invoiceData.pincode}
                    </div>
                  </address>
                </div>
              </div>
              <div className="row" style={{ borderBottom: "1px Solid #000000" }}>
                <div className="col-md-12">
                  <table className="table">
                    <thead>
                      <tr className="line">
                        <td className="text-start">
                          <strong>SR.NO</strong>
                        </td>
                        <td className="text-center">
                          <strong>DESCRIPTION OF GOODS</strong>
                        </td>
                        <td className="text-center">
                          <strong>BRAND</strong>
                        </td>
                        <td className="text-center">
                          <strong>HSN COCE</strong>
                        </td>
                        <td className="text-center">
                          <strong>QTY</strong>
                        </td>
                        <td className="text-center">
                          <strong>UNIT</strong>
                        </td>
                        <td className="text-center">
                          <strong>RATE</strong>
                        </td>
                        <td className="text-end">
                          <strong>AMOUNT</strong>
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
                          <td className="text-center">{row.quantity}</td>
                          <td className="text-center">{row.unit}</td>
                          <td className="text-center">{row.rate}</td>
                          <td className="text-end">{row.amount}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colspan="4.5" className="text-start">
                          <strong>Company Bank Details : </strong>
                          <div>
                            <strong>Bank : </strong>
                            {invoiceData.seller_bank_name}{" "}
                          </div>
                          <div>
                            <strong>Account No : </strong>
                            {invoiceData.seller_account_no}{" "}
                          </div>
                          <div>
                            <strong>Branch & IFSC Code : </strong>
                            {invoiceData.seller_branch} &{" "}
                            {invoiceData.seller_ifsc}{" "}
                          </div>
                        </td>
                        <td colspan="3">
                          <strong>Taxabale Amount</strong>
                          <br />
                          <strong>CGST Amount</strong> <br />
                          <strong>SGST Amount</strong> <br />
                          <strong>IGST Amount</strong> <br />
                          <strong>Total Amount</strong>
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
                          <strong>{invoiceData.total}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mb-4" style={{ borderBottom: "1px Solid #000000" }}>
                <div className="col-md-8 text-right">
                  {Information.map((data, i) => {
                    return (
                      <p
                        key={i}
                        style={{ margin: 0, padding: 0, fontSize: "11px" }}
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
                      ? invoiceData.approval.approved_by
                      : ""}
                    {invoiceData.approval
                      ? invoiceData.approval.approved_date
                      : ""}
                    <br />
                    <strong>Authorising Signatory</strong>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 ">
                  <img
                    className="p-2"
                    src={AllLogo}
                    alt=""
                    height="80"
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
    text: "Material is delivered at owner's risk and with no liability of transportation damage to glutape india Pvt Ltd. ",
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