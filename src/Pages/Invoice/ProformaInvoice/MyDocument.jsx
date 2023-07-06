import React from "react";
import {
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISO.png";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import moment from "moment";

export const MyDocument = (props) => {
  const { productData, invoiceData, hsnData, AMOUNT_IN_WORDS, TOTAL_GST } =
    props;
  return (
    <Document>
      <Page
        size="A4"
        orientation="portrait"
        style={{ fontFamily: "Helvetica", fontSize: "12pt" }}
      >
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
                  {invoiceData.seller_address}, {invoiceData.seller_city},{" "}
                  {"\n"}
                  {invoiceData.seller_state}-{invoiceData.seller_state_code},
                  {invoiceData.seller_pincode}, CIN No;-{" "}
                  {invoiceData.seller_cin}, P.No:- {invoiceData.seller_contact}
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
                  Proforma Tax Invoice
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
                <Text style={{ ...style.innerText }}>
                  {invoiceData.address}
                </Text>
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
                <Text style={{ ...style.innerText }}>
                  {invoiceData.pincode}
                </Text>
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
                <Text style={{ ...style.innerText }}>
                  {invoiceData.contact}
                </Text>
              </View>
              <View style={{ ...style.cell, ...style.borderRight }}>
                <Text style={{ ...style.outerText }}>Contact :</Text>
              </View>
              <View style={style.cell}>
                <Text style={{ ...style.innerText }}>
                  {invoiceData.contact}
                </Text>
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
                <Text style={{ ...style.innerText }}>
                  Glutape India Pvt Ltd
                </Text>
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
                  <Text style={{ ...style.innerText }}>
                    {historyRow.amount}
                  </Text>
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
                  {invoiceData.approval
                    ? invoiceData.approval.approval_date
                    : ""}
                </Text>
                <Text style={{ ...style.outerText }}>
                  {" "}
                  Authorising Signatory
                </Text>
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
        <Text
          style={{
            ...style.lightText,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          This is computer generated Proforma Invoice
        </Text>
      </Page>
    </Document>
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
