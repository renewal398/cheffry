
import React from 'react';
import { ShoppingBasket, ChefHat, Globe, Users } from 'lucide-react';

// Added interface and used React.FC to handle React-specific props like 'key'
interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <div className={`glass p-8 rounded-[40px] hover:shadow-2xl transition-all hover:-translate-y-2 group group animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0`} style={{ animationDelay: delay }}>
    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF7A18] mb-6 group-hover:scale-110 transition-transform">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-[#111111]">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: ShoppingBasket,
      title: "Ingredient-Based Suggestions",
      description: "Tell us what you have, and we'll suggest delicious meals you can make right now.",
      delay: "0.1s"
    },
    {
      icon: ChefHat,
      title: "AI Chef Assistant",
      description: "Get personalized cooking guidance from your smart AI chef that knows your preferences.",
      delay: "0.2s"
    },
    {
      icon: Globe,
      title: "Country-Based Feed",
      description: "Discover recipes and cooking posts from your country and around the world.",
      delay: "0.3s"
    },
    {
      icon: Users,
      title: "Community Posts",
      description: "Share your cooking creations and get inspired by fellow food lovers.",
      delay: "0.4s"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#111111]">Everything You Need to Cook Smarter</h2>
          <p className="text-gray-500 text-lg">From AI-powered suggestions to community recipes, Cheffry has you covered.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Features;
