export const awards = [
  {
    id: 1,
    title: "Global Climate Innovation Award 2024",
    category: "Climate Innovation",
    year: 2024,
    organization: "International Climate Foundation",
    description: "Recognized for groundbreaking research in renewable energy integration and community-based climate solutions.",
    image: "https://images.unsplash.com/photo-1551818255-e6e10975cd17?w=600&h=400&fit=crop",
    type: "award",
    featured: true,
    level: "international",
    date: "2024-11-15",
    impact: "This recognition highlights FEED's commitment to innovative climate solutions that bridge the gap between research and real-world implementation."
  },
  {
    id: 2,
    title: "Best Energy Research Institute - Nepal 2024",
    category: "Research Excellence",
    year: 2024,
    organization: "Nepal Academy of Science and Technology",
    description: "Awarded for outstanding contributions to energy research and policy development in Nepal.",
    image: "https://images.unsplash.com/photo-1569144157596-1d61b5518167?w=600&h=400&fit=crop",
    type: "award",
    featured: true,
    level: "national",
    date: "2024-09-20",
    impact: "This award recognizes FEED's leadership in advancing Nepal's energy transition through evidence-based research and policy recommendations."
  },
  {
    id: 3,
    title: "UN SDG Partnership Recognition",
    category: "Sustainable Development",
    year: 2024,
    organization: "United Nations Development Programme",
    description: "Recognized as a key partner in advancing SDG 7 (Affordable and Clean Energy) in South Asia.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop",
    type: "recognition",
    featured: false,
    level: "international",
    date: "2024-06-05",
    impact: "This partnership recognition validates FEED's contribution to global sustainable development goals through local action."
  },
  {
    id: 4,
    title: "Excellence in Community Engagement",
    category: "Community Impact",
    year: 2023,
    organization: "South Asian Development Council",
    description: "Honored for innovative approaches to community-led energy transitions and grassroots capacity building.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    type: "award",
    featured: false,
    level: "regional",
    date: "2023-12-10",
    impact: "Recognition of FEED's unique methodology in empowering communities to lead their own energy transformation projects."
  },
  {
    id: 5,
    title: "Outstanding Research Publication Award",
    category: "Academic Excellence",
    year: 2023,
    organization: "International Journal of Renewable Energy",
    description: "Awarded for the most cited research paper on renewable energy integration in developing countries.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    type: "award",
    featured: false,
    level: "international",
    date: "2023-08-15",
    impact: "This academic recognition demonstrates FEED's contribution to global knowledge in renewable energy systems."
  }
];

export const achievements = [
  {
    id: 1,
    title: "50+ Communities Electrified",
    category: "Energy Access",
    year: 2024,
    description: "Successfully implemented renewable energy solutions in over 50 remote communities across Nepal, providing clean electricity access to 25,000+ people.",
    icon: "⚡",
    metrics: {
      communities: 52,
      beneficiaries: 25400,
      capacity: "2.5 MW"
    },
    type: "milestone",
    featured: true,
    impact: "Transformed lives through reliable electricity access, enabling education, healthcare, and economic opportunities in remote areas."
  },
  {
    id: 2,
    title: "Policy Impact: Nepal's Energy Transition Strategy",
    category: "Policy Influence",
    year: 2024,
    description: "Key contributor to Nepal's National Energy Transition Strategy, with 80% of FEED's recommendations incorporated into the final policy.",
    icon: "📋",
    metrics: {
      policies: 3,
      recommendations: 24,
      adoption_rate: "80%"
    },
    type: "milestone",
    featured: true,
    impact: "Direct influence on national energy policy, shaping Nepal's path toward renewable energy transition."
  },
  {
    id: 3,
    title: "$10M+ in Climate Finance Mobilized",
    category: "Financial Impact",
    year: 2024,
    description: "Successfully mobilized over $10 million in climate finance for renewable energy projects across South Asia through innovative financing mechanisms.",
    icon: "💰",
    metrics: {
      amount: "$10.2M",
      projects: 15,
      countries: 4
    },
    type: "milestone",
    featured: false,
    impact: "Unlocked significant capital for climate action, demonstrating the viability of innovative financing approaches."
  },
  {
    id: 4,
    title: "1000+ Professionals Trained",
    category: "Capacity Building",
    year: 2024,
    description: "Conducted comprehensive training programs for over 1000 energy professionals, government officials, and community leaders.",
    icon: "🎓",
    metrics: {
      trainees: 1050,
      programs: 25,
      institutions: 12
    },
    type: "milestone",
    featured: false,
    impact: "Built local capacity for sustainable energy development, creating a network of skilled professionals across the region."
  },
  {
    id: 5,
    title: "Carbon Emissions Reduced by 50,000 tons CO2",
    category: "Environmental Impact",
    year: 2024,
    description: "FEED's renewable energy projects have collectively reduced carbon emissions by over 50,000 tons of CO2 equivalent.",
    icon: "🌱",
    metrics: {
      co2_reduced: "50,000 tons",
      projects: 35,
      equivalent: "10,000 cars off road"
    },
    type: "milestone",
    featured: true,
    impact: "Measurable contribution to climate change mitigation through direct emission reductions."
  }
];

export const milestones = [
  {
    year: 2024,
    title: "Global Recognition Year",
    events: [
      "Won Global Climate Innovation Award",
      "Reached 50 communities milestone",
      "Mobilized $10M+ in climate finance",
      "Published 12 research papers"
    ]
  },
  {
    year: 2023,
    title: "Expansion and Excellence",
    events: [
      "Expanded operations to 4 countries",
      "Launched Community Energy Leadership Program",
      "Established partnerships with 10 universities",
      "Received Excellence in Community Engagement Award"
    ]
  },
  {
    year: 2022,
    title: "Innovation and Growth",
    events: [
      "Developed innovative microfinance model for energy access",
      "Launched digital platform for energy project monitoring",
      "Trained 500+ energy professionals",
      "Established regional office in Bangladesh"
    ]
  },
  {
    year: 2021,
    title: "Foundation and Impact",
    events: [
      "FEED established with core team of 8 experts",
      "First community energy project completed",
      "Partnership with UNDP initiated",
      "Baseline research on regional energy access published"
    ]
  }
];

export const getAwardsByCategory = (category) => {
  if (category === "All") return awards;
  return awards.filter(award => award.category === category);
};

export const getAchievementsByCategory = (category) => {
  if (category === "All") return achievements;
  return achievements.filter(achievement => achievement.category === category);
};

export const getFeaturedAwards = () => {
  return awards.filter(award => award.featured);
};

export const getFeaturedAchievements = () => {
  return achievements.filter(achievement => achievement.featured);
};

export const getAwardsByYear = (year) => {
  return awards.filter(award => award.year === year);
};

export const getRecentAwards = (limit = 5) => {
  return awards
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const awardCategories = [
  "All",
  "Climate Innovation",
  "Research Excellence", 
  "Sustainable Development",
  "Community Impact",
  "Academic Excellence"
];

export const achievementCategories = [
  "All",
  "Energy Access",
  "Policy Influence",
  "Financial Impact",
  "Capacity Building",
  "Environmental Impact"
];

export const getAwardStats = () => {
  return {
    totalAwards: awards.length,
    internationalAwards: awards.filter(award => award.level === "international").length,
    nationalAwards: awards.filter(award => award.level === "national").length,
    regionalAwards: awards.filter(award => award.level === "regional").length,
    recentYear: Math.max(...awards.map(award => award.year))
  };
};
