import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-200">
            National Digital Platform for Research, Policy Innovation & Land Governance (NDP-LG)
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
            Official SIH 2026 Problem Statements: 26019, 26018, 26016, 25017, 26015.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="hover:text-slate-200 cursor-pointer">Terms of Use</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Privacy & Data Sharing Policy</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">DILRMP Guidelines</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Bhuvan / ISRO Acknowledgement</span>
          <span>•</span>
          <span className="hover:text-slate-200 cursor-pointer">Helpdesk</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>Design & Architecture aligned with Government of India Web Guidelines (GIGW 3.0).</p>
        <p>Hosted on National Cloud Infrastructure • Updated for Smart India Hackathon 2026</p>
      </div>
    </footer>
  );
};
