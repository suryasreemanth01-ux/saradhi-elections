"use client";

import { useState, useEffect } from 'react';

interface ReviewScreenProps {
  selections: Record<number, number>;
  electionId: number;
  mobileNumber: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewScreen({ selections, electionId, mobileNumber, onBack, onSubmit }: ReviewScreenProps) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchPositions();
  }, [electionId]);

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_URL}/election/positions/${electionId}`);
      const data = await response.json();
      setPositions(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const votes = Object.entries(selections).map(([positionId, candidateId]) => ({
        position_id: parseInt(positionId),
        candidate_id: candidateId
      }));

      const response = await fetch(`${API_URL}/voter/submit-vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          election_id: electionId,
          votes: votes
        })
      });

      const data = await response.json();
      if (data.success) {
        onSubmit();
      } else {
        alert(data.message || 'Failed to submit vote');
        setSubmitting(false);
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: '32px', color: '#6B7280'}}>Loading review...</div>;
  }

  const positionNames = ['President', 'Vice President', 'Secretary', 'Treasurer'];

  return (
    <div>
      {/* Page Heading */}
      <div style={{textAlign: 'center', marginBottom: '8px'}}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#1E3A8A',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px'
        }}>
          Review Your Vote
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginTop: '4px'
        }}>
          Please review your selections before submitting.
        </p>
      </div>

      {/* Candidate Cards */}
      <div style={{marginTop: '24px'}}>
        {positions.map((position, index) => {
          const selectedCandidateId = selections[position.id];
          const selectedCandidate = position.candidates.find((c: any) => c.id === selectedCandidateId);
          return (
            <div 
              key={position.id} 
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {/* Blue accent line */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '4px',
                height: '100%',
                background: '#2563EB',
                borderRadius: '4px 0 0 4px'
              }} />
              
              {/* Role Badge */}
              <div style={{
                display: 'inline-block',
                background: '#EFF6FF',
                color: '#1E3A8A',
                fontWeight: '700',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '4px 12px',
                borderRadius: '6px'
              }}>
                {positionNames[index] || position.name}
              </div>
              
              {/* Candidate Name */}
              <div style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#111827',
                marginTop: '8px'
              }}>
                {selectedCandidate?.name || 'Not selected'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Box */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#FFFBEB',
        borderLeft: '4px solid #F59E0B',
        borderRadius: '8px'
      }}>
        <p style={{
          fontWeight: '500',
          fontSize: '15px',
          color: '#92400E',
          lineHeight: '1.5'
        }}>
          ⚠️ Please carefully review your selections. Once submitted, it cannot be changed.
        </p>
      </div>

      {/* Buttons */}
      <div style={{marginTop: '24px'}}>
        <button 
          onClick={handleSubmit} 
          disabled={submitting} 
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: '#2563EB',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.5 : 1,
            marginBottom: '12px'
          }}
        >
          {submitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
        </button>
        
        <button 
          onClick={onBack} 
          disabled={submitting} 
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: '#F3F4F6',
            color: '#374151',
            fontWeight: '500',
            fontSize: '14px',
            border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.5 : 1
          }}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
