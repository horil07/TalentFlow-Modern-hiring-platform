import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAPI } from '../../services/mockApi';

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  const loadCandidate = async () => {
    try {
      const candidateData = await mockAPI.getCandidate(parseInt(candidateId));
      setCandidate(candidateData);
      
      const timelineData = await mockAPI.getCandidateTimeline(parseInt(candidateId));
      setTimeline(timelineData);
    } catch (error) {
      console.error('Failed to load candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        await mockAPI.addCandidateNote(parseInt(candidateId), newNote);
        setNewNote('');
        loadCandidate(); // Reload to get updated notes
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      applied: '#64748b',
      screen: '#f59e0b',
      tech: '#3b82f6',
      offer: '#10b981',
      hired: '#10b981',
      rejected: '#ef4444'
    };
    return colors[stage] || '#64748b';
  };

  if (loading) return <div className="loading">Loading candidate profile...</div>;
  if (!candidate) return <div className="loading">Candidate not found</div>;

  return (
    <div className="candidate-profile">
      <div className="detail-header">
        <Link to="/candidates" className="btn btn-outline">
          ← Back to Candidates
        </Link>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-header">
            <div className="candidate-avatar large">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-info">
              <h1>{candidate.name}</h1>
              <p className="profile-email">{candidate.email}</p>
              <div className="profile-meta">
                <div className="meta-item">
                  <span>📞</span>
                  <span>{candidate.phone}</span>
                </div>
                <div className="meta-item">
                  <span>📅</span>
                  <span>Applied {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="profile-stage">
              <span 
                className="stage-badge large"
                style={{ 
                  backgroundColor: getStageColor(candidate.stage),
                  color: 'white'
                }}
              >
                {candidate.stage}
              </span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="notes-section">
            <h2>Notes</h2>
            <div className="notes-input">
              <textarea
                className="form-textarea"
                placeholder="Add a note about this candidate... Use @ to mention team members"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="3"
              />
              <button 
                className="btn btn-primary"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                Add Note
              </button>
            </div>
            
            <div className="notes-list">
              {candidate.notes && candidate.notes.map(note => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <strong>{note.createdBy}</strong>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="note-text">{note.text}</p>
                </div>
              ))}
              {(!candidate.notes || candidate.notes.length === 0) && (
                <p className="text-secondary">No notes yet.</p>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="timeline-section">
            <h2>Application Timeline</h2>
            <div className="timeline">
              {timeline.map((event, index) => (
                <div key={event.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <strong>{event.stage}</strong>
                      <span className="timeline-date">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{event.note}</p>
                    {event.updatedBy && (
                      <small className="text-secondary">By {event.updatedBy}</small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;