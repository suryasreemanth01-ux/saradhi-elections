"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function VoteConfirmation() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Vote Submitted!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-xl font-semibold text-green-700">
            YOUR VOTE HAS BEEN RECORDED SUCCESSFULLY
          </p>
          <p className="text-gray-500 mt-4">
            Thank you for participating in the Saradhi Elections 2026!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
