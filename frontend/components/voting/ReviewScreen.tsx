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
    return <div className="text-center py-8 text-gray-500">Loading review...</div>;
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#212121]">Review Your Vote</h2>
        <p className="text-gray-500 text-sm">Please confirm your selections</p>
      </div>

      <div className="space-y-4">
        {positions.map((position) => {
          const selectedCandidateId = selections[position.id];
          const selectedCandidate = position.candidates.find((c: any) => c.id === selectedCandidateId);
          return (
            <div key={position.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-600">{position.name}:</span>
              <span className="font-semibold text-[#212121]">{selectedCandidate?.name || 'Not selected'}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-sm text-yellow-800">
          ⚠️ Please carefully review your selections. Once submitted, it cannot be changed.
        </p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Vote'}
        </button>
      </div>
    </div>
  );
}
