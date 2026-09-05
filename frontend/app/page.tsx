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

  const steps = [
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'voting', label: 'Vote' },
    { id: 'review', label: 'Review' },
    { id: 'confirmation', label: 'Confirm' }
  ];

  const currentIndex = steps.findIndex(s => s.id === step);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-card p-6 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl">🗳️</span>
            <h1 className="text-2xl font-bold text-[#0D47A1]">SARADHI ELECTION SYSTEM</h1>
          </div>
          <p className="text-gray-500 text-sm">Secure Digital Voting Platform</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`
                step-circle
                ${index < currentIndex ? 'step-completed' :
                  index === currentIndex ? 'step-active' :
                  'step-inactive'}
              `}>
                {index < currentIndex ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  step-line
                  ${index < currentIndex ? 'step-line-completed' : ''}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div>
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

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-400 text-xs">
            © 2026 Saradhi Election System • Secure • Transparent • Reliable
          </p>
        </div>
      </div>
    </div>
  );
}
