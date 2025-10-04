import React from 'react';

const QuestionBuilder = ({ question, index, onChange, onDelete, onAddOption }) => {
  const handleTypeChange = (newType) => {
    const updatedQuestion = { ...question, type: newType };
    
    // Reset options for certain types
    if (['text', 'textarea', 'number', 'file'].includes(newType)) {
      delete updatedQuestion.options;
    } else if (!updatedQuestion.options) {
      updatedQuestion.options = ['Option 1'];
    }
    
    onChange(updatedQuestion);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onChange({ ...question, options: newOptions });
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onChange({ ...question, options: newOptions });
  };

  return (
    <div className="question-builder">
      <div className="question-header">
        <input
          type="text"
          className="form-input"
          placeholder="Question text"
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
        />
        <select
          className="form-input"
          value={question.type}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="text">Short Text</option>
          <option value="textarea">Long Text</option>
          <option value="number">Number</option>
          <option value="single">Single Choice</option>
          <option value="multiple">Multiple Choice</option>
          <option value="file">File Upload</option>
        </select>
        <button onClick={onDelete} className="btn btn-outline">
          🗑️
        </button>
      </div>

      {['single', 'multiple'].includes(question.type) && (
        <div className="question-options">
          <label className="form-label">Options:</label>
          {question.options.map((option, index) => (
            <div key={index} className="option-item">
              <input
                type="text"
                className="form-input"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => handleRemoveOption(index)}
                className="btn btn-outline"
                disabled={question.options.length <= 1}
              >
                🗑️
              </button>
            </div>
          ))}
          <button onClick={onAddOption} className="btn btn-outline">
            ➕ Add Option
          </button>
        </div>
      )}

      {(question.type === 'number') && (
        <div className="question-settings">
          <div className="form-group">
            <label className="form-label">Minimum Value</label>
            <input
              type="number"
              className="form-input"
              value={question.min || ''}
              onChange={(e) => onChange({ ...question, min: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Maximum Value</label>
            <input
              type="number"
              className="form-input"
              value={question.max || ''}
              onChange={(e) => onChange({ ...question, max: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
        </div>
      )}

      {(question.type === 'text' || question.type === 'textarea') && (
        <div className="form-group">
          <label className="form-label">Maximum Length</label>
          <input
            type="number"
            className="form-input"
            value={question.maxLength || ''}
            onChange={(e) => onChange({ ...question, maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
          />
        </div>
      )}

      <div className="question-settings">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => onChange({ ...question, required: e.target.checked })}
          />
          Required question
        </label>
      </div>
    </div>
  );
};

export default QuestionBuilder;