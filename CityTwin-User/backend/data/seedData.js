// Realistic Seed Data for Thane District Digital Twin (CityTwin)

const sampleRegions = [
  {
    id: "thane-city",
    name: "Thane City (TMC)",
    code: "TMC",
    center: [19.2183, 72.9781],
    areaSqKm: 147,
    population: "1,841,488",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [72.9400, 19.2450],
        [72.9900, 19.2550],
        [73.0150, 19.2200],
        [73.0000, 19.1750],
        [72.9550, 19.1800],
        [72.9300, 19.2100],
        [72.9400, 19.2450]
      ]]
    },
    metrics: {
      aqi: 86,
      aqiCategory: "Moderate",
      temp: 28,
      humidity: 72,
      rainProb: 40,
      dengueRisk: "High",
      dengueCases: 42,
      dengueTrend: "Increasing",
      malariaRisk: "Moderate",
      waterloggingRisk: "High",
      trafficCongestion: "Heavy at Majiwada",
      airQualityStatus: "Moderate PM2.5 levels near Teen Hath Naka"
    },
    activeAlerts: [
      { id: "alt-1", title: "Heavy Rain Warning", severity: "High", icon: "cloud-rain", description: "Waterlogging expected near Vandana ST Depot and Lake City Mall." }
    ]
  },
  {
    id: "kalyan-dombivli",
    name: "Kalyan - Dombivli (KDMC)",
    code: "KDMC",
    center: [19.2403, 73.1305],
    areaSqKm: 137,
    population: "1,247,327",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.0800, 19.2700],
        [73.1500, 19.2800],
        [73.1750, 19.2300],
        [73.1300, 19.2000],
        [73.0700, 19.2200],
        [73.0800, 19.2700]
      ]]
    },
    metrics: {
      aqi: 112,
      aqiCategory: "Unhealthy for Sensitive Groups",
      temp: 29,
      humidity: 68,
      rainProb: 35,
      dengueRisk: "Moderate",
      dengueCases: 28,
      dengueTrend: "Stable",
      malariaRisk: "Low",
      waterloggingRisk: "Moderate",
      trafficCongestion: "Moderate near Patri Pool",
      airQualityStatus: "Elevated dust levels near Station Road"
    },
    activeAlerts: []
  },
  {
    id: "navi-mumbai-north",
    name: "Navi Mumbai (Airoli / Digha Zone)",
    code: "NMMC-N",
    center: [19.1672, 72.9972],
    areaSqKm: 109,
    population: "1,120,547",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [72.9750, 19.1850],
        [73.0200, 19.1900],
        [73.0400, 19.1400],
        [72.9900, 19.1300],
        [72.9700, 19.1550],
        [72.9750, 19.1850]
      ]]
    },
    metrics: {
      aqi: 64,
      aqiCategory: "Good",
      temp: 27,
      humidity: 75,
      rainProb: 30,
      dengueRisk: "Low",
      dengueCases: 9,
      dengueTrend: "Decreasing",
      malariaRisk: "Low",
      waterloggingRisk: "Low",
      trafficCongestion: "Smooth on Thane-Belapur Road",
      airQualityStatus: "Fresh sea breeze filtering industrial area"
    },
    activeAlerts: []
  },
  {
    id: "mira-bhayandar",
    name: "Mira - Bhayandar (MBMC)",
    code: "MBMC",
    center: [19.2813, 72.8562],
    areaSqKm: 79,
    population: "814,655",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [72.8100, 19.3200],
        [72.8800, 19.3100],
        [72.8900, 19.2600],
        [72.8400, 19.2500],
        [72.8100, 19.2800],
        [72.8100, 19.3200]
      ]]
    },
    metrics: {
      aqi: 95,
      aqiCategory: "Moderate",
      temp: 28,
      humidity: 78,
      rainProb: 50,
      dengueRisk: "High",
      dengueCases: 34,
      dengueTrend: "Increasing",
      malariaRisk: "Moderate",
      waterloggingRisk: "Critical",
      trafficCongestion: "Heavy on WEH Junction",
      airQualityStatus: "Moderate humidity haze"
    },
    activeAlerts: [
      { id: "alt-2", title: "High Tide Alert", severity: "High", icon: "waves", description: "Bhayandar Creek high tide expected at 4:30 PM." }
    ]
  },
  {
    id: "bhiwandi-nizampur",
    name: "Bhiwandi - Nizampur (BNMC)",
    code: "BNMC",
    center: [19.2969, 73.0631],
    areaSqKm: 116,
    population: "709,665",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.0100, 19.3400],
        [73.1000, 19.3300],
        [73.1100, 19.2700],
        [73.0400, 19.2600],
        [73.0100, 19.3400]
      ]]
    },
    metrics: {
      aqi: 145,
      aqiCategory: "Unhealthy",
      temp: 30,
      humidity: 64,
      rainProb: 25,
      dengueRisk: "High",
      dengueCases: 51,
      dengueTrend: "Increasing",
      malariaRisk: "High",
      waterloggingRisk: "High",
      trafficCongestion: "Bhiwandi Bypass Freight Delay",
      airQualityStatus: "High industrial particulate matter"
    },
    activeAlerts: []
  },
  {
    id: "ulhasnagar",
    name: "Ulhasnagar (UMC)",
    code: "UMC",
    center: [19.2215, 73.1554],
    areaSqKm: 28,
    population: "506,098",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.1350, 19.2400],
        [73.1700, 19.2400],
        [73.1750, 19.2000],
        [73.1400, 19.2000],
        [73.1350, 19.2400]
      ]]
    },
    metrics: {
      aqi: 120,
      aqiCategory: "Unhealthy for Sensitive Groups",
      temp: 29,
      humidity: 66,
      rainProb: 30,
      dengueRisk: "Moderate",
      dengueCases: 19,
      dengueTrend: "Stable",
      malariaRisk: "Moderate",
      waterloggingRisk: "Moderate",
      trafficCongestion: "Slow moving near Furniture Market",
      airQualityStatus: "Moderate commercial dust"
    },
    activeAlerts: []
  }
];

const sampleEmergencyServices = [
  {
    id: "hosp-1",
    name: "Jupiter Hospital Thane",
    type: "Hospital",
    location: { coordinates: [72.9723, 19.2039] },
    address: "Eastern Express Highway, Service Rd, Next to Viviana Mall, Thane West",
    phone: "+91 22 2172 5555",
    availableBeds: 24,
    totalBeds: 350,
    status: "Active / ICU Beds Available"
  },
  {
    id: "hosp-2",
    name: "Chhatrapati Shivaji Maharaj Hospital (Kalwa)",
    type: "Hospital",
    location: { coordinates: [72.9912, 19.1965] },
    address: "Belapur Road, Kalwa West, Thane",
    phone: "+91 22 2537 2894",
    availableBeds: 18,
    totalBeds: 500,
    status: "24/7 Emergency Ward Open"
  },
  {
    id: "hosp-3",
    name: "Bethany Hospital Thane",
    type: "Hospital",
    location: { coordinates: [72.9701, 19.2289] },
    address: "Pokhran Road No. 2, Upvan, Thane West",
    phone: "+91 22 2172 5100",
    availableBeds: 11,
    totalBeds: 125,
    status: "Trauma Care Available"
  },
  {
    id: "police-1",
    name: "Thane City Police Control Room",
    type: "Police",
    location: { coordinates: [72.9772, 19.1878] },
    address: "Near Court Naka, Thane West",
    phone: "112 / +91 22 2544 3333",
    availableBeds: 0,
    totalBeds: 0,
    status: "Patrol Units Dispatched"
  },
  {
    id: "fire-1",
    name: "Panchpakhadi Main Fire Station",
    type: "Fire",
    location: { coordinates: [72.9680, 19.1945] },
    address: "Almeida Road, Panchpakhadi, Thane West",
    phone: "101 / +91 22 2533 1313",
    availableBeds: 0,
    totalBeds: 0,
    status: "Standby Readiness"
  }
];

const sampleIssues = [
  {
    id: "iss-101",
    title: "Dengue Mosquito Larvae Breeding",
    category: "Disease / Pandemic",
    severity: "High",
    status: "Pending",
    description: "Stagnant water near Ghodbunder Road construction site breeding mosquitoes. Multiple dengue cases reported.",
    location: {
      address: "Ghodbunder Road, Near Ovala, Thane West",
      regionName: "Thane City (TMC)",
      coordinates: [72.9712, 19.2612]
    },
    distanceKm: "1.2 km away",
    timeAgo: "2 hours ago",
    reporterName: "Rohan Sharma",
    imageUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80",
    likes: 14,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: "iss-102",
    title: "Garbage Accumulation on Footpath",
    category: "Garbage",
    severity: "Medium",
    status: "Under Review",
    description: "Uncollected plastic waste blocking pedestrian pathway near Naupada market.",
    location: {
      address: "Gokhale Road, Naupada, Thane West",
      regionName: "Thane City (TMC)",
      coordinates: [72.9745, 19.1882]
    },
    distanceKm: "800 m away",
    timeAgo: "5 hours ago",
    reporterName: "Priya Patel",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80",
    likes: 8,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: "iss-103",
    title: "Severe Waterlogging Under Majiwada Flyover",
    category: "Waterlogging",
    severity: "High",
    status: "Pending",
    description: "Knee-deep water logging after brief heavy shower causing major traffic bottleneck.",
    location: {
      address: "Majiwada Flyover Junction, Thane West",
      regionName: "Thane City (TMC)",
      coordinates: [72.9810, 19.2150]
    },
    distanceKm: "2.1 km away",
    timeAgo: "Yesterday",
    reporterName: "Amitabh Verma",
    imageUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=80",
    likes: 29,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "iss-104",
    title: "Major Traffic Collision on Eastern Express Highway",
    category: "Accident",
    severity: "Critical",
    status: "Under Review",
    description: "Two vehicle collision near Nitin Company junction. Emergency medical team dispatched.",
    location: {
      address: "EEH Nitin Company Junction, Thane West",
      regionName: "Thane City (TMC)",
      coordinates: [72.9698, 19.1990]
    },
    distanceKm: "1.5 km away",
    timeAgo: "30 mins ago",
    reporterName: "Emergency Response Patrol",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
    likes: 41,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

const sampleForecast = [
  { day: "Today", date: "Sep 27", tempMax: 28, tempMin: 24, icon: "cloud-sun", rainProb: 40, aqi: 86, condition: "Partly Cloudy" },
  { day: "Tomorrow", date: "Sep 28", tempMax: 29, tempMin: 25, icon: "cloud-rain", rainProb: 75, aqi: 92, condition: "Moderate Rain" },
  { day: "+3 Days", date: "Sep 29 - Oct 1", tempMax: 30, tempMin: 25, icon: "sun", rainProb: 20, aqi: 78, condition: "Mostly Sunny" },
  { day: "+7 Days", date: "Oct 2 - Oct 6", tempMax: 31, tempMin: 26, icon: "cloud-sun-rain", rainProb: 45, aqi: 85, condition: "Scattered Showers" }
];

module.exports = {
  sampleRegions,
  sampleEmergencyServices,
  sampleIssues,
  sampleForecast
};
