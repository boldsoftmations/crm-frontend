import React, { useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";

const EmployeesCurrentLocation = ({ employeesCurrentLocation }) => {
  const [currentLocation, setVCurrentLocation] = useState(null);
  const [addressMap, setAddressMap] = useState({});
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

  const fetchAddress = async (lat, lon, index) => {
    if (addressMap[index]) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setAddressMap((prev) => ({
        ...prev,
        [index]: data.display_name || "Address not found",
      }));
    } catch (err) {
      console.error("Reverse geocoding failed", err);
      setAddressMap((prev) => ({
        ...prev,
        [index]: "Failed to fetch address",
      }));
    }
  };

  const handleMarkerHover = (index, lat, lon) => {
    setVCurrentLocation(index);
    fetchAddress(lat, lon, index);
    setMapCenter([lat, lon]);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "8px 14px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Map height={400} center={mapCenter} zoom={5}>
        {employeesCurrentLocation.map((item, index) => (
          <Marker
            key={index}
            width={50}
            anchor={[item.latitude, item.longitude]}
            onMouseOver={() =>
              handleMarkerHover(index, item.latitude, item.longitude)
            }
          />
        ))}

        {currentLocation !== null && (
          <Overlay
            anchor={[
              employeesCurrentLocation[currentLocation].latitude,
              employeesCurrentLocation[currentLocation].longitude,
            ]}
            offset={[60, 30]}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "8px 14px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                minWidth: "180px",
              }}
            >
              <div
                style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}
              >
                {addressMap[currentLocation] || "Fetching address..."}
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#9C27B0",
                }}
              >
                {employeesCurrentLocation[currentLocation].customer}
              </div>
              <div style={{ fontSize: "12px", color: "#D84B86" }}>
                Employee Name - {employeesCurrentLocation[currentLocation].user}
              </div>
              <div style={{ fontSize: "12px", color: "#C19EE0" }}>
                {employeesCurrentLocation[currentLocation].check_in_time}
              </div>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
};

export default EmployeesCurrentLocation;
