import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 120000, // 2 min — models can be slow
});

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data; // { text, filename }
}

export async function summarizeNotes(text) {
  const { data } = await API.post('/notes', { text });
  return data; // { summary }
}

export async function solveDoubt(question, context) {
  const { data } = await API.post('/doubt', { question, context });
  return data; // { answer }
}

export async function generateQuiz(text, numQuestions = 5) {
  const { data } = await API.post('/quiz', { text, num_questions: numQuestions });
  return data; // { message }
}

export async function createRevisionPlan(text, examDate, studentType, dailyHours) {
  const { data } = await API.post('/revision-plan', {
    text,
    exam_date: examDate,
    student_type: studentType,
    daily_hours: dailyHours,
  });
  return data;
}

export default API;
