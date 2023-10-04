import React, { useState, useEffect } from "react";
import { BankDetails } from "../BankDetails/BankDetails";
import { ContactDetails } from "../ContactDetails/ContactDetails";
import { WareHouseDetails } from "../WareHouseDetails/WareHouseDetails";
import { UpdateCompanyDetails } from "./UpdateCompanyDetails";
import CustomerServices from "../../../services/CustomerService";
import { SecurityChequesDetails } from "../SecurityCheckDetails/SecurityChequesDetails";
import { ForecastView } from "../ForecastDetails/ForecastView";
import { CustomLoader } from "../../../Components/CustomLoader";
import { CustomTabs } from "../../../Components/CustomTabs";
import KycUpdate from "../KycDetails/KycUpdate";

export const UpdateAllCompanyDetails = (props) => {
  const [open, setOpen] = useState(false);
  const { setOpenPopup, getAllCompanyDetails, recordForEdit, product } = props;
  const [bankData, setBankData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [wareHousedata, setWareHouseData] = useState([]);
  const [securityChequedata, setSecurityChequeData] = useState([]);
  const [forecastdata, setForecastData] = useState([]);
  const [kycData, setKycData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "Company" },
    { label: "Bank" },
    { label: "Contact" },
    { label: "WareHouse" },
    { label: "Security Cheques" },
    { label: "Forecast" },
    { label: "KYC" },
  ];
  // All Company Details Api
  // Fetch company details based on the active tab when the component mounts or the active tab changes
  useEffect(() => {
    if (recordForEdit) {
      getAllCompanyDetailsByID();
    }
  }, [recordForEdit]);

  // API call to fetch company details based on type
  const getAllCompanyDetailsByID = async () => {
    try {
      setOpen(true);
      const [
        bankResponse,
        contactResponse,
        warehouseResponse,
        securitychequeResponse,
        forecastResponse,
        kycResponse,
      ] = await Promise.all([
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "bank"),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "contacts"),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "warehouse"),
        CustomerServices.getCompanyDataByIdWithType(
          recordForEdit,
          "security_cheque"
        ),
        CustomerServices.getCompanyDataByIdWithType(recordForEdit, "forecast"),
        CustomerServices.getCompanyDataById(recordForEdit),
      ]);
      setBankData(bankResponse.data.bank);
      setContactData(contactResponse.data.contacts);
      setWareHouseData(warehouseResponse.data.warehouse);
      setSecurityChequeData(securitychequeResponse.data.security_cheque);
      setForecastData(forecastResponse.data.forecast);
      setKycData(kycResponse.data);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      console.log("company data by id error", err);
    }
  };

  return (
    <div>
      <CustomLoader open={open} />

      <div>
        <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <div style={{ marginTop: "10px" }}>
          {activeTab === 0 && (
            <div>
              <UpdateCompanyDetails
                setOpenPopup={setOpenPopup}
                getAllCompanyDetails={getAllCompanyDetails}
                recordForEdit={recordForEdit}
                product={product}
              />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <BankDetails
                bankData={bankData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <ContactDetails
                contactData={contactData}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <WareHouseDetails
                contactData={contactData}
                wareHousedata={wareHousedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <SecurityChequesDetails
                securityChequedata={securityChequedata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <ForecastView
                forecastdata={forecastdata}
                open={open}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
              />
            </div>
          )}
          {activeTab === 6 && (
            <div>
              <KycUpdate
                setOpenPopup={setOpenPopup}
                getAllCompanyDetailsByID={getAllCompanyDetailsByID}
                contactData={contactData}
                kycData={kycData}
                recordForEdit={recordForEdit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
