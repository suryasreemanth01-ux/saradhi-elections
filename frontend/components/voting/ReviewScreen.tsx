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
    return <div className="text-center py-8 text-[#6B7280]">Loading review...</div>;
  }

  const positionNames = ['President', 'Vice President', 'Secretary', 'Treasurer'];

  return (
    <div>
      {/* Page Heading */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-bold text-[#1E3A8A] uppercase tracking-wide">
          Review Your Vote
        </h1>
        <p className="text-base text-[#6B7280] mt-1">
          Please review your selections before submitting.
        </p>
      </div>

      {/* Candidate Cards */}
      <div className="space-y-4 mt-6">
        {positions.map((position, index) => {
          const selectedCandidateId = selections[position.id];
          const selectedCandidate = position.candidates.find((c: any) => c.id === selectedCandidateId);
          return (
            <div 
              key={position.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 relative overflow-hidden"
            >
              {/* Blue accent line on left */}
              <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 rounded-l-xl" />
              
              {/* Role Badge */}
              <div className="inline-block bg-blue-50 text-blue-800 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-md">
                {positionNames[index] || position.name}
              </div>
              
              {/* Candidate Name */}
              <div className="font-semibold text-[22px] text-gray-900 mt-2">
                {selectedCandidate?.name || 'Not selected'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Box */}
      <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
        <p className="font-medium text-[15px] text-amber-800 leading-relaxed">
          ⚠️ Please carefully review your selections. Once submitted, it cannot be changed.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-6">
        <button 
          onClick={handleSubmit} 
          disabled={submitting} 
          className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base shadow-sm hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'SUBMITTING...' : 'SUBMIT VOTE'}
        </button>
        
        <button 
          onClick={onBack} 
          disabled={submitting} 
          className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          BACK
        </button>
      </div>
    </div>
  );
}
