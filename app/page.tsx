
'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CommunityScroll from '@/components/CommunityScroll';
import AIChefDemo from '@/components/AIChefDemo';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen selection:bg-orange-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AIChefDemo />
        <CommunityScroll />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
