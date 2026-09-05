"use client";

export function VoteConfirmation() {
  return (
    <div className="text-center py-6">
      <div className="checkmark-circle">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#212121] mb-2">YOUR VOTE HAS BEEN RECORDED</h2>
      <p className="text-gray-600 mb-4">Thank You For Participating In The Election.</p>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-sm mx-auto">
        <p className="text-sm text-blue-700">
          Your vote has been securely submitted and cannot be modified.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-8 py-3 rounded-xl btn-primary text-white font-semibold"
      >
        Exit
      </button>
    </div>
  );
}
