import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing icons from react-icons

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
            <a href="#home">Logo</a>
          </div>
        )}
        <div className={`md:flex ${isMobile ? "block" : "hidden"} md:items-center w-full md:w-auto`}>
          <ul className="md:flex md:space-x-10">
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <a href="#home">Home</a>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <a href="#about">About</a>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <a href="#services">Services</a>
            </li>
            <li className="text-rose-950 py-2 md:py-0 md:hover:bg-white md:rounded-lg">
              <a href="#contact">Contact</a>
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
