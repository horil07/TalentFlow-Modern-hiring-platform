import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, onEdit, onArchive }) => {
  // Simple icon components since lucide-react has version issues
  const EditIcon = () => <span>✏️</span>;
  const ArchiveIcon = () => <span>📁</span>;
  const UnarchiveIcon = () => <span>📂</span>;
  const MapPinIcon = () => <span>📍</span>;
  const CalendarIcon = () => <span>📅</span>;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="job-slug text-secondary">/{job.slug}</p>
        </div>
        <span className={`status-badge status-${job.status}`}>
          {job.status}
        </span>
      </div>

      <p className="job-description text-secondary text-sm">
        {job.description}
      </p>

      <div className="job-meta">
        {job.tags && job.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="job-footer">
        <div className="job-info">
          <div className="info-item">
            <MapPinIcon />
            <span>Remote</span>
          </div>
          <div className="info-item">
            <CalendarIcon />
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="job-actions">
          <button
            className="btn btn-outline"
            onClick={() => onEdit(job)}
          >
            <EditIcon />
          </button>
          <button
            className="btn btn-outline"
            onClick={() => onArchive(job.id, job.status !== 'archived')}
          >
            {job.status === 'archived' ? <UnarchiveIcon /> : <ArchiveIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;