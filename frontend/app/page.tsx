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

  const steps = ['Eligibility', 'President', 'Vice President', 'Secretary', 'Treasurer', 'Review'];
  const currentIndex = ['eligibility', 'voting', 'review', 'confirmation'].indexOf(step);

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
    <div className="election-container">
      {/* Header */}
      <div className="election-header">
        <h1>SARADHI ELECTIONS 2026</h1>
        <p>Colony Election Voting System</p>
      </div>

      {/* Progress Steps - only show after eligibility */}
      {step !== 'eligibility' && (
        <div className="progress-steps">
          {steps.map((label, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            return (
              <div key={index} className="step-item">
                <div className={`
                  step-circle
                  ${isActive ? 'step-active' : isCompleted ? 'step-completed' : 'step-inactive'}
                `}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className="step-label">{label}</span>
                {index < steps.length - 1 && (
                  <div className={`step-line ${isCompleted ? 'step-line-completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="election-card">
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
    </div>
  );
}
