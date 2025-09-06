import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Award, TrendingUp, ShoppingBag, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Leaf,
      title: 'Eco Impact Tracking',
      description: 'See real-time CO₂, water, and energy savings with every purchase',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: Award,
      title: 'Gamified Experience',
      description: 'Earn eco points, unlock badges, and climb the sustainability leaderboard',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Zap,
      title: 'AI-Powered Listings',
      description: 'Smart category suggestions and condition assessment for your items',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with like-minded individuals committed to sustainable living',
      color: 'from-blue-400 to-blue-600'
    }
  ];

  const stats = [
    { value: '2.5M+', label: 'CO₂ Saved (kg)', icon: '🌍' },
    { value: '45K+', label: 'Items Traded', icon: '♻️' },
    { value: '12K+', label: 'Happy Users', icon: '👥' },
    { value: '850K+', label: 'Water Saved (L)', icon: '💧' }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent leading-tight">
            Sustainable Second-Hand
            <br />
            <span className="text-amber-600">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join the revolution against fast fashion and overconsumption. Buy, sell, and donate pre-loved items while tracking your positive environmental impact.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/marketplace"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Explore Marketplace</span>
          </Link>
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Join Community</span>
            </Link>
          )}
        </div>

        {/* Impact Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto border border-green-100">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-800">Your Impact Matters</span>
          </div>
          <p className="text-sm text-gray-600">
            Every second-hand purchase prevents new manufacturing and reduces waste. 
            Start tracking your environmental savings today!
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white rounded-3xl shadow-lg p-8 border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Community Impact</h2>
          <p className="text-gray-600">Together, we're making a difference for our planet</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-2xl font-bold text-green-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose EcoFinds?</h2>
          <p className="text-xl text-gray-600">Sustainable shopping made smart, social, and rewarding</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl w-fit mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-green-50 to-amber-50 rounded-3xl p-8 border border-green-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Simple steps to sustainable shopping</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800">List or Browse</h3>
            <p className="text-gray-600">Upload items with AI-powered categorization or browse thousands of pre-loved products</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Connect & Trade</h3>
            <p className="text-gray-600">Message sellers, negotiate prices, and complete secure transactions</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Earn & Impact</h3>
            <p className="text-gray-600">Earn eco points, get blockchain certificates, and see your environmental impact</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of eco-warriors who are reshaping how we consume
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={isAuthenticated ? "/list-item" : "/auth"}
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Start Selling Today
          </Link>
          <Link
            to="/marketplace"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition-all"
          >
            Shop Sustainably
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;