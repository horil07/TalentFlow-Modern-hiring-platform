import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const QuestionBuilder = ({ question, onChange, onDelete, onAddOption }) => {
  const handleTypeChange = (newType) => {
    const updatedQuestion = { ...question, type: newType };
    
    // Reset options for certain types
    if (['text', 'textarea', 'number'].includes(newType)) {
      delete updatedQuestion.options;
    } else if (!updatedQuestion.options) {
      updatedQuestion.options = ['Option 1'];
    }
    
    onChange(updatedQuestion);
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
          <Trash2 size={16} />
        </button>
      </div>

      {['single', 'multiple'].includes(question.type) && (
        <div className="question-options">
          <label>Options:</label>
          {question.options.map((option, index) => (
            <div key={index} className="option-item">
              <input
                type="text"
                className="form-input"
                value={option}
                onChange={(e) => {
                  const newOptions = [...question.options];
                  newOptions[index] = e.target.value;
                  onChange({ ...question, options: newOptions });
                }}
              />
              <button
                onClick={() => {
                  const newOptions = question.options.filter((_, i) => i !== index);
                  onChange({ ...question, options: newOptions });
                }}
                className="btn btn-outline"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button onClick={onAddOption} className="btn btn-outline">
            <Plus size={14} />
            Add Option
          </button>
        </div>
      )}

      <div className="question-settings">
        <label>
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => onChange({ ...question, required: e.target.checked })}
          />
          Required
        </label>
      </div>
    </div>
  );
};

export default QuestionBuilder;