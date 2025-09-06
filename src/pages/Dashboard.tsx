import React from 'react';
import { TrendingUp, Award, Leaf, ShoppingBag, Plus, Share2, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserProducts, getUserTransactions } = useProducts();

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your dashboard</h2>
        <Link
          to="/auth"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userProducts = getUserProducts(user.id);
  const userTransactions = getUserTransactions(user.id);
  
  const stats = [
    {
      icon: ShoppingBag,
      label: 'Items Listed',
      value: userProducts.length.toString(),
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Items Sold',
      value: userTransactions.filter(t => t.sellerId === user.id).length.toString(),
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: Award,
      label: 'Eco Points',
      value: user.ecoPoints.toString(),
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      icon: Leaf,
      label: 'CO₂ Saved',
      value: `${user.totalImpact.co2Saved.toFixed(1)}kg`,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ];

  const recentBadges = user.badges.slice(-3);

  const generateCertificate = () => {
    const certificateData = {
      userName: user.name,
      totalImpact: user.totalImpact,
      ecoPoints: user.ecoPoints,
      badges: user.badges.length,
      generatedAt: new Date().toISOString()
    };
    
    // Simple hash generation for demo
    const certificateHash = btoa(JSON.stringify(certificateData)).slice(0, 16);
    
    const certificateText = `
🌍 EcoFinds Sustainability Certificate

Certificate ID: ECO-${certificateHash}
Holder: ${user.name}

Environmental Impact Achieved:
• CO₂ Reduced: ${user.totalImpact.co2Saved.toFixed(1)} kg
• Water Saved: ${user.totalImpact.waterSaved.toFixed(0)} L
• Energy Saved: ${user.totalImpact.energySaved.toFixed(1)} kWh

Achievement Summary:
• Eco Points Earned: ${user.ecoPoints}
• Badges Unlocked: ${user.badges.length}
• Sustainable Actions: ${userTransactions.length}

Generated on: ${new Date().toLocaleDateString()}

"Every sustainable choice matters. Together, we're building a greener future."
    `;

    const element = document.createElement('a');
    const file = new Blob([certificateText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `EcoFinds-Certificate-${user.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareImpact = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My EcoFinds Impact',
        text: `I've saved ${user.totalImpact.co2Saved.toFixed(1)}kg CO₂ and earned ${user.ecoPoints} eco points through sustainable shopping on EcoFinds! 🌍`,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I've saved ${user.totalImpact.co2Saved.toFixed(1)}kg CO₂ and earned ${user.ecoPoints} eco points through sustainable shopping on EcoFinds! 🌍 ${window.location.origin}`;
      navigator.clipboard.writeText(shareText);
      alert('Impact shared to clipboard!');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-xl opacity-90">
              You're making a real difference with sustainable choices
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button
              onClick={shareImpact}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Impact</span>
            </button>
            <button
              onClick={generateCertificate}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Environmental Impact */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Environmental Impact</h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">CO₂ Emissions Prevented</span>
                <span className="text-2xl font-bold text-green-600">{user.totalImpact.co2Saved.toFixed(1)}kg</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(user.totalImpact.co2Saved / 100 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-700 mt-1">Equivalent to planting {(user.totalImpact.co2Saved / 22).toFixed(1)} trees</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Water Conserved</span>
                <span className="text-2xl font-bold text-blue-600">{user.totalImpact.waterSaved.toLocaleString()}L</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(user.totalImpact.waterSaved / 50000 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-700 mt-1">{(user.totalImpact.waterSaved / 185).toFixed(0)} days of drinking water saved</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-800">Energy Saved</span>
                <span className="text-2xl font-bold text-yellow-600">{user.totalImpact.energySaved.toFixed(1)}kWh</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(user.totalImpact.energySaved / 1000 * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-yellow-700 mt-1">Powers a home for {(user.totalImpact.energySaved / 30).toFixed(1)} days</p>
            </div>
          </div>
        </div>

        {/* Badges and Achievements */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges & Achievements</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-yellow-800">Current Level</span>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Level {Math.floor(user.ecoPoints / 100) + 1}
                </span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full" 
                  style={{ width: `${(user.ecoPoints % 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                {100 - (user.ecoPoints % 100)} points to next level
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recent Badges</h3>
              <div className="space-y-2">
                {recentBadges.length > 0 ? (
                  recentBadges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl">{badge.split(' ')[0]}</div>
                      <div>
                        <div className="font-medium text-gray-800">{badge.substring(2)}</div>
                        <div className="text-xs text-gray-600">Unlocked recently</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">No badges yet. Start listing or buying items to earn your first badges!</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800 font-medium">
                You've earned {user.badges.length} badges!
              </p>
              <p className="text-xs text-green-600 mt-1">
                Keep up the sustainable actions to unlock more
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/list-item"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-center"
          >
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">List New Item</h3>
            <p className="text-sm opacity-90">Earn points by listing items</p>
          </Link>

          <Link
            to="/marketplace"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
          >
            <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Browse Items</h3>
            <p className="text-sm opacity-90">Find sustainable products</p>
          </Link>

          <Link
            to="/leaderboard"
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 text-center"
          >
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">View Leaderboard</h3>
            <p className="text-sm opacity-90">See community rankings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;