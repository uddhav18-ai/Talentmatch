import React from 'react';
import { Link, useLocation } from 'wouter';

const Footer: React.FC = () => {
  const [location, setLocation] = useLocation();
  
  const handleLinkClick = (path: string) => {
    setLocation(path);
    window.scrollTo(0, 0);
  };
  
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white text-primary p-1.5 rounded">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <span className="text-xl font-bold">TalentMatch</span>
            </div>
            <p className="text-gray-400 mb-4">Reimagining hiring through skills, not resumes.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          {/* For Candidates */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Candidates</h3>
            <ul className="space-y-2">
              <li><Link href="/challenges" className="text-gray-400 hover:text-white transition-colors">Browse Challenges</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Skill Verification</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Resources</a></li>
            </ul>
          </div>
          
          {/* For Companies */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Companies</h3>
            <ul className="space-y-2">
              <li><Link href="/companies" className="text-gray-400 hover:text-white transition-colors">Post Work Samples</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Talent Search</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise Solutions</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a onClick={() => handleLinkClick('/about')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</a></li>
              <li><a onClick={() => handleLinkClick('/about')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Our Mission</a></li>
              <li><a onClick={() => handleLinkClick('/about')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Blog</a></li>
              <li><a onClick={() => handleLinkClick('/contact')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} TalentMatch. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
