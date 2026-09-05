"use client";

import { useState } from 'react';
import { CheckEligibility } from '@/components/voting/CheckEligibility';
import { VotingScreen } from '@/components/voting/VotingScreen';
import { ReviewScreen } from '@/components/voting/ReviewScreen';
import { VoteConfirmation } from '@/components/voting/VoteConfirmation';
import { VoteIcon, Shield, Users } from 'lucide-react';

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
    <main className="min-h-screen bg-premium-light relative overflow-hidden">
      {/* Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="bg-premium py-6 shadow-lg">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <VoteIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    SARADHI ELECTIONS 2026
                  </h1>
                  <p className="text-white/80 text-sm">Secure • Transparent • Democratic</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="container mx-auto px-4 max-w-4xl mt-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {['Eligibility', 'Vote', 'Review', 'Confirm'].map((label, index) => {
              const stepIndex = ['eligibility', 'voting', 'review', 'confirmation'].indexOf(step);
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;
              return (
                <div key={index} className="flex items-center">
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive ? 'bg-premium text-white shadow-lg' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-500'}
                  `}>
                    <span className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${isActive ? 'bg-white/20' :
                        isCompleted ? 'bg-white/20' :
                        'bg-gray-300'}
                    `}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    {label}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 ${index < stepIndex ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl pb-12">
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="border-t border-gray-200 pt-4 pb-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2026 Saradhi Elections. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
