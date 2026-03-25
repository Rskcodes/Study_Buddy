import { useState } from 'react';
import { MessageCircleQuestion, Send, Lightbulb } from 'lucide-react';
import { solveDoubt } from '../api';

export default function DoubtPage({ extractedText }) {
  const [context, setContext] = useState(extractedText || '');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!context.trim() || !question.trim()) {
      setError('Please provide both context and a question.');
      return;
    }

    setError('');
    setLoading(true);
    setAnswer('');

    try {
      const data = await solveDoubt(question, context);
      setAnswer(data.answer);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to solve doubt. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>❓ Doubt Solver</h1>
        <p>Provide context from your study material and ask any question. The AI will find the answer.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-icon" style={{ background: 'var(--gradient-warm)' }}>
            <MessageCircleQuestion />
          </div>
          <div className="card-header-text">
            <h3>Ask Your Doubt</h3>
            <p>Context-based question answering</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Context / Study Material</label>
          <textarea
            className="form-textarea"
            rows={6}
            placeholder="Paste your study material or reference text here..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Your Question</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g., What is photosynthesis?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !context.trim() || !question.trim()}
        >
          {loading ? (
            <>
              <div className="loader-spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div>
              Finding answer...
            </>
          ) : (
            <>
              <Send /> Get Answer
            </>
          )}
        </button>

        {error && <div className="error-msg">{error}</div>}
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-spinner"></div>
          AI is analyzing your question...
        </div>
      )}

      {answer && !loading && (
        <div className="card">
          <div className="result-box">
            <div className="result-box-header">
              <Lightbulb /> Answer
            </div>
            <div className="result-box-content">{answer}</div>
          </div>
        </div>
      )}
    </div>
  );
}
