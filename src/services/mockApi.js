import { db } from './database.js';

const simulateNetwork = async (operation) => {
  // Artificial latency
  const latency = Math.random() * 1000 + 200;
  await new Promise(resolve => setTimeout(resolve, latency));

  // 5-10% error rate for write operations
  if (operation.type === 'write' && Math.random() < 0.08) {
    throw new Error('Simulated server error');
  }

  return operation.execute();
};

export const mockAPI = {
  // Jobs endpoints
  getJobs: async (filters = {}) => {
    return simulateNetwork({
      type: 'read',
      execute: async () => {
        let jobs = await db.jobs.toArray();
        
        // Apply filters
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          jobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchLower) ||
            job.description?.toLowerCase().includes(searchLower) ||
            job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters.status && filters.status !== 'all') {
          jobs = jobs.filter(job => job.status === filters.status);
        }

        // Sort by order
        jobs.sort((a, b) => a.order - b.order);

        // Pagination
        const page = filters.page || 1;
        const pageSize = filters.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

        return {
          data: paginatedJobs,
          total: jobs.length,
          page,
          pageSize,
          totalPages: Math.ceil(jobs.length / pageSize)
        };
      }
    });
  },

  createJob: async (jobData) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        // Check if slug is unique
        const existingJob = await db.jobs.where('slug').equals(jobData.slug).first();
        if (existingJob) {
          throw new Error('Slug must be unique');
        }

        // Get max order
        const maxOrder = await db.jobs.orderBy('order').last();
        const order = (maxOrder?.order || 0) + 1;

        const id = await db.jobs.add({
          ...jobData,
          order,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        return { id, ...jobData, order };
      }
    });
  },

  updateJob: async (id, updates) => {
    return simulateNetwork({
      type: 'write', 
      execute: async () => {
        if (updates.slug) {
          const existingJob = await db.jobs.where('slug').equals(updates.slug).first();
          if (existingJob && existingJob.id !== id) {
            throw new Error('Slug must be unique');
          }
        }

        await db.jobs.update(id, {
          ...updates,
          updatedAt: new Date()
        });
        return { id, ...updates };
      }
    });
  },

  reorderJobs: async (fromOrder, toOrder) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        const jobs = await db.jobs.toArray();
        
        if (fromOrder === toOrder) return { success: true };

        const jobToMove = jobs.find(job => job.order === fromOrder);
        if (!jobToMove) throw new Error('Job not found');

        // Update orders
        if (fromOrder < toOrder) {
          // Moving down
          for (const job of jobs) {
            if (job.order > fromOrder && job.order <= toOrder) {
              await db.jobs.update(job.id, { order: job.order - 1 });
            }
          }
        } else {
          // Moving up
          for (const job of jobs) {
            if (job.order >= toOrder && job.order < fromOrder) {
              await db.jobs.update(job.id, { order: job.order + 1 });
            }
          }
        }

        await db.jobs.update(jobToMove.id, { order: toOrder });
        return { success: true };
      }
    });
  },

  // Candidates endpoints
  getCandidates: async (filters = {}) => {
    return simulateNetwork({
      type: 'read',
      execute: async () => {
        let candidates = await db.candidates.toArray();
        
        // Client-side search
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          candidates = candidates.filter(candidate =>
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower)
          );
        }

        // Server-like filter
        if (filters.stage && filters.stage !== 'all') {
          candidates = candidates.filter(candidate => candidate.stage === filters.stage);
        }

        if (filters.jobId) {
          candidates = candidates.filter(candidate => candidate.jobId === parseInt(filters.jobId));
        }

        const page = filters.page || 1;
        const pageSize = filters.pageSize || 20;
        const startIndex = (page - 1) * pageSize;
        const paginatedCandidates = candidates.slice(startIndex, startIndex + pageSize);

        return {
          data: paginatedCandidates,
          total: candidates.length,
          page,
          pageSize,
          totalPages: Math.ceil(candidates.length / pageSize)
        };
      }
    });
  },

  getCandidate: async (id) => {
    return simulateNetwork({
      type: 'read',
      execute: async () => {
        const candidate = await db.candidates.get(id);
        if (!candidate) throw new Error('Candidate not found');
        return candidate;
      }
    });
  },

  updateCandidate: async (id, updates) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        await db.candidates.update(id, {
          ...updates,
          updatedAt: new Date()
        });

        // Add to timeline if stage changed
        if (updates.stage) {
          const candidate = await db.candidates.get(id);
          await db.candidateTimeline.add({
            candidateId: id,
            stage: updates.stage,
            note: `Candidate moved to ${updates.stage} stage`,
            createdAt: new Date(),
            updatedBy: 'System'
          });
        }

        return { id, ...updates };
      }
    });
  },

  getCandidateTimeline: async (candidateId) => {
    return simulateNetwork({
      type: 'read',
      execute: async () => {
        const timeline = await db.candidateTimeline
          .where('candidateId')
          .equals(candidateId)
          .sortBy('createdAt');
        return timeline.reverse();
      }
    });
  },

  addCandidateNote: async (candidateId, note) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        const candidate = await db.candidates.get(candidateId);
        const updatedNotes = [...(candidate.notes || []), {
          id: Date.now(),
          text: note,
          createdAt: new Date(),
          createdBy: 'HR User'
        }];

        await db.candidates.update(candidateId, { notes: updatedNotes });
        return updatedNotes;
      }
    });
  },

  // Assessments endpoints
  getAssessment: async (jobId) => {
    return simulateNetwork({
      type: 'read',
      execute: async () => {
        const assessment = await db.assessments.where('jobId').equals(parseInt(jobId)).first();
        return assessment || null;
      }
    });
  },

  saveAssessment: async (jobId, assessmentData) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        const existing = await db.assessments.where('jobId').equals(parseInt(jobId)).first();
        
        if (existing) {
          await db.assessments.update(existing.id, {
            ...assessmentData,
            updatedAt: new Date()
          });
          return { id: existing.id, ...assessmentData };
        } else {
          const id = await db.assessments.add({
            jobId: parseInt(jobId),
            ...assessmentData,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          return { id, ...assessmentData };
        }
      }
    });
  },

  submitAssessment: async (assessmentId, candidateId, responses) => {
    return simulateNetwork({
      type: 'write',
      execute: async () => {
        const id = await db.assessmentResponses.add({
          assessmentId: parseInt(assessmentId),
          candidateId: parseInt(candidateId),
          responses,
          submittedAt: new Date(),
          score: calculateScore(responses)
        });
        return { id, assessmentId, candidateId, responses };
      }
    });
  }
};

const calculateScore = (responses) => {
  // Simple scoring logic - in real app, this would be more complex
  const totalQuestions = Object.keys(responses).length;
  const answeredQuestions = Object.values(responses).filter(r => r !== '' && r !== null).length;
  return Math.round((answeredQuestions / totalQuestions) * 100);
};