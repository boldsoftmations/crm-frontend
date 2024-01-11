import React, { useCallback, useEffect, useState } from "react";
import logo from "../../../Images/LOGOS3.png";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import moment from "moment";

export const GRNPDFDownload = ({ grnRegisterPDFData }) => (
  <Document>
    <Page style={{ fontFamily: "Helvetica", fontSize: "12pt" }}>
      <View style={{ padding: "20pt" }}>
        <View style={style.container}>
          <View style={style.row}>
            <View style={style.cell}>
              <Image style={style.logo} src={logo} />
            </View>
            <View
              style={{
                ...style.cell,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ fontSize: "18pt", fontWeight: "bold" }}>
                GRN Register
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(grnRegisterPDFData.invoice_date).format("DD-MM-YYYY")}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Vendor</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.vendor || "N/A"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Invoice No</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.invoice_no || "N/A"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Description</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.description}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Product</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.products || "N/A"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Order Quantity</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.invoice_quantity || "N/A"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>QA Rejected</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.qa_rejected || "N/A"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Received Quantity</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {grnRegisterPDFData.qa_recieved}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const style = StyleSheet.create({
  container: {
    // margin: "50pt",
    // padding: "10pt",
    border: "1pt solid #ccc",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    padding: "5pt",
  },
  header: {
    backgroundColor: "#eee",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    flexGrow: 1,
    textAlign: "center",
    padding: "5pt",
  },
  logo: {
    height: "auto",
    width: "100pt",
  },
  lightText: {
    color: "#777", // set the color to a light gray color
  },
});
