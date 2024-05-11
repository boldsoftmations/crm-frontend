import React from "react";
import { Image, Document, Page, View, Text } from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import ISO from "../../../Images/ISO.png";
import AllLogo from "../../../Images/allLogo.jpg";
import MSME from "../../../Images/MSME.jpeg";
import "../../../App.css";

export const PurchaseOrderPDF = ({ purchaseOrderData, AMOUNT_IN_WORDS }) => {
  console.log("purchaseOrderData", purchaseOrderData);
  // Calculate the number of pages required to display all products
  const totalPages = Math.ceil(purchaseOrderData.products.length / 6);

  // Create an array to store the products for each page
  const pages = [];

  // Split the productData into pages
  for (let i = 0; i < totalPages; i++) {
    const startIndex = i * 6;
    const endIndex = startIndex + 6;
    const products = purchaseOrderData.products.slice(startIndex, endIndex);
    pages.push(products);
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
              <Header purchaseOrderData={purchaseOrderData} />
              <View style={rowStyle}>
                <View
                  style={{
                    ...cellStyle,
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <Text style={{ fontWeight: "100", fontSize: 12 }}>
                    Purchase Order
                  </Text>
                </View>
              </View>
              {/* PI DETAILS */}
              {/* PI AND DATE & PLACE OF SUPPLY */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={{ ...cellStyle, ...borderRightStyle }}></View>
                <View style={cellStyle}></View>
              </View>
              {/* SALES PERSON AND TRASNPORTER NAME */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>PO Date : </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.po_date}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>PO NO & Date : </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.po_no} & {purchaseOrderData.po_date}
                  </Text>
                </View>
              </View>

              {/* PAYMENT TERMS*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Currency :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.symbol + " "}
                    {purchaseOrderData.currency}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Payment Terms :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.payment_terms}
                  </Text>
                </View>
              </View>
              {/* DELIVERY TERMS */}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Schedule Date :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.schedule_date}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Delivery Terms :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.delivery_terms}
                  </Text>
                </View>
              </View>

              {/* Vendor and Delivery Address*/}
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
                    Supplier Details
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...outerTextStyle, textAlign: "center" }}>
                    Buyer Details
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
                    {purchaseOrderData.vendor}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Company :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.seller_company}
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
                    {purchaseOrderData.vendor_address} ,{" "}
                    {purchaseOrderData.vendor_city} ,{" "}
                    {purchaseOrderData.vendor_state} ,{" "}
                    {purchaseOrderData.vendor_pincode}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Address :</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.seller_address}
                  </Text>
                </View>
              </View>
              {/* BILLED TO CITY & STATE*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Email</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.vendor_email}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Gst Number</Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.seller_gst}
                  </Text>
                </View>
              </View>
              {/* BILLED TO PINCODE*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact Person :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.vendor_contact_person}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}></Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}></Text>
                </View>
              </View>
              {/* BILLED TO GST NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}>Contact :</Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...innerTextStyle }}>
                    {purchaseOrderData.vendor_contact}
                  </Text>
                </View>
                <View style={{ ...cellStyle, ...borderRightStyle }}>
                  <Text style={{ ...outerTextStyle }}></Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle }}></Text>
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
                        {historyRow.description}
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
                      <Text style={lightTextStyle}>{historyRow.unit}</Text>
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

              {/*  COMPANY & Taxable Amount*/}
              {purchaseOrderData.vendor_type === "Domestic" && (
                <View style={rowStyle}>
                  <View style={{ ...cellStyle }}>
                    <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                      CGST Amount :
                    </Text>
                  </View>
                  <View style={cellStyle}>
                    <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                      {purchaseOrderData.cgst ? purchaseOrderData.cgst : "-"}
                    </Text>
                  </View>
                </View>
              )}
              {/* Bank & CGST Amount*/}
              {purchaseOrderData.vendor_type === "Domestic" && (
                <View style={rowStyle}>
                  <View style={{ ...cellStyle }}>
                    <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                      SGST Amount :
                    </Text>
                  </View>
                  <View style={cellStyle}>
                    <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                      {purchaseOrderData.sgst ? purchaseOrderData.sgst : "-"}
                    </Text>
                  </View>
                </View>
              )}
              {/* >Account No & CITY & SGST Amount*/}
              {purchaseOrderData.vendor_type === "Domestic" && (
                <View style={rowStyle}>
                  <View style={{ ...cellStyle }}>
                    <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                      IGST Amount :
                    </Text>
                  </View>
                  <View style={cellStyle}>
                    <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                      {purchaseOrderData.igst ? purchaseOrderData.igst : "-"}
                    </Text>
                  </View>
                </View>
              )}
              {/* Branch and IFSC Code & IGST Amount*/}
              {purchaseOrderData.vendor_type === "Domestic" && (
                <View style={rowStyle}>
                  <View style={{ ...cellStyle }}>
                    <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                      Round Off :
                    </Text>
                  </View>
                  <View style={cellStyle}>
                    <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                      {purchaseOrderData.round_off}
                    </Text>
                  </View>
                </View>
              )}
              {/* Round Off & GST NUMBER*/}
              <View style={rowStyle}>
                <View style={{ ...cellStyle }}>
                  <Text style={{ ...outerTextStyle, textAlign: "right" }}>
                    Total Amount :
                  </Text>
                </View>
                <View style={cellStyle}>
                  <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                    {purchaseOrderData.symbol + " "}
                    {purchaseOrderData.round_off_total}
                  </Text>
                </View>
              </View>
              {/* Total Amount & PAN NUMBER*/}
              <View style={rowStyle}>
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
                    <Text style={{ ...innerTextStyle, textAlign: "center" }}>
                      {purchaseOrderData.amount_in_word}
                    </Text>
                  </Text>
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
                  {purchaseOrderData.vendor_type === "Domestic"
                    ? Information.map((data, i) => (
                        <Text key={i} style={{ color: "#777777", fontSize: 6 }}>
                          {data.id} {data.text}
                        </Text>
                      ))
                    : Info.map((data, i) => (
                        <Text key={i} style={{ color: "#777777", fontSize: 6 }}>
                          {data.id} {data.text}
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
                    {purchaseOrderData.created_by || ""}
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
            This is Computer Generated Purchase Order Invoice
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

const Header = ({ purchaseOrderData }) => (
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
        {purchaseOrderData.seller_address}, {purchaseOrderData.seller_city},{" "}
        {"\n"}
        {purchaseOrderData.seller_state}-{purchaseOrderData.seller_state_code},
        {purchaseOrderData.seller_pincode}, CIN No;-{" "}
        {purchaseOrderData.seller_cin}, P.No:-{" "}
        {purchaseOrderData.seller_contact}
        {"\n"}
        E: {purchaseOrderData.seller_email}, W: www.glutape.com
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

const Info = [
  {
    id: "1)",
    text: "Please send your acceptance through return mail within 24 Hrs.",
  },
  {
    id: "2)",
    text: "Material should  be shipped as per the schedule dates. Any delay in supply will attract a Late delivery charges @2% on part or there of. ",
  },

  {
    id: "3)",
    text: "Please do mention the correct P.O number and Part number in all invoice copies & respective delivery documents .",
  },
  {
    id: "4)",
    text: "Apart from this, schedule excess qty. will be returned to you on your account.",
  },
  {
    id: "5)",
    text: "Any short reciept will be debited in multipac of the packets..",
  },
  {
    id: "6)",
    text: "On acknowledgement of wrong invoicing, Glutape India Pvt Ltd will debit 3 times of (concerned) invoice value to your account.",
  },
  {
    id: "7)",
    text: "We reserve the right to reject the supply at any stage if the consignment / goods does not confirm the specification or sample or defects are revealed during processing.",
  },
  {
    id: "8)",
    text: "Please ensure that proper barcoding is followed for each item mentioned in this purchase order, if barcoding is not followed, the material will be rejected and sent back on your account.",
  },
];

const Information = [
  {
    id: "1)",
    text: "Please send your acceptance through return mail within 24 Hrs.",
  },
  {
    id: "2)",
    text: "Material should  reach in Our Stores as per the schedule dates. Any delay in supply will attract a Late delivery charges @2% on part or there of. ",
  },
  {
    id: "3)",
    text: "Every part needs to make on seperate invoice, cupled invoices will not inwarded.",
  },
  {
    id: "4)",
    text: "Delivery should be between 09.00 AM to 06.00 PM",
  },
  {
    id: "5)",
    text: "Please do mention the correct P.O number and Part number in all invoice copies & respective delivery documents .",
  },
  {
    id: "6)",
    text: "Apart from this, schedule excess qty. will be returned to you on your account.",
  },
  {
    id: "7)",
    text: "Any short reciept will be debited in multipac of the packets..",
  },
  {
    id: "8)",
    text: "On acknowledgement of wrong invoicing, Glutape India Pvt Ltd will debit 3 times of (concerned) invoice value to your account.",
  },
  {
    id: "9)",
    text: "We reserve the right to reject the supply at any stage if the consignment / goods does not confirm the specification or sample or defects are revealed during processing.",
  },
  {
    id: "10)",
    text: "Please ensure that proper barcoding is followed for each item mentioned in this purchase order, if barcoding is not followed, the material will be rejected and sent back on your account.",
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
