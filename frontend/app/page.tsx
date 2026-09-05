"use client";

import { useState } from 'react';
import { CheckEligibility } from '@/components/voting/CheckEligibility';
import { VotingScreen } from '@/components/voting/VotingScreen';
import { ReviewScreen } from '@/components/voting/ReviewScreen';
import { VoteConfirmation } from '@/components/voting/VoteConfirmation';
import { VoteIcon, Shield } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Background decorative elements - simpler approach */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 15}s`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="container mx-auto px-4 max-w-4xl py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
                  <VoteIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-lg">
                    SARADHI ELECTIONS 2026
                  </h1>
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <span>Secure</span>
                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                    <span>Transparent</span>
                    <span className="w-1 h-1 bg-white/40 rounded-full" />
                    <span>Democratic</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <Shield className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="container mx-auto px-4 max-w-4xl mt-8">
          <div className="flex items-center justify-center gap-1 md:gap-3">
            {['Eligibility', 'Vote', 'Review', 'Confirm'].map((label, index) => {
              const stepIndex = ['eligibility', 'voting', 'review', 'confirmation'].indexOf(step);
              const isActive = index === stepIndex;
              const isCompleted = index < stepIndex;
              return (
                <div key={index} className="flex items-center">
                  <div className={`
                    flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 backdrop-blur-sm
                    ${isActive ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/30 scale-105' :
                      isCompleted ? 'bg-green-500/30 text-white border border-green-400/30' :
                      'bg-white/10 text-white/60 border border-white/10'}
                  `}>
                    <span className={`
                      w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isActive ? 'bg-indigo-600 text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-white/20 text-white/60'}
                    `}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {index < 3 && (
                    <div className={`
                      w-6 md:w-12 h-0.5 mx-0.5 md:mx-1 transition-all duration-500
                      ${index < stepIndex ? 'bg-green-400' : 'bg-white/20'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-4xl pb-12 mt-8">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-6 md:p-8 shadow-2xl shadow-indigo-500/20">
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

        {/* Footer */}
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="border-t border-white/10 pt-4 pb-6 text-center">
            <p className="text-white/50 text-sm">
              © 2026 Saradhi Elections. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-80px) rotate(180deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}
