import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/User/HomePage";
import ContactPage from "./pages/User/ContactPage";
import MovieDetailPage from "./pages/User/MovieDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { MovieProvider } from "./context/MovieDetailContext";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import AdminDashboard from "./pages/Employee/AdminDashboard";

const App = () => {
  const [searchData, setSearchData] = useState([]);
  const [isEmployeeMode, setIsEmployeeMode] = useState(false);

  return (
    <Router>
      <MovieProvider>
        <div className="flex flex-col min-h-screen bg-black">
          <Header
            isEmployeeMode={isEmployeeMode}
            setIsEmployeeMode={setIsEmployeeMode}
            setSearchData={setSearchData}
          />

          <Routes>
            {isEmployeeMode ? (
              <Route path="/admin" element={<AdminDashboard />} />
            ) : (
              <>
                <Route path="/" element={<Navigate to="/user" />} />
                <Route path="/user" element={<HomePage searchData={searchData} />} />
                <Route path="/user/contact" element={<ContactPage />} />
                <Route path="/user/movies/:id" element={<MovieDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </>
            )}
          </Routes>

          <Footer />
            </div>
      </MovieProvider>
    </Router>
  );
};

export default App;
