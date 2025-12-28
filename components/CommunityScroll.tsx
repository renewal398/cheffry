
import React from 'react';
import { Heart, MessageSquare, MapPin } from 'lucide-react';

interface CommunityCardProps {
  image: string;
  country: string;
  author: string;
  title: string;
  likes: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ image, country, author, title, likes }) => (
  <div className="min-w-[300px] md:min-w-[350px] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-2xl">
    <div className="relative h-64">
      <img src={image} className="w-full h-full object-cover" alt={title} />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm">
        <MapPin size={12} className="text-[#FF7A18]" />
        {country}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden">
          <img src={`https://i.pravatar.cc/100?u=${author}`} className="w-full h-full object-cover" alt={author} />
        </div>
        <span className="text-sm font-bold text-gray-800">{author}</span>
      </div>
      <h3 className="text-lg font-bold text-[#111111] mb-6 line-clamp-1">{title}</h3>
      <div className="flex items-center justify-between border-t border-gray-50 pt-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium">
            <Heart size={18} />
            {likes}
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium">
            <MessageSquare size={18} />
            {Math.floor(Math.random() * 20)}
          </button>
        </div>
        <button
          onClick={() => alert('Redirecting to login page...')}
          className="text-xs font-bold text-[#FF7A18] uppercase tracking-wider hover:underline"
        >
          View Recipe
        </button>
      </div>
    </div>
  </div>
);

const CommunityScroll: React.FC = () => {
  const posts = [
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreid25eagapa5rjjgzvu37655pstvgld7p5m24luluvmyd4scc5qn24",
      country: "Nigeria",
      author: "Adewale King",
      title: "Spicy Smoky Jollof Rice",
      likes: "12.2k"
    },
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreifnd3rl4rikbq3wziub35d7t6jekuvzpztkoixvkgl6r63znc4ga4",
      country: "Ghana",
      author: "Kofi Mensah",
      title: "Banku with Grilled Tilapia",
      likes: "8.4k"
    },
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreiczuxzajeanqhj5yt3vrxjy6ff7oatnok355f3k2bie2a2onn2iw4",
      country: "Nigeria",
      author: "Chinyere Okafor",
      title: "Pounded Yam with Egusi",
      likes: "15.1k"
    },
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreidg5unihao6ini5eskdyqfiyhndyjy3lpgaa7s3p7q76nh4xxto3u",
      country: "Kenya",
      author: "Amara Wambui",
      title: "Authentic Nyama Choma",
      likes: "5.1k"
    },
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreie3lx65gr7aey3rsf2lcfcr5x54ro6nz6bfhesglrbynuucbcvwxu",
      country: "Nigeria",
      author: "Tunde Bakare",
      title: "Efo Riro with Assorted Meat",
      likes: "9.5k"
    },
    {
      image: "https://ivory-occupational-panther-121.mypinata.cloud/ipfs/bafkreid7mlh4xpqhm4kavv2lmx2stn3vnzt25xbrb6n6t2tm4w6vcbofnu",
      country: "Senegal",
      author: "Fatou Diop",
      title: "Thieboudienne (Fish & Rice)",
      likes: "7.8k"
    },
  ];

  return (
    <section className="py-24 overflow-hidden bg-white" id="community">
      <div className="container mx-auto px-6 mb-12 flex items-end justify-between">
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-[#111111]">Local Flavors, Global Inspiration</h2>
          <p className="text-gray-500 text-lg">See what chefs in your area and around the world are cooking right now.</p>
        </div>
      </div>

      <div className="relative group">
        <div className="flex gap-8 overflow-x-auto px-6 pb-12 scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing">
          {posts.map((p, i) => (
            <CommunityCard key={i} {...p} />
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CommunityScroll;
