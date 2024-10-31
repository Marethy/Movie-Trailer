import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BiSearch } from "react-icons/bi"; // Import search icon
import { message, Spin } from "antd";
import UserProfileButton from "../../components/UserProfileButton";

const Header = ({ setSearchData }) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debounce search function
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search) {
        handleSearch();
      } else {
        setSearchData([]);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]); // Runs when search changes

  const handleSearch = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=vi&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };

    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      message.success("Search successful");
      setSearchData(data.results);
    } catch (error) {
      console.error(error);
      message.error("Failed to search, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = Boolean(localStorage.getItem("username")); // Check if user is logged in

  return (
    <div className="p-4 flex justify-between relative w-full bg-black">
      <div className="flex items-center gap-8">
        <nav className="flex items-center space-x-5 text-white text-xl">
          <Link to="/" className="text-4xl uppercase text-red-700 font-bold">
            Movie
          </Link>
          <Link to="/" className="hidden md:block hover:text-red-700">
            Home
          </Link>
          <Link
            to="/cinema/contact"
            className="hidden md:block hover:text-red-700"
          >
            Contact
          </Link>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-2xl border-gray-300 p-2 pl-10 text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search movies" // Accessibility label
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 left-2 flex items-center text-gray-500"
              aria-label="Search button" // Accessibility label
            >
              <BiSearch size={20} />
            </button>
            {loading && <Spin size="small" className="absolute right-2 top-2" />} {/* Loading spinner */}
          </div>
        </nav>
      </div>

      <div className="flex items-center space-x-5">
        {isLoggedIn ? (
          <UserProfileButton />
        ) : (
          <button
            className="ml-auto mr-5 bg-black text-white text-lg px-3 py-1 rounded-lg font-bold hover:text-red-700 hover:border-white"
            onClick={() => navigate("/login")}
          >
            LOG IN
          </button>
        )}
      </div>
    </div>
  );
};

Header.propTypes = {
  setSearchData: PropTypes.func.isRequired,
};

export default Header;
