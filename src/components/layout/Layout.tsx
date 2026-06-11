import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JoueurLinkModal } from '../features/JoueurLinkModal';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-8 pb-12 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <JoueurLinkModal />
    </div>
  );
};
