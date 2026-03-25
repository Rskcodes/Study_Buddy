import { useState } from 'react';
import { CalendarClock, Send, Target, Clock, BookOpen } from 'lucide-react';
import { createRevisionPlan } from '../api';

const STUDENT_TYPES = [
  { value: 'general', label: 'General Student' },
  { value: 'neet', label: 'NEET' },
  { value: 'jee', label: 'JEE' },
  { value: 'college', label: 'College' },
  { value: 'placement', label: 'Placement Prep' },
  { value: 'upsc', label: 'UPSC' },
  { value: 'gate', label: 'GATE' },
  { value: 'bank', label: 'Bank Exams' },
  { value: 'school', label: 'School' },
];

export default function RevisionPage({ extractedText }) {
  const [text, setText] = useState(extractedText || '');
  const [examDate, setExamDate] = useState('');
  const [studentType, setStudentType] = useState('general');
  const [dailyHours, setDailyHours] = useState(4);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim() || !examDate) {
      setError('Please provide study material and exam date.');
      return;
    }

    setError('');
    setLoading(true);
    setPlan(null);

    try {
      const data = await createRevisionPlan(text, examDate, studentType, dailyHours);
      if (data.error) {
        setError(data.error);
      } else {
        setPlan(data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create plan. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getPhaseClass = (phase) => {
    if (phase.includes('1')) return 'phase-1';
    if (phase.includes('2')) return 'phase-2';
    return 'phase-3';
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>📅 Revision Planner</h1>
        <p>Create a personalized study plan based on your exam date, study material, and preparation level.</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-icon" style={{ background: 'var(--gradient-green)' }}>
            <CalendarClock />
          </div>
          <div className="card-header-text">
            <h3>Plan Configuration</h3>
            <p>Set up your revision parameters</p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Study Material</label>
          <textarea
            className="form-textarea"
            rows={6}
            placeholder="Paste your study content here. The AI will break it into topics..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Exam Date</label>
            <input
              className="form-input"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Student Type</label>
            <select
              className="form-select"
              value={studentType}
              onChange={(e) => setStudentType(e.target.value)}
            >
              {STUDENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: 200 }}>
          <label className="form-label">Daily Study Hours</label>
          <input
            className="form-input"
            type="number"
            min={1}
            max={16}
            value={dailyHours}
            onChange={(e) => setDailyHours(parseInt(e.target.value) || 4)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !text.trim() || !examDate}
        >
          {loading ? (
            <>
              <div className="loader-spinner" style={{ width: 14, height: 14, borderWidth: 2 }}></div>
              Creating Plan...
            </>
          ) : (
            <>
              <Send /> Generate Revision Plan
            </>
          )}
        </button>

        {error && <div className="error-msg">{error}</div>}
      </div>

      {loading && (
        <div className="loader">
          <div className="loader-spinner"></div>
          Creating your personalized revision plan...
        </div>
      )}

      {plan && !loading && (
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: 'var(--gradient-green)' }}>
              <Target />
            </div>
            <div className="card-header-text">
              <h3>Your Revision Plan</h3>
              <p>{plan.student_type.toUpperCase()} — Exam on {plan.exam_date}</p>
            </div>
          </div>

          <div className="revision-summary">
            <div className="revision-stat">
              <div className="stat-value">{plan.days_left}</div>
              <div className="stat-label">Days Left</div>
            </div>
            <div className="revision-stat">
              <div className="stat-value">{plan.total_topics}</div>
              <div className="stat-label">Topics</div>
            </div>
            <div className="revision-stat">
              <div className="stat-value">{plan.revision_plan?.length || 0}</div>
              <div className="stat-label">Study Days</div>
            </div>
          </div>

          <div className="timeline">
            {plan.revision_plan?.map((day, idx) => (
              <div key={idx} className={`timeline-item ${getPhaseClass(day.phase)}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-day">Day {day.day} — {day.daily_goal}</div>
                  <div className="timeline-phase">{day.phase}</div>
                  <div className="timeline-topics">
                    {day.topics.map((t, i) => (
                      <div key={i}>• {t}</div>
                    ))}
                  </div>
                  <div className="timeline-tip">💡 {day.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
