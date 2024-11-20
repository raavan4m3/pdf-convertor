import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PDFDocument, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import fontkit from '@pdf-lib/fontkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded.');
    }

    const filePath = path.join(__dirname, req.file.path);

    console.log('Extracting text from DOCX file...');
    const docxBuffer = await fs.readFile(filePath);

    // Extract text content from the DOCX file
    const { value: extractedText } = await mammoth.extractRawText({ buffer: docxBuffer });

    if (!extractedText.trim()) {
      throw new Error('The uploaded DOCX file contains no readable text.');
    }

    console.log('Creating PDF from extracted text...');
    const pdfDoc = await PDFDocument.create();

    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Load custom font
    const fontPath = path.join(__dirname, 'fonts', 'Roboto-Regular.ttf');
    const fontBytes = await fs.readFile(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const fontSize = 12;

    // Add text to the PDF, line by line
    let yOffset = height - 50; // Start from the top of the page
    const lineHeight = fontSize + 4;
    const lines = extractedText.split('\n');

    lines.forEach((line) => {
      const wrappedLines = wrapText(line.trim(), customFont, fontSize, width - 100);
      wrappedLines.forEach((wrappedLine) => {
        if (yOffset < lineHeight) {
          // Add a new page when space runs out
          const page = pdfDoc.addPage();
          yOffset = height - 50;
        }
        page.drawText(wrappedLine, { x: 50, y: yOffset, size: fontSize, font: customFont, color: rgb(0, 0, 0) });
        yOffset -= lineHeight;
      });
    });

    const pdfBytes = await pdfDoc.save();

    console.log('PDF created successfully. Sending response...');
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="converted.pdf"',
    });

    res.send(pdfBytes);

    // Clean up uploaded file
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Error converting file:', error.message);
    res.status(500).send(`Failed to convert file to PDF: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Function to wrap text within the specified width
function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
    
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
