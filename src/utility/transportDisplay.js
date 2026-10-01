const DIRECT_MODES = ["BUS", "TRAIN", "AIR", "SELF_PICKUP"];

export const normalizeTransportMode = (mode) => {
  if (!mode) {
    return "";
  }

  const value = String(mode).trim();
  const upperValue = value.toUpperCase().replace(/\s+/g, "_");

  if (upperValue === "SURFACE" || upperValue === "SURFACE_/_ROAD") {
    return "SURFACE";
  }
  if (upperValue === "COURIER") {
    return "COURIER";
  }
  if (upperValue === "LOCAL_AGGREGATOR" || upperValue === "LOCAL_/_AGGREGATOR") {
    return "LOCAL_AGGREGATOR";
  }
  if (upperValue === "BUS") {
    return "BUS";
  }
  if (upperValue === "TRAIN") {
    return "TRAIN";
  }
  if (upperValue === "AIR") {
    return "AIR";
  }
  if (upperValue === "SELF_PICKUP") {
    return "SELF_PICKUP";
  }

  return upperValue;
};

export const isDirectTransportMode = (mode) => {
  return DIRECT_MODES.indexOf(normalizeTransportMode(mode)) !== -1;
};

export const getTransportMethodLabel = (mode) => {
  const normalizedMode = normalizeTransportMode(mode);

  if (normalizedMode === "SURFACE") return "Surface / Road";
  if (normalizedMode === "COURIER") return "Courier";
  if (normalizedMode === "LOCAL_AGGREGATOR") return "Local / Aggregator";
  if (normalizedMode === "BUS") return "Bus";
  if (normalizedMode === "TRAIN") return "Train";
  if (normalizedMode === "AIR") return "Air";
  if (normalizedMode === "SELF_PICKUP") return "Self Pickup";

  return mode ? String(mode) : "-";
};

export const getTransporterDisplayName = (mode, transporterName) => {
  if (isDirectTransportMode(mode)) {
    return "Not Required";
  }

  return transporterName || "-";
};
