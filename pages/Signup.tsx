import React, { useState } from 'react';
import { AuthStep } from '../types';
import { Loader2, Check } from 'lucide-react';

interface SignupProps {
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  onComplete: () => void;
}

export default function Signup({ authStep, setAuthStep, onComplete }: SignupProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: 'John',
    lastName: 'Doe',
    location: 'Philippines',
    phone: '0912',
    hearAbout: '',
    companyName: 'Demo',
    industry: 'Development & Programming',
    businessDesc: 'It\'s launching soon',
    revenue: '0',
    serviceDuration: 'More than a week but less than a month',
    billingTool: ''
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
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex">
        {/* Left Content Area (Forms) */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
                <div className="flex items-center mb-12">
                     <div className="w-8 h-8 bg-fb-blue rounded-md flex items-center justify-center text-white font-bold text-xl mr-2">F</div>
                     <span className="font-bold text-2xl text-fb-slate">FreshBooks</span>
                </div>

                {authStep === AuthStep.LOGIN_START && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                         <h1 className="text-3xl font-bold text-fb-slate mb-2">Welcome!</h1>
                         <h1 className="text-3xl font-bold text-fb-slate mb-8">Let's Get You Set Up</h1>

                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-fb-slate mb-1">First name*</label>
                                <input 
                                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                    value={formData.firstName}
                                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-fb-slate mb-1">Last name*</label>
                                <input 
                                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                    value={formData.lastName}
                                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">Where are you located?*</label>
                            <input 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">Phone Number*</label>
                            <input 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">How did you hear about us?</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.hearAbout}
                                onChange={(e) => setFormData({...formData, hearAbout: e.target.value})}
                            >
                                <option value="">Choose an option</option>
                                <option value="Word of Mouth">Word of Mouth</option>
                                <option value="Social Media">Social Media</option>
                                <option value="Search">Search Engine</option>
                                <option value="Advertisement">Advertisement</option>
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                onClick={() => setAuthStep(AuthStep.SURVEY_BUSINESS)} // Skip OTP for clone demo speed
                                disabled={!formData.firstName || !formData.lastName}
                                className="bg-[#3fd071] hover:bg-[#33c46b] text-white font-bold py-3 px-8 rounded shadow-sm transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {authStep === AuthStep.SURVEY_BUSINESS && (
                     <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                         <h1 className="text-3xl font-bold text-fb-slate mb-2">Tell us about your business</h1>
                         <h1 className="text-3xl font-bold text-fb-slate mb-8">so we can tailor your experience</h1>

                         <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">What's your company's name?</label>
                            <input 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.companyName}
                                onChange={e => setFormData({...formData, companyName: e.target.value})}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">What does your business do? *</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.industry}
                                onChange={e => setFormData({...formData, industry: e.target.value})}
                            >
                                <option>Development & Programming</option>
                                <option>Creative & Marketing</option>
                                <option>Business Consulting</option>
                                <option>Education</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">How would you describe your business? *</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.businessDesc}
                                onChange={e => setFormData({...formData, businessDesc: e.target.value})}
                            >
                                <option>It's launching soon</option>
                                <option>Side hustle</option>
                                <option>Full-time business</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-fb-slate mb-1">Estimated revenue?</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all">
                                    <option>PHP — Philippine ...</option>
                                    <option>USD — US Dollar</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-fb-slate mb-1">Amount</label>
                                <input 
                                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none focus:ring-1 focus:ring-fb-blue transition-all"
                                    value={formData.revenue}
                                    onChange={e => setFormData({...formData, revenue: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">How long does it take to complete your services? *</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.serviceDuration}
                                onChange={e => setFormData({...formData, serviceDuration: e.target.value})}
                            >
                                <option>More than a week but less than a month</option>
                                <option>Less than a week</option>
                                <option>One day or less</option>
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-fb-slate mb-1">What do you currently use to bill your customers? *</label>
                            <select 
                                className="w-full border border-gray-300 rounded px-3 py-2.5 focus:border-fb-blue outline-none bg-white focus:ring-1 focus:ring-fb-blue transition-all"
                                value={formData.billingTool}
                                onChange={e => setFormData({...formData, billingTool: e.target.value})}
                            >
                                <option value="">Choose an option</option>
                                <option value="spreadsheets">Spreadsheets</option>
                                <option value="word">Word Processing</option>
                                <option value="paper">Pen and Paper</option>
                                <option value="other_software">Other Software</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                             <button onClick={() => setAuthStep(AuthStep.LOGIN_START)} className="text-gray-500 font-medium hover:text-gray-700">Back</button>
                             <button 
                                onClick={handleNext}
                                className="bg-[#3fd071] hover:bg-[#33c46b] text-white font-bold py-3 px-6 rounded shadow-sm flex items-center transition-colors"
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : 'Save and Finish'}
                            </button>
                        </div>
                     </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center cursor-pointer hover:text-fb-blue"><span className="mr-2 rounded-full border border-gray-400 w-4 h-4 flex items-center justify-center text-[10px]">?</span> Contact Support</span>
                <span className="flex items-center cursor-pointer hover:text-fb-blue">Log Out</span>
            </div>
        </div>

        {/* Right Blue Panel */}
        <div className="hidden lg:block w-1/2 bg-[#005aab] relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
                 <div className="space-y-12 relative z-10">
                     <div className="flex items-start">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-colors duration-300 ${authStep === AuthStep.LOGIN_START ? 'bg-white text-[#005aab]' : 'bg-[#004e93] text-blue-200'}`}>1</div>
                         <span className={`text-lg font-bold transition-colors duration-300 ${authStep === AuthStep.LOGIN_START ? 'text-white' : 'text-blue-200'}`}>Enter your profile information</span>
                     </div>
                     
                     <div className="h-16 border-l-2 border-blue-400/30 absolute left-4 top-8"></div>
                     
                     <div className="flex items-start">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 transition-colors duration-300 ${authStep === AuthStep.SURVEY_BUSINESS ? 'bg-white text-[#005aab]' : 'bg-[#004e93] text-blue-200'}`}>2</div>
                         <span className={`text-lg font-bold transition-colors duration-300 ${authStep === AuthStep.SURVEY_BUSINESS ? 'text-white' : 'text-blue-200'}`}>Tell us about your business</span>
                     </div>
                 </div>
            </div>
            {/* Abstract Shapes */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#004e93] rounded-full translate-y-1/2 translate-x-1/3 opacity-50 blur-3xl"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0066c0] rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl"></div>
        </div>
    </div>
  );
}