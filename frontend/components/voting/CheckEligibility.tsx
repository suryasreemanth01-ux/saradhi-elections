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
      setError('Please enter your mobile number.');
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
        setError('This mobile number is not eligible to vote.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-[#1F2937] mb-2">Welcome!</h2>
      <p className="text-center text-[#6B7280] text-sm mb-6">
        Enter your registered mobile number to check eligibility
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1F2937] mb-1.5">
            Mobile Number
          </label>
          <div className="input-group">
            <span className="input-prefix">+91</span>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              className="input-field"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Checking...' : 'CHECK ELIGIBILITY'}
        </button>
      </div>
    </div>
  );
}
