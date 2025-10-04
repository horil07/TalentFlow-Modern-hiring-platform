export const JobType = {
  id: Number,
  title: String,
  slug: String,
  status: String,
  tags: Array,
  order: Number,
  description: String,
  requirements: Array,
  createdAt: Date,
  updatedAt: Date
};

export const CandidateType = {
  id: Number,
  name: String,
  email: String,
  stage: String,
  jobId: Number,
  phone: String,
  appliedAt: Date,
  notes: Array,
  updatedAt: Date
};

export const AssessmentType = {
  id: Number,
  jobId: Number,
  title: String,
  description: String,
  questions: Array,
  createdAt: Date,
  updatedAt: Date
};