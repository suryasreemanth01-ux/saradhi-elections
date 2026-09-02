"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

  useEffect(() => {
    fetchPositions();
  }, [electionId]);

  const fetchPositions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/election/positions/${electionId}`);
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
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8 text-center">
          <div className="text-gray-600">Loading election...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8 text-center">
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  const currentPosition = positions[currentIndex];
  const totalPositions = positions.length;
  const progress = ((currentIndex) / totalPositions) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {totalPositions}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <CardTitle className="text-2xl mt-4">{currentPosition.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selections[currentPosition.id]?.toString()}
          onValueChange={(value) => handleSelect(parseInt(value))}
          className="space-y-3"
        >
          {currentPosition.candidates.map((candidate: any) => (
            <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={candidate.id.toString()} id={`candidate-${candidate.id}`} />
              <Label htmlFor={`candidate-${candidate.id}`} className="flex-1 cursor-pointer text-lg">
                {candidate.name}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleNext}
          disabled={!selections[currentPosition.id]}
          className="w-full mt-6 text-lg py-6"
        >
          {currentIndex < totalPositions - 1 ? 'NEXT' : 'REVIEW VOTE'}
        </Button>
      </CardContent>
    </Card>
  );
}
