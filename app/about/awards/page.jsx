"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroBanner from '@/components/HeroBanner'
import { Award, Trophy, Target, Calendar, Users, MapPin, TrendingUp, Star, Medal, Crown, Zap, BookOpen } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { 
  awards, 
  achievements, 
  milestones,
  awardCategories, 
  achievementCategories,
  getAwardsByCategory,
  getAchievementsByCategory,
  getFeaturedAwards,
  getFeaturedAchievements,
  getAwardStats
} from '@/src/data/awards'

export default function AwardsPage() {
  const [activeAwardFilter, setActiveAwardFilter] = useState('All')
  const [activeAchievementFilter, setActiveAchievementFilter] = useState('All')
  const [activeTab, setActiveTab] = useState('awards')

  const filteredAwards = getAwardsByCategory(activeAwardFilter)
  const filteredAchievements = getAchievementsByCategory(activeAchievementFilter)
  const featuredAwards = getFeaturedAwards()
  const featuredAchievements = getFeaturedAchievements()
  const stats = getAwardStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getIconForCategory = (category) => {
    const iconMap = {
      "Energy Access": "⚡",
      "Policy Influence": "📋",
      "Financial Impact": "💰",
      "Capacity Building": "🎓",
      "Environmental Impact": "🌱",
      "Climate Innovation": "🔬",
      "Research Excellence": "📖",
      "Sustainable Development": "🌍",
      "Community Impact": "👥",
      "Academic Excellence": "🏆"
    }
    return iconMap[category] || "🏅"
  }

  const getLevelColor = (level) => {
    switch(level) {
      case 'international': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'national': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'regional': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Banner */}
        <HeroBanner
          title="Awards & Achievements"
          description="Celebrating our commitment to sustainable energy, community empowerment, and climate action"
          badgeText="Excellence & Recognition"
          badgeIcon={Trophy}
        />

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-700 mb-2">{stats.totalAwards}</div>
                <div className="text-yellow-600 font-medium">Total Awards</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <Crown className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-700 mb-2">{stats.internationalAwards}</div>
                <div className="text-blue-600 font-medium">International</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-700 mb-2">25K+</div>
                <div className="text-green-600 font-medium">Lives Impacted</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-700 mb-2">{stats.recentYear}</div>
                <div className="text-purple-600 font-medium">Latest Recognition</div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="container mx-auto px-6">
            <div className="flex justify-center">
              <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('awards')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'awards'
                      ? 'bg-[#1A365D] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-5 h-5 inline mr-2" />
                  Awards & Recognition
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'achievements'
                      ? 'bg-[#1A365D] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Target className="w-5 h-5 inline mr-2" />
                  Key Achievements
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === 'timeline'
                      ? 'bg-[#1A365D] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Awards Section */}
        {activeTab === 'awards' && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              {/* Featured Awards */}
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-8 text-center">Featured Awards</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {featuredAwards.map((award) => (
                    <div key={award.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg overflow-hidden shadow-lg border border-yellow-200">
                      <div className="h-48 overflow-hidden">
                        <Image
                          src={award.image}
                          alt={award.title}
                          width={600}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(award.level)}`}>
                            {award.level.charAt(0).toUpperCase() + award.level.slice(1)}
                          </span>
                          <span className="text-sm text-gray-600">{award.year}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-2">{award.title}</h3>
                        <p className="text-orange-700 font-medium mb-3">{award.organization}</p>
                        <p className="text-gray-700 mb-4">{award.description}</p>
                        <div className="bg-white/50 p-3 rounded-md">
                          <p className="text-sm text-gray-600 italic">{award.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter and All Awards */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">All Awards & Recognition</h2>
                  <div className="flex flex-wrap gap-2">
                    {awardCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveAwardFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeAwardFilter === category
                            ? 'bg-[#1A365D] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAwards.map((award) => (
                    <div key={award.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                      <div className="h-40 overflow-hidden rounded-t-lg">
                        <Image
                          src={award.image}
                          alt={award.title}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{getIconForCategory(award.category)}</span>
                          <span className="text-sm text-gray-500">{award.year}</span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-[#1A365D] mb-2">{award.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{award.organization}</p>
                        <p className="text-gray-700 text-sm mb-3">{award.description}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(award.level)}`}>
                          {award.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {activeTab === 'achievements' && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              {/* Featured Achievements */}
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-8 text-center">Key Achievements</h2>
                <div className="grid lg:grid-cols-3 gap-8">
                  {featuredAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center shadow-lg border border-blue-200">
                      <div className="text-6xl mb-4">{achievement.icon}</div>
                      <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{achievement.title}</h3>
                      <p className="text-gray-700 mb-6">{achievement.description}</p>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {Object.entries(achievement.metrics).map(([key, value]) => (
                          <div key={key} className="bg-white/50 rounded-lg p-3">
                            <div className="font-bold text-blue-700">{value}</div>
                            <div className="text-xs text-blue-600 capitalize">{key.replace('_', ' ')}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white/70 p-3 rounded-md">
                        <p className="text-sm text-gray-600 italic">{achievement.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Achievements with Filter */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h2 className="text-2xl font-serif font-bold text-[#1A365D]">All Achievements</h2>
                  <div className="flex flex-wrap gap-2">
                    {achievementCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveAchievementFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          activeAchievementFilter === category
                            ? 'bg-[#1A365D] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredAchievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                            {achievement.icon}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <h3 className="text-xl font-serif font-bold text-[#1A365D]">{achievement.title}</h3>
                            <span className="text-sm text-gray-500 mt-1 sm:mt-0">{achievement.year}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{achievement.description}</p>
                          <div className="flex flex-wrap gap-4 mb-4">
                            {Object.entries(achievement.metrics).map(([key, value]) => (
                              <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
                                <div className="font-semibold text-[#1A365D]">{value}</div>
                                <div className="text-xs text-gray-600 capitalize">{key.replace('_', ' ')}</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-md">{achievement.impact}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {activeTab === 'timeline' && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-serif font-bold text-[#1A365D] mb-12 text-center">Our Journey of Excellence</h2>
              <div className="max-w-4xl mx-auto">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative mb-12">
                    {/* Timeline Line */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-full bg-gradient-to-b from-[#1A365D] to-gray-300"></div>
                    )}
                    
                    {/* Timeline Node */}
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-[#1A365D] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {milestone.year}
                      </div>
                      <div className="flex-grow bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-2xl font-serif font-bold text-[#1A365D] mb-4">{milestone.title}</h3>
                        <ul className="space-y-3">
                          {milestone.events.map((event, eventIndex) => (
                            <li key={eventIndex} className="flex items-start gap-3">
                              <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{event}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16 bg-[#1A365D]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Join Our Mission for Sustainable Energy
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of our journey towards a sustainable energy future. Together, we can achieve even greater milestones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about/team"
                className="inline-flex items-center bg-[#B22234] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-300"
              >
                <Users className="mr-2 w-5 h-5" />
                Meet Our Team
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-[#1A365D] transition-all duration-300"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                View Our Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
