"use client";

export function VoteConfirmation() {
  return (
    <div className="text-center py-4">
      <div className="success-icon">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#1F2937] mb-2">YOUR VOTE HAS BEEN RECORDED</h2>
      <p className="text-[#6B7280] mb-4">
        Thank you for participating in Saradhi Elections 2026.
      </p>

      <div className="p-4 bg-green-50 border border-green-200 rounded-xl max-w-sm mx-auto mb-6">
        <p className="text-sm text-green-700 font-medium">Election Status</p>
        <p className="text-sm text-green-600">✓ Vote Recorded</p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        EXIT
      </button>
    </div>
  );
}
