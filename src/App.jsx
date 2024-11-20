import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Navbar from './components/nav';
import Toolbtn from './components/Toolbtn';
import DocToPdf from './components/DocToPdf';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Toolbtn />} />
        <Route path="/doc-to-pdf" element={<DocToPdf />} />
      </Routes>
    </Router>
  );
}
