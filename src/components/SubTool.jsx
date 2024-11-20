import React from 'react';
import { Link } from 'react-router-dom';

const SubTool = () => {
  return (
    <div className="ml-4 py-2 w-48 bg-white rounded-lg shadow-xl">
      <Link to="/doc-to-pdf" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
        <i className="fa-solid fa-file-pdf text-rose-600"></i>
        <p>WORD to PDF</p>
      </Link>
      <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
        <i className="fa-solid fa-file-word text-blue-400"></i>
        <p>PDF to WORD</p>
      </a>
      <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
        <i className="fa-solid fa-file-excel text-green-400"></i>
        <p>EXCEL to PDF</p>
      </a>
      <a href="#" className="block flex justify-between items-center px-4 py-2 text-gray-800 hover:text-blue-500 hover:text-purple-500">
        <i className="fa-solid fa-file-image text-yellow-400"></i>
        <p>IMAGE to PDF</p>
      </a>
    </div>
  );
};

export default SubTool;
