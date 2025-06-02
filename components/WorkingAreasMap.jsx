"use client"

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Province name mapping function to convert old names to current official names
const getOfficialProvinceName = (geoJsonProvinceName) => {
  const nameMapping = {
    "Province No 1": "Koshi Province",
    "Province No. 1": "Koshi Province",
    "Province No 2": "Madhesh Province", 
    "Province No. 2": "Madhesh Province",
    "Province No 3": "Bagmati Province",
    "Province No. 3": "Bagmati Province",
    "Province No 4": "Gandaki Province",
    "Province No. 4": "Gandaki Province",
    "Province No 5": "Lumbini Province",
    "Province No. 5": "Lumbini Province",
    "Province No 6": "Karnali Province",
    "Province No. 6": "Karnali Province",
    "Province No 7": "Sudurpashchim Province",
    "Province No. 7": "Sudurpashchim Province",
    // Keep existing correct names as they are
    "Koshi Province": "Koshi Province",
    "Madhesh Province": "Madhesh Province",
    "Bagmati Province": "Bagmati Province",
    "Gandaki Province": "Gandaki Province",
    "Lumbini Province": "Lumbini Province",
    "Karnali Province": "Karnali Province",
    "Sudurpashchim Province": "Sudurpashchim Province",
    // Handle alternative spellings
    "Sudurpashchim Pradesh": "Sudurpashchim Province",
    "Gandaki Pradesh": "Gandaki Province",
    "Karnali Pradesh": "Karnali Province",
    "Bagmati Pradesh": "Bagmati Province",
    "Lumbini Pradesh": "Lumbini Province"
  };
  
  return nameMapping[geoJsonProvinceName] || geoJsonProvinceName;
};

// Project types configuration
const projectTypes = {
  "Climate Change & Disaster Risk Reduction": {
    color: '#FF6B6B',
    keywords: ['landslide', 'flood', 'climate', 'disaster', 'risk', 'hazard', 'resilient']
  },
  "Hydropower Projects": {
    color: '#4ECDC4',
    keywords: ['hydropower', 'hydro power', 'MW', 'power project']
  },
  "Infrastructure & Development": {
    color: '#45B7D1',
    keywords: ['infrastructure', 'construction', 'supervision', 'engineering', 'design']
  },
  "Training & Capacity Building": {
    color: '#96CEB4',
    keywords: ['training', 'concepts', 'principles', 'application', 'drone', 'survey']
  },
  "Social & Economic Development": {
    color: '#FECA57',
    keywords: ['livelihood', 'income generation', 'enterprise', 'COVID', 'social', 'economic']
  }
};

// Function to categorize project by type
const categorizeProject = (projectName) => {
  const projectLower = projectName.toLowerCase();
  
  for (const [type, config] of Object.entries(projectTypes)) {
    if (config.keywords.some(keyword => projectLower.includes(keyword))) {
      return type;
    }
  }
  return "Other";
};

// Project data by province with categorization (using official names)
const provinceProjects = {
  "Sudurpashchim Province": [
    {
      name: "Landslide Susceptibility Mapping and Preliminary Geotechnical Assessment of Balaucha and Owa landslide of Aalital Rural Municipality, Dadeldhura",
      type: "Climate Change & Disaster Risk Reduction"
    }
  ],
  "Gandaki Province": [
    {
      name: "Develop a flood hazard model and flood risk reduction measure of the Kamalpokhari area of ward no.13, Pokhara metropolitan",
      type: "Climate Change & Disaster Risk Reduction"
    },
    {
      name: "COVID impact study on enterprise as well as CFUGs and Possibility for Livelihood Support through Income Generation",
      type: "Social & Economic Development"
    }
  ],
  "Bagmati Province": [
    {
      name: "Fundamental Concepts, Principles and Application of Drone Survey",
      type: "Training & Capacity Building"
    },
    {
      name: "Consulting Service for Risk Assessment of Flood affected/prone areas",
      type: "Climate Change & Disaster Risk Reduction"
    },
    {
      name: "Climate Resilient Infrastructure for social Transformation and Adaptation (CRISTA)",
      type: "Climate Change & Disaster Risk Reduction"
    },
    {
      name: "Construction supervision of Upper Chaku Hydropower project (22.5 MW)",
      type: "Hydropower Projects"
    }
  ],
  "Koshi Province": [
    {
      name: "Detailed Engineering Design of Sabha Khola (4 MW) Hydro Power Project",
      type: "Hydropower Projects"
    }
  ]
};

// Function to get project type distribution for a province
const getProjectTypeDistribution = (provinceName) => {
  const projects = provinceProjects[provinceName] || [];
  const typeCount = {};
  
  projects.forEach(project => {
    const type = project.type;
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  const labels = Object.keys(typeCount);
  const data = Object.values(typeCount);
  const colors = labels.map(type => projectTypes[type]?.color || '#999999');
  
  return {
    labels,
    data,
    colors,
    total: projects.length
  };
};

// Function to get all project types distribution
const getAllProjectTypesDistribution = () => {
  const allProjects = Object.values(provinceProjects).flat();
  const typeCount = {};
  
  allProjects.forEach(project => {
    const type = project.type;
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  
  const labels = Object.keys(typeCount);
  const data = Object.values(typeCount);
  const colors = labels.map(type => projectTypes[type]?.color || '#999999');
  
  return {
    labels,
    data,
    colors,
    total: allProjects.length
  };
};
const provinceData = {
  labels: [
    'Bagmati Province',
    'Gandaki Province', 
    'Lumbini Province',
    'Karnali Province',
    'Sudurpashchim Province',
    'Koshi Province',
    'Madhesh Province'
  ],
  datasets: [
    {
      data: [4, 2, 0, 0, 1, 1, 0], // Bagmati, Gandaki, Lumbini, Karnali, Sudurpaschim, Koshi, Madhesh
      backgroundColor: [
        '#3366CC', // Bagmati
        '#DC3912', // Gandaki
        '#FF9900', // Lumbini
        '#109618', // Karnali
        '#990099', // Sudurpaschim
        '#0099C6', // Koshi
        '#DD4477'  // Madhesh
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      label: 'Number of Projects'
    },
  ],
};

// Project status data (updated based on total 8 projects)
const statusData = {
  labels: ['Completed', 'Ongoing'],
  datasets: [
    {
      data: [8, 0], // All projects are completed
      backgroundColor: [
        '#3366CC',
        '#DC3912',
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      label: 'Project Status'
    },
  ],
};

const provinceChartOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 12
        },
        padding: 20,
        generateLabels: (chart) => {
          const datasets = chart.data.datasets[0];
          return chart.data.labels.map((label, i) => ({
            text: `${label} (${datasets.data[i]})`,
            fillStyle: datasets.backgroundColor[i],
            hidden: false,
            index: i
          }));
        }
      }
    },
    title: {
      display: true,
      text: 'Projects by Province',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value} projects`;
        }
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
};

const statusChartOptions = {
  plugins: {
    legend: {
      position: 'right',
      labels: {
        font: {
          size: 12
        },
        padding: 20,
        generateLabels: (chart) => {
          const datasets = chart.data.datasets[0];
          return chart.data.labels.map((label, i) => ({
            text: `${label} (${datasets.data[i]})`,
            fillStyle: datasets.backgroundColor[i],
            hidden: false,
            index: i
          }));
        }
      }
    },
    title: {
      display: true,
      text: 'Project Status Distribution',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        top: 10,
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function WorkingAreasMap() {
  const [nepalGeoJson, setNepalGeoJson] = useState(null);
  const [activeProvince, setActiveProvince] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredProjects, setHoveredProjects] = useState([]);
  const [projectTypeData, setProjectTypeData] = useState(getAllProjectTypesDistribution());

  useEffect(() => {
    setIsMounted(true);
    // Load Nepal GeoJSON data
    fetch('/nepal-provinces-detailed.json')
      .then(response => response.json())
      .then(data => setNepalGeoJson(data))
      .catch(error => console.error('Error loading map data:', error));

    // Import Leaflet CSS only on client-side
    import('leaflet/dist/leaflet.css');
  }, []);

  const getProvinceProjects = (provinceNameFromFeature) => {
    // Convert GeoJSON province name to official name
    const officialName = getOfficialProvinceName(provinceNameFromFeature);
    return provinceProjects[officialName] || [];
  };

  // Dynamic chart data based on active province or overall data
  const getChartData = () => {
    const distribution = activeProvince ? 
      getProjectTypeDistribution(activeProvince) : 
      getAllProjectTypesDistribution();
    
    return {
      labels: distribution.labels,
      datasets: [{
        data: distribution.data,
        backgroundColor: distribution.colors,
        borderColor: '#ffffff',
        borderWidth: 2,
        label: 'Project Types'
      }]
    };
  };

  const projectTypeChartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 11
          },
          padding: 15,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label} (${datasets.data[i]})`,
              fillStyle: datasets.backgroundColor[i],
              hidden: false,
              index: i
            }));
          }
        }
      },
      title: {
        display: true,
        text: activeProvince ? `${activeProvince} - Project Types` : 'All Projects by Type',
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const mapStyle = (feature) => {
    const projects = getProvinceProjects(feature.properties.PR_NAME);
    const hasProjects = projects.length > 0;
    const officialName = getOfficialProvinceName(feature.properties.PR_NAME);
    
    return {
      fillColor: activeProvince === officialName ? '#0396FF' : (hasProjects ? '#3fa9f5' : '#cccccc'),
      weight: 2,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: activeProvince === officialName ? 0.9 : (hasProjects ? 0.7 : 0.4)
    };
  };

  const onEachFeature = (feature, layer) => {
    const geoJsonProvinceName = feature.properties.PR_NAME;
    const officialProvinceName = getOfficialProvinceName(geoJsonProvinceName);
    
    layer.on({
      mouseover: () => {
        setActiveProvince(officialProvinceName);
        setHoveredProjects(getProvinceProjects(geoJsonProvinceName));
        // Update project type chart data
        setProjectTypeData(getProjectTypeDistribution(officialProvinceName));
      },
      mouseout: () => {
        setActiveProvince(null);
        setHoveredProjects([]);
        // Reset to overall project type data
        setProjectTypeData(getAllProjectTypesDistribution());
      }
    });

    const projects = getProvinceProjects(geoJsonProvinceName);
    const projectsList = projects.length > 0 
      ? `<ul class="list-disc pl-5 mt-2 text-sm space-y-1">
          ${projects.map(project => `
            <li>
              <div class="font-medium">${project.name}</div>
              <div class="text-xs text-gray-600 mt-1">
                <span class="inline-block px-2 py-1 rounded text-white text-xs" style="background-color: ${projectTypes[project.type]?.color || '#999999'}">
                  ${project.type}
                </span>
              </div>
            </li>
          `).join('')}
        </ul>`
      : '<p class="text-sm italic mt-2">No active projects</p>';

    layer.bindPopup(`
      <div class="max-w-md">
        <h3 class="font-bold text-lg border-b pb-2 mb-2">${officialProvinceName || 'Unknown Province'}</h3>
        <p class="font-medium">Number of Projects: ${projects.length}</p>
        ${projectsList}
      </div>
    `, {
      maxWidth: 400,
      className: 'province-popup'
    });
  };

  if (!isMounted) return null;

  return (
    <section className="working-areas py-20 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-[#0396FF]"></div>
            <h2 className="text-2xl font-bold">Working Areas</h2>
          </div>
          <p className="text-gray-600">Here are our work areas in Nepal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-4">
            <div className="h-[500px] bg-white rounded-lg shadow-lg overflow-hidden relative" style={{ zIndex: 10 }}>
              <MapContainer
                center={[28.3949, 84.1240]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
                zoomControl={true}
                attributionControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {nepalGeoJson && (
                  <GeoJSON
                    data={nepalGeoJson}
                    style={mapStyle}
                    onEachFeature={onEachFeature}
                  />
                )}
              </MapContainer>
            </div>
            {hoveredProjects.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                <h4 className="font-bold text-lg mb-3">{activeProvince} Projects:</h4>
                <div className="space-y-3">
                  {hoveredProjects.map((project, index) => (
                    <div key={index} className="border-l-4 pl-3" style={{borderColor: projectTypes[project.type]?.color || '#999999'}}>
                      <div className="text-sm text-gray-700 mb-1">{project.name}</div>
                      <span 
                        className="inline-block px-2 py-1 rounded text-white text-xs font-medium"
                        style={{backgroundColor: projectTypes[project.type]?.color || '#999999'}}
                      >
                        {project.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 bg-[#0396FF] text-white p-2 rounded">
                  Project Statistics
                </h3>
                <div className="h-[250px]">
                  <Doughnut data={provinceData} options={provinceChartOptions} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center mb-8 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="text-3xl font-bold text-[#0396FF]">8</h4>
                  <p className="text-gray-600">Total Projects</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-[#0396FF]">0</h4>
                  <p className="text-gray-600">Ongoing Projects</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 bg-[#0396FF] text-white p-2 rounded">
                  Project Status
                </h3>
                <div className="h-[250px]">
                  <Doughnut data={statusData} options={statusChartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}