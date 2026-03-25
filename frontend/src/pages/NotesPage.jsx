import { useState } from 'react';
import { BookOpen, Sparkles, Send } from 'lucide-react';
import { summarizeNotes } from '../api';

export default function NotesPage({ extractedText }) {
  const [text, setText] = useState(extractedText || '');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setError('');
    setLoading(true);
    setSummary('');

    try {
      const data = await summarizeNotes(text);
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to summarize. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>📝 Smart Notes</h1>
        <p>Paste your study material below or use extracted text from an upload, and get a concise AI summary.</p>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--gradient-primary)' }}>
              <BookOpen />
            </div>
            <div className="card-header-text">
              <h3>Input Text</h3>
              <p>Paste or type your content</p>
            </div>
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              rows={12}
              placeholder="Paste your study material here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <div className="loader-spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div>
                Summarizing...
              </>
            ) : (
              <>
                <Send /> Summarize
              </>
            )}
          </button>

          {error && <div className="error-msg">{error}</div>}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--gradient-secondary)' }}>
              <Sparkles />
            </div>
            <div className="card-header-text">
              <h3>AI Summary</h3>
              <p>Your summarized notes</p>
            </div>
          </div>

          {loading && (
            <div className="loader">
              <div className="loader-spinner"></div>
              AI is summarizing your notes...
            </div>
          )}

          {summary && !loading && (
            <div className="result-box">
              <div className="result-box-header">
                <Sparkles /> Summary
              </div>
              <div className="result-box-content">{summary}</div>
            </div>
          )}

          {!summary && !loading && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              Your AI-generated summary will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
