import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SubTool from './SubTool';

function Toolbtn() {
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef(null);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (parentRef.current && !parentRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="tool-btn hidden sm:flex sm:items-center sm:justify-start sm:h-screen relative">
        <div className="flex items-center" ref={parentRef}>
          <button 
            className={`border-solid border-2 border-orange-200 flex bg-orange-100 text-rose-950 py-2 px-10 rounded transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            onClick={toggleOptions}
          >
            <p>Convert &nbsp; to &nbsp; &nbsp;</p> <i className="fa-solid fa-file-pdf text-rose-600"></i>
          </button>
          {isOpen && (
            <div>
              <SubTool />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Toolbtn;
