"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VoteConfirmation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto card-premium border-0 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-premium" />
      <CardHeader className="pt-8">
        <CardTitle className="text-3xl text-center text-premium">Vote Submitted!</CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className={`
          flex justify-center mb-6 transition-all duration-700
          ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
        `}>
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <CheckCircle className="h-24 w-24 text-green-500 animate-checkmark relative" />
          </div>
        </div>

        <div className={`
          transition-all duration-700 delay-200
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
          <p className="text-2xl font-bold text-green-700 mb-2">
            YOUR VOTE HAS BEEN RECORDED
          </p>
          <p className="text-xl font-semibold text-green-600 mb-4">
            SUCCESSFULLY ✅
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <PartyPopper className="h-5 w-5 text-yellow-500" />
            <p>Thank you for participating!</p>
          </div>
        </div>

        <div className={`
          mt-6 p-4 bg-blue-50 rounded-xl transition-all duration-700 delay-400
          ${show ? 'opacity-100' : 'opacity-0'}
        `}>
          <p className="text-sm text-blue-700">
            Your vote has been securely recorded and cannot be changed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
