import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardUser {
  id: string;
  name: string;
  ecoPoints: number;
  badges: string[];
  totalImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  };
  rank: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo, we'll create sample leaderboard data
    const sampleUsers: LeaderboardUser[] = [
      {
        id: '1',
        name: 'Sarah Green',
        ecoPoints: 2450,
        badges: ['🌱 Green Pioneer', '♻️ Recycling Champion', '🏆 Eco Master', '💧 Water Guardian'],
        totalImpact: { co2Saved: 180.5, waterSaved: 45000, energySaved: 890 },
        rank: 1
      },
      {
        id: '2',
        name: 'Mike EcoWarrior',
        ecoPoints: 2180,
        badges: ['🌱 Green Pioneer', '♻️ Recycling Champion', '🏆 Eco Master'],
        totalImpact: { co2Saved: 165.2, waterSaved: 42000, energySaved: 780 },
        rank: 2
      },
      {
        id: '3',
        name: 'Emma Sustainable',
        ecoPoints: 1950,
        badges: ['🌱 Green Pioneer', '♻️ Recycling Champion'],
        totalImpact: { co2Saved: 145.8, waterSaved: 38000, energySaved: 720 },
        rank: 3
      },
      {
        id: '4',
        name: 'Alex ClimateHero',
        ecoPoints: 1720,
        badges: ['🌱 Green Pioneer', '♻️ Recycling Champion'],
        totalImpact: { co2Saved: 125.4, waterSaved: 32000, energySaved: 650 },
        rank: 4
      },
      {
        id: '5',
        name: 'Lisa EcoFriend',
        ecoPoints: 1580,
        badges: ['🌱 Green Pioneer'],
        totalImpact: { co2Saved: 118.2, waterSaved: 28000, energySaved: 590 },
        rank: 5
      }
    ];

    // Add current user if logged in
    if (user) {
      const currentUserInList = sampleUsers.find(u => u.id === user.id);
      if (!currentUserInList) {
        const userRank = sampleUsers.filter(u => u.ecoPoints > user.ecoPoints).length + 1;
        sampleUsers.push({
          id: user.id,
          name: user.name,
          ecoPoints: user.ecoPoints,
          badges: user.badges,
          totalImpact: user.totalImpact,
          rank: userRank
        });
      }
    }

    // Sort by eco points and assign ranks
    const sortedUsers = sampleUsers
      .sort((a, b) => b.ecoPoints - a.ecoPoints)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    setLeaderboardUsers(sortedUsers);
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-yellow-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-yellow-500 to-yellow-700';
      default:
        return 'from-gray-200 to-gray-300';
    }
  };

  const topThree = leaderboardUsers.slice(0, 3);
  const remaining = leaderboardUsers.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Sustainability Leaderboard</h1>
        <p className="text-xl text-gray-600">Celebrating our eco-warriors making the biggest impact</p>
      </div>

      {/* Filter */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-1">
          <div className="flex space-x-1">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'month', label: 'This Month' },
              { value: 'week', label: 'This Week' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value as any)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  timeFilter === filter.value
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">
              {leaderboardUsers.reduce((sum, user) => sum + user.totalImpact.co2Saved, 0).toFixed(1)}kg
            </div>
            <div className="text-gray-600">Total CO₂ Prevented</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {leaderboardUsers.reduce((sum, user) => sum + user.totalImpact.waterSaved, 0).toLocaleString()}L
            </div>
            <div className="text-gray-600">Water Conserved</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{leaderboardUsers.length}</div>
            <div className="text-gray-600">Active Eco Warriors</div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 border border-green-100">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">🏆 Top Performers</h2>
        
        <div className="flex justify-center items-end space-x-4 max-w-4xl mx-auto">
          {/* Second Place */}
          {topThree[1] && (
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4 transform hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-gray-300 to-gray-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{topThree[1].name}</h3>
                  <div className="text-2xl font-bold text-green-600">{topThree[1].ecoPoints}</div>
                  <div className="text-xs text-gray-600 mb-3">eco points</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {topThree[1].badges.slice(0, 2).map((badge, i) => (
                      <span key={i} className="text-xs">{badge.split(' ')[0]}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-t from-gray-400 to-gray-300 w-24 h-20 rounded-t-lg flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
          )}

          {/* First Place */}
          {topThree[0] && (
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-300 p-6 mb-4 transform hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{topThree[0].name}</h3>
                  <div className="text-3xl font-bold text-green-600">{topThree[0].ecoPoints}</div>
                  <div className="text-xs text-gray-600 mb-3">eco points</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {topThree[0].badges.slice(0, 3).map((badge, i) => (
                      <span key={i} className="text-xs">{badge.split(' ')[0]}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 w-28 h-32 rounded-t-lg flex items-center justify-center">
                <Crown className="h-10 w-10 text-white" />
              </div>
            </div>
          )}

          {/* Third Place */}
          {topThree[2] && (
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4 transform hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{topThree[2].name}</h3>
                  <div className="text-2xl font-bold text-green-600">{topThree[2].ecoPoints}</div>
                  <div className="text-xs text-gray-600 mb-3">eco points</div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {topThree[2].badges.slice(0, 2).map((badge, i) => (
                      <span key={i} className="text-xs">{badge.split(' ')[0]}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-t from-yellow-700 to-yellow-600 w-20 h-16 rounded-t-lg flex items-center justify-center">
                <Medal className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Complete Rankings</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {leaderboardUsers.map((leaderUser, index) => (
            <div
              key={leaderUser.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                user && leaderUser.id === user.id ? 'bg-green-50 border-l-4 border-green-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(leaderUser.rank)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {leaderUser.name}
                      {user && leaderUser.id === user.id && (
                        <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          You
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      {leaderUser.badges.slice(0, 3).map((badge, i) => (
                        <span key={i} className="text-sm">{badge.split(' ')[0]}</span>
                      ))}
                      {leaderUser.badges.length > 3 && (
                        <span className="text-xs text-gray-500">+{leaderUser.badges.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{leaderUser.ecoPoints}</div>
                  <div className="text-sm text-gray-600">eco points</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="font-semibold text-green-600">
                    {leaderUser.totalImpact.co2Saved.toFixed(1)}kg
                  </div>
                  <div className="text-gray-600">CO₂ Saved</div>
                </div>
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="font-semibold text-blue-600">
                    {leaderUser.totalImpact.waterSaved.toLocaleString()}L
                  </div>
                  <div className="text-gray-600">Water</div>
                </div>
                <div className="text-center bg-yellow-50 rounded-lg p-3">
                  <div className="font-semibold text-yellow-600">
                    {leaderUser.totalImpact.energySaved.toFixed(0)}kWh
                  </div>
                  <div className="text-gray-600">Energy</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 text-white text-center">
        <TrendingUp className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Join the Movement!</h2>
        <p className="text-xl mb-6 opacity-90">
          Every sustainable action counts. Start listing items or shop second-hand to climb the leaderboard!
        </p>
        {!user && (
          <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            Sign Up & Start Your Journey
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;