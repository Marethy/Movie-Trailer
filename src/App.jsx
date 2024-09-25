import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { MovieProvider } from "./context/MovieDetailContext";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";

function App() {
  const [searchData, setSearchData] = useState([]);
  const [isEmployeeMode, setIsEmployeeMode] = useState(false);

  return (
    <Router>
      <MovieProvider>
        <div className="h-full bg-black text-white min-h-screen pb-10 relative">
          <Header 
            isEmployeeMode={isEmployeeMode} 
            setIsEmployeeMode={setIsEmployeeMode} 
            setSearchData={setSearchData} 
          />
         <Routes>
  {isEmployeeMode ? (
    <>
      <Route path="/employee" element={<EmployeeDashboard />} />
    </>
  ) : (
    <>
      <Route path="/" element={<Navigate to="/cinema" />} />
      <Route path="/cinema" element={<HomePage searchData={searchData} />} />
      <Route path="/cinema/contact" element={<ContactPage />} />
      <Route path="/cinema/movies/:id" element={<MovieDetailPage />} />
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
}

export default App;
