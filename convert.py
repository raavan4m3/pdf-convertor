import os
import pythoncom
import comtypes.client
from flask import Flask, request, send_file
from flask_cors import CORS
from docx2pdf import convert
from pdf2docx import Converter
from fpdf import FPDF
from PIL import Image
import pandas as pd
from PyPDF2 import PdfMerger

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)

@app.route('/convert', methods=['POST'])
def convert_file():
    pythoncom.CoInitialize()  # Initialize the COM library
    try:
        if 'file' not in request.files:
            return 'No file part', 400

        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        if file:
            input_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(input_path)

            if file.filename.endswith('.docx'):
                output_path = os.path.join(OUTPUT_FOLDER, file.filename.replace('.docx', '.pdf'))
                # Convert DOCX to PDF
                convert(input_path, output_path)
            elif file.filename.endswith('.doc'):
                output_path = os.path.join(OUTPUT_FOLDER, file.filename.replace('.doc', '.pdf'))
                # Convert DOC to PDF
                convert_doc_to_pdf(input_path, output_path)
            else:
                return 'Unsupported file format', 400

            return send_file(output_path, as_attachment=True, download_name='converted.pdf')
    finally:
        pythoncom.CoUninitialize()  # Uninitialize the COM library

def convert_doc_to_pdf(input_path, output_path):
    word = comtypes.client.CreateObject('Word.Application')
    try:
        doc = word.Documents.Open(os.path.abspath(input_path))
        doc.SaveAs(os.path.abspath(output_path), FileFormat=17)  # 17 corresponds to the PDF format
        doc.Close()
    except Exception as e:
        print(f"Failed to convert DOC to PDF: {e}")
    finally:
        word.Quit()

@app.route('/pdf-to-word', methods=['POST'])
def convert_pdf_to_word():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if file:
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        output_path = os.path.join(OUTPUT_FOLDER, file.filename.replace('.pdf', '.docx'))
        file.save(input_path)

        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()

        return send_file(output_path, as_attachment=True, download_name='converted.docx')

@app.route('/excel-to-pdf', methods=['POST'])
def convert_excel_to_pdf():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if file:
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        output_path = os.path.join(OUTPUT_FOLDER, file.filename.replace('.xlsx', '.pdf'))
        file.save(input_path)

        # Convert Excel to PDF using pandas and FPDF
        try:
            data = pd.read_excel(input_path)

            # Create PDF
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)

            col_width = pdf.w / (len(data.columns) + 1)  # Calculate column width
            row_height = pdf.font_size * 1.5

            # Write the header
            for header in data.columns:
                pdf.cell(col_width, row_height, str(header), border=1)
            pdf.ln(row_height)

            # Write the data
            for index, row in data.iterrows():
                cell_height = row_height
                for value in row:
                    text = str(value)
                    text_width = pdf.get_string_width(text)
                    num_lines = int(text_width / col_width) + 1
                    cell_height = max(cell_height, row_height * num_lines)
                    pdf.cell(col_width, cell_height, text, border=1)
                pdf.ln(cell_height)

            pdf.output(output_path)
        except Exception as e:
            print(f"Failed to convert Excel to PDF: {e}")
            return 'Conversion failed', 500

        return send_file(output_path, as_attachment=True, download_name='converted.pdf')

@app.route('/image-to-pdf', methods=['POST'])
def convert_image_to_pdf():
    if 'files[]' not in request.files:
        return 'No file part', 400

    files = request.files.getlist('files[]')
    if not files:
        return 'No selected files', 400

    image_paths = []
    for file in files:
        if file.filename == '':
            return 'No selected file', 400

        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)
        image_paths.append(input_path)

    output_path = os.path.join(OUTPUT_FOLDER, 'converted.pdf')

    # Convert Images to PDF using PIL and FPDF
    try:
        pdf = FPDF()
        for image_path in image_paths:
            image = Image.open(image_path)
            pdf.add_page()
            pdf.image(image_path, x=10, y=10, w=pdf.w - 20)  # Adjust positioning and width
        pdf.output(output_path)
    except Exception as e:
        print(f"Failed to convert Images to PDF: {e}")
        return 'Conversion failed', 500

    return send_file(output_path, as_attachment=True, download_name='converted.pdf')

@app.route('/merge-pdf', methods=['POST'])
def merge_pdf():
    if 'files[]' not in request.files:
        return 'No file part', 400

    files = request.files.getlist('files[]')
    if not files:
        return 'No selected files', 400

    merger = PdfMerger()
    try:
        for file in files:
            if file.filename == '':
                return 'No selected file', 400

            input_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(input_path)
            merger.append(input_path)

        output_path = os.path.join(OUTPUT_FOLDER, 'merged.pdf')
        merger.write(output_path)
        merger.close()
    except Exception as e:
        return f'Failed to merge PDFs: {e}', 500

    return send_file(output_path, as_attachment=True, download_name='merged.pdf')

if __name__ == '__main__':
    app.run(port=3000)
