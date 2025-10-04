import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAPI } from '../../services/mockApi';

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const jobs = await mockAPI.getJobs({});
      const foundJob = jobs.data.find(j => j.id === parseInt(jobId));
      setJob(foundJob);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (!job) return <div className="loading">Job not found</div>;

  return (
    <div className="job-detail">
      <div className="detail-header">
        <Link to="/jobs" className="btn btn-outline">
          ← Back to Jobs
        </Link>
        <div className="header-actions">
          <Link to={`/jobs/${jobId}/assessment`} className="btn btn-secondary">
            📝 Manage Assessment
          </Link>
        </div>
      </div>

      <div className="job-detail-content">
        <div className="job-main">
          <div className="job-title-section">
            <h1>{job.title}</h1>
            <span className={`status-badge status-${job.status}`}>
              {job.status}
            </span>
          </div>
          
          <p className="job-slug">/{job.slug}</p>
          
          <div className="job-description">
            <h3>Description</h3>
            <p>{job.description || 'No description provided.'}</p>
          </div>

          <div className="job-tags">
            <h3>Tags</h3>
            <div className="tags-list">
              {job.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="job-sidebar">
          <div className="sidebar-card">
            <h3>Job Information</h3>
            <div className="info-list">
              <div className="info-item">
                <strong>Status:</strong>
                <span className={`status-${job.status}`}>{job.status}</span>
              </div>
              <div className="info-item">
                <strong>Created:</strong>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <strong>Updated:</strong>
                <span>{new Date(job.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;