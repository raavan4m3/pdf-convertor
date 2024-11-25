import React, { useState } from 'react';
import axios from 'axios';
import './DocToPdf.css';  // Using the same CSS for consistency

const ExcelToPdf = () => {
  const [file, setFile] = useState(null);
  const [pdfLink, setPdfLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file...');
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/excel-to-pdf', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('File converted successfully');
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfLink(url);
    } catch (error) {
      console.error('Error converting file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Convert Excel to PDF</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleUpload} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
        Convert
      </button>
      {isLoading && (
        <div className="loading-container mt-4">
          <div className="circular-text">
            <span>P</span>
            <span>r</span>
            <span>o</span>
            <span>c</span>
            <span>e</span>
            <span>s</span>
            <span>s</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      )}
      {!isLoading && pdfLink && (
        <div>
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mr-4"
          >
            View PDF
          </a>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = pdfLink;
              link.download = 'converted.pdf';
              link.click();
            }}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Download PDF
          </button>
          <embed
            src={pdfLink}
            width="600"
            height="500"
            type="application/pdf"
            className="mt-4"
          />
        </div>
      )}
    </div>
  );
};

export default ExcelToPdf;
