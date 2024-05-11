import React from "react";
import { Image, Document, Page, View, Text } from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISO.png";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import moment from "moment";
import "../../../App.css";

export const MyDocument = (props) => {
  const { productData, invoiceData, hsnData, AMOUNT_IN_WORDS, TOTAL_GST } =
    props;
  // Calculate the number of pages required to display all products
  const totalPages = Math.ceil(productData.length / 6);

  // Create an array to store the products for each page
  const pages = [];

  // Split the productData into pages
  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * 6;
    const endIndex = startIndex + 6;
    const products = productData.slice(startIndex, endIndex);
    pages.push(products);
  }

  function capitalizeFirstLetter(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    // Assuming firstPageProducts and remainingProducts are arrays containing product data

    <Document>
      {pages.map((products, pageIndex) => (
        <Page
          size="A4"
          orientation="portrait"
          style={{
            fontSize: "12pt",
          }}
        >
          <View style={{ padding: "20pt" }}>
            <View style={containerStyle}>
              {/* HEADERS */}
              <Header
                invoiceData={invoiceData}
                capitalizeFirstLetter={capitalizeFirstLetter}
              />
              <View style={rowStyle}>
                <View
                  style={{
                    ...cellStyle,
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <Text style={{ fontWeight: "100", fontSize: 12 }}>
                    Proforma Tax Invoice
                  </Text>
                </View>
              </View>
              {/* PI DETAILS */}
              {/* PI AND DATE & PLACE OF SUPPLY */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    Proforma Invoice No & Date :
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.pi_number} & {invoiceData.generation_date}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Place of Supply :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.place_of_supply)}
                  </Text>
                </View>
              </View>
              {/* SALES PERSON AND TRASNPORTER NAME */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Sales Person :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.raised_by_first_name)}
                    {capitalizeFirstLetter(invoiceData.raised_by_last_name)}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Transporter Name :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.transporter_name)}
                  </Text>
                </View>
              </View>
              {/* VALID UNTIL & BUYER ORDER NO */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Valid Until :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {moment(invoiceData.validity).format("DD-MM-YYYY")}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    Buyer Order No & Date :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.buyer_order_no} &{" "}
                    {invoiceData.buyer_order_date}
                  </Text>
                </View>
              </View>
              {/* AMOUN T RECEIVED */}
              <View style={rowStyle}>
                <View z></View>
                <View style={{ ...cellStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Amount Receive :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.amount_recieved}
                  </Text>
                </View>
              </View>
              {/* PAYMENT TERMS*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Payment Terms :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.payment_terms}
                  </Text>
                </View>
              </View>
              {/* DELIVERY TERMS */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Delivery Terms :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.delivery_terms}
                  </Text>
                </View>
              </View>

              {/* BILLED  AND SHIPPED TO*/}
              {/* BILLED TO */}
              <View style={{ ...rowStyle, ...headerStyle }}>
                <View style={cellStyle}>
                  <Text
                    style={{
                      ...outerTextStyle,
                      ...borderRightStyle,
                      textAlign: "center",
                    }}
                  >
                    Billed To
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...outerTextStyle, textAlign: "center" }}>
                    Shipped To{" "}
                  </Text>
                </View>
              </View>
              {/* BILLED TO COMPANY*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Company :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.company_name)}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Company :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.company_name)}
                  </Text>
                </View>
              </View>
              {/* BILLED TO ADDRESS*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Address :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.billing_address)}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Address :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.address)}
                  </Text>
                </View>
              </View>
              {/* BILLED TO CITY & STATE*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>City & State:</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.billing_city)} &
                    {capitalizeFirstLetter(invoiceData.billing_state)}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>City & State:</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.city)} &
                    {capitalizeFirstLetter(invoiceData.state)}
                  </Text>
                </View>
              </View>
              {/* BILLED TO PINCODE*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Pin Code :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.billing_pincode}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}> Pin Code :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.pincode}
                  </Text>
                </View>
              </View>
              {/* BILLED TO GST NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Gst Number :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.gst_number}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Gst Number :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.gst_number}
                  </Text>
                </View>
              </View>
              {/* BILLED TO PAN NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Pan Number :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.pan_number}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Pan Number :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.pan_number}
                  </Text>
                </View>
              </View>
              {/* BILLED TO CONTACT*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.contact}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.contact}
                  </Text>
                </View>
              </View>
              {/* BILLED TO CONTACT PERSON*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact Person :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.contact_person_name)}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact Person :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.contact_person_name)}
                  </Text>
                </View>
              </View>
              {/* PRODUCT */}
              <View
                className={{ ...rowStyle, ...headerStyle }}
                style={{ ...rowStyle, ...headerStyle }}
              >
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.2,
                    flexGrow: 0.2,
                    marginLeft: "4pt",
                    textAlign: "left",
                  }}
                >
                  <Text>Sr.No</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,

                    flex: 0.8,
                    flexGrow: 0.8,
                    textAlign: "left",
                  }}
                >
                  <Text>Description of Goods</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.3,
                    flexGrow: 0.3,
                    textAlign: "center",
                  }}
                >
                  <Text>HSN</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.2,
                    flexGrow: 0.2,
                    textAlign: "center",
                  }}
                >
                  <Text>Quantity</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.2,
                    flexGrow: 0.2,
                    textAlign: "center",
                  }}
                >
                  <Text>Unit</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.2,
                    flexGrow: 0.2,
                    textAlign: "center",
                  }}
                >
                  <Text>Rate</Text>
                </View>
                <View
                  style={{
                    ...cellStyle,
                    flex: 0.2,
                    flexGrow: 0.2,
                    textAlign: "center",
                  }}
                >
                  <Text>Amount</Text>
                </View>
              </View>

              {/* Display firstPageProducts */}
              {products.map((historyRow, i) => {
                const productIndex = pageIndex * 6 + i + 1; // Calculate the product index across pages
                return (
                  <View style={{ ...rowStyle, paddingVertical: 5 }} key={i}>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.2,
                        flexGrow: 0.2,
                        marginLeft: "4pt",
                        textAlign: "left",
                      }}
                    >
                      <Text style={lightTextStyle}>{productIndex}</Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        textAlign: "left",

                        flex: 0.8,
                        flexGrow: 0.8,
                        width: 80,
                      }}
                    >
                      <Text style={{ ...lightTextStyle, color: "#000" }}>
                        {historyRow.product}
                      </Text>
                      <Text style={{ ...lightTextStyle, color: "#000" }}>
                        {capitalizeFirstLetter(historyRow.description)}
                      </Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.3,
                        flexGrow: 0.3,
                        textAlign: "center",
                      }}
                    >
                      <Text style={lightTextStyle}>{historyRow.hsn_code}</Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.2,
                        flexGrow: 0.2,
                        textAlign: "center",
                      }}
                    >
                      <Text style={lightTextStyle}>{historyRow.quantity}</Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.2,
                        flexGrow: 0.2,
                        textAlign: "center",
                      }}
                    >
                      <Text style={lightTextStyle}>
                        {capitalizeFirstLetter(historyRow.unit)}
                      </Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.2,
                        flexGrow: 0.2,
                        textAlign: "center",
                      }}
                    >
                      <Text style={lightTextStyle}>{historyRow.rate}</Text>
                    </View>
                    <View
                      style={{
                        ...cellStyle,
                        flex: 0.2,
                        flexGrow: 0.2,
                        textAlign: "center",
                      }}
                    >
                      <Text style={lightTextStyle}>{historyRow.amount}</Text>
                    </View>
                  </View>
                );
              })}
              {/* COMPANY DETAIL AND TOTAL GST AMOUNT */}
              <View style={{ ...rowStyle }}>
                <View style={{ ...cellStyle, ...headerStyle }}>
                  <Text
                    style={{
                      ...outerTextStyle,

                      textAlign: "center",
                    }}
                  >
                    Company Bank Details
                  </Text>
                </View>
                <View
                  style={{ ...cellStyle, ...headerStyle, ...borderRightStyle }}
                ></View>
                <View style={{ ...cellStyle, flexGrow: 0.4 }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    Taxable Amount :
                  </Text>
                </View>
                <View style={{ ...cellStyle, flexGrow: 0.4 }}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.amount}
                  </Text>
                </View>
              </View>
              {/*  COMPANY & Taxable Amount*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Company :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    Glutape India Pvt Ltd
                  </Text>
                </View>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    CGST Amount :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.cgst ? invoiceData.cgst : "-"}
                  </Text>
                </View>
              </View>
              {/* Bank & CGST Amount*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Bank :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.seller_bank_name)}
                  </Text>
                </View>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    SGST Amount :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.sgst ? invoiceData.sgst : "-"}
                  </Text>
                </View>
              </View>
              {/* >Account No & CITY & SGST Amount*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Account No :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.seller_account_no}
                  </Text>
                </View>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    IGST Amount :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.igst ? invoiceData.igst : "-"}
                  </Text>
                </View>
              </View>
              {/* Branch and IFSC Code & IGST Amount*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    Branch & IFSC Code :
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {capitalizeFirstLetter(invoiceData.seller_branch)} &
                    {invoiceData.seller_ifsc_code}
                  </Text>
                </View>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    Round Off :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.round_off}
                  </Text>
                </View>
              </View>
              {/* Round Off & GST NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Gst Number :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.seller_gst}
                  </Text>
                </View>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    Total Amount :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {invoiceData.round_off_total}
                  </Text>
                </View>
              </View>
              {/* Total Amount & PAN NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Pan Number :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {invoiceData.seller_pan}
                  </Text>
                </View>
                <View style={{ ...cellStyle }}></View>
                <View style={cellStyle}></View>
              </View>

              {/* AMOUNTS IN WORDS */}
              <View style={{ ...rowStyle }}>
                <View
                  style={{
                    ...cellStyle,
                    padding: "5pt",
                  }}
                >
                  <Text style={outerTextStyle}>
                    Amount in Words :-
                    <Text style={innerTextStyle}> &nbsp;{AMOUNT_IN_WORDS}</Text>
                  </Text>
                </View>
              </View>
              <View>
                <Text>{"\n"}</Text>
              </View>
              {/* HSN TABLE */}
              <View style={{ ...rowStyle, ...headerStyle }}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>HSN</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>TAXABLE AMOUNT</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>CGST</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>SGST</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>IGST</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>GST</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...outerTextStyle }}>TOTAL GST</Text>
                </View>
              </View>
              {/* HSN TABLE DATA*/}
              {hsnData.map((historyRow, i) => (
                <View style={rowStyle} key={i}>
                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>
                      {historyRow.hsn_code}
                    </Text>
                  </View>

                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>
                      {historyRow.amount}
                    </Text>
                  </View>

                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>{historyRow.cgst}</Text>
                  </View>

                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>{historyRow.sgst}</Text>
                  </View>

                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>{historyRow.igst}</Text>
                  </View>

                  <View style={{ ...cellStyle, ...borderRightStyle }}>
                    <Text style={{ ...innerTextStyle }}>
                      {historyRow.gst_percentage}
                    </Text>
                  </View>

                  <View style={cellStyle}>
                    <Text style={{ ...innerTextStyle }}>
                      {historyRow.total_gst}
                    </Text>
                  </View>
                </View>
              ))}

              {/* HSN TABLE DATA TOTAL AND TAX*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Total</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    {invoiceData.amount || "-"}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    {invoiceData.cgst || "-"}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    {invoiceData.sgst || "-"}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>
                    {invoiceData.igst | "-"}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>-</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...outerTextStyle }}>{TOTAL_GST | "-"}</Text>
                </View>
              </View>
              <View>
                <Text>{"\n"}</Text>
              </View>
              {/* TERMS AND CONDITION */}
              <View style={rowStyle}>
                <View
                  style={{
                    ...cellStyle,
                    marginLeft: "4pt",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 8 }}>
                    Terms and Condition :-
                  </Text>
                  {Information.map((data, i) => (
                    <Text key={i} style={{ color: "#777777", fontSize: 6 }}>
                      {data.id} {capitalizeFirstLetter(data.text)}
                    </Text>
                  ))}
                </View>
                <View
                  style={{
                    ...cellStyle,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={innerTextStyle}>
                    {invoiceData.approval
                      ? capitalizeFirstLetter(invoiceData.approval.approve_name)
                      : ""}
                  </Text>
                  <Text style={innerTextStyle}>
                    {invoiceData.approval
                      ? moment(invoiceData.approval.approval_date).format(
                          "DD-MM-YYYY"
                        )
                      : ""}
                  </Text>
                  <Text style={innerTextStyle}>Authorising Signatory</Text>
                  <Text style={innerTextStyle}>[Digitally Signed]</Text>
                </View>
              </View>
              {/* FOOTERS */}
              <Footer />
            </View>
          </View>
          <Text
            style={{
              ...lightTextStyle,
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            This is Computer Generated Proforma Tax Invoice
          </Text>
          <Text
            style={{
              ...lightTextStyle,
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Page {pageIndex + 1} of {totalPages}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

const Header = ({ invoiceData, capitalizeFirstLetter }) => (
  <View style={headersStyle}>
    <View style={{ marginRight: "20pt" }}>
      <Image source={logo} style={logoStyle} />
    </View>
    <View
      style={{
        ...cellStyle,
        alignItems: "center",
        textAlign: "center",
        padding: 0,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 12 }}>
        Glutape India Private Limited
      </Text>
      <Text style={{ color: "#777777", fontSize: 6 }}>
        {capitalizeFirstLetter(invoiceData.seller_address)},{" "}
        {capitalizeFirstLetter(invoiceData.seller_city)}, {"\n"}
        {capitalizeFirstLetter(invoiceData.seller_state)}-
        {invoiceData.seller_state_code},{invoiceData.seller_pincode}, CIN No;-{" "}
        {invoiceData.seller_cin}, P.No:- {invoiceData.seller_contact}
        {"\n"}
        E: {invoiceData.seller_email}, W: www.glutape.com
      </Text>
    </View>
    <View>
      <Image source={MSME} style={logo2Style} />
    </View>
    <View>
      <Image source={ISO} style={logo2Style} />
    </View>
  </View>
);

const Footer = () => (
  <View style={footerStyle}>
    <Image source={AllLogo} style={{ width: "100%", height: "auto" }} />
  </View>
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

const containerStyle = {
  border: "1pt solid #000000",
  overflow: "hidden",
};

const rowStyle = {
  display: "flex",
  flexDirection: "row",
  borderBottom: "1pt solid #ccc",
};
const headersStyle = {
  height: "40pt",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1pt solid #777777",
};
const footerStyle = {
  height: "40pt",
  flexDirection: "row",
  width: "100%",
  borderTop: "1pt solid #777777",
};
const headerStyle = {
  backgroundColor: "#eee",
  fontWeight: "bold",
};
const cellStyle = {
  flex: 1,
  flexGrow: 1,
  fontSize: 10,
};
const logoStyle = {
  height: "auto",
  width: "80pt",
};
const logo2Style = {
  height: "auto",
  width: "50pt",
};
const lightTextStyle = {
  fontWeight: 300,
  color: "#454545",
  fontSize: 8,
};

const outerTextStyle = {
  fontWeight: "bold",
  fontSize: 8,
  textAlign: "left",
  marginLeft: "5pt",
};

const innerTextStyle = {
  fontWeight: 300,
  fontSize: 8,
  color: "#454545",
  marginLeft: "5pt",
};
const borderRightStyle = {
  borderRightWidth: 1,
  borderRightColor: "#ccc",
};
