"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckEligibilityProps {
  onSuccess: (data: any) => void;
}

export function CheckEligibility({ onSuccess }: CheckEligibilityProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/voter/check-eligibility', {
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome!</CardTitle>
        <CardDescription className="text-center">
          Enter your registered mobile number to check eligibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md text-gray-600">
                +91
              </span>
              <Input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                className="rounded-l-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheck}
            disabled={loading}
            className="w-full text-lg py-6"
          >
            {loading ? 'Checking...' : 'CHECK ELIGIBILITY'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
