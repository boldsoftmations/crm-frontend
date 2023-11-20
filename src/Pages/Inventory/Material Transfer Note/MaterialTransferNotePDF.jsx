import React from "react";
import {
  pdf,
  Image,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../Images/LOGOS3.png";
import moment from "moment";

export const MaterialTransferNotePDF = ({ materialTransferNoteByID }) => (
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
                Material Transfer Note
              </Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text>Date</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {moment(materialTransferNoteByID.created_on).format(
                  "DD-MM-YYYY"
                )}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>User</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.user}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Accepted</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.accepted ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          <View style={style.row}>
            <View style={style.cell}>
              <Text>Seller Unit</Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.seller_account}
              </Text>
            </View>
          </View>
          {/* Empty row */}
          <View style={style.row}>
            <View style={style.cell}></View>
            <View style={style.cell}></View>
          </View>
          <View style={{ ...style.row, ...style.header }}>
            <View style={style.cell}>
              <Text>PRODUCT</Text>
            </View>
            <View style={style.cell}>
              <Text>UNIT</Text>
            </View>
            <View style={style.cell}>
              <Text>QUANTITY</Text>
            </View>
          </View>

          <View style={style.row}>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.product}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.unit}
              </Text>
            </View>
            <View style={style.cell}>
              <Text style={style.lightText}>
                {materialTransferNoteByID.quantity}
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
