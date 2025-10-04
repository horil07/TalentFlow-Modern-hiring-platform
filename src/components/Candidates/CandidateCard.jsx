import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const JobForm = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'active',
    tags: []
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        slug: job.slug,
        description: job.description || '',
        status: job.status,
        tags: job.tags || []
      });
    }
  }, [job]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{job ? 'Edit Job' : 'Create Job'}</h2>
          <button onClick={onCancel} className="btn btn-outline">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Slug *</label>
            <input
              type="text"
              className="form-input"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="tag-add">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button type="button" onClick={handleAddTag} className="btn btn-outline">
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;