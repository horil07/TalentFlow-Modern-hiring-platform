import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { mockAPI } from '../../services/mockApi';
import SearchFilter from '../../components/Common/SearchFilter';
import Pagination from '../../components/Common/Pagination';
import JobForm from '../../components/Jobs/JobForm';

const JobsBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    pageSize: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await mockAPI.getJobs(filters);
      setJobs(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormSubmit = async (jobData) => {
    try {
      if (editingJob) {
        await mockAPI.updateJob(editingJob.id, jobData);
      } else {
        await mockAPI.createJob(jobData);
      }
      setShowForm(false);
      setEditingJob(null);
      loadJobs();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleArchiveJob = async (jobId, archive) => {
    try {
      await mockAPI.updateJob(jobId, { status: archive ? 'archived' : 'active' });
      loadJobs();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const fromOrder = result.source.index + 1;
    const toOrder = result.destination.index + 1;

    // Optimistic update
    const reorderedJobs = Array.from(jobs);
    const [movedJob] = reorderedJobs.splice(result.source.index, 1);
    reorderedJobs.splice(result.destination.index, 0, movedJob);
    setJobs(reorderedJobs);

    try {
      await mockAPI.reorderJobs(fromOrder, toOrder);
    } catch (error) {
      // Rollback on failure
      loadJobs();
      alert('Failed to reorder jobs. Please try again.');
    }
  };

  return (
    <div className="jobs-board">
      <div className="board-header">
        <div className="header-content">
          <h1>Jobs Board</h1>
          <p>Manage job positions and applications</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateJob}>
          ➕ Create Job
        </button>
      </div>

      <SearchFilter
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search jobs by title, description, or tags..."
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' }
        ]}
      />

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="jobs">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="jobs-grid"
                >
                  {jobs.map((job, index) => (
                    <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`job-card ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
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
                            {job.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>

                          <div className="job-footer">
                            <div className="job-info">
                              <div className="info-item">
                                <span>📍</span>
                                <span>Remote</span>
                              </div>
                              <div className="info-item">
                                <span>📅</span>
                                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="job-actions">
                              <button
                                className="btn btn-outline"
                                onClick={() => handleEditJob(job)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-outline"
                                onClick={() => handleArchiveJob(job.id, job.status !== 'archived')}
                              >
                                {job.status === 'archived' ? '📂' : '📁'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        </>
      )}

      {showForm && (
        <JobForm
          job={editingJob}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};

export default JobsBoard;