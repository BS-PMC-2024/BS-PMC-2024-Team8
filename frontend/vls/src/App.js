// Importing necessary dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ForgotPassword from "./pages/Login/forgotpassword";
import FirstPage from "./pages/Login/FirstPage";
import Home from "./pages/Admin/Home";
import Proceses from "./pages/Admin/Proceses";
import Contact from "./pages/Admin/Contact";
import Customers from "./pages/Admin/Customers";
import Analytics from "./pages/Admin/Analytics";

// Main App component
function App() {
  useEffect(() => {
    // Dynamically create the viewport meta tag
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    
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
            <Route path="/processAdmin" element={<Proceses />} />
            <Route path="/contactAdmin" element={<Contact />} />
            <Route path="/customersAdmin" element={<Customers />} />
            <Route path="/analyticsAdmin" element={<Analytics />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;