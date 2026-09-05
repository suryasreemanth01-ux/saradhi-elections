"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
    return <div className="text-center py-8 text-gray-500">Loading election...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  const currentPosition = positions[currentIndex];
  const totalPositions = positions.length;

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#212121]">Select {currentPosition.name}</h2>
        <p className="text-gray-500 text-sm">
          {currentIndex + 1} of {totalPositions}
        </p>
      </div>

      <div className="space-y-3">
        {currentPosition.candidates.map((candidate: any) => (
          <div
            key={candidate.id}
            onClick={() => handleSelect(candidate.id)}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all
              ${selections[currentPosition.id] === candidate.id
                ? 'border-[#0D47A1] bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selections[currentPosition.id] === candidate.id
                  ? 'border-[#0D47A1] bg-[#0D47A1]'
                  : 'border-gray-300'}
              `}>
                {selections[currentPosition.id] === candidate.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-[#212121] font-medium">{candidate.name}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selections[currentPosition.id]}
        className="w-full mt-6 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentIndex < totalPositions - 1 ? 'Next →' : 'Review Vote'}
      </button>
    </div>
  );
}
