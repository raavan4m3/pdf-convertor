import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons from react-icons
import { Link } from 'react-router-dom'; // Importing Link from react-router-dom

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMenuClick = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav className="bg-emerald-200 fixed top-0 w-full z-10">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        {!isMobile && (
          <div className={`text-rose-950 text-lg font-bold ${isMobile ? "hidden" : "block"} md:block`}>
            <Link to="/">Logo</Link>
          </div>
        )}
        <div className={`md:flex ${isMobile ? "block" : "hidden"} md:items-center w-full md:w-auto`}>
          <ul className="md:flex md:space-x-10">
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <Link to="/">Home</Link>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <Link to="/about">About</Link>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <Link to="/services">Services</Link>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className={`md:hidden text-white text-2xl cursor-pointer absolute top-4 right-4`} onClick={handleMenuClick}>
          {isMobile ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
