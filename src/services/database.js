import Dexie from 'dexie';

export class TalentFlowDB extends Dexie {
  constructor() {
    super('TalentFlowDB');
    
    this.version(2).stores({
      jobs: '++id, title, slug, status, tags, order, createdAt, updatedAt',
      candidates: '++id, name, email, stage, jobId, appliedAt, notes, updatedAt',
      candidateTimeline: '++id, candidateId, stage, note, createdAt, updatedBy',
      assessments: '++id, jobId, title, description, questions, settings, createdAt, updatedAt',
      assessmentResponses: '++id, assessmentId, candidateId, responses, submittedAt, score'
    });
  }
}

export const db = new TalentFlowDB();