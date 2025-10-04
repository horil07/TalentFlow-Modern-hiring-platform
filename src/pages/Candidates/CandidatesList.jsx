import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';
import { mockAPI } from '../../services/mockApi';
import SearchFilter from '../../components/Common/SearchFilter';
import Pagination from '../../components/Common/Pagination';

const CandidateRow = ({ index, style, data }) => {
  const candidate = data.candidates[index];
  
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

  return (
    <div style={style}>
      <div className="candidate-card">
        <div className="candidate-header">
          <div className="candidate-avatar">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="candidate-info">
            <h4 className="candidate-name">
              <Link to={`/candidates/${candidate.id}`}>{candidate.name}</Link>
            </h4>
            <p className="candidate-email">{candidate.email}</p>
          </div>
          <span 
            className="stage-badge"
            style={{ backgroundColor: getStageColor(candidate.stage) }}
          >
            {candidate.stage}
          </span>
        </div>

        <div className="candidate-meta">
          <div className="meta-item">
            <span>📞</span>
            <span>{candidate.phone}</span>
          </div>
          <div className="meta-item">
            <span>📅</span>
            <span>{new Date(candidate.appliedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatesList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all',
    page: 1,
    pageSize: 50
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const response = await mockAPI.getCandidates(filters);
      setCandidates(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      });
    } catch (error) {
      console.error('Failed to load candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'applied', label: 'Applied' },
    { value: 'screen', label: 'Screen' },
    { value: 'tech', label: 'Technical' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const listData = useMemo(() => ({ candidates }), [candidates]);

  return (
    <div className="candidates-list">
      <div className="board-header">
        <div className="header-content">
          <h1>Candidates</h1>
          <p>Manage candidate applications and progression</p>
        </div>
      </div>

      <SearchFilter
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search candidates by name or email..."
        filterOptions={stageOptions}
      />

      {loading ? (
        <div className="loading">Loading candidates...</div>
      ) : (
        <>
          <div className="candidates-virtualized">
            <List
              height={600}
              itemCount={candidates.length}
              itemSize={120}
              itemData={listData}
            >
              {CandidateRow}
            </List>
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
};

export default CandidatesList;