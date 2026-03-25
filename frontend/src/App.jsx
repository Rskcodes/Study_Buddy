import { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  Home, Upload, BookOpen, MessageCircleQuestion, Brain,
  CalendarClock, GraduationCap, Menu, X
} from 'lucide-react';
import './App.css';

import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import NotesPage from './pages/NotesPage';
import DoubtPage from './pages/DoubtPage';
import QuizPage from './pages/QuizPage';
import RevisionPage from './pages/RevisionPage';

const navItems = [
  { path: '/', label: 'Home', icon: <Home /> },
  { path: '/upload', label: 'Upload & Extract', icon: <Upload /> },
  { path: '/notes', label: 'Smart Notes', icon: <BookOpen /> },
  { path: '/doubt', label: 'Doubt Solver', icon: <MessageCircleQuestion /> },
  { path: '/quiz', label: 'Quiz Generator', icon: <Brain />, badge: 'Soon' },
  { path: '/revision', label: 'Revision Planner', icon: <CalendarClock /> },
];

export default function App() {
  const [extractedText, setExtractedText] = useState('');
  const [extractedFilename, setExtractedFilename] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleTextExtracted = (text, filename) => {
    setExtractedText(text);
    setExtractedFilename(filename);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <GraduationCap />
          </div>
          <div className="sidebar-brand">
            <h2>Study Buddy</h2>
            <span>AI Study Assistant</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Navigation</span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">SB</div>
          <div className="sidebar-footer-info">
            <span>Study Buddy</span>
            <span>v1.0.0 • AI Powered</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/upload"
            element={
              <UploadPage
                onTextExtracted={handleTextExtracted}
                extractedText={extractedText}
                extractedFilename={extractedFilename}
              />
            }
          />
          <Route path="/notes" element={<NotesPage extractedText={extractedText} />} />
          <Route path="/doubt" element={<DoubtPage extractedText={extractedText} />} />
          <Route path="/quiz" element={<QuizPage extractedText={extractedText} />} />
          <Route path="/revision" element={<RevisionPage extractedText={extractedText} />} />
        </Routes>
      </main>
    </div>
  );
}
