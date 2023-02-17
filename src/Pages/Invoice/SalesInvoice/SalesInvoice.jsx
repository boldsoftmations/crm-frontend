import React, { useEffect, useState, useRef } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import { Button } from "@mui/material";

import { useReactToPrint } from "react-to-print";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISOLogo.ico";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
export const SalesInvoice = (props) => {
  const { idForEdit, getSalesInvoiceDetails, setOpenPopup } = props;
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [hsnData, setHsnData] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getSalesInvoiceByIDDetails();
  }, []);

  const getSalesInvoiceByIDDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getSalesnvoiceDataById(idForEdit);
      setSalesInvoiceData(response.data);
      setProductData(response.data.products);
      setHsnData(response.data.hsn_table);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  const str = salesInvoiceData.amount_in_words
    ? salesInvoiceData.amount_in_words
    : "";
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const AMOUNT_IN_WORDS = arr.join(" ");

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Sales Invoice Number ${salesInvoiceData.order_book}`,
  });

  const TOTAL_GST_DATA = salesInvoiceData.total - salesInvoiceData.amount;
  const TOTAL_GST = TOTAL_GST_DATA.toFixed(2);

  return (
    <>
      {" "}
      <div
        className="container-fluid mb-4"
        style={{ border: "1px Solid #000000" }}
      >
        <div className="row p-2">
          <div className="col-xs-12 ">
            {" "}
            <Button variant="contained" onClick={handlePrint}>
              Export
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
                          {salesInvoiceData.seller_address},
                          {salesInvoiceData.seller_city},
                          {salesInvoiceData.seller_state}-
                          {salesInvoiceData.seller_state_code},<br />
                          {salesInvoiceData.seller_pincode}, CIN No ;-
                          {salesInvoiceData.seller_cin_number}, P.No :- <br />
                          {salesInvoiceData.seller_contact}
                          E:
                          {salesInvoiceData.seller_email},W:www.glutape.com
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
                        Sales Invoice
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
                          Sales Invoice No & Date :{" "}
                        </strong>{" "}
                        {salesInvoiceData.invoice_no} &{" "}
                        {salesInvoiceData.generation_date}
                      </div>

                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Customer Name :{" "}
                        </strong>{" "}
                        {salesInvoiceData.company}
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
                        {salesInvoiceData.place_of_supply}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Transporter Name :{" "}
                        </strong>
                        {salesInvoiceData.transporter_name}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Buyer Order No & Date :{" "}
                        </strong>
                        {salesInvoiceData.buyer_order_number} &{" "}
                        {salesInvoiceData.buyer_order_date}
                      </div>

                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Payment Terms :{" "}
                        </strong>{" "}
                        {salesInvoiceData.payment_terms}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Delivery Terms :{" "}
                        </strong>{" "}
                        {salesInvoiceData.delivery_terms}
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
                        {salesInvoiceData.company},
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Address :{" "}
                        </strong>
                        {salesInvoiceData.billing_address},
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          City & State:{" "}
                        </strong>
                        {salesInvoiceData.billing_city} &{" "}
                        {salesInvoiceData.billing_state},
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Pin Code :{" "}
                        </strong>
                        {salesInvoiceData.billing_pincode}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Gst Number :{" "}
                        </strong>
                        {salesInvoiceData.buyer_gst}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Pan Number :{" "}
                        </strong>
                        {salesInvoiceData.buyer_pan}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Contact :{" "}
                        </strong>
                        {salesInvoiceData.contact}
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
                        {salesInvoiceData.company},
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Address :{" "}
                        </strong>
                        {salesInvoiceData.shipping_address}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          City & State:{" "}
                        </strong>
                        {salesInvoiceData.shipping_city} &{" "}
                        {salesInvoiceData.shipping_state},
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Pin Code :{" "}
                        </strong>
                        {salesInvoiceData.shipping_pincode}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Gst Number :{" "}
                        </strong>
                        {salesInvoiceData.buyer_gst}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Pan Number :{" "}
                        </strong>
                        {salesInvoiceData.buyer_pan}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Contact :{" "}
                        </strong>
                        {salesInvoiceData.contact}
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
                              HSN COCE
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
                            <td className="text-center">{row.hsn_code}</td>

                            <td className="text-center">{row.quantity}</td>
                            <td className="text-center">{row.unit}</td>
                            <td className="text-center">{row.rate}</td>
                            <td className="text-center">{row.amount}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colspan="3.5" className="text-start">
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
                              {salesInvoiceData.seller_bank_name}{" "}
                            </div>
                            <div>
                              <strong style={{ ...typographyStyling }}>
                                Account No :{" "}
                              </strong>
                              {salesInvoiceData.seller_account_no}{" "}
                            </div>
                            <div>
                              <strong style={{ ...typographyStyling }}>
                                Branch & IFSC Code :{" "}
                              </strong>
                              {salesInvoiceData.seller_branch} &{" "}
                              {salesInvoiceData.seller_ifsc}{" "}
                            </div>
                            <div>
                              <strong style={{ ...typographyStyling }}>
                                Gst Number :{" "}
                              </strong>
                              {salesInvoiceData.seller_gst}
                            </div>
                            <div>
                              <strong style={{ ...typographyStyling }}>
                                Pan Number :{" "}
                              </strong>
                              {salesInvoiceData.seller_pan}
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
                            <span>{salesInvoiceData.amount}</span>
                            <br />
                            <span>
                              {salesInvoiceData.cgst
                                ? salesInvoiceData.cgst
                                : "-"}
                            </span>
                            <br />
                            <span>
                              {salesInvoiceData.sgst
                                ? salesInvoiceData.sgst
                                : "-"}
                            </span>
                            <br />
                            <span>
                              {salesInvoiceData.igst
                                ? salesInvoiceData.igst
                                : "-"}
                            </span>
                            <br />
                            <strong style={{ ...typographyStyling }}>
                              {salesInvoiceData.round_off}
                            </strong>
                            <br />
                            <strong style={{ ...typographyStyling }}>
                              {salesInvoiceData.round_off_total}
                            </strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {salesInvoiceData.amount_in_words !== undefined && (
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
                )}
                {hsnData.length > 0 && (
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
                                {salesInvoiceData.amount}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {salesInvoiceData.cgst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {salesInvoiceData.sgst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {salesInvoiceData.igst}
                              </strong>
                            </td>
                            <td colspan="1" className="text-start">
                              <strong style={{ ...typographyStyling }}>
                                {/* {salesInvoiceData.igst} */}
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
                  <div className="col-md-12 text-right">
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
