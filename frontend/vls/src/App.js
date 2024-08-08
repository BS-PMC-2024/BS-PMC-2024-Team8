// Importing necessary dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ForgotPassword from "./pages/Login/forgotpassword";
import FirstPage from "./pages/Login/FirstPage";
import Home from "./pages/Admin/Home";
import Proceses from "./pages/Admin/Proceses";
import Contact from "./pages/Admin/Contact";
import Customers from "./pages/Admin/Customers";
import EditCustomer from "./pages/Admin/EditCustomer";
import Analytics from "./pages/Admin/Analytics";
import EditProceses from "./pages/Admin/EditProceses";
import HomeC from "./pages/Company/HomeC";
import NewProcess from "./pages/Company/NewProcess";
import ContactC from "./pages/Company/ContactC";
import Customersc from "./pages/Company/CustomersC";
import EditCustomerC from "./pages/Company/EditCustomerC";
import DeleteCustomerC from "./pages/Company/DeleteCustomerC";
import AnalyticsC from "./pages/Company/AnalyticsC";
import ProcessC from "./pages/Company/ProcessC";
import Payment from "./pages/Company/Payment";

// Main App component
function App() {
  useEffect(() => {
    // Dynamically create the viewport meta tag
    const viewportMeta = document.createElement("meta");
    viewportMeta.name = "viewport";
    viewportMeta.content = "width=device-width, initial-scale=1.0";

    // Append the meta tag to the document head
    document.head.appendChild(viewportMeta);

    // Cleanup function to remove the added meta tag when component unmounts
    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/homeAdmin" element={<Home />} />
          <Route path="/homeCompany" element={<HomeC />} />
          <Route path="/processAdmin" element={<Proceses />} />
          <Route path="/contactAdmin" element={<Contact />} />
          <Route path="/customersAdmin" element={<Customers />} />
          <Route path="/EditCustomer" element={<EditCustomer />} />
          <Route path="/analyticsAdmin" element={<Analytics />} />
          <Route path="/newProcess" element={<NewProcess />} />
          <Route path="/processCompany" element={<ProcessC />} />
          <Route path="/contactCompany" element={<ContactC />} />
          <Route path="/customersCompany" element={<Customersc />} />
          <Route path="/EditCustomerC" element={<EditCustomerC />} />
          <Route path="/DeleteCustomerC" element={<DeleteCustomerC />} />
          <Route path="/analyticsCompany" element={<AnalyticsC />} />
          <Route path="/EditProceses" element={<EditProceses />} />
          <Route path="/Payment" element={<Payment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
