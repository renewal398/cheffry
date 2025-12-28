import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 md:space-y-8 animate-[fadeInUp_0.8s_ease-out] text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-[#FF7A18] text-[10px] md:text-xs font-bold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] animate-ping"></span>
            Powered by AI and local taste
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#111111] leading-[1.15] md:leading-[1.1]">
            Decide What to <br />
            <span className="text-[#FF7A18]">Cook, Instantly</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Cheffry helps you discover meals, share cooking posts, and decide what to cook
            based on your available ingredients. Get personalized suggestions from your
            AI chef assistant.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5">
            <button className="w-full sm:w-auto bg-[#FF7A18] hover:bg-[#e66e15] text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
              Start Cooking Free
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i} 
                  src={`https://picsum.photos/100/100?random=${i}`} 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm" 
                  alt="User" 
                />
              ))}
            </div>
            <p className="text-xs md:text-sm text-gray-500 font-medium">
              Join <span className="text-[#111111] font-bold">10k+</span> home cooks.
            </p>
          </div>
        </div>

        {/* Correct Image Positioning - Larger & Better Aligned */}
        <div className="relative h-[650px] hidden lg:block">
          {/* Top Right - Drink Image (Larger) */}
          <div 
            className="absolute top-0 right-0 w-44 h-44 bg-white p-2 rounded-3xl shadow-xl transition-transform duration-700 ease-out animate-[float_6s_infinite_ease-in-out] z-20"
            style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)` }}
          >
            <img 
              src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreiebjp2ssstsr6lux5sl4iq5iccodenmwlyrwonzjhse7hwcdj3egy" 
              className="w-full h-full object-cover rounded-2xl" 
              alt="Drink" 
            />
          </div>

          {/* Center Right - Large Main Dish Image (Bigger) */}
          <div 
            className="absolute top-24 right-0 w-[460px] h-[460px] bg-white rounded-[50px] shadow-2xl overflow-hidden border-8 border-white transition-transform duration-700 ease-out z-10"
            style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
          >
            <img 
              src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreibidul7qg5ddb4b33cjc7igtgme6iv42rkxfckxjnkahsce5mmygu" 
              className="w-full h-full object-cover" 
              alt="Main Dish" 
            />
            
            {/* Free Tip Overlay on Main Image */}
            <div className="absolute top-8 left-8 glass px-5 py-3 rounded-2xl shadow-lg border border-white/50 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg">✓</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Free Tip</p>
                  <p className="text-sm font-bold text-[#111111]">Drink Water</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left - Rice Dish (Larger & Better Positioned) */}
          <div 
            className="absolute bottom-0 left-0 w-52 h-52 bg-white p-2 rounded-3xl shadow-xl transition-transform duration-700 ease-out animate-[float_8s_infinite_ease-in-out_reverse] z-20"
            style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}
          >
            <img 
              src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreie5lgwkxjgzd3je6krozyob2mvgg7ahrn7gbgngbrsje27mxrh5ru" 
              className="w-full h-full object-cover rounded-2xl" 
              alt="Rice Dish" 
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .glass {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </section>
  );
};

export default Hero;