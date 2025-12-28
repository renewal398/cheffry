
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <div className="animate-bounce mb-6 w-64 h-64">
          <img
            src="https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreigiwlkpkd5z3ge2o7m2lv4pykgvxd2toowpazhyo4iohc5u3prrae"
            alt="Cheffry Chef"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-6 bg-gray-100/50 rounded-[100%] blur-xl animate-pulse"></div>
      </div>
      <div className="text-center mt-12 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF7A18] animate-ping"></div>
          <p className="text-[#FF7A18] font-black text-3xl tracking-tighter">
            Cheffry
          </p>
        </div>
        <p className="text-gray-400 font-medium text-sm tracking-wide animate-pulse">
          PREPARING YOUR KITCHEN...
        </p>
      </div>
    </div>
  );
};

export default Preloader;
