import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { uploadFile } from '../api';

export default function UploadPage({ onTextExtracted, extractedText, extractedFilename }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError('Only PDF, JPG, JPEG, or PNG files are supported.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await uploadFile(file);
      onTextExtracted(data.text, data.filename);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>📄 Upload & Extract</h1>
        <p>Upload a PDF or image to extract text. The extracted text will be available across all tools.</p>
      </div>

      <div className="card">
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            hidden
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="upload-zone-icon">
            <Upload />
          </div>
          <h3>Drop your file here or <span className="highlight">browse</span></h3>
          <p>Supports PDF, JPG, JPEG, PNG</p>
        </div>

        {loading && (
          <div className="loader">
            <div className="loader-spinner"></div>
            Extracting text...
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {extractedFilename && !loading && (
          <div className="file-chip">
            <CheckCircle /> {extractedFilename}
          </div>
        )}

        {extractedText && !loading && (
          <div className="extracted-text">{extractedText}</div>
        )}
      </div>
    </div>
  );
}
