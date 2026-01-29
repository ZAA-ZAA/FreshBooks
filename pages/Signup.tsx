// @ts-nocheck
import React, { useState } from 'react';
import { AuthStep } from '../types';
import { Loader2, Check, ChevronDown, HelpCircle, LogOut, ArrowLeft, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface SignupProps {
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  onComplete: () => void;
}

const CustomSelect = ({ label, value, onChange, options, placeholder = "Choose an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <label className="block text-sm font-bold text-[#2d3a4b] mb-2">{label}</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full border rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer transition-all ${isOpen ? 'border-[#0075dd] ring-2 ring-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
                <span className={`text-sm ${value ? 'text-[#2d3a4b] font-medium' : 'text-gray-400'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {options.map((opt) => (
                        <div 
                            key={opt}
                            onClick={() => { onChange(opt); setIsOpen(false); }}
                            className="px-4 py-2.5 hover:bg-blue-50 text-sm text-[#2d3a4b] font-medium cursor-pointer transition-colors"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Signup({ authStep, setAuthStep, onComplete }: SignupProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreedToTerms: false,
    firstName: '',
    lastName: '',
    location: '',
    phone: '',
    hearAbout: '',
    companyName: '',
    businessDo: '',
    describeBusiness: '',
    revenueCurrency: 'PHP — Philippine Peso',
    revenueAmount: '',
    serviceDuration: '',
    billingTool: '',
    customization: '' 
  });

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

  const handleBack = () => {
      if (authStep === AuthStep.SIGNUP_START) {
          navigate('/');
      } else {
          setAuthStep(authStep - 1);
      }
  };

  // Step 0: Try FreshBooks Free (Initial Screen)
  if (authStep === AuthStep.SIGNUP_START) {
    return (
      <div className="min-h-screen bg-[#002a63] flex flex-col items-center justify-center relative overflow-hidden font-sans px-4">
        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors group z-50"
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        {/* Background Decorative Curves */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-600/20 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        {/* Signup Card */}
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-2xl z-10 p-12 animate-in fade-in zoom-in-95 duration-500 text-center">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-10">
               <div className="bg-[#0075dd] p-2 rounded-lg">
                  <div className="w-6 h-6 flex items-center justify-center text-white font-black text-2xl leading-none">f</div>
               </div>
               <span className="text-3xl font-black text-[#002a63] tracking-tight">FreshBooks</span>
            </div>
            <h1 className="text-2xl font-bold text-[#002a63] mb-2">Try FreshBooks Free</h1>
            <p className="text-gray-500 text-sm font-medium">No credit card required. Cancel anytime.</p>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#0075dd] outline-none transition-all placeholder:text-gray-400 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#0075dd] outline-none transition-all placeholder:text-gray-400 font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0075dd] hover:underline uppercase tracking-wider"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded border-gray-300 text-fb-blue focus:ring-fb-blue"
                checked={formData.agreedToTerms}
                onChange={e => setFormData({...formData, agreedToTerms: e.target.checked})}
              />
              <label htmlFor="terms" className="text-[11px] text-gray-500 leading-normal">
                I confirm that I have read and agree to FreshBooks <a href="#" className="text-fb-blue hover:underline">Terms of Service</a> and <a href="#" className="text-fb-blue hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-[#00a651] hover:bg-[#008541] text-white font-black py-4 rounded-lg shadow-lg transition-all active:scale-[0.98] text-lg mt-2"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Get Started'}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-lg font-bold text-[#002a63] hover:bg-gray-50 transition-all shadow-sm">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-300 rounded-lg font-bold text-[#002a63] hover:bg-gray-50 transition-all shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
              Sign up with Apple
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <span className="text-gray-400 text-sm font-medium">Already have an account? </span>
            <Link to="/login" className="text-sm font-bold text-[#0075dd] hover:underline">Log In</Link>
          </div>
        </div>

        {/* Card Footer */}
        <div className="mt-12 text-white/50 flex flex-col items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
             <Globe size={14} /> English | Español
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="flex items-center gap-1 hover:text-white transition-colors"><ShieldCheck size={14} /> Security Safeguards</a>
          </div>
        </div>
      </div>
    );
  }

  // Steps 1 & 2: Survey Onboarding (Split-Screen Design)
  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden animate-in fade-in duration-500">
      {/* Back to Home Button - Floating fixed */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 text-gray-400 hover:text-fb-blue transition-colors group"
      >
        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-fb-blue group-hover:bg-blue-50 transition-all">
          <ArrowLeft size={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
      </button>

      {/* Left Form Content */}
      <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-8 md:p-20 overflow-y-auto custom-scroll">
        <div className="max-w-[540px] w-full">
          <div className="flex items-center mb-12">
            <div className="bg-[#0075dd] p-2 rounded-lg shadow-sm">
              <div className="w-6 h-6 flex items-center justify-center text-white font-black text-xl leading-none">f</div>
            </div>
            <span className="text-2xl font-black text-[#002a63] tracking-tight ml-3">FreshBooks</span>
          </div>

          {authStep === AuthStep.SURVEY_PROFILE && (
            <div className="animate-in fade-in slide-in-from-left-6 duration-500">
              <h1 className="text-4xl font-bold text-[#002a63] leading-tight mb-2">Welcome!</h1>
              <h2 className="text-4xl font-bold text-[#002a63] leading-tight mb-12">Let's Get You Set Up</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-[#2d3a4b] mb-2">First name*</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                    value={formData.firstName}
                    placeholder="e.g. John"
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2d3a4b] mb-2">Last name*</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                    value={formData.lastName}
                    placeholder="e.g. Doe"
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[#2d3a4b] mb-2">Where are you located?*</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                  value={formData.location}
                  placeholder="e.g. Philippines"
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-[#2d3a4b] mb-2">Phone Number*</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                  value={formData.phone}
                  placeholder="e.g. 0912"
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="mb-10">
                <CustomSelect 
                    label="How did you hear about us?"
                    value={formData.hearAbout}
                    onChange={val => setFormData({ ...formData, hearAbout: val })}
                    options={["Web Search (ex. Google)", "Social Media (ex. LinkedIn, Facebook, X, YouTube, etc)", "Word of Mouth", "Sponsored Newsletter", "Review Site (ex. G2, Capterra, etc)", "Podcast or Influencers"]}
                />
              </div>

              <div className="flex justify-end pt-8">
                <button
                  onClick={handleNext}
                  className="bg-[#00a651] hover:bg-[#008541] text-white font-bold py-3 px-12 rounded shadow-md transition-all active:scale-95 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Next'}
                </button>
              </div>
            </div>
          )}

          {authStep === AuthStep.SURVEY_BUSINESS && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500">
              <h1 className="text-4xl font-bold text-[#002a63] leading-tight mb-12">Tell us about your business so we can tailor your experience</h1>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#2d3a4b] mb-2">What's your company's name?</label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                    value={formData.companyName}
                    placeholder="e.g. Demo"
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <CustomSelect 
                    label="What does your business do? *"
                    value={formData.businessDo}
                    onChange={val => setFormData({ ...formData, businessDo: val })}
                    options={["Development & Programming", "Creative & Design", "Marketing & PR", "Legal & Professional", "Other"]}
                />

                <CustomSelect 
                    label="How would you describe your business? *"
                    value={formData.describeBusiness}
                    onChange={val => setFormData({ ...formData, describeBusiness: val })}
                    options={["It's launching soon", "Already established", "Scaling up"]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect 
                        label="What's your estimated revenue this year? *"
                        value={formData.revenueCurrency}
                        onChange={val => setFormData({ ...formData, revenueCurrency: val })}
                        options={["PHP — Philippine Peso", "USD — US Dollar"]}
                    />
                    <div>
                        <label className="block text-sm font-bold text-[#2d3a4b] mb-2 opacity-0">Amount</label>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#0075dd] focus:ring-2 focus:ring-blue-50 outline-none transition-all font-medium text-[#2d3a4b]"
                            value={formData.revenueAmount}
                            placeholder="0"
                            onChange={e => setFormData({ ...formData, revenueAmount: e.target.value })}
                        />
                    </div>
                </div>

                <CustomSelect 
                    label="How long does it take to complete your services? *"
                    value={formData.serviceDuration}
                    onChange={val => setFormData({ ...formData, serviceDuration: val })}
                    options={["More than a week but less than a month", "Less than a week", "Continuous support"]}
                />

                <CustomSelect 
                    label="What do you currently use to bill your customers? *"
                    value={formData.billingTool}
                    onChange={val => setFormData({ ...formData, billingTool: val })}
                    options={["Spreadsheets", "Manual Invoices", "Other Software"]}
                />

                <div>
                    <label className="block text-sm font-bold text-[#2d3a4b] mb-2">How customized is your offering for customers? *</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setFormData({...formData, customization: 'More or less the same'})}
                            className={`py-3 px-4 rounded-lg font-medium border transition-all text-sm ${formData.customization === 'More or less the same' ? 'border-[#0075dd] bg-blue-50 text-[#0075dd] font-bold' : 'border-gray-300 text-[#2d3a4b] hover:border-gray-400'}`}
                        >
                            More or less the same
                        </button>
                        <button 
                            onClick={() => setFormData({...formData, customization: 'Different or customized'})}
                            className={`py-3 px-4 rounded-lg font-medium border transition-all text-sm ${formData.customization === 'Different or customized' ? 'border-[#0075dd] bg-blue-50 text-[#0075dd] font-bold' : 'border-gray-300 text-[#2d3a4b] hover:border-gray-400'}`}
                        >
                            Different or customized
                        </button>
                    </div>
                </div>
              </div>

              <div className="flex justify-end items-center mt-12 gap-8 pt-8 border-t border-gray-50">
                <button onClick={handleBack} className="text-[#2d3a4b] font-bold hover:underline">Back</button>
                <button
                  onClick={handleNext}
                  className="bg-[#00a651] hover:bg-[#008541] text-white font-bold py-3 px-8 rounded shadow-md transition-all active:scale-95 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Save and Finish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Stepper Panel */}
      <div className="hidden lg:flex w-[40%] bg-[#002a63] relative overflow-hidden flex-col justify-center px-24">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10 space-y-16">
            <div className="flex items-center group relative">
                <div className="absolute left-[20px] top-[40px] w-0.5 h-[80px] bg-white/20"></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 transition-all duration-500 border-2 ${authStep === AuthStep.SURVEY_PROFILE ? 'bg-white text-[#002a63] border-white shadow-xl scale-110' : 'bg-[#002a63] text-white border-white/40'}`}>
                    {authStep > AuthStep.SURVEY_PROFILE ? <Check size={20} strokeWidth={3} /> : '1'}
                </div>
                <h4 className={`text-lg font-bold transition-all ${authStep === AuthStep.SURVEY_PROFILE ? 'text-white' : 'text-white/40'}`}>Enter your profile information</h4>
            </div>

            <div className="flex items-center group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-6 transition-all duration-500 border-2 ${authStep === AuthStep.SURVEY_BUSINESS ? 'bg-white text-[#002a63] border-white shadow-xl scale-110' : 'bg-[#002a63] text-white border-white/40'}`}>
                    2
                </div>
                <h4 className={`text-lg font-bold transition-all ${authStep === AuthStep.SURVEY_BUSINESS ? 'text-white' : 'text-white/40'}`}>Tell us about your business</h4>
            </div>
        </div>

        <div className="absolute bottom-16 right-16 flex gap-10 text-white/50 font-bold text-xs">
          <button className="hover:text-white transition-colors flex items-center gap-2"><HelpCircle size={16} /> Contact Support</button>
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors flex items-center gap-2"><LogOut size={16} /> Log Out</button>
        </div>
      </div>
    </div>
  );
}
