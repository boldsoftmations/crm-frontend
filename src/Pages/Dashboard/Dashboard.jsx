import React, { useEffect, useState } from "react";
import { CustomLoader } from "../../Components/CustomLoader";
import { OrderBookSummaryView } from "./OrderBookSummary/OrderBookSummaryView";
import { CurrentSummaryFM } from "./OrderBookSummary/CurrentSummaryFM";
import { CurrentSummaryRM } from "./OrderBookSummary/CurrentSummaryRM";
import { CurrentMonthFM } from "./SalesSummary/CurrentMonthFM";
import { CurrentMonthRM } from "./SalesSummary/CurrentMonthRM";
import InvoiceServices from "../../services/InvoiceService";
import { SalesPersonSummary } from "./SalesPersonSummary/SalesPersonSummary";
import { CustomTabs } from "../../Components/CustomTabs";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [orderBookSummary, setOrderBookSummary] = useState([]);
  const [currentOrderBookSummaryFM, setCurrentOrderBookSummaryFM] = useState(
    []
  );
  const [currentOrderBookSummaryRM, setCurrentOrderBookSummaryRM] = useState(
    []
  );
  const [currentSalesSummaryFM, setCurrentSalesSummaryFM] = useState([]);
  const [currentSalesSummaryRM, setCurrentSalesSummaryRM] = useState([]);
  const [salesPersonSummary, setSalesPersonSummary] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    { label: "OrderBook Summary" },
    { label: "Current OrderBook(Finish Good)" },
    { label: "Current OrderBook(Raw Material)" },
    { label: "Current Month Sales(Finish Good)" },
    { label: "Current Month Sales(Raw Material)" },
    { label: "Sales Person Summary" },
  ];

  useEffect(() => {
    getAllDashboardDetails();
  }, []);

  const getAllDashboardDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllDashboardData();
      setOrderBookSummary(response.data.Order_Book_Summary);
      setCurrentOrderBookSummaryFM(response.data.Order_Book_FG);
      setCurrentOrderBookSummaryRM(response.data.Order_Book_RM);
      setCurrentSalesSummaryFM(response.data.Sales_Invoice_FG);
      setCurrentSalesSummaryRM(response.data.Sales_Invoice_RM);
      setSalesPersonSummary(response.data.sales_summary);
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
        <div>
          {activeTab === 0 && (
            <div>
              {" "}
              <OrderBookSummaryView orderBookSummary={orderBookSummary} />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <CurrentSummaryFM
                currentOrderBookSummaryFM={currentOrderBookSummaryFM}
              />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <CurrentSummaryRM
                currentOrderBookSummaryRM={currentOrderBookSummaryRM}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <CurrentMonthFM currentSalesSummaryFM={currentSalesSummaryFM} />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <CurrentMonthRM currentSalesSummaryRM={currentSalesSummaryRM} />
            </div>
          )}
          {activeTab === 5 && (
            <div>
              <SalesPersonSummary salesPersonSummary={salesPersonSummary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
