'use client';
import React from 'react';
import ThemeSwitcher from './theme-switcher';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-green-900 bg-opacity-75 p-4 z-50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
        </div>
        <div className="flex space-x-4 items-center">
            <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
