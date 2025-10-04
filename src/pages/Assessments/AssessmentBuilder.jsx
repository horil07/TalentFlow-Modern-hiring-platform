import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAPI } from '../../services/mockApi';
import QuestionBuilder from '../../components/Assessments/QuestionBuilder';

const AssessmentBuilder = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJob();
    loadAssessment();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const jobs = await mockAPI.getJobs({});
      const foundJob = jobs.data.find(j => j.id === parseInt(jobId));
      setJob(foundJob);
    } catch (error) {
      console.error('Failed to load job:', error);
    }
  };

  const loadAssessment = async () => {
    try {
      const assessmentData = await mockAPI.getAssessment(parseInt(jobId));
      setAssessment(assessmentData || {
        jobId: parseInt(jobId),
        title: 'Technical Assessment',
        description: '',
        questions: [],
        settings: {
          timeLimit: 60,
          passingScore: 70
        }
      });
    } catch (error) {
      console.error('Failed to load assessment:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      text: '',
      required: false
    };
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...assessment.questions];
    newQuestions[index] = updatedQuestion;
    setAssessment(prev => ({ ...prev, questions: newQuestions }));
  };

  const deleteQuestion = (index) => {
    const newQuestions = assessment.questions.filter((_, i) => i !== index);
    setAssessment(prev => ({ ...prev, questions: newQuestions }));
  };

  const addOption = (questionIndex) => {
    const question = assessment.questions[questionIndex];
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    updateQuestion(questionIndex, { ...question, options: newOptions });
  };

  const handleSaveAssessment = async () => {
    setSaving(true);
    try {
      await mockAPI.saveAssessment(parseInt(jobId), assessment);
      alert('Assessment saved successfully!');
    } catch (error) {
      alert(`Failed to save assessment: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!job || !assessment) return <div className="loading">Loading...</div>;

  return (
    <div className="assessment-builder">
      <div className="detail-header">
        <Link to={`/jobs/${jobId}`} className="btn btn-outline">
          ← Back to Job
        </Link>
        <div className="header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => setPreview(!preview)}
          >
            {preview ? '✏️ Edit Mode' : '👁️ Preview'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSaveAssessment}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save Assessment'}
          </button>
        </div>
      </div>

      <div className="builder-header">
        <h1>Assessment Builder - {job.title}</h1>
        <p>Create and customize the assessment for this job position</p>
      </div>

      {!preview ? (
        <div className="builder-content">
          <div className="assessment-settings">
            <h3>Assessment Settings</h3>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={assessment.title}
                onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                value={assessment.description}
                onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
              />
            </div>
          </div>

          <div className="questions-section">
            <h3>Questions</h3>
            <div className="questions-list">
              {assessment.questions.map((question, index) => (
                <QuestionBuilder
                  key={question.id}
                  question={question}
                  index={index}
                  onChange={(updated) => updateQuestion(index, updated)}
                  onDelete={() => deleteQuestion(index)}
                  onAddOption={() => addOption(index)}
                />
              ))}
            </div>

            <button onClick={addQuestion} className="btn btn-outline add-question">
              ➕ Add Question
            </button>
          </div>
        </div>
      ) : (
        <div className="preview-content">
          <div className="assessment-preview">
            <h2>{assessment.title}</h2>
            {assessment.description && (
              <p className="preview-description">{assessment.description}</p>
            )}
            
            <form className="preview-form">
              {assessment.questions.map((question, index) => (
                <div key={question.id} className="preview-question">
                  <label className="question-label">
                    {index + 1}. {question.text}
                    {question.required && <span className="required">*</span>}
                  </label>
                  
                  {question.type === 'text' && (
                    <input type="text" className="form-input" disabled />
                  )}
                  
                  {question.type === 'textarea' && (
                    <textarea className="form-input" rows={3} disabled />
                  )}
                  
                  {question.type === 'number' && (
                    <input type="number" className="form-input" disabled />
                  )}
                  
                  {question.type === 'single' && (
                    <div className="options-list">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="option-label">
                          <input type="radio" name={`question-${index}`} disabled />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'multiple' && (
                    <div className="options-list">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="option-label">
                          <input type="checkbox" disabled />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'file' && (
                    <input type="file" className="form-input" disabled />
                  )}
                </div>
              ))}
              
              <button type="button" className="btn btn-primary" disabled>
                Submit Assessment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentBuilder;