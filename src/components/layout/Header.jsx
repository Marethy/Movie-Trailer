import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 flex justify-between fixed top-0 left-0 w-full z-[9999] bg-black">
      <div className="flex items-center gap-8">
      <nav className="hidden md:flex items-center space-x-5">

        <Link to ="/" className="text-[30px] uppercase text-red-700 font-bold">Movie</Link>
          <Link to="/" className="hover:text-red-700">
            Home
          </Link>
          <Link to="/cinema/about" className="hover:text-red-700">
            About
          </Link>
          <Link to="/cinema/contact" className="hover:text-red-700">
            Contact
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-5">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 p-2 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-red-700 text-white px-3 py-1 rounded-lg"
          onClick={() => onSearch(search)}
        >
          Search
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default Header;
