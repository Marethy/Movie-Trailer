import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Header = ({ isEmployeeMode, setIsEmployeeMode, setSearchData }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleEmployeeModeToggle = () => {
    setIsEmployeeMode(!isEmployeeMode);

    // Navigate to the EmployeeDashboard if switching to employee mode
    if (!isEmployeeMode) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 flex justify-between relative w-full z-[9999] bg-black">
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center space-x-5 text-white">
          <Link to="/" className="text-[30px] uppercase text-red-700 font-bold">
            Movie
          </Link>
          {!isEmployeeMode && (
            <>
              <Link to="/" className="hover:text-red-700">
                Home
              </Link>
              <Link to="/cinema/contact" className="hover:text-red-700">
                Contact
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="flex items-center space-x-5">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 p-2 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Chỉ cập nhật giá trị tìm kiếm
        />
        <button
          onClick={handleSearch} // Gọi hàm tìm kiếm khi nhấn nút
          className="bg-red-700 text-white px-3 py-2 rounded-lg"
        >
          Search
        </button>
        <button
          className="ml-4 bg-blue-600 text-white px-3 py-1 rounded-lg"
          onClick={() => handleEmployeeModeToggle()}
        >
          Switch to {isEmployeeMode ? "User" : "Employee"} Mode
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  isEmployeeMode: PropTypes.bool.isRequired,
  setIsEmployeeMode: PropTypes.func.isRequired,
  setSearchData: PropTypes.func.isRequired,
};

export default Header;
