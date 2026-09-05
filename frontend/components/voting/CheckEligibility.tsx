"use client";

import { useState } from 'react';

interface CheckEligibilityProps {
  onSuccess: (data: any) => void;
}

export function CheckEligibility({ onSuccess }: CheckEligibilityProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  const handleCheck = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/voter/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: mobileNumber })
      });

      const data = await response.json();

      if (data.eligible) {
        onSuccess({
          mobile_number: mobileNumber,
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
        <h2 className="text-xl font-semibold text-white">Welcome!</h2>
        <p className="text-white/60 text-sm mt-1">Enter your mobile number to check eligibility</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/70 block mb-1.5">Mobile Number</label>
          <div className="flex">
            <span className="flex items-center px-3 bg-white/10 border border-r-0 border-white/20 rounded-l-xl text-white/60 text-sm">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-white/10 border border-white/20 rounded-r-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="9876543210"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-100 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'CHECK ELIGIBILITY'}
        </button>
      </div>
    </div>
  );
}
