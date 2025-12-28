
import React from 'react';
import Link from 'next/link';

const CTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-white">
  <div className="container mx-auto px-4 md:px-6">
      <div className="bg-[#FF7A18] rounded-[40px] md:rounded-[60px] p-10 md:p-24 text-center relative overflow-hidden shadow-2xl">
        {/* Animated Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-10">
          <h2 className="text-3xl md:text-6xl font-extrabold text-white leading-tight">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-orange-50 text-base md:text-xl font-medium opacity-90">
            Join thousands of home cooks who are making smarter decisions in the kitchen with Cheffry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link href="/signup">
              <button className="w-full sm:w-auto bg-white text-[#FF7A18] hover:bg-gray-50 font-extrabold px-10 md:px-12 py-4 md:py-5 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 text-base md:text-lg">
                Start Cooking Smarter
              </button>
            </Link>
          </div>
         </div>
 
        </div>
      </div>
    </section>
  );
};

export default CTA;
