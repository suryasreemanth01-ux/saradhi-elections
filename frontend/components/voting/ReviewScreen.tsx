"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://saradhi-elections-backend.onrender.com/api';

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
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-8 text-center">
          <div className="text-gray-600">Loading review...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">REVIEW YOUR VOTE</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => {
            const selectedCandidateId = selections[position.id];
            const selectedCandidate = position.candidates.find((c: any) => c.id === selectedCandidateId);
            return (
              <div key={position.id} className="border-b pb-3">
                <div className="text-sm font-medium text-gray-500">{position.name}</div>
                <div className="text-lg font-semibold text-gray-900">{selectedCandidate?.name || 'Not selected'}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ Please carefully review your selections. Once your vote is submitted, it cannot be changed.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={onBack} variant="outline" className="flex-1" disabled={submitting}>
            BACK
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={submitting}>
            {submitting ? 'SUBMITTING...' : 'SUBMIT FINAL VOTE'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
