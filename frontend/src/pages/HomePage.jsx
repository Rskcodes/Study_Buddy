import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, BookOpen, MessageCircleQuestion, Brain, CalendarClock,
  Sparkles, Zap
} from 'lucide-react';

const features = [
  {
    icon: <Upload />,
    title: 'Upload & Extract',
    desc: 'Upload PDFs or images and extract text instantly using OCR.',
    path: '/upload',
    gradient: 'var(--gradient-cool)',
  },
  {
    icon: <BookOpen />,
    title: 'Smart Notes',
    desc: 'Summarize long text into concise, bullet-point notes using AI.',
    path: '/notes',
    gradient: 'var(--gradient-primary)',
  },
  {
    icon: <MessageCircleQuestion />,
    title: 'Doubt Solver',
    desc: 'Ask questions about your study material and get instant answers.',
    path: '/doubt',
    gradient: 'var(--gradient-warm)',
  },
  {
    icon: <Brain />,
    title: 'Quiz Generator',
    desc: 'Generate practice quizzes from your uploaded content.',
    path: '/quiz',
    gradient: 'var(--gradient-pink)',
  },
  {
    icon: <CalendarClock />,
    title: 'Revision Planner',
    desc: 'Create a personalized revision plan based on your exam timeline.',
    path: '/revision',
    gradient: 'var(--gradient-green)',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-badge">
          <Sparkles /> AI-Powered Study Assistant
        </div>
        <h1>
          Your Smart<br />
          <span className="gradient-text">Study Buddy</span>
        </h1>
        <p>
          Upload your notes, get AI-powered summaries, solve doubts, generate quizzes,
          and plan your revision — all in one place.
        </p>
      </div>

      <div className="home-features stagger-children">
        {features.map((f) => (
          <Link to={f.path} key={f.path} className="feature-card">
            <div className="feature-card-icon" style={{ background: f.gradient }}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
