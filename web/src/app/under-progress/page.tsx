export default function UnderProgressPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#00d4ff] bg-[#00d4ff]/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            className="text-[#00d4ff]"
          >
            <path
              fill="currentColor"
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-wider text-white mb-3">
          Under <span className="text-[#00d4ff]">Construction</span>
        </h1>
        <p className="text-white/50 font-mono text-sm mb-8">
          X (Twitter) sign-in is coming soon. Use Google or GitHub for now.
        </p>
        <a
          href="/login"
          className="inline-block bg-white/10 text-white px-6 py-3 font-bold uppercase tracking-wider border-2 border-white/20 hover:border-[#c8ff00] hover:text-[#c8ff00] transition-all"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
