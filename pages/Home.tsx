import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Promo Banner */}
      <div className="bg-fb-blue text-white text-center py-2 text-sm font-medium">
        New year, huge savings 🎉 – 60% off for 3 months. <span onClick={() => navigate('/signup')} className="underline cursor-pointer ml-2">Buy now</span>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24 px-6 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold text-fb-slate leading-tight">
              Small business software that makes the hard part easy
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Spend less time on paperwork and more time doing what you love. FreshBooks creates professional invoices, tracks expenses, and makes payments painless.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/signup')}
                className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Try It Free
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-white border-2 border-fb-blue text-fb-blue hover:bg-blue-50 px-8 py-4 rounded-full text-lg font-bold transition-all"
              >
                Buy Now & Save
              </button>
            </div>
            <p className="text-sm text-gray-500">No credit card required. Cancel anytime.</p>
          </div>
          
          {/* Hero Image / Animation Placeholder */}
          <div className="relative h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in slide-in-from-right-4 duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
              <div className="text-center p-8">
                 <div className="w-full max-w-sm mx-auto bg-white rounded shadow-lg p-6 mb-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-gray-100 rounded"></div>
                        <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                        <div className="h-3 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <div className="h-8 w-20 bg-fb-green rounded opacity-20"></div>
                        <div className="h-4 w-16 bg-fb-blue rounded opacity-20"></div>
                    </div>
                 </div>
                 <p className="text-gray-400 font-medium tracking-wide">AUTOMATED INVOICING</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings Strip */}
      <section className="bg-gray-50 py-10 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-6">Trusted by businesses everywhere</p>
            <div className="flex justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
                {/* Mock Logos */}
                <span className="text-xl font-bold text-gray-700 flex items-center gap-2"><Star className="fill-current text-yellow-500" /> GetApp</span>
                <span className="text-xl font-bold text-gray-700 flex items-center gap-2"><Star className="fill-current text-orange-500" /> Capterra</span>
                <span className="text-xl font-bold text-gray-700 flex items-center gap-2"><Star className="fill-current text-red-500" /> G2 Crowd</span>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-fb-slate mb-4">Everything you need to run your business</h2>
                  <p className="text-lg text-gray-600">Simple enough for freelancers, powerful enough for growing agencies.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { title: "Invoicing", desc: "Impress clients with professional invoices that take seconds to create." },
                      { title: "Expenses", desc: "Snap receipts, forward emails, and track every penny effortlessly." },
                      { title: "Time Tracking", desc: "Log hours automatically and bill for exactly what you're worth." },
                      { title: "Projects", desc: "Keep your team aligned and your projects profitable." },
                      { title: "Payments", desc: "Get paid 2x faster with online payment options." },
                      { title: "Reporting", desc: "Understand your profitability with easy-to-read reports." }
                  ].map((feature, i) => (
                      <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-fb-blue mb-6">
                              <Check />
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-fb-slate">{feature.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
}