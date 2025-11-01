import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap size={32} />
            <div>
              <h1 className="text-2xl font-bold">Student Registration System</h1>
              <p className="text-sm text-primary-100">Course Management Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Welcome to SRS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
