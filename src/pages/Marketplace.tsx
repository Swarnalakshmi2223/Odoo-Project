import React, { useState } from 'react';
import { Search, Filter, Grid, List, Heart, MapPin, Clock } from 'lucide-react';
import { useProducts, Product } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const categories = [
    { value: 'all', label: 'All Categories', count: products.length },
    { value: 'clothing', label: 'Clothing', count: products.filter(p => p.category === 'clothing').length },
    { value: 'electronics', label: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
    { value: 'furniture', label: 'Furniture', count: products.filter(p => p.category === 'furniture').length },
    { value: 'books', label: 'Books', count: products.filter(p => p.category === 'books').length },
    { value: 'sports', label: 'Sports', count: products.filter(p => p.category === 'sports').length },
    { value: 'accessories', label: 'Accessories', count: products.filter(p => p.category === 'accessories').length }
  ];

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'eco-impact', label: 'Highest Eco Impact' }
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesCondition = selectedCondition === 'all' || product.condition === selectedCondition;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const isAvailable = product.status === 'available';
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice && isAvailable;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'eco-impact':
          return b.ecoImpact.co2Saved - a.ecoImpact.co2Saved;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 overflow-hidden">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <button className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)} capitalize`}>
              {product.condition}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-green-600">${product.price}</div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(product.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-gray-600 mb-3">
            <MapPin className="h-3 w-3" />
            <span>By {product.sellerName}</span>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-700 font-medium mb-1">Environmental Impact</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-green-600">{product.ecoImpact.co2Saved}kg</div>
                <div className="text-gray-600">CO₂ Saved</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">{product.ecoImpact.waterSaved}L</div>
                <div className="text-gray-600">Water</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">{product.ecoImpact.energySaved}kWh</div>
                <div className="text-gray-600">Energy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <Link to={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-4">
        <div className="flex space-x-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center space-x-4 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)} capitalize`}>
                    {product.condition}
                  </span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(product.createdAt)}</span>
                  <span className="text-xs text-gray-600">By {product.sellerName}</span>
                </div>
                
                <div className="flex items-center space-x-6 text-xs">
                  <div className="text-green-600">🌍 {product.ecoImpact.co2Saved}kg CO₂</div>
                  <div className="text-blue-600">💧 {product.ecoImpact.waterSaved}L</div>
                  <div className="text-yellow-600">⚡ {product.ecoImpact.energySaved}kWh</div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-green-600">${product.price}</div>
                <button className="mt-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sustainable Marketplace</h1>
        <p className="text-xl text-gray-600">Discover amazing pre-loved items and reduce your environmental footprint</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label} ({category.count})
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                className="w-20 px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                className="w-20 px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredProducts.length} Items Found
          </h2>
          {searchTerm && (
            <p className="text-gray-600">Results for "{searchTerm}"</p>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium text-green-600">
            {filteredProducts.reduce((sum, product) => sum + product.ecoImpact.co2Saved, 0).toFixed(1)}kg
          </span>
          {' '}total CO₂ savings available
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            viewMode === 'grid' 
              ? <ProductCard key={product.id} product={product} />
              : <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find more items.
          </p>
          <Link
            to="/list-item"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
          >
            List Your First Item
          </Link>
        </div>
      )}
    </div>
  );
};

export default Marketplace;