"use client"

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useProjects } from '@/src/hooks/useApi';
import { pagesApi } from '@/src/lib/api-services';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// Fix Leaflet default markers issue with dynamic imports
let DefaultIcon;
let L;

if (typeof window !== 'undefined') {
  import('leaflet').then((leaflet) => {
    L = leaflet.default;
    DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  });
}

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
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

// Kathmandu coordinates (FEED headquarters)
const kathmanduCoords = [27.7172, 85.3240];

// Custom marker icons for different types
const createCustomIcon = (color, isHeadquarters = false) => {
  if (typeof window === 'undefined') return null;
  
  const size = isHeadquarters ? 14 : 12;
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: ${isHeadquarters ? '16px' : '12px'};
    ">
    </div>
  `;
  
  return L?.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size/2)]
  });
};

// District coordinates for project markers
const districtCoordinates = {
  // Sudurpashchim Province
  "Dadeldhura": [29.3008, 80.5833],
  "Achham": [29.2333, 81.2167],
  
  // Gandaki Province
  "Kaski": [28.2096, 83.9856], // Pokhara
  "Lamjung": [28.2333, 84.3833],
  "Myagdi": [28.6167, 83.5500],
  "Parbat": [28.2333, 83.6833],
  "Shyangja": [28.0833, 83.8667],
  "Mustang": [28.9833, 83.7500],
  
  // Bagmati Province
  "Sindhupalchok": [27.9500, 85.9667],
  "Kavrepalanchok": [27.5500, 85.5500],
  "Nuwakot": [27.9167, 85.1667],
  "Lalitpur": [27.6667, 85.3167],
  "Bhaktapur": [27.6667, 85.4167],
  "Makawanpur": [27.4333, 85.0500],
  "Chitwan": [27.6833, 84.4333],
  "Rasuwa": [28.1667, 85.3167],
  "Dhading": [27.8667, 84.9000],
  "Ramechhap": [27.3333, 86.0833],
  
  // Koshi Province
  "Sankhuwasabha": [27.7333, 87.1833],
  "Taplejung": [27.3500, 87.6667],
  "Panchthar": [27.1833, 87.9833],
  "Dhankuta": [26.9833, 87.3500],
  "Morang": [26.6500, 87.2833],
  "Sunsari": [26.6167, 87.1833],
  
  // Lumbini Province
  "Rupandehi": [27.6167, 83.4667],
  
  // Karnali Province
  "Surkhet": [28.6000, 81.6167],
  "Rukum": [28.2167, 82.5333],
  "Humla": [30.1000, 81.8167],
  "Bardiya": [28.3333, 81.5000],
  "Banke": [28.1167, 81.6167],
  
  // Madhesh Province
  "Sarlahi": [27.0000, 85.5333],
  "Dhanusha": [26.7500, 86.0667],
  "Saptari": [26.6000, 86.9000]
};

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

const DEFAULT_WORKING_AREAS_SECTION_META = {
  header: {
    badgeText: 'Working Areas',
    title: 'Our Work in Nepal',
    subtitle: 'Discover the regions where we have active projects and impact.',
  },
  messages: {
    loading: 'Loading map and project data...',
    empty: 'No project location data available at the moment.',
    error: 'Unable to load map/project data. Please try again later.',
    note: 'Map Legend',
  },
};

const normalizeWorkingAreasSectionMeta = (rawMeta) => {
  const meta = rawMeta && typeof rawMeta === 'object' ? rawMeta : {};
  return {
    ...DEFAULT_WORKING_AREAS_SECTION_META,
    ...meta,
    header: {
      ...DEFAULT_WORKING_AREAS_SECTION_META.header,
      ...(meta.header || {}),
    },
    messages: {
      ...DEFAULT_WORKING_AREAS_SECTION_META.messages,
      ...(meta.messages || {}),
    },
  };
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

export default function WorkingAreasMap() {
  const { data: projectsResponse, loading: projectsLoading, error: projectsError } = useProjects({ type: 'map' , limit: 1000});
  const projects = projectsResponse?.data || [];
  
  const [nepalGeoJson, setNepalGeoJson] = useState(null);
  const [activeProvince, setActiveProvince] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredProjects, setHoveredProjects] = useState([]);
  const [projectTypeData, setProjectTypeData] = useState({ labels: [], data: [], colors: [], total: 0 });
  const [projectMarkers, setProjectMarkers] = useState([]);
  const [districtMarkers, setDistrictMarkers] = useState([]);
  const [sectionMeta, setSectionMeta] = useState(DEFAULT_WORKING_AREAS_SECTION_META);

  // Function to create district-wise project markers
  const createDistrictMarkers = () => {
    const markers = [];
    const districtProjects = {};
    
    // Group projects by district
    projects.forEach(project => {
      if (project.district) {
        // Handle multiple districts in one project
        const districts = project.district.split(',').map(d => d.trim());
        districts.forEach(district => {
          if (!districtProjects[district]) {
            districtProjects[district] = [];
          }
          districtProjects[district].push({
            name: project.title,
            type: project.category,
            district: project.district
          });
        });
      }
    });
    
    // Create markers for each district with projects
    Object.keys(districtProjects).forEach(districtName => {
      const districtProjectsList = districtProjects[districtName];
      const coords = districtCoordinates[districtName];
      
      if (coords && districtProjectsList.length > 0) {
        // Get the most common project type for color coding
        const typeCount = {};
        districtProjectsList.forEach(project => {
          typeCount[project.type] = (typeCount[project.type] || 0) + 1;
        });
        const dominantType = Object.keys(typeCount).reduce((a, b) => 
          typeCount[a] > typeCount[b] ? a : b
        );
        
        markers.push({
          district: districtName,
          coords: coords,
          projectCount: districtProjectsList.length,
          projects: districtProjectsList,
          dominantType: dominantType,
          color: projectTypes[dominantType]?.color || '#999999'
        });
      }
    });
    
    return markers;
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize Leaflet and icons
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        L = leaflet.default;
        // Fix default icon paths
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
      });
    }
    
    // Load Nepal GeoJSON data
    fetch('/nepal-provinces-detailed.json')
      .then(response => response.json())
      .then(data => setNepalGeoJson(data))
      .catch(error => console.error('Error loading map data:', error));

    // Import Leaflet CSS only on client-side
    import('leaflet/dist/leaflet.css');
  }, []);

  useEffect(() => {
    let isMountedFlag = true;

    const fetchSectionMeta = async () => {
      try {
        const response = await pagesApi.getBySlug('working-areas-section');
        if (!isMountedFlag) return;

        if (response.success && response.data) {
          setSectionMeta(normalizeWorkingAreasSectionMeta(response.data.meta_data));
        }
      } catch (error) {
        if (`${error?.message || ''}`.toLowerCase().includes('page not found')) {
          return;
        }
        console.warn('Failed to load working-areas-section metadata, using defaults', error);
      }
    };

    fetchSectionMeta();

    return () => {
      isMountedFlag = false;
    };
  }, []);

  // Process projects data when it loads
  useEffect(() => {
    if (projects.length > 0) {
      // Create district markers data
      setDistrictMarkers(createDistrictMarkers());
      // Initialize project type data
      setProjectTypeData(getAllProjectTypesDistribution());
    }
  }, [projects]);

  // Get province projects data from dynamic source  
  const getProvinceProjects = (provinceNameFromFeature) => {
    // Convert GeoJSON province name to official name
    const officialName = getOfficialProvinceName(provinceNameFromFeature);
    const provinceData = {};
    
    projects.forEach(project => {
      const provinceName = project.province;
      if (!provinceData[provinceName]) {
        provinceData[provinceName] = [];
      }
      
      provinceData[provinceName].push({
        name: project.title,
        type: project.category,
        district: project.district
      });
    });
    
    return provinceData[officialName] || [];
  };

  // Function to get project type distribution for a province
  const getProjectTypeDistribution = (provinceName) => {
    const provinceProjects = getProvinceProjects(provinceName);
    const typeCount = {};
    
    provinceProjects.forEach(project => {
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
      total: provinceProjects.length
    };
  };

  // Function to get all project types distribution
  const getAllProjectTypesDistribution = () => {
    const provinceData = {};
    projects.forEach(project => {
      const provinceName = project.province;
      if (!provinceData[provinceName]) {
        provinceData[provinceName] = [];
      }
      
      provinceData[provinceName].push({
        name: project.title,
        type: project.category,
        district: project.district
      });
    });
    
    const allProjects = Object.values(provinceData).flat();
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

  // Generate dynamic province data from projects
  const generateProvinceData = () => {
    const provinceCounts = {};
    projects.forEach(project => {
      const province = project.province;
      provinceCounts[province] = (provinceCounts[province] || 0) + 1;
    });

    // Sort provinces by project count (descending)
    const sortedProvinces = Object.entries(provinceCounts)
      .sort(([,a], [,b]) => b - a);

    const labels = sortedProvinces.map(([province]) => province);
    const data = sortedProvinces.map(([,count]) => count);
    
    const colorPalette = [
      '#3366CC', // Bagmati
      '#DC3912', // Gandaki  
      '#0099C6', // Koshi
      '#FF9900', // Lumbini
      '#109618', // Karnali
      '#990099', // Sudurpaschim
      '#DD4477'  // Madhesh
    ];
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colorPalette.slice(0, labels.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        label: 'Number of Projects'
      }]
    };
  };

  // Generate dynamic status data from projects
  const generateStatusData = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const ongoingProjects = totalProjects - completedProjects;

    return {
      labels: ['Completed', 'Ongoing'],
      datasets: [{
        data: [completedProjects, ongoingProjects],
        backgroundColor: ['#3366CC', '#DC3912'],
        borderColor: '#ffffff',
        borderWidth: 2,
        label: 'Project Status'
      }]
    };
  };

  // Get dynamic data
  const provinceData = generateProvinceData();
  const statusData = generateStatusData();
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
                <span class="inline-block px-2 py-1 rounded text-white text-xs mr-2" style="background-color: ${projectTypes[project.type]?.color || '#999999'}">
                  ${project.type}
                </span>
                ${project.district ? `<span class="text-blue-600 font-medium">District: ${project.district}</span>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>`
      : '<p class="text-sm italic mt-2">No active projects</p>';

    layer.bindPopup(`
      <div class="max-w-md h-64 overflow-scroll">
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

  if (projectsLoading) {
    return (
      <section className="working-areas px-12 py-12 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0396FF] mx-auto mb-4"></div>
            <p className="text-gray-600">{sectionMeta.messages.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  if (projectsError) {
    return (
      <section className="working-areas px-12 py-12 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">{sectionMeta.header.title}</h2>
            <p className="text-red-600">{sectionMeta.messages.error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!projectsLoading && projects.length === 0) {
    return (
      <section className="working-areas px-12 py-12 bg-gray-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">{sectionMeta.header.title}</h2>
            <p className="text-gray-600">{sectionMeta.messages.empty}</p>
          </div>
        </div>
      </section>
    );
  }

  // Chart options for the statistics
  const provinceChartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12
          },
          padding: 8,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text: `${label} (${datasets.data[i]})`,
              fillStyle: datasets.backgroundColor[i],
              hidden: false,
              index: i
            }));
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Projects by Province',
        font: {
          size: 14,
          weight: 'bold'
        },
        padding: {
          top: 8,
          bottom: 15
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
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
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

  return (
    <section className="working-areas px-12 py-12 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-[#00966a] text-white text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full mb-4 shadow-sm">
            {sectionMeta.header.badgeText}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0396FF] mb-4">
            {sectionMeta.header.title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            {sectionMeta.header.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="md:col-span-4">
            <div className="h-[400px] bg-white rounded-lg shadow-lg overflow-hidden relative" style={{ zIndex: 10 }}>
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
                
                {/* Kathmandu Headquarters Marker */}
                {isMounted && L && (
                  <Marker 
                    position={kathmanduCoords}
                    icon={createCustomIcon('#0396FF', true)}
                  >
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-base mb-2">FEED Headquarters</h3>
                        <p className="text-sm text-gray-600">Kathmandu, Nepal</p>
                        <p className="text-xs text-[#0396FF] mt-1">Central Hub for All Projects</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* District Project Markers */}
                {isMounted && L && districtMarkers.map((marker, index) => (
                  <Marker 
                    key={index} 
                    position={marker.coords}
                    icon={createCustomIcon(marker.color)}
                  >
                    <Popup>
                      <div className="max-w-xs">
                        <h4 className="font-bold text-base mb-2">{marker.district} District</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {marker.projectCount} Project{marker.projectCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Dominant Type: <span style={{color: marker.color}} className="font-medium">{marker.dominantType}</span>
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {marker.projects.map((project, projectIndex) => (
                            <div key={projectIndex} className="border-l-3 pl-2" style={{borderColor: projectTypes[project.type]?.color || '#999999'}}>
                              <div className="text-xs text-gray-700 mb-1 font-medium">{project.name}</div>
                              <div className="flex flex-wrap gap-1 items-center">
                                <span 
                                  className="inline-block px-2 py-1 rounded text-white text-xs font-medium"
                                  style={{backgroundColor: projectTypes[project.type]?.color || '#999999'}}
                                >
                                  {project.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            {hoveredProjects.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded-lg shadow-lg">
                <h4 className="font-bold text-base mb-2">{activeProvince} Projects:</h4>
                
                {/* District Summary */}
                <div className="mb-3 p-2 bg-gray-50 rounded">
                  <h5 className="font-medium text-sm mb-1">Districts with Projects:</h5>
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(hoveredProjects.map(p => p.district).filter(Boolean).flatMap(d => d.split(',').map(dist => dist.trim())))].map((district, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {hoveredProjects.map((project, index) => (
                    <div key={index} className="border-l-4 pl-2" style={{borderColor: projectTypes[project.type]?.color || '#999999'}}>
                      <div className="text-xs text-gray-700 mb-1">{project.name}</div>
                      <div className="flex flex-wrap gap-1 items-center">
                        <span 
                          className="inline-block px-2 py-1 rounded text-white text-xs font-medium"
                          style={{backgroundColor: projectTypes[project.type]?.color || '#999999'}}
                        >
                          {project.type}
                        </span>
                        {project.district && (
                          <span className="text-blue-600 text-xs font-medium">
                            District: {project.district}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* District Markers Legend */}
            <div className="mt-3 p-3 bg-white rounded-lg shadow-lg">
              <h4 className="font-bold text-sm mb-3">{sectionMeta.messages.note || 'Map Legend'}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#0396FF] rounded-full border-2 border-white shadow-md"></div>
                  <span>FEED Headquarters (Kathmandu)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FF6B6B] rounded-full border-2 border-white shadow-md"></div>
                  <span>Climate Change & DRR Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#4ECDC4] rounded-full border-2 border-white shadow-md"></div>
                  <span>Hydropower Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#45B7D1] rounded-full border-2 border-white shadow-md"></div>
                  <span>Infrastructure & Development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#96CEB4] rounded-full border-2 border-white shadow-md"></div>
                  <span>Training & Capacity Building</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FECA57] rounded-full border-2 border-white shadow-md"></div>
                  <span>Social & Economic Development</span>
                </div>
                <p className="text-gray-600 text-xs mt-2 italic">
                  District markers are colored by dominant project type. Click markers for details.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3 bg-[#0396FF] text-white p-2 rounded">
                  Project Statistics
                </h3>
                <div className="h-[200px]">
                  <Doughnut data={provinceData} options={provinceChartOptions} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center mb-6 bg-gray-50 p-3 rounded-lg">
                <div>
                  <h4 className="text-2xl font-bold text-[#0396FF]">{projects.length}</h4>
                  <p className="text-gray-600 text-xs">Total Projects</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-[#0396FF]">{projects.filter(p => p.status !== 'Completed').length}</h4>
                  <p className="text-gray-600 text-xs">Ongoing Projects</p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold mb-3 bg-[#0396FF] text-white p-2 rounded">
                  Project Status
                </h3>
                <div className="h-[200px]">
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
