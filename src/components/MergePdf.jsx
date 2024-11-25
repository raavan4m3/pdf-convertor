import React, { useState } from 'react';
import axios from 'axios';
import './DocToPdf.css';  // Use the same CSS for consistency

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [mergedPdfLink, setMergedPdfLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select one or more PDF files.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }

    try {
      console.log('Uploading files...');
      setIsLoading(true);
      const response = await axios.post('http://localhost:3000/merge-pdf', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Files merged successfully');
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setMergedPdfLink(url);
    } catch (error) {
      console.error('Error merging files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Merge PDFs</h1>
      <input type="file" onChange={handleFileChange} multiple className="mb-4" accept="application/pdf" />
      <button onClick={handleUpload} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
        Merge
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
      {!isLoading && mergedPdfLink && (
        <div>
          <a
            href={mergedPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mr-4"
          >
            View Merged PDF
          </a>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = mergedPdfLink;
              link.download = 'merged.pdf';
              link.click();
            }}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Download Merged PDF
          </button>
          <embed
            src={mergedPdfLink}
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

export default MergePdf;