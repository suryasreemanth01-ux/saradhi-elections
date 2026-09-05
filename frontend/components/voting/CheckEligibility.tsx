"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Welcome!</h2>
        <p className="text-white/70 text-sm mt-1">
          Enter your registered mobile number to check eligibility
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-white/80 block mb-1.5">
            Mobile Number
          </label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-xl text-white/70 text-sm">
              +91
            </span>
            <Input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              className="rounded-r-xl bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30"
              placeholder="9876543210"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl text-red-100 text-sm">
            {error}
          </div>
        )}

        <Button
          onClick={handleCheck}
          disabled={loading}
          className="w-full text-lg py-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02]"
        >
          {loading ? 'Checking...' : 'CHECK ELIGIBILITY'}
        </Button>
      </div>
    </div>
  );
}
