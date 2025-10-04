import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const AssessmentForm = () => {
  const { assessmentId } = useParams();
  const [responses, setResponses] = useState({});

  // This would be loaded from the database based on assessmentId
  const assessment = {
    id: assessmentId,
    title: 'Senior React Developer Assessment',
    questions: [
      {
        id: 1,
        type: 'text',
        text: 'What is your full name?',
        required: true
      },
      {
        id: 2,
        type: 'single',
        text: 'How many years of React experience do you have?',
        options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
        required: true
      }
    ]
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Assessment responses:', responses);
    alert('Assessment submitted successfully!');
  };

  return (
    <div className="assessment-form">
      <div className="form-header">
        <h1>{assessment.title}</h1>
        <p>Please complete the following assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="assessment-form-content">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="form-question">
            <label className="question-label">
              {index + 1}. {question.text}
              {question.required && <span className="required">*</span>}
            </label>
            
            {question.type === 'text' && (
              <input
                type="text"
                className="form-input"
                required={question.required}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}
            
            {question.type === 'textarea' && (
              <textarea
                className="form-input"
                rows={3}
                required={question.required}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}
            
            {question.type === 'number' && (
              <input
                type="number"
                className="form-input"
                required={question.required}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              />
            )}
            
            {question.type === 'single' && (
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      required={question.required}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'multiple' && (
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="checkbox"
                      value={option}
                      onChange={(e) => {
                        const currentValues = responses[question.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter(v => v !== option);
                        handleResponseChange(question.id, newValues);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'file' && (
              <input
                type="file"
                className="form-input"
                onChange={(e) => handleResponseChange(question.id, e.target.files[0])}
              />
            )}
          </div>
        ))}
        
        <button type="submit" className="btn btn-primary">
          Submit Assessment
        </button>
      </form>
    </div>
  );
};

export default AssessmentForm;