import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Lottie from "react-lottie";
import { Shield, Lock, FileKey, MessageSquareShare, X } from "lucide-react";
import security from "../assets/Animation/security.json";
import Footer from '../components/Footer';
import Subscription from '../components/Subscription';
import Testimonials from '../components/Testimonials';
import About from '../components/About';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: security,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const Home = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleGetStarted = () => {
    navigate('/create'); // Navigate to the signup page
  };

  const toggleLearnMore = () => {
    setShowLearnMore(!showLearnMore);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E7F5FD] to-[#FCEBE0]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-2 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Content */}
          <div className="flex-1 space-y-0">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Secure Your Digital World
              <span className="text-blue-600">.</span>
            </h1>
            
            <p className="text-xl text-slate-600 mt-4">
              Enterprise-grade encryption for your messages and files. 
              Stay protected with military-grade security protocols.
            </p>
            
            <div className="flex gap-4 mt-8">
              <button 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-300"
                onClick={handleGetStarted}
              >
                Get Started
              </button>
              <button 
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-md font-medium transition-colors duration-300"
                onClick={toggleLearnMore}
              >
                Learn More
              </button>
            </div>

            {/* Learn More Modal - Improved with backdrop blur */}
            {showLearnMore && (
              <div className="fixed inset-0 backdrop-blur-md bg-gradient-to-r from-[#E7F5FD]/60 to-[#FCEBE0]/60 z-50 flex items-center justify-center  transition-all duration-300">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl w-full  max-h-[100vh] overflow-y-auto shadow-2xl border border-white/20">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">About SecureConnect</h2>
                      <button 
                        onClick={toggleLearnMore}
                        className="p-2 rounded-full hover:bg-slate-200/70 transition-colors duration-300"
                      >
                        <X className="h-6 w-6 text-slate-600" />
                      </button>
                    </div>

                    <div className="space-y-6 text-slate-700">
                      <div className="bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl border border-blue-100/50">
                        <h3 className="text-2xl font-semibold text-blue-700 mb-3">Our Mission</h3>
                        <p className="text-lg">
                          SecureConnect was founded with a simple mission: to make secure communication accessible to everyone. 
                          In today's digital landscape, privacy is not just a luxury—it's a fundamental right. We believe that 
                          everyone deserves communication tools that are both powerful and private.
                        </p>
                      </div>

                      <div className="bg-indigo-50/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-100/50">
                        <h3 className="text-2xl font-semibold text-indigo-700 mb-3">How Our Technology Works</h3>
                        <p className="text-lg">
                          Our platform uses military-grade 256-bit AES encryption combined with a zero-knowledge architecture. 
                          This means that your data is encrypted on your device before it's transmitted, and only you and your 
                          intended recipients hold the keys to decrypt it. Even if our servers were compromised, your data 
                          would remain secure and private.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-50/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-100/50">
                          <h3 className="text-2xl font-semibold text-cyan-700 mb-3">Key Security Features</h3>
                          <ul className="list-disc pl-5 space-y-2 text-lg">
                            <li>End-to-end encryption for all messages and files</li>
                            <li>Zero-knowledge architecture ensuring even we can't access your data</li>
                            <li>Optional message expiration and self-destruct features</li>
                            <li>Multi-factor authentication and biometric security</li>
                            <li>Regular third-party security audits</li>
                            <li>Open-source encryption protocols for transparency</li>
                          </ul>
                        </div>

                        <div className="bg-green-50/50 backdrop-blur-sm p-6 rounded-xl border border-green-100/50">
                          <h3 className="text-2xl font-semibold text-green-700 mb-3">Compliance & Certifications</h3>
                          <p className="text-lg mb-4">
                            SecureConnect meets or exceeds industry standards for security and privacy, including:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-white/70 rounded-full text-green-800 font-medium text-sm">ISO 27001</span>
                            <span className="px-3 py-1 bg-white/70 rounded-full text-green-800 font-medium text-sm">GDPR</span>
                            <span className="px-3 py-1 bg-white/70 rounded-full text-green-800 font-medium text-sm">HIPAA</span>
                            <span className="px-3 py-1 bg-white/70 rounded-full text-green-800 font-medium text-sm">SOC 2 Type II</span>
                            <span className="px-3 py-1 bg-white/70 rounded-full text-green-800 font-medium text-sm">CCPA</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100/50">
                        <h3 className="text-2xl font-semibold text-purple-700 mb-3">Enterprise Solutions</h3>
                        <p className="text-lg">
                          For businesses and organizations, we offer custom deployment options, including on-premises 
                          installations, dedicated instances, and integration with existing security infrastructure. 
                          Our enterprise solutions include advanced admin controls, custom retention policies, and 
                          detailed security analytics.
                        </p>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-white/50 p-3 rounded-lg text-center">
                            <div className="font-bold text-purple-600 text-2xl">99.99%</div>
                            <div className="text-sm text-purple-800">Uptime SLA</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg text-center">
                            <div className="font-bold text-purple-600 text-2xl">24/7</div>
                            <div className="text-sm text-purple-800">Priority Support</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg text-center">
                            <div className="font-bold text-purple-600 text-2xl">10GB+</div>
                            <div className="text-sm text-purple-800">File Transfer</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200 pt-6">
                      <div className="text-slate-600">Ready to experience secure communication?</div>
                      <div className="flex gap-4">
                        <button 
                          onClick={toggleLearnMore}
                          className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-md font-medium transition-colors duration-300"
                        >
                          Close
                        </button>
                        <button 
                          onClick={handleGetStarted}
                          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-300"
                        >
                          Sign Up Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-6 rounded-xl border bg-white/50 backdrop-blur shadow">
                <Shield className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
                <p className="text-slate-600">Your data is encrypted before it leaves your device</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/50 backdrop-blur shadow">
                <Lock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Zero Knowledge</h3>
                <p className="text-slate-600">We can't read your messages or access your files</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/50 backdrop-blur shadow">
                <FileKey className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure File Transfer</h3>
                <p className="text-slate-600">Transfer files with automatic encryption</p>
              </div>

              <div className="p-6 rounded-xl border bg-white/50 backdrop-blur shadow">
                <MessageSquareShare className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Private Messaging</h3>
                <p className="text-slate-600">Messages that only recipients can read</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-0 p-4 bg-white/30 backdrop-blur rounded-lg">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>🔒 ISO 27001 Certified</span>
                <span>|</span>
                <span>🛡️ GDPR Compliant</span>
                <span>|</span>
                <span>⚡ 99.9% Uptime</span>
              </div>
            </div>
          </div>
          
          {/* Right Animation */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              {/* Blue glow effect behind animation */}
              <div className="absolute inset-0 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>
              <div className="w-full h-full md:w-150 md:h-150 overflow-hidden">
                <Lottie options={defaultOptions} height="100%" width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Subscription/>
      <Testimonials/>
      <About/>
      <Footer />
    </div>
  );
};

export default Home;