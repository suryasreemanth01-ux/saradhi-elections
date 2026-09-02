"use client";

import { useState } from 'react';
import { CheckEligibility } from '@/components/voting/CheckEligibility';
import { VotingScreen } from '@/components/voting/VotingScreen';
import { ReviewScreen } from '@/components/voting/ReviewScreen';
import { VoteConfirmation } from '@/components/voting/VoteConfirmation';

export default function Home() {
  const [step, setStep] = useState<'eligibility' | 'voting' | 'review' | 'confirmation'>('eligibility');
  const [mobileNumber, setMobileNumber] = useState('');
  const [voterName, setVoterName] = useState('');
  const [electionId, setElectionId] = useState<number | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Record<number, number>>({});

  const handleEligibilitySuccess = (data: any) => {
    setMobileNumber(data.mobile_number);
    setVoterName(data.voter_name);
    setElectionId(data.election_id);
    setStep('voting');
  };

  const handleVotingComplete = (selections: Record<number, number>) => {
    setSelectedCandidates(selections);
    setStep('review');
  };

  const handleVoteSubmit = () => {
    setStep('confirmation');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">SARADHI ELECTIONS 2026</h1>
          <p className="text-gray-600 mt-2">Colony Election Voting System</p>
        </div>

        {step === 'eligibility' && (
          <CheckEligibility onSuccess={handleEligibilitySuccess} />
        )}

        {step === 'voting' && electionId && (
          <VotingScreen
            electionId={electionId}
            onComplete={handleVotingComplete}
          />
        )}

        {step === 'review' && (
          <ReviewScreen
            selections={selectedCandidates}
            electionId={electionId!}
            mobileNumber={mobileNumber}
            onBack={() => setStep('voting')}
            onSubmit={handleVoteSubmit}
          />
        )}

        {step === 'confirmation' && (
          <VoteConfirmation />
        )}
      </div>
    </main>
  );
}
