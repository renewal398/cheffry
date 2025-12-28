"use client";
import React, { useState, useMemo } from 'react';
import { Sparkles, Loader2, ChefHat, Clock, ArrowLeft, ChevronRight, Globe, MapPin, Search, ChevronDown, X } from 'lucide-react';
import { getRecipeSuggestions, RecipeResponse } from '../services/geminiService';

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const AIChefDemo: React.FC = () => {
  const [country, setCountry] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeResponse | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRIES.filter(c => 
      c.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const handleSuggest = async () => {
    if (!ingredients.trim() || !country) return;
    setLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);
    const results = await getRecipeSuggestions(ingredients, country);
    setRecipes(results);
    setLoading(false);
  };

  const selectCountry = (name: string) => {
    setCountry(name);
    setIsDropdownOpen(false);
    setCountrySearch('');
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA]" id="ai-chef">
      <div className="container mx-auto px-4 md:px-6">
        <div className="glass rounded-[30px] md:rounded-[40px] p-6 md:p-16 flex flex-col lg:flex-row gap-10 md:gap-16 items-start shadow-2xl relative overflow-hidden">
          {/* Background Highlight */}
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-100 rounded-full blur-[80px] md:blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>

          <div className="w-full lg:w-1/3 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 text-[#FF7A18] font-bold">
              <Sparkles size={18} />
              <span className="uppercase tracking-widest text-[10px] md:text-xs">AI Kitchen Assistant</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111111]">Local Taste, AI Precision</h2>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              We'll find traditional dishes from your chosen country using <span className="text-[#FF7A18] font-bold">ONLY</span> your available ingredients.
            </p>

            <div className="space-y-4">
              {/* Custom Searchable Country List */}
              <div className="relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">Select Country</label>
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-gray-200 focus-within:border-[#FF7A18] focus-within:ring-4 focus-within:ring-orange-100 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 flex items-center justify-between cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className={country ? "text-[#FF7A18]" : "text-gray-300"} />
                    <span className={`text-sm md:text-lg ${country ? 'text-[#111111] font-medium' : 'text-gray-400'}`}>
                      {country || "Choose your country..."}
                    </span>
                  </div>
                  <ChevronDown size={18} className={`text-gray-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-[60] left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-[fadeInDown_0.2s_ease-out]">
                    <div className="p-3 border-b border-gray-50 sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Search countries..."
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl outline-none text-xs md:text-sm border border-transparent focus:border-orange-100 transition-all"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-56 md:max-h-64 overflow-y-auto custom-scrollbar">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map(c => (
                          <div 
                            key={c}
                            onClick={() => selectCountry(c)}
                            className={`px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm cursor-pointer transition-colors flex items-center justify-between ${country === c ? 'bg-orange-50 text-[#FF7A18] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {c}
                            {country === c && <Sparkles size={12} />}
                          </div>
                        ))
                      ) : (
                        <div className="p-5 text-center text-gray-400 text-xs italic">No countries found.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">Your Ingredients</label>
                <input 
                  type="text" 
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., tomato, chicken, rice"
                  className="w-full bg-white border border-gray-200 focus:border-[#FF7A18] focus:ring-4 focus:ring-orange-100 rounded-xl md:rounded-2xl py-3.5 md:py-5 px-4 md:px-6 outline-none transition-all shadow-sm text-sm md:text-lg"
                />
                <div className="absolute top-[34px] md:top-[38px] right-4 flex items-center">
                   <ChefHat size={18} className="text-gray-300 group-focus-within:text-[#FF7A18] transition-colors" />
                </div>
              </div>

              <button 
                onClick={handleSuggest}
                disabled={loading || !ingredients.trim() || !country}
                className="w-full bg-[#FF7A18] hover:bg-[#e66e15] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {loading ? "Chef is thinking..." : "Get Local Recipes"}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-2/3 mt-6 lg:mt-0">
            {selectedRecipe ? (
              <div className="bg-white rounded-[25px] md:rounded-3xl p-5 md:p-8 shadow-xl border border-orange-50 animate-[fadeIn_0.5s_ease-out]">
                <button 
                  onClick={() => setSelectedRecipe(null)}
                  className="mb-4 md:mb-6 flex items-center gap-2 text-gray-400 hover:text-[#FF7A18] font-bold transition-colors text-xs"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-6 md:mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-[#FF7A18] text-[10px] md:text-xs font-bold uppercase mb-1">
                      <MapPin size={10} /> {country}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111111]">{selectedRecipe.recipeName}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-bold bg-gray-50 px-3 py-1 rounded-lg text-xs md:text-sm self-start md:self-auto">
                    <Clock size={14} />
                    {selectedRecipe.cookingTime}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <h4 className="font-bold text-[#FF7A18] mb-3 text-[10px] md:text-sm uppercase tracking-wider">Required Ingredients</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] md:text-sm border border-orange-100 font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-[10px] md:text-xs text-gray-400 italic leading-relaxed">
                      Generated strictly with your ingredients + water, salt, pepper, and oil.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#FF7A18] mb-3 text-[10px] md:text-sm uppercase tracking-wider">Instructions</h4>
                    <div className="space-y-4">
                      {selectedRecipe.instructions.map((step, i) => (
                        <div key={i} className="flex gap-3 md:gap-4 items-start group">
                          <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-100 text-[#FF7A18] flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0 mt-0.5 group-hover:bg-[#FF7A18] group-hover:text-white transition-colors">
                            {i + 1}
                          </span>
                          <p className="text-gray-600 text-[12px] md:text-sm leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : recipes.length > 0 ? (
              <div className="space-y-3 md:space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <h3 className="text-sm md:text-xl font-bold text-gray-400 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                  <MapPin size={16} className="text-[#FF7A18]" /> Authentic {country} Dishes
                </h3>
                {recipes.map((recipe, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedRecipe(recipe)}
                    className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF7A18] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-[#FF7A18] rounded-lg md:rounded-xl flex items-center justify-center font-bold text-sm md:text-base">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-lg text-[#111111]">{recipe.recipeName}</h4>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-medium mt-0.5 md:mt-1">
                          <Clock size={10} />
                          {recipe.cookingTime}
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#FF7A18] group-hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[300px] md:min-h-[400px] border-4 border-dashed border-gray-100 rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-center text-gray-300 space-y-4">
                <ChefHat size={48} className="md:size-[64px] opacity-20" />
                <p className="font-medium text-center px-6 text-sm md:text-base">Select a country and enter ingredients above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};


export default AIChefDemo;
