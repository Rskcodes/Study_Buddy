import { useState } from 'react';
import { Brain, Send, Info } from 'lucide-react';
import { generateQuiz } from '../api';

export default function QuizPage({ extractedText }) {
  const [text, setText] = useState(extractedText || '');
  const [numQuestions, setNumQuestions] = useState(5);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to generate a quiz.');
      return;
    }

    setError('');
    setLoading(true);
    setResult('');

    try {
      const data = await generateQuiz(text, numQuestions);
      setResult(data.message || JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate quiz. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>🧠 Quiz Generator</h1>
        <p>Generate practice questions from your study material to test your knowledge.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-icon" style={{ background: 'var(--gradient-pink)' }}>
            <Brain />
          </div>
          <div className="card-header-text">
            <h3>Generate Quiz</h3>
            <p>AI-powered question generation</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Study Material</label>
          <textarea
            className="form-textarea"
            rows={8}
            placeholder="Paste your study content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ maxWidth: 200 }}>
          <label className="form-label">Number of Questions</label>
          <input
            className="form-input"
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
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
              Generating...
            </>
          ) : (
            <>
              <Send /> Generate Quiz
            </>
          )}
        </button>

        {error && <div className="error-msg">{error}</div>}
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-spinner"></div>
          Generating questions...
        </div>
      )}

      {result && !loading && (
        <div className="card">
          <div className="result-box">
            <div className="result-box-header">
              <Info /> Quiz Result
            </div>
            <div className="result-box-content">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}
