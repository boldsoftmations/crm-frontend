import { useEffect, useState } from "react";
import InvoiceServices from "../services/InvoiceService";

const transportCache = {};
const transportPending = {};

const getPiKey = (piNumber) => {
  if (piNumber === null || piNumber === undefined || piNumber === "") {
    return "";
  }
  return String(piNumber);
};

const fetchPiTransportDetails = async (piNumber) => {
  const key = getPiKey(piNumber);
  if (!key) {
    return null;
  }

  if (transportCache[key]) {
    return transportCache[key];
  }

  if (!transportPending[key]) {
    transportPending[key] = InvoiceServices.getCustomerProformaInvoiceDataByID(
      piNumber,
    )
      .then((response) => {
        const data = response && response.data ? response.data : {};
        const details = {
          selected_transport_mode: data.selected_transport_mode || "",
          transporter_name: data.transporter_name || "",
        };
        transportCache[key] = details;
        return details;
      })
      .catch((error) => {
        console.error(
          "Unable to load PI transport details for Order Book:",
          piNumber,
          error,
        );
        return null;
      })
      .finally(() => {
        delete transportPending[key];
      });
  }

  return transportPending[key];
};

export const getOrderBookTransportMode = (row, transportByPi) => {
  if (row && row.selected_transport_mode) {
    return row.selected_transport_mode;
  }

  const key = row ? getPiKey(row.proforma_invoice) : "";
  const cached = key && transportByPi ? transportByPi[key] : null;
  return cached && cached.selected_transport_mode
    ? cached.selected_transport_mode
    : "";
};

export const getOrderBookTransporterName = (row, transportByPi) => {
  if (row && row.transporter_name) {
    return row.transporter_name;
  }

  const key = row ? getPiKey(row.proforma_invoice) : "";
  const cached = key && transportByPi ? transportByPi[key] : null;
  return cached && cached.transporter_name ? cached.transporter_name : "";
};

export const useOrderBookTransportDetails = (rows) => {
  const [transportByPi, setTransportByPi] = useState({});

  useEffect(() => {
    let active = true;
    const list = Array.isArray(rows) ? rows : [];
    const piNumbers = [];
    const seen = {};
    const immediateMap = {};

    list.forEach((row) => {
      const key = row ? getPiKey(row.proforma_invoice) : "";
      if (!key) {
        return;
      }

      if (row.selected_transport_mode || row.transporter_name) {
        immediateMap[key] = {
          selected_transport_mode: row.selected_transport_mode || "",
          transporter_name: row.transporter_name || "",
        };
      }

      if (!row.selected_transport_mode && !seen[key]) {
        seen[key] = true;
        piNumbers.push(row.proforma_invoice);
      }
    });

    if (Object.keys(immediateMap).length > 0) {
      setTransportByPi((prev) => ({ ...prev, ...immediateMap }));
    }

    if (piNumbers.length === 0) {
      return () => {
        active = false;
      };
    }

    Promise.all(
      piNumbers.map((piNumber) =>
        fetchPiTransportDetails(piNumber).then((details) => ({
          piNumber,
          details,
        })),
      ),
    ).then((results) => {
      if (!active) {
        return;
      }

      const nextMap = {};
      results.forEach((item) => {
        const key = getPiKey(item.piNumber);
        if (key && item.details) {
          nextMap[key] = item.details;
        }
      });

      if (Object.keys(nextMap).length > 0) {
        setTransportByPi((prev) => ({ ...prev, ...nextMap }));
      }
    });

    return () => {
      active = false;
    };
  }, [rows]);

  return transportByPi;
};
