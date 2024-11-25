import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Navbar from './components/nav';
import Toolbtn from './components/Toolbtn';
import DocToPdf from './components/DocToPdf';
import PdfToWord from './components/PdfToWord';
import ExcelToPdf from './components/ExcelToPdf';
import ImageToPdf from './components/ImageToPdf';
import MergePdf from './components/MergePdf';  // Import the new component

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Toolbtn />} />
        <Route path="/doc-to-pdf" element={<DocToPdf />} />
        <Route path="/pdf-to-word" element={<PdfToWord />} />
        <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
        <Route path="/image-to-pdf" element={<ImageToPdf />} />
        <Route path="/merge-pdf" element={<MergePdf />} />  // Add the new route
      </Routes>
    </Router>
  );
}
