import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png"; // Ensure the logo is imported correctly

// Register font if necessary
// Font.register({ family: 'Oswald', src: 'http://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf' });

// Create styles
// Styles for the entire page, header, table, and footer
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 24,
    fontFamily: "Helvetica",
  },
  Container: {
    borderWidth: 1,
    borderColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1, // Add a bottom border
    borderColor: "#000",
  },
  logo: {
    width: 100,
    height: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    // textAlign: "center",
    flex: 1,
    marginRight: 100, // Adjust based on the size of your logo
  },
  grnInfoContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    fontSize: 12,
    alignItems: "flex-end",
  },
  grnInfo: {
    marginLeft: 4,
    marginBottom: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#CCCCCC",
  },
  tableHeaderCell: {
    fontSize: 12,
    fontWeight: "bold",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableCell: {
    fontSize: 12,
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 12,
  },
  signatureLabel: {
    fontSize: 12,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    // minWidth: 150,
    marginTop: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginTop: 8,
    marginBottom: 8,
  },
});

const colStyles = StyleSheet.create({
  col1: { flex: 0.5 },
  col2: { flex: 1 },
  col3: { flex: 3 },
  col4: { flex: 1 },
  col5: { flex: 1 },
  col6: { flex: 1 },
});

// Example data structure for items
const items = [
  {
    code: "0001",
    description: "Sample Item Description",
    orderQty: 10,
    qaRejection: 0,
    receivedQty: 10,
  },
  // ... more items
];
// Define your document component
export const GRNPDFDownload = ({ grnRegisterPDFData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.Container}>
          {/* Header Section */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>GOODS RECEIVED NOTE</Text>
            <View style={styles.grnInfoContainer}>
              <Text style={styles.grnInfo}>
                GRN No: {grnRegisterPDFData.grn_no}
              </Text>
            </View>
          </View>
          {/* <View style={styles.divider} /> */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ flex: 1, fontSize: 12, marginLeft: 24 }}>
              Supplier Name: {grnRegisterPDFData.vendor}
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end", marginRight: 24 }}>
              <Text style={{ fontSize: 12 }}>
                GRN Date: {grnRegisterPDFData.created_on}
              </Text>
              <Text style={{ fontSize: 12 }}>
                Invoice No: {grnRegisterPDFData.packing_list_no}
              </Text>
              <Text style={{ fontSize: 12 }}>
                Supplier Invoice Date: {grnRegisterPDFData.pl_date}
              </Text>
            </View>
          </View>
          {/* Table Section */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Sr. No.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 4 }]}>
                Item Code
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                Item Description
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                Order Qty
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                QA Rejection
              </Text>
              <Text
                style={[
                  styles.tableHeaderCell,
                  { flex: 1, borderRightWidth: 0 },
                ]}
              >
                Received Qty
              </Text>
            </View>
            {grnRegisterPDFData.products.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 4 }]}>
                  {item.products}
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {item.description}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.order_quantity}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {item.qa_rejected}
                </Text>
                <Text
                  style={[styles.tableCell, { flex: 1, borderRightWidth: 0 }]}
                >
                  {item.qa_accepted}
                </Text>
              </View>
            ))}
          </View>
          {/* Stores Supervisor Row */}
          <View style={styles.footer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureLabel}>
                  Stores Supervisor's Name:
                </Text>
              </View>
              <View style={[styles.signatureBlock, { marginLeft: 100 }]}>
                <Text style={styles.signatureLabel}>Signature:</Text>
              </View>
              <View style={[styles.signatureBlock, { marginLeft: 100 }]}>
                <Text style={styles.signatureLabel}>Date:</Text>
              </View>
            </View>
          </View>
          <View style={styles.divider} />
          {/* Quality Supervisor Row */}
          <View style={styles.footer}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.signatureBlock}>
                <Text style={styles.signatureLabel}>
                  Quality Supervisor's Name:
                </Text>
              </View>
              <View style={[styles.signatureBlock, { marginLeft: 100 }]}>
                <Text style={styles.signatureLabel}>Signature:</Text>
              </View>
              <View style={[styles.signatureBlock, { marginLeft: 100 }]}>
                <Text style={styles.signatureLabel}>Date:</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
