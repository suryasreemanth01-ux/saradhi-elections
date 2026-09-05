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

  const steps = ['Eligibility', 'Vote', 'Review', 'Confirm'];
  const currentStepIndex = ['eligibility', 'voting', 'review', 'confirmation'].indexOf(step);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-card rounded-2xl p-6 md:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">SARADHI ELECTIONS 2026</h1>
          <p className="text-white/60 text-sm mt-1">Secure • Transparent • Democratic</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                ${index < currentStepIndex ? 'bg-green-500 text-white' :
                  index === currentStepIndex ? 'bg-white text-purple-600' :
                  'bg-white/20 text-white/40'}
              `}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <span className={`
                text-xs ml-1 hidden sm:block
                ${index <= currentStepIndex ? 'text-white' : 'text-white/40'}
              `}>
                {label}
              </span>
              {index < 3 && (
                <div className={`
                  w-6 h-0.5 mx-1
                  ${index < currentStepIndex ? 'bg-green-500' : 'bg-white/20'}
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
        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-white/30 text-xs">© 2026 Saradhi Elections. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
