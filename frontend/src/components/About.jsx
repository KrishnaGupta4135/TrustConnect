import React from 'react';
import PropTypes from 'prop-types';
import { Shield, Lock, Zap, Users, CheckCircle, FileCheck, Info, MessageSquare, FileText, Server, Key, Clock } from 'lucide-react';

const features = [
  { icon: <Shield className="w-5 h-5" />, title: "Zero-Knowledge Encryption", description: "Your data stays completely private - even we can't access your messages or files" },
  { icon: <FileCheck className="w-5 h-5" />, title: "Large File Transfers", description: "Transfer files up to 10GB, supporting 150+ formats including healthcare imaging and CAD files" },
  { icon: <Zap className="w-5 h-5" />, title: "Real-Time Messaging", description: "Instant delivery confirmation and synchronization across all devices" },
  { icon: <Users className="w-5 h-5" />, title: "Collaboration Rooms", description: "Controlled access for up to 250 participants with secure sharing" }
];

const uniqueFeatures = [
  "Proprietary QuickScan™ technology - Malware screening under 3 seconds",

  "99.99% uptime guarantee with monthly security audits"
];

const certifications = [
  { label: "ISO 27001", bgColor: "bg-blue-100/80", textColor: "text-blue-800" },
  { label: "HIPAA", bgColor: "bg-green-100/80", textColor: "text-green-800" },
  { label: "SOC 2 Type II", bgColor: "bg-purple-100/80", textColor: "text-purple-800" }
];

// Secure messaging details
const messagingDetails = [
  { icon: <Key className="w-4 h-4" />, title: "Military-Grade Encryption", description: "256-bit AES encryption for all messages with perfect forward secrecy" },
  { icon: <Clock className="w-4 h-4" />, title: "Message Expiration", description: "Set custom expiration times from 1 minute to 30 days" },
  { icon: <MessageSquare className="w-4 h-4" />, title: "Read Receipts", description: "Private confirmation of message delivery and reading" },
  { icon: <Shield className="w-4 h-4" />, title: "Quantum-Resistant", description: "Future-proof encryption algorithms resistant to quantum computing attacks" }
];

// File transfer details
// const fileTransferDetails = [
//   { icon: <FileText className="w-4 h-4" />, title: "Format Support", description: "Secure transfer of 150+ file formats including medical imaging and CAD files" },
//   { icon: <Server className="w-4 h-4" />, title: "Distributed Storage", description: "Files are split, encrypted, and stored across multiple secure locations" },
//   { icon: <Shield className="w-4 h-4" />, title: "Integrity Verification", description: "Automatic checksum verification ensures files aren't modified in transit" },
//   { icon: <Lock className="w-4 h-4" />, title: "Access Controls", description: "Set granular permissions for viewing, downloading, or forwarding files" }
// ];

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-2 border rounded-lg bg-gray-50/80 backdrop-blur-sm group hover:border-blue-200 transition-all duration-300">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-blue-600 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-medium text-gray-800">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const DetailItem = ({ icon, title, description }) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-1 text-blue-600 group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

DetailItem.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const StatCard = ({ number, label }) => (
  <div className="text-gray-600 text-center sm:text-left group">
    <span className="font-semibold text-xl group-hover:text-blue-600 transition-colors">{number}</span>
    <span className="ml-1">{label}</span>
  </div>
);

StatCard.propTypes = {
  number: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const About = () => {
  return (
    <div className="h-full min-h-screen w-full relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-[#E7F5FD] to-[#FCEBE0] z-0" />
      
      <div className="relative z-10 flex-grow flex items-center justify-center w-full">
        <div className="w-full h-[100vh]">
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-none sm:rounded-lg transition-all duration-300 hover:shadow-2xl h-full overflow-y-auto">
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">SecureConnect</h1>
              </div>
              <p className="text-sm text-gray-600 mt-1">Empowering teams with military-grade security and intuitive design for protected communication.</p>
            </div>

            <div className="px-4 py-4 space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  Core Features <Info className="w-4 h-4 text-blue-600 cursor-help" />
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </div>

              {/* Secure Messaging Section */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  Secure Messaging <MessageSquare className="w-4 h-4 text-blue-600" />
                </h2>
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-3 rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        Our secure messaging system implements multiple layers of encryption and privacy controls, ensuring your communications remain completely confidential.
                      </p>
                      <div className="space-y-2">
                        {messagingDetails.slice(0, 2).map((item, index) => (
                          <DetailItem key={index} {...item} />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {messagingDetails.slice(2).map((item, index) => (
                        <DetailItem key={index} {...item} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Transfer Section */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  Secure File Transfer <FileText className="w-4 h-4 text-blue-600" />
                </h2>
                <div className="bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm p-3 rounded-lg">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        Transfer files of any size with complete security. Each file is encrypted, split, and distributed across our secure network to ensure maximum protection.
                      </p>
                      {/* <div className="space-y-2">
                        {fileTransferDetails.slice(0, 2).map((item, index) => (
                          <DetailItem key={index} {...item} />
                        ))}
                      </div> */}
                    </div>
                    {/* <div className="space-y-2">
                      {fileTransferDetails.slice(2).map((item, index) => (
                        <DetailItem key={index} {...item} />
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                <h2 className="text-lg font-semibold text-gray-800">What Sets Us Apart</h2>
                <div className="bg-blue-50/80 backdrop-blur-sm p-0 rounded-lg space-y-0">
                  {uniqueFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 group">
                      <CheckCircle className="w-1 h-1 text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-1">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-4">
                    <StatCard number="2M+" label="Users" />
                    <StatCard number="10K+" label="Orgs" />
                    <StatCard number="1B+" label="Secure Messages" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {certifications.map((cert, index) => (
                      <span key={index} className={`${cert.bgColor} ${cert.textColor} px-2 py-1 rounded-full text-xs font-medium`}>
                        {cert.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur-sm p-3 rounded-b-none sm:rounded-b-lg">
              <p className="text-xs text-gray-500 text-center">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;