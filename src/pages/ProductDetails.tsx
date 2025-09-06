import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, MapPin, Clock, Shield, MessageCircle, Star, Award } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById, buyProduct } = useProducts();
  const { user, updateUser, isAuthenticated } = useAuth();
  
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);

  if (!id) {
    navigate('/marketplace');
    return null;
  }

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
      return;
    }

    setIsProcessingPurchase(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transaction = buyProduct(product.id, user.id);
      
      if (transaction) {
        // Update user points and badges
        const newEcoPoints = user.ecoPoints + 25; // Purchase bonus
        const newBadges = [...user.badges];
        
        if (!user.badges.includes('🛒 First Purchase')) {
          newBadges.push('🛒 First Purchase');
        }
        
        if (product.ecoImpact.co2Saved > 50 && !user.badges.includes('🌍 Climate Warrior')) {
          newBadges.push('🌍 Climate Warrior');
        }

        updateUser({
          ecoPoints: newEcoPoints,
          badges: newBadges,
          totalImpact: {
            co2Saved: user.totalImpact.co2Saved + product.ecoImpact.co2Saved,
            waterSaved: user.totalImpact.waterSaved + product.ecoImpact.waterSaved,
            energySaved: user.totalImpact.energySaved + product.ecoImpact.energySaved
          }
        });

        setCertificate(transaction);
        setShowCertificate(true);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const shareCertificate = () => {
    if (!certificate) return;
    
    const shareText = `🎉 I just made a sustainable purchase on EcoFinds! I saved ${product.ecoImpact.co2Saved}kg CO₂, ${product.ecoImpact.waterSaved}L water, and ${product.ecoImpact.energySaved}kWh energy. Certificate: ECO-${certificate.ecoCertificateHash} 🌍`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My EcoFinds Purchase Certificate',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Certificate details copied to clipboard!');
    }
  };

  const shareProduct = () => {
    const shareText = `Check out this sustainable product on EcoFinds: ${product.title} - Saving ${product.ecoImpact.co2Saved}kg CO₂! 🌍`;
    
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      alert('Product link copied to clipboard!');
    }
  };

  if (showCertificate && certificate) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border-2 border-green-200 p-8 text-center">
          <div className="mb-6">
            <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Purchase Successful!</h1>
            <p className="text-xl text-gray-600">You've made a positive environmental impact</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Eco Certificate</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">Certificate ID</div>
              <div className="font-mono text-lg font-bold text-gray-900">
                ECO-{certificate.ecoCertificateHash}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{product.ecoImpact.co2Saved}kg</div>
                <div className="text-xs text-gray-600">CO₂ Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{product.ecoImpact.waterSaved}L</div>
                <div className="text-xs text-gray-600">Water Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{product.ecoImpact.energySaved}kWh</div>
                <div className="text-xs text-gray-600">Energy Saved</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-green-800">
                <strong>Impact Equivalent:</strong> Planting {(product.ecoImpact.co2Saved / 22).toFixed(1)} trees, 
                saving {Math.floor(product.ecoImpact.waterSaved / 185)} days of drinking water, 
                and powering a home for {(product.ecoImpact.energySaved / 30).toFixed(1)} days!
              </div>
            </div>

            <p className="text-sm text-gray-600">
              This certificate is blockchain-verified and can be shared on social media to showcase your commitment to sustainability.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={shareCertificate}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
            >
              <Share2 className="h-5 w-5" />
              <span>Share Certificate</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
            >
              View Dashboard
            </button>

            <button
              onClick={() => navigate('/marketplace')}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          <button
            onClick={shareProduct}
            className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-100 transition-colors shadow-lg"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-100 transition-colors shadow-lg">
            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Seller Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">
                {product.sellerName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{product.sellerName}</div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Verified seller</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Message Seller</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Main Product Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Listed {formatTimeAgo(product.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Local pickup available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="text-4xl font-bold text-green-600">${product.price}</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(product.condition)} capitalize`}>
              {product.condition} condition
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.status === 'available' ? (
            <button
              onClick={handlePurchase}
              disabled={isProcessingPurchase || !isAuthenticated}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              {isProcessingPurchase ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Purchase...</span>
                </>
              ) : !isAuthenticated ? (
                <span>Sign In to Purchase</span>
              ) : (
                <>
                  <span>Buy Now & Earn Points</span>
                  <Award className="h-5 w-5" />
                </>
              )}
            </button>
          ) : (
            <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-xl font-bold text-lg text-center">
              {product.status === 'sold' ? 'Sold Out' : 'Reserved'}
            </div>
          )}

          {!isAuthenticated && (
            <p className="text-center text-sm text-gray-600 mt-4">
              <button 
                onClick={() => navigate('/auth')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button> to purchase items and track your eco impact
            </p>
          )}
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span>🌍</span>
            <span>Environmental Impact</span>
          </h3>
          
          <p className="text-gray-700 mb-6">
            By choosing this pre-loved item instead of buying new, you'll help save:
          </p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-2xl font-bold text-green-600">{product.ecoImpact.co2Saved}kg</div>
              <div className="text-sm text-gray-600">CO₂ Prevented</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-600">{product.ecoImpact.waterSaved}L</div>
              <div className="text-sm text-gray-600">Water Saved</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-yellow-600">{product.ecoImpact.energySaved}kWh</div>
              <div className="text-sm text-gray-600">Energy Saved</div>
            </div>
          </div>

          <div className="bg-green-100 rounded-lg p-4">
            <div className="text-sm text-green-800">
              <strong>Fun Fact:</strong> This purchase is equivalent to planting {(product.ecoImpact.co2Saved / 22).toFixed(1)} trees 
              and saving {Math.floor(product.ecoImpact.waterSaved / 185)} days worth of drinking water!
            </div>
          </div>
        </div>

        {/* Purchase Benefits */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 What You Get</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700">Earn 25 eco points for sustainable shopping</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-700">Blockchain eco-certificate for social sharing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-gray-700">Potential badges and leaderboard climb</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Heart className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-gray-700">Feel good about making a positive impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;