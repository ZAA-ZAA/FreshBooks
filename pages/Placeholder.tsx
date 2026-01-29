// @ts-nocheck
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft, Lock } from 'lucide-react';

export default function Placeholder() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract page title from path (e.g. "/time-tracking" -> "Time Tracking")
  const title = location.pathname.split('/')[1].replace('-', ' ');

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm max-w-lg">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-fb-blue">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-fb-slate capitalize mb-2">{title}</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This feature is available in the <strong>Premium Plan</strong>.<br/>
          Upgrade now to unlock {title}, advanced reporting, and more.
        </p>
        <div className="flex gap-4 justify-center">
            <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 border border-gray-300 rounded font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
                Return Home
            </button>
            <button 
                onClick={() => navigate('/settings')}
                className="px-6 py-2.5 bg-fb-blue text-white rounded font-bold hover:bg-fb-darkBlue transition-colors shadow-sm"
            >
                Upgrade Plan
            </button>
        </div>
      </div>
    </div>
  );
}