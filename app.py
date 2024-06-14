from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from pdf2docx import Converter
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB upload limit

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_pdf():
    uploaded_file = request.files.get('pdf_file')

    if uploaded_file:
        if not uploaded_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Invalid file format. Please upload a PDF file.'}), 400

        filename = secure_filename(uploaded_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        uploaded_file.save(filepath)

        output_filename = f'converted_{filename[:-4]}.docx'
        output_filepath = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)

        try:
            converter = Converter(filepath)
            converter.convert(output_filepath, start=0, end=None)
            converter.close()

            return send_file(output_filepath, as_attachment=True), 200
        except Exception as e:
            return jsonify({'error': f'An error occurred during conversion: {str(e)}'}), 500
    else:
        return jsonify({'error': 'No file uploaded.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
