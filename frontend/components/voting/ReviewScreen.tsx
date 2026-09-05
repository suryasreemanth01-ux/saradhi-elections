\"use client";

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
    return <div className="text-center py-8 text-[#6B7280]">Loading review...</div>;
  }

  const positionNames = ['President', 'Vice President', 'Secretary', 'Treasurer'];

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937]">Review Your Vote</h2>
        <p className="text-sm text-[#6B7280] mt-1">Please review your selections before submitting</p>
      </div>

      <div className="space-y-3">
        {positions.map((position, index) => {
          const selectedCandidateId = selections[position.id];
          const selectedCandidate = position.candidates.find((c: any) => c.id === selectedCandidateId);
          return (
            <div key={position.id} className="p-4 border border-gray-200 rounded-xl">
              <div className="text-sm text-[#6B7280]">{positionNames[index] || position.name}</div>
              <div className="font-semibold text-[#1F2937] text-lg">
                {selectedCandidate?.name || 'Not selected'}
              </div>
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
        <button onClick={onBack} disabled={submitting} className="btn-secondary">
          ← BACK
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
          {submitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
        </button>
      </div>
    </div>
  );
}
