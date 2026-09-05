"use client";

import { useState } from 'react';

interface CheckEligibilityProps {
  onSuccess: (data: any) => void;
}

export function CheckEligibility({ onSuccess }: CheckEligibilityProps) {
  const [voterId, setVoterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleCheck = async () => {
    if (!voterId || voterId.length < 10) {
      setError('Please enter a valid Voter ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/voter/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: voterId })
      });

      const data = await response.json();

      if (data.eligible) {
        onSuccess({
          mobile_number: voterId,
          voter_name: data.voter_name,
          election_id: data.election_id
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-[#212121]">Check Your Eligibility</h2>
        <p className="text-gray-500 text-sm mt-1">Enter your Voter ID to begin</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#212121] block mb-1.5">
            Enter Your Voter ID
          </label>
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="input-glass"
            placeholder="Enter your Voter ID"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full py-3 rounded-xl btn-primary text-white font-semibold shadow-lg disabled:opacity-50"
        >
          {loading ? 'Checking...' : '✅ Check Eligibility'}
        </button>
      </div>
    </div>
  );
}
