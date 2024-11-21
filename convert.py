import os
import pythoncom
import comtypes.client
from flask import Flask, request, send_file
from flask_cors import CORS
from docx2pdf import convert

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

if __name__ == '__main__':
    app.run(port=3000)
