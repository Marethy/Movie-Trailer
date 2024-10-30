import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { BiSearch } from "react-icons/bi"; // Import biểu tượng tìm kiếm
import { message } from "antd";
const Header = ({ setSearchData }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=vi&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
    };
    if (search === "") return setSearchData([]);
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchData(data.results);
      message.success("Search successful");
    } catch (error) {
      console.log(error);
      message.error("Failed to search");
    }
  };

  return (
    <div className="p-4 flex justify-between relative w-full z-[9999] bg-black">
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

          <div className="relative  ">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-2xl border-gray-300 p-2 pl-10 text-black "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 left-2 flex items-center text-gray-500"
            >
              <BiSearch size={20} />
            </button>
          </div>
        </nav>
      </div>

      <div className="flex items-center space-x-5">
        <button
          className="ml-auto mr-5 bg-black text-white text-lg px-3 py-1 rounded-lg font-bold   hover:text-red-700 hover:border-white"
          onClick={() => navigate("/login")}
        >
          LOG IN
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  setSearchData: PropTypes.func.isRequired,
};

export default Header;
