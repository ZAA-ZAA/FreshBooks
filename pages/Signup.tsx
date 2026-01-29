// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { AuthStep } from '../types';
import { Loader2, Check, ChevronDown, Globe, ShieldCheck, HelpCircle, LogOut, Mail, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SignupProps {
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  onComplete: () => void;
}

export default function Signup({ authStep, setAuthStep, onComplete }: SignupProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: 'John',
    lastName: 'Doe',
    location: 'Philippines',
    phone: '',
    hearAbout: '',
    companyName: '',
    industry: 'Development & Programming',
    revenue: '0',
    billingTool: '',
    customizedOffering: ''
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (authStep === AuthStep.SURVEY_BUSINESS) {
        onComplete();
      } else {
        setAuthStep(authStep + 1);
      }
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const resetSignup = () => {
      setAuthStep(AuthStep.LOGIN_START);
      setOtp(['', '', '', '', '', '']);
  };

  // --- RENDER STAGE 1: INITIAL SIGNUP CARD ---
  if (authStep === AuthStep.LOGIN_START) {
    return (
      <div className="min-h-screen bg-[#002a63] flex flex-col items-center justify-center relative overflow-hidden font-display px-4">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-2xl z-10 p-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-fb-blue p-2 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-white font-black text-2xl leading-none">f</div>
              </div>
              <span className="text-3xl font-black text-fb-navy tracking-tight">FreshBooks</span>
            </div>
            <h1 className="text-2xl font-bold text-fb-navy mb-2">Try FreshBooks Free</h1>
            <p className="text-sm text-gray-400 font-medium">No credit card required. Cancel anytime.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none transition-all placeholder:text-gray-300 font-bold text-fb-navy"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Create Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none transition-all placeholder:text-gray-300 font-bold text-fb-navy"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-fb-blue hover:text-fb-darkBlue uppercase tracking-widest">Show</button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-2">
              <input type="checkbox" className="mt-1 rounded-md text-fb-green focus:ring-fb-green border-gray-300 w-5 h-5 cursor-pointer" id="terms" />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-normal cursor-pointer font-medium">
                I confirm that I have read and agree to FreshBooks <a href="#" className="text-fb-blue hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-fb-blue hover:underline font-bold">Privacy Policy</a>.
              </label>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.email || !formData.password}
              className="w-full bg-fb-green hover:brightness-110 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-xl shadow-fb-green/20 transition-all active:scale-[0.98] text-xl"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Get Started'}
            </button>
          </div>

          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-xl font-black text-fb-navy hover:bg-gray-50 transition-all shadow-sm">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </button>
          </div>

          <div className="mt-10 text-center border-t border-gray-50 pt-8">
            <span className="text-sm text-gray-400 font-bold">Already have an account? </span>
            <Link to="/login" className="text-sm font-black text-fb-blue hover:underline">Log In</Link>
          </div>
        </div>

        <div className="mt-8 text-white flex flex-col items-center gap-4 text-xs font-bold opacity-80">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-100">
            <Globe size={14} /> English | Español
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 hover:underline"><ShieldCheck size={14} /> Security Safeguards</a>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER STAGE 2: OTP / VERIFICATION ---
  if (authStep === AuthStep.OTP) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center font-display px-4">
        <div className="w-full max-w-[540px] bg-white rounded-[32px] border border-gray-100 shadow-2xl p-16 text-center animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-fb-blue"></div>
          
          <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-10 text-fb-blue shadow-inner">
            <Mail size={40} strokeWidth={2.5} />
          </div>
          
          <h1 className="text-4xl font-black text-fb-navy mb-4 tracking-tight">Verify Identity</h1>
          <p className="text-gray-500 mb-2 font-medium leading-relaxed">
            We've dispatched a 6-digit access code to:
          </p>
          <div className="bg-fb-gray px-6 py-3 rounded-xl inline-block mb-8 border border-gray-100">
            <span className="font-black text-fb-navy text-xl">{formData.email}</span>
          </div>
          
          <div className="mb-10">
            <button 
              onClick={resetSignup}
              className="text-fb-blue font-black text-sm hover:underline flex items-center justify-center gap-2 mx-auto bg-blue-50 px-6 py-3 rounded-full transition-all active:scale-95 shadow-sm border border-blue-100"
            >
              <ArrowLeft size={16} /> Not your email? Change it
            </button>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                autoComplete="off"
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-14 h-16 text-center text-3xl font-black text-fb-navy border-2 border-gray-100 rounded-2xl focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          <div className="space-y-6">
            <button
              onClick={handleNext}
              disabled={otp.some(d => !d)}
              className="w-full bg-fb-blue hover:brightness-110 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-2xl shadow-fb-blue/20 transition-all text-xl active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Finalize Verification'}
            </button>
            
            <p className="text-sm text-gray-400 font-bold">
              Didn't receive the code? <button className="text-fb-blue hover:underline">Resend Transmission</button>
            </p>
          </div>
        </div>

        <button 
            onClick={() => navigate('/login')}
            className="mt-12 text-gray-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-fb-navy transition-all flex items-center gap-2"
        >
            <RefreshCcw size={12} /> Restart Enrollment Process
        </button>
      </div>
    );
  }

  // --- ONBOARDING SPLIT SCREEN (SURVEY) ---
  return (
    <div className="min-h-screen bg-white flex font-display overflow-hidden">
      <div className="w-full lg:w-[60%] p-8 md:p-20 flex flex-col items-center overflow-y-auto custom-scroll">
        <div className="max-w-[540px] w-full">
          <div className="flex items-center mb-20">
            <div className="bg-fb-blue p-2 rounded-lg shadow-sm">
              <div className="w-6 h-6 flex items-center justify-center text-white font-black text-xl leading-none">f</div>
            </div>
            <span className="text-2xl font-black text-fb-navy tracking-tight ml-3">FreshBooks</span>
          </div>

          {authStep === AuthStep.SURVEY_PROFILE && (
            <div className="animate-in fade-in slide-in-from-left-6 duration-500">
              <h1 className="text-5xl font-black text-fb-navy leading-tight mb-4 tracking-tighter">Welcome aboard!</h1>
              <h2 className="text-3xl font-bold text-gray-400 leading-tight mb-16">Let's initialize your profile.</h2>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">First Identity</label>
                  <input
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 outline-none transition-all font-bold text-fb-navy shadow-sm"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">Last Identity</label>
                  <input
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 outline-none transition-all font-bold text-fb-navy shadow-sm"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">Jurisdiction</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 outline-none transition-all font-bold text-fb-navy shadow-sm"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="mb-12">
                <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">Lead Attribution</label>
                <div className="relative">
                  <select
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 pr-12 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 outline-none bg-white appearance-none transition-all font-bold text-fb-navy shadow-sm cursor-pointer"
                    value={formData.hearAbout}
                    onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                  >
                    <option value="">Select Channel</option>
                    <option value="Social">Social Media</option>
                    <option value="Search">Search Engine</option>
                    <option value="Word">Referral / Word of Mouth</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-fb-blue pointer-events-none" size={24} />
                </div>
              </div>

              <div className="flex justify-end border-t border-gray-50 pt-12">
                <button
                  onClick={handleNext}
                  className="bg-fb-green hover:brightness-110 text-white font-black py-4 px-14 rounded-2xl shadow-xl shadow-fb-green/20 transition-all flex items-center min-w-[180px] justify-center text-xl active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Continue'}
                </button>
              </div>
            </div>
          )}

          {authStep === AuthStep.SURVEY_BUSINESS && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500">
              <h1 className="text-5xl font-black text-fb-navy leading-tight mb-4 tracking-tighter">Business Logic</h1>
              <h2 className="text-3xl font-bold text-gray-400 leading-tight mb-16">Tailoring your ecosystem.</h2>

              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">Legal Entity Name</label>
                  <input
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none font-black text-fb-navy text-2xl shadow-sm"
                    placeholder="e.g. Acme Corp Int."
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-3 uppercase tracking-[0.3em] ml-1">Operational Industry</label>
                  <div className="relative">
                    <select
                      className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 pr-12 focus:border-fb-blue focus:ring-4 focus:ring-fb-blue/5 focus:border-fb-blue outline-none bg-white appearance-none transition-all font-bold text-fb-navy shadow-sm cursor-pointer"
                      value={formData.industry}
                      onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    >
                      <option>Development & Engineering</option>
                      <option>Creative Services</option>
                      <option>Management Consulting</option>
                      <option>Legal & Professional</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-fb-blue pointer-events-none" size={24} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 mb-5 uppercase tracking-[0.3em] ml-1">Catalog Specialization</label>
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => setFormData({ ...formData, customizedOffering: 'same' })}
                      className={`py-5 rounded-2xl font-black border-2 transition-all shadow-sm ${formData.customizedOffering === 'same' ? 'border-fb-blue text-fb-blue bg-blue-50 ring-4 ring-fb-blue/5 scale-105' : 'border-gray-100 text-gray-400 hover:border-fb-blue/20'}`}
                    >
                      Standard Services
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, customizedOffering: 'different' })}
                      className={`py-5 rounded-2xl font-black border-2 transition-all shadow-sm ${formData.customizedOffering === 'different' ? 'border-fb-blue text-fb-blue bg-blue-50 ring-4 ring-fb-blue/5 scale-105' : 'border-gray-100 text-gray-400 hover:border-fb-blue/20'}`}
                    >
                      Bespoke Projects
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-16 border-t border-gray-50 pt-12">
                <button onClick={() => setAuthStep(AuthStep.SURVEY_PROFILE)} className="text-fb-navy font-black hover:underline flex items-center gap-2 uppercase tracking-widest text-[10px]">
                  <ArrowLeft size={16} className="text-fb-blue" /> Return
                </button>
                <button
                  onClick={handleNext}
                  className="bg-fb-green hover:brightness-110 text-white font-black py-4 px-16 rounded-2xl shadow-xl shadow-fb-green/20 transition-all flex items-center text-xl active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Initialize Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-[40%] bg-fb-navy relative overflow-hidden flex-col justify-center px-20">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 space-y-20">
            <div className="flex items-start group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black mr-8 transition-all duration-500 border-2 ${authStep === AuthStep.SURVEY_PROFILE ? 'bg-white text-fb-navy border-white shadow-2xl scale-110' : 'bg-transparent text-white/40 border-white/20'}`}>
                    {authStep === AuthStep.SURVEY_BUSINESS ? <Check size={24} /> : '1'}
                </div>
                <div>
                    <h4 className={`text-2xl font-black transition-all ${authStep === AuthStep.SURVEY_PROFILE ? 'text-white' : 'text-white/40'}`}>Identity Core</h4>
                    <p className={`mt-2 font-bold max-w-xs ${authStep === AuthStep.SURVEY_PROFILE ? 'text-blue-200' : 'text-white/10'}`}>Personalize your secure administrative profile.</p>
                </div>
            </div>

            <div className="flex items-start group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black mr-8 transition-all duration-500 border-2 ${authStep === AuthStep.SURVEY_BUSINESS ? 'bg-white text-fb-navy border-white shadow-2xl scale-110' : 'bg-transparent text-white/40 border-white/20'}`}>
                    2
                </div>
                <div>
                    <h4 className={`text-2xl font-black transition-all ${authStep === AuthStep.SURVEY_BUSINESS ? 'text-white' : 'text-white/40'}`}>Business DNA</h4>
                    <p className={`mt-2 font-bold max-w-xs ${authStep === AuthStep.SURVEY_BUSINESS ? 'text-blue-200' : 'text-white/10'}`}>Configure the ledger for your specific industry.</p>
                </div>
            </div>
        </div>

        <div className="absolute bottom-16 right-16 flex gap-10 text-white/50 font-black text-[10px] uppercase tracking-[0.2em]">
          <button className="hover:text-white transition-colors flex items-center gap-2"><HelpCircle size={16} /> Knowledge Base</button>
          <button onClick={resetSignup} className="hover:text-white transition-colors flex items-center gap-2"><LogOut size={16} /> Cancel Session</button>
        </div>
      </div>
    </div>
  );
}