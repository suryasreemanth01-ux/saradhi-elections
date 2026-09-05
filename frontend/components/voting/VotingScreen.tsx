"use client";

import { useState, useEffect } from 'react';

interface VotingScreenProps {
  electionId: number;
  onComplete: (selections: Record<number, number>) => void;
}

export function VotingScreen({ electionId, onComplete }: VotingScreenProps) {
  const [positions, setPositions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setError('Failed to load election data');
      setLoading(false);
    }
  };

  const handleSelect = (candidateId: number) => {
    const currentPosition = positions[currentIndex];
    setSelections({
      ...selections,
      [currentPosition.id]: candidateId
    });
  };

  const handleNext = () => {
    if (currentIndex < positions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(selections);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-[#6B7280]">Loading election...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const currentPosition = positions[currentIndex];
  const totalPositions = positions.length;

  const positionTitles = ['President', 'Vice President', 'Secretary', 'Treasurer'];

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Select {positionTitles[currentIndex] || currentPosition.name}
        </h2>
        <p className="text-sm text-[#6B7280] mt-1">
          Step {currentIndex + 1} of {totalPositions} • Choose ONE candidate
        </p>
      </div>

      <div className="space-y-3">
        {currentPosition.candidates.map((candidate: any) => {
          const isSelected = selections[currentPosition.id] === candidate.id;
          return (
            <div
              key={candidate.id}
              onClick={() => handleSelect(candidate.id)}
              className={`candidate-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="radio-circle">
                {isSelected && <div className="radio-dot" />}
              </div>
              <div>
                <div className="font-semibold text-[#1F2937]">{candidate.name}</div>
                <div className="text-sm text-[#6B7280]">Candidate for {currentPosition.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!selections[currentPosition.id]}
        className="btn-primary mt-6"
      >
        {currentIndex < totalPositions - 1 ? 'NEXT →' : 'REVIEW VOTE'}
      </button>
    </div>
  );
}
