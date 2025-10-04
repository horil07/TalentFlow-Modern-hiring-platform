import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../services/database';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const jobsCount = await db.jobs.count();
        if (jobsCount === 0) {
          await seedInitialData();
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDB();
  }, []);

  const value = {
    isInitialized,
    db
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

const seedInitialData = async () => {
  const jobs = Array.from({ length: 25 }, (_, i) => ({
    title: `Job Position ${i + 1}`,
    slug: `job-position-${i + 1}`,
    status: i % 5 === 0 ? 'archived' : 'active',
    tags: ['React', 'JavaScript', 'TypeScript', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1),
    order: i + 1,
    description: `Description for job position ${i + 1}. This is a detailed description of the role and responsibilities.`,
    requirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await db.jobs.bulkAdd(jobs);

  const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  const candidates = Array.from({ length: 1000 }, (_, i) => ({
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@email.com`,
    stage: stages[Math.floor(Math.random() * stages.length)],
    jobId: Math.floor(Math.random() * 25) + 1,
    phone: `+1-555-${String(i).padStart(4, '0')}`,
    appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    notes: [],
    updatedAt: new Date()
  }));

  await db.candidates.bulkAdd(candidates);
};