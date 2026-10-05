import React from 'react';
import { useTranslation } from '../../i18n';

export const Footer: React.FC = () => {
  const { language } = useTranslation();
  const isHi = language === 'hi';

  return (
    <footer className="liquid-glass border-t border-white/10 text-[#A7ADA8] text-xs py-6 px-4 backdrop-blur-2xl relative z-10 bg-[#101313]/90">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-bold text-[#F5F5F2] text-sm flex items-center justify-center md:justify-start space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300]" />
            <span>
              {isHi 
                ? 'राष्ट्रीय भूमि शासन, नीति नवाचार एवं साक्ष्य-आधारित अनुसंधान मंच (NDP-LG)'
                : 'National Digital Platform for Research, Policy Innovation & Land Governance (NDP-LG)'}
            </span>
          </p>
          <p className="text-[11px] text-[#A7ADA8] mt-1">
            {isHi 
              ? 'भूमि संसाधन विभाग (DoLR), ग्रामीण विकास मंत्रालय, भारत सरकार। आधिकारिक एसआईएच 2026 समस्या विवरण: 26019, 26018, 26016, 25017, 26015।'
              : 'Department of Land Resources (DoLR), Ministry of Rural Development, Government of India. Official SIH 2026 Problem Statements: 26019, 26018, 26016, 25017, 26015.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          <span className="hover:text-[#B7E300] transition cursor-pointer">{isHi ? 'उपयोग की शर्तें' : 'Terms of Use'}</span>
          <span className="text-white/20">•</span>
          <span className="hover:text-[#B7E300] transition cursor-pointer">{isHi ? 'गोपनीयता एवं डेटा नीति' : 'Privacy & Data Policy'}</span>
          <span className="text-white/20">•</span>
          <span className="hover:text-[#B7E300] transition cursor-pointer">{isHi ? 'डीआईएलआरएमपी दिशानिर्देश' : 'DILRMP Guidelines'}</span>
          <span className="text-white/20">•</span>
          <span className="hover:text-[#B7E300] transition cursor-pointer">{isHi ? 'इसरो भुवन आभार' : 'Bhuvan / ISRO Acknowledgement'}</span>
          <span className="text-white/20">•</span>
          <span className="hover:text-[#B7E300] transition cursor-pointer">{isHi ? 'सहायता केंद्र' : 'Helpdesk'}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-white/10 text-[10px] text-[#6F7772] flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <p>{isHi ? 'भारत सरकार की वेबसाइट दिशानिर्देशों (GIGW 3.0) के अनुरूप संरचित।' : 'Design & Architecture aligned with Government of India Web Guidelines (GIGW 3.0).'}</p>
        <p className="text-[#B7E300] font-mono font-medium">{isHi ? 'राष्ट्रीय क्लाउड अवसंरचना पर होस्टेड • स्मार्ट इंडिया हैकाथॉन 2026 हेतु सत्यापित' : 'Hosted on National Cloud Infrastructure • Verified for Smart India Hackathon 2026'}</p>
      </div>
    </footer>
  );
};
