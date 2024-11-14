import React, { useState } from 'react';
function Doc2Pdf() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="tool-btn hidden sm:flex sm:items-center sm:justify-start sm:h-screen relative">
        <div className="flex items-center">
          <button 
            className={`bg-blue-500 text-white py-2 px-4 rounded transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
            onClick={toggleOptions}
          >
            Convert to Pdf
          </button>
          {isOpen && (
            <div className="ml-4 py-2 w-48 bg-white rounded-lg shadow-xl">

              <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
                <i class="fa-solid fa-file-pdf text-rose-600"></i>
                <p>WORD to PDF</p>
              </a>

              <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
                <i class="fa-solid fa-file-word text-blue-400"></i>
                <p>PDF to WORD</p>
              </a>

              <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
                <i class="fa-solid fa-file-excel text-green-400"></i>
                <p>EXEL to PDF</p>
              </a>

              <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
                <i class="fa-solid fa-file-image text-yellow-400"></i>
                <p>IMAGE to PDF</p>
              </a>
              
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Doc2Pdf;
