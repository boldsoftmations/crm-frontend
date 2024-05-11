import React, { useEffect, useRef, useState } from "react";
import { CustomLoader } from "../../../Components/CustomLoader";
import InventoryServices from "../../../services/InventoryService";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISOLogo.ico";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { Button } from "@mui/material";

export const PurchaseInvoice = (props) => {
  const { idForEdit } = props;
  console.log("idForEdit", idForEdit);
  const [purchaseInvoiceDataByID, setPurchaseInvoiceDataByID] = useState([]);
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    if (idForEdit) getAllPackingListDetailsByID();
  }, [idForEdit]);

  const getAllPackingListDetailsByID = async () => {
    try {
      setOpen(true);
      const response = await InventoryServices.getPurchaseInvoiceDataById(
        idForEdit
      );
      setPurchaseInvoiceDataByID(response.data);
      setProductData(response.data.products_data);

      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  const str = purchaseInvoiceDataByID.amount_in_words
    ? purchaseInvoiceDataByID.amount_in_words
    : "";
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const AMOUNT_IN_WORDS = arr.join(" ");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `PI Number ${purchaseInvoiceDataByID.invoice_no} ${purchaseInvoiceDataByID}`,
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
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
            >
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
                      <img src={logo} alt="" Height="60" width="150" />
                    </div>
                    <div className="col-md-7" style={{ marginRight: "1rem" }}>
                      {/* seller Details */}
                      <div className="text-center address">
                        <strong style={{ ...typographyStyling }}>
                          Glutape India Private Limited
                        </strong>
                        <br />
                        <p style={{ fontSize: "0.70rem" }}>
                          {purchaseInvoiceDataByID.seller_address},
                          {purchaseInvoiceDataByID.seller_city},
                          {purchaseInvoiceDataByID.seller_state}-
                          {purchaseInvoiceDataByID.seller_state_code},<br />
                          {purchaseInvoiceDataByID.seller_pincode}, CIN No ;-
                          {purchaseInvoiceDataByID.seller_cin}, P.No :-
                          {purchaseInvoiceDataByID.seller_contact} <br />
                          E:
                          {purchaseInvoiceDataByID.seller_email}
                          ,W:www.glutape.com
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
                        Purchase Invoice
                      </p>
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{ borderBottom: "1px Solid #000000" }}
                  >
                    <div className="col-md-6 justify-content-end">
                      <address className="justify-content-end">
                        <strong style={{ ...typographyStyling }}>
                          Shipped From:
                        </strong>
                        <br />
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Supplier :{" "}
                          </strong>
                          {purchaseInvoiceDataByID.supplier_name},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Address :{" "}
                          </strong>
                          {purchaseInvoiceDataByID.address}
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            City & State:{" "}
                          </strong>
                          {purchaseInvoiceDataByID.city} &{" "}
                          {purchaseInvoiceDataByID.state},
                        </div>
                        <div>
                          <strong style={{ ...typographyStyling }}>
                            Pin Code :{" "}
                          </strong>
                          {purchaseInvoiceDataByID.pincode}
                        </div>
                        {purchaseInvoiceDataByID.gst_number !== "" ? (
                          <div>
                            <strong style={{ ...typographyStyling }}>
                              Gst Number :{" "}
                            </strong>
                            {purchaseInvoiceDataByID.gst_number}
                          </div>
                        ) : null}
                        {purchaseInvoiceDataByID.pan_number !== "" ? (
                          <div>
                            <strong style={{ ...typographyStyling }}>
                              Pan Number :{" "}
                            </strong>
                            {purchaseInvoiceDataByID.pan_number}
                          </div>
                        ) : null}
                      </address>
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
                          Voucher No & Date. :{" "}
                        </strong>
                        {purchaseInvoiceDataByID.invoice_no} &{" "}
                        {purchaseInvoiceDataByID.invoice_date}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Grn No & Date. :{" "}
                        </strong>
                        {purchaseInvoiceDataByID.grn_number} &{" "}
                        {purchaseInvoiceDataByID.grn_date}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Purchase Order No & Date :
                        </strong>
                        {purchaseInvoiceDataByID.po_no} &{" "}
                        {purchaseInvoiceDataByID.po_date}
                      </div>
                      <div>
                        <strong style={{ ...typographyStyling }}>
                          Supplier Invoice & Date:{" "}
                        </strong>
                        {purchaseInvoiceDataByID.packing_list_no} &{" "}
                        {purchaseInvoiceDataByID.order_date}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
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
                              HSN CODE
                            </strong>
                          </td>
                          <td className="text-center">
                            <strong style={{ ...typographyStyling }}>
                              QUANTITY
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
                            <td className="text-center">{row.hsn}</td>
                            <td className="text-center">{row.quantity}</td>
                            <td className="text-center">{row.unit}</td>
                            <td className="text-center">{row.rate}</td>
                            <td className="text-center">{row.amount}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colspan="3" className="text-start"></td>
                          <td colspan="2">
                            <strong style={{ ...typographyStyling }}>
                              Taxable Amount
                            </strong>

                            {purchaseInvoiceDataByID.gst > 0.0 ? (
                              <>
                                <br />
                                <strong style={{ ...typographyStyling }}>
                                  GST Amount
                                </strong>
                              </>
                            ) : null}

                            {purchaseInvoiceDataByID.round_off > 0.0 ? (
                              <>
                                <br />
                                <strong style={{ ...typographyStyling }}>
                                  Round Off
                                </strong>
                              </>
                            ) : null}
                            <br />
                            <strong style={{ ...typographyStyling }}>
                              Total Amount
                            </strong>
                          </td>
                          <td colspan="1" className="text-right">
                            <span>{purchaseInvoiceDataByID.amount}</span>

                            {purchaseInvoiceDataByID.gst > 0.0 ? (
                              <>
                                <br />
                                <span>
                                  {purchaseInvoiceDataByID.gst
                                    ? purchaseInvoiceDataByID.gst
                                    : "-"}
                                </span>
                              </>
                            ) : null}

                            {purchaseInvoiceDataByID.round_off > 0.0 ? (
                              <>
                                <br />
                                <span style={{ ...typographyStyling }}>
                                  {purchaseInvoiceDataByID.round_off}
                                </span>
                              </>
                            ) : null}
                            <br />
                            <strong style={{ ...typographyStyling }}>
                              {purchaseInvoiceDataByID.round_off_total}
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
