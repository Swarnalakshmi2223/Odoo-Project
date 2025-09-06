import React, { useState } from 'react';
import { Upload, Camera, Sparkles, DollarSign, Package, FileText, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useNavigate, Link } from 'react-router-dom';

interface FormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  image: string;
}

const ListItem: React.FC = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: 0,
    image: ''
  });
  
  const [aiSuggestions, setAiSuggestions] = useState<{
    category: string;
    condition: string;
  } | null>(null);
  
  const [isGeneratingImpact, setIsGeneratingImpact] = useState(false);
  const [ecoImpact, setEcoImpact] = useState<{
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  } | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to list items</h2>
        <Link
          to="/auth"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const categories = [
    { value: 'clothing', label: 'Clothing & Fashion' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'books', label: 'Books & Media' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'toys', label: 'Toys & Games' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new', description: 'No visible wear, works perfectly' },
    { value: 'good', label: 'Good - Minor wear', description: 'Slight signs of use, fully functional' },
    { value: 'fair', label: 'Fair - Visible wear', description: 'Noticeable wear but still functional' }
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
    'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg',
    'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg',
    'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const simulateAISuggestions = () => {
    if (!formData.title) return;
    
    // Simulate AI processing
    setTimeout(() => {
      const titleLower = formData.title.toLowerCase();
      let suggestedCategory = 'accessories';
      let suggestedCondition = 'good';

      // Simple keyword matching for demo
      if (titleLower.includes('laptop') || titleLower.includes('phone') || titleLower.includes('electronics')) {
        suggestedCategory = 'electronics';
      } else if (titleLower.includes('shirt') || titleLower.includes('jacket') || titleLower.includes('dress')) {
        suggestedCategory = 'clothing';
      } else if (titleLower.includes('chair') || titleLower.includes('table') || titleLower.includes('furniture')) {
        suggestedCategory = 'furniture';
      } else if (titleLower.includes('book') || titleLower.includes('novel')) {
        suggestedCategory = 'books';
      }

      if (titleLower.includes('new') || titleLower.includes('mint')) {
        suggestedCondition = 'excellent';
      } else if (titleLower.includes('used') || titleLower.includes('worn')) {
        suggestedCondition = 'fair';
      }

      setAiSuggestions({
        category: suggestedCategory,
        condition: suggestedCondition
      });
    }, 1000);
  };

  const calculateEcoImpact = (category: string, condition: string) => {
    setIsGeneratingImpact(true);
    
    // Simulate impact calculation based on category and condition
    setTimeout(() => {
      let baseCO2 = 10;
      let baseWater = 1000;
      let baseEnergy = 50;

      // Category multipliers
      const categoryMultipliers = {
        clothing: { co2: 2.5, water: 10, energy: 3 },
        electronics: { co2: 8, water: 15, energy: 12 },
        furniture: { co2: 4, water: 2, energy: 6 },
        books: { co2: 1.5, water: 3, energy: 2 },
        sports: { co2: 2, water: 4, energy: 3 },
        accessories: { co2: 1.8, water: 5, energy: 2.5 },
        home: { co2: 3, water: 6, energy: 4 },
        toys: { co2: 2.2, water: 4, energy: 3.5 }
      };

      // Condition multipliers
      const conditionMultipliers = {
        excellent: 1.2,
        good: 1.0,
        fair: 0.8
      };

      const catMult = categoryMultipliers[category as keyof typeof categoryMultipliers] || { co2: 2, water: 5, energy: 3 };
      const condMult = conditionMultipliers[condition as keyof typeof conditionMultipliers] || 1;

      const impact = {
        co2Saved: Number((baseCO2 * catMult.co2 * condMult).toFixed(1)),
        waterSaved: Number((baseWater * catMult.water * condMult).toFixed(0)),
        energySaved: Number((baseEnergy * catMult.energy * condMult).toFixed(1))
      };

      setEcoImpact(impact);
      setIsGeneratingImpact(false);
    }, 1500);
  };

  const applySuggestion = (field: 'category' | 'condition') => {
    if (!aiSuggestions) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: aiSuggestions[field]
    }));
    
    // Calculate eco impact when both category and condition are available
    if (field === 'category' && formData.condition) {
      calculateEcoImpact(aiSuggestions.category, formData.condition);
    } else if (field === 'condition' && formData.category) {
      calculateEcoImpact(formData.category, aiSuggestions.condition);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setFormData(prev => ({ ...prev, category }));
    
    if (formData.condition) {
      calculateEcoImpact(category, formData.condition);
    }
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const condition = e.target.value;
    setFormData(prev => ({ ...prev, condition }));
    
    if (formData.category) {
      calculateEcoImpact(formData.category, condition);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ecoImpact) return;

    // Add product
    addProduct({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      price: formData.price,
      image: formData.image || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      sellerId: user.id,
      sellerName: user.name,
      ecoImpact,
      status: 'available'
    });

    // Update user points and badges
    const newEcoPoints = user.ecoPoints + 50; // Listing bonus
    const newBadges = [...user.badges];
    
    if (!user.badges.includes('🏪 First Seller') && getUserProducts(user.id).length === 0) {
      newBadges.push('🏪 First Seller');
    }
    
    if (newEcoPoints >= 100 && !user.badges.includes('💯 Century Club')) {
      newBadges.push('💯 Century Club');
    }

    updateUser({
      ecoPoints: newEcoPoints,
      badges: newBadges,
      totalImpact: {
        co2Saved: user.totalImpact.co2Saved + ecoImpact.co2Saved,
        waterSaved: user.totalImpact.waterSaved + ecoImpact.waterSaved,
        energySaved: user.totalImpact.energySaved + ecoImpact.energySaved
      }
    });

    navigate('/marketplace');
  };

  // Mock function for user products (would be from context in real implementation)
  const getUserProducts = (userId: string) => {
    return JSON.parse(localStorage.getItem('ecofinds-products') || '[]')
      .filter((p: any) => p.sellerId === userId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">List Your Item</h1>
        <p className="text-xl text-gray-600">Give your pre-loved items a new home and earn eco points!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Package className="h-6 w-6 text-green-600" />
            <span>Item Details</span>
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                onBlur={simulateAISuggestions}
                placeholder="e.g., Vintage Leather Jacket, iPhone 12, Wooden Coffee Table"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your item's features, condition, size, color, any defects, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                
                {/* AI Suggestion for Category */}
                {aiSuggestions && aiSuggestions.category !== formData.category && (
                  <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-700">
                          AI suggests: <strong>{categories.find(c => c.value === aiSuggestions.category)?.label}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion('category')}
                        className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  name="condition"
                  required
                  value={formData.condition}
                  onChange={handleConditionChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select condition</option>
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value} title={cond.description}>
                      {cond.label}
                    </option>
                  ))}
                </select>
                
                {/* AI Suggestion for Condition */}
                {aiSuggestions && aiSuggestions.condition !== formData.condition && (
                  <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-700">
                          AI suggests: <strong>{conditions.find(c => c.value === aiSuggestions.condition)?.label}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion('condition')}
                        className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Camera className="h-6 w-6 text-green-600" />
            <span>Photos</span>
          </h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">Upload photos of your item</div>
              <p className="text-gray-600 mb-4">Add up to 5 photos. First photo will be the main image.</p>
              <button
                type="button"
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Choose Files
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>Tips for great photos:</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Use natural lighting when possible</li>
                <li>Show the item from multiple angles</li>
                <li>Include any defects or wear clearly</li>
                <li>Keep backgrounds clean and simple</li>
              </ul>
            </div>

            {/* Sample Image Selection for Demo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Or select a sample image:</label>
              <div className="grid grid-cols-5 gap-2">
                {sampleImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: img }))}
                    className={`border-2 rounded-lg overflow-hidden ${
                      formData.image === img ? 'border-green-500' : 'border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Sample ${index + 1}`} className="w-full h-16 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        {(formData.category && formData.condition) && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <span>Environmental Impact</span>
            </h2>

            {isGeneratingImpact ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg text-gray-600">Calculating environmental impact...</span>
                </div>
              </div>
            ) : ecoImpact ? (
              <div>
                <p className="text-lg text-gray-700 mb-6">
                  By selling this item instead of discarding it, you'll help save:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl mb-2">🌍</div>
                    <div className="text-3xl font-bold text-green-600">{ecoImpact.co2Saved}kg</div>
                    <div className="text-gray-600">CO₂ Emissions Prevented</div>
                    <div className="text-xs text-gray-500 mt-1">
                      = Planting {(ecoImpact.co2Saved / 22).toFixed(1)} trees
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl mb-2">💧</div>
                    <div className="text-3xl font-bold text-blue-600">{ecoImpact.waterSaved.toLocaleString()}L</div>
                    <div className="text-gray-600">Water Conserved</div>
                    <div className="text-xs text-gray-500 mt-1">
                      = {Math.floor(ecoImpact.waterSaved / 185)} days of drinking water
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-yellow-600">{ecoImpact.energySaved}kWh</div>
                    <div className="text-gray-600">Energy Saved</div>
                    <div className="text-xs text-gray-500 mt-1">
                      = Powers a home for {(ecoImpact.energySaved / 30).toFixed(1)} days
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Eco Rewards</span>
                  </div>
                  <p className="text-green-700">
                    You'll earn <strong>50 eco points</strong> for listing this item, plus additional points when it sells!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600">Complete category and condition to see environmental impact</p>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              <p>By listing this item, you agree to EcoFinds' seller terms and commit to honest descriptions.</p>
            </div>
            
            <button
              type="submit"
              disabled={!ecoImpact}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Package className="h-5 w-5" />
              <span>List Item & Earn Points</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListItem;