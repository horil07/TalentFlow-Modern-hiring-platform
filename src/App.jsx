import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import JobsBoard from './pages/Jobs/JobsBoard';
import JobDetail from './pages/Jobs/JobDetail';
import CandidatesList from './pages/Candidates/CandidatesList';
import CandidateProfile from './pages/Candidates/CandidateProfile';
import AssessmentBuilder from './pages/Assessments/AssessmentBuilder';
import AssessmentForm from './pages/Assessments/AssessmentForm';
import { seedInitialData } from './services/seedData';
import './styles/global.css';

function App() {
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobsBoard />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/candidates" element={<CandidatesList />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfile />} />
          <Route path="/jobs/:jobId/assessment" element={<AssessmentBuilder />} />
          <Route path="/assessments/:assessmentId" element={<AssessmentForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;