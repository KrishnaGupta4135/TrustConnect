import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold">TrustConnect</span>
            </div>
            <p className="text-slate-400">
              Secure your digital world with enterprise-grade encryption and privacy solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Secure Messaging</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">File Transfer</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">End-to-End Encryption</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Data Protection</a></li>
              <li><a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Enterprise Solutions</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                <span className="text-slate-400">123 Security Street, Cyber City, 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-blue-500" />
                <a href="tel:+1234567890" className="text-slate-400 hover:text-blue-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-500" />
                <a href="mailto:info@trustconnect.com" className="text-slate-400 hover:text-blue-500 transition-colors">
                  info@trustconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400">
              © {new Date().getFullYear()} TrustConnect. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;