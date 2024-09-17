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
import MovieSearch from "./components/movie/MovieSearch";

function App() {
  const [searchData, setSearchData] = useState([]);

  const handleSearch = async (value) => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=vi&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    if (value === "") return setSearchData([]);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchData(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Router>
      <MovieProvider>
        <div className="h-full bg-black text-white min-h-screen pb-10 relative">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/cinema" />} />
            <Route path="/cinema" element={<HomePage />} />
            <Route path="/cinema/contact" element={<ContactPage />} />
            <Route path="/cinema/movies/:id" element={<MovieDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <Footer />
        </div>
      </MovieProvider>
    </Router>
  );
}

export default App;
