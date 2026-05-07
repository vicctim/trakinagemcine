export default function Loading() {
  return (
    <div className="page-loading" aria-hidden="true">
      <div className="page-loading__bar" />
      <style>{`
        .page-loading {
          position: fixed;
          inset: 0;
          z-index: 9990;
          pointer-events: none;
        }

        .page-loading__bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 2px;
          width: 40%;
          background: var(--color-accent, #c8a96e);
          animation: page-loading-bar 1.2s ease-in-out infinite;
        }

        @keyframes page-loading-bar {
          0%   { left: -40%; width: 40%; }
          60%  { left: 100%; width: 40%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
    </div>
  )
}
