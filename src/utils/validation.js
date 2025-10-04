export const validateJob = (jobData) => {
  const errors = {};

  if (!jobData.title?.trim()) {
    errors.title = 'Job title is required';
  }

  if (!jobData.slug?.trim()) {
    errors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(jobData.slug)) {
    errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
  }

  return errors;
};

export const validateAssessmentResponse = (questions, responses) => {
  const errors = {};

  questions.forEach(question => {
    if (question.required && !responses[question.id]) {
      errors[question.id] = 'This question is required';
    }
  });

  return errors;
};