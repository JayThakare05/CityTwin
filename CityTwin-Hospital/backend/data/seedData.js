const bcrypt = require('bcryptjs');

// Hospital seed data
const sampleHospitals = [
  {
    hospitalId: 'HOSP-001',
    name: 'Jupiter Hospital Thane',
    email: 'admin@jupiterthane.com',
    password: bcrypt.hashSync('hospital123', 10),
    address: 'Eastern Express Highway, Service Rd, Next to Viviana Mall, Thane West',
    phone: '+91 22 2172 5555',
    location: { coordinates: [72.9723, 19.2039] },
    availableBeds: 24,
    totalBeds: 350,
    icuBeds: 8,
    status: 'Active',
    specializations: ['Cardiology', 'Neurology', 'Trauma', 'Pediatrics']
  },
  {
    hospitalId: 'HOSP-002',
    name: 'Chhatrapati Shivaji Maharaj Hospital',
    email: 'admin@csmhkalwa.com',
    password: bcrypt.hashSync('hospital123', 10),
    address: 'Belapur Road, Kalwa West, Thane',
    phone: '+91 22 2537 2894',
    location: { coordinates: [72.9912, 19.1965] },
    availableBeds: 18,
    totalBeds: 500,
    icuBeds: 12,
    status: 'Active',
    specializations: ['General Surgery', 'Emergency Medicine', 'Orthopedics']
  },
  {
    hospitalId: 'HOSP-003',
    name: 'Bethany Hospital Thane',
    email: 'admin@bethanythane.com',
    password: bcrypt.hashSync('hospital123', 10),
    address: 'Pokhran Road No. 2, Upvan, Thane West',
    phone: '+91 22 2172 5100',
    location: { coordinates: [72.9701, 19.2289] },
    availableBeds: 11,
    totalBeds: 125,
    icuBeds: 4,
    status: 'Active',
    specializations: ['Trauma Care', 'General Medicine']
  }
];

// Ambulance seed data
const sampleAmbulances = [
  {
    vehicleNumber: 'MH-04-AB-1234',
    hospitalId: 'HOSP-001',
    driverName: 'Rajesh Kumar',
    driverId: 'DRV-001',
    driverPhone: '+91 98765 43210',
    status: 'Available',
    location: { coordinates: [72.9723, 19.2039] }
  },
  {
    vehicleNumber: 'MH-04-CD-5678',
    hospitalId: 'HOSP-001',
    driverName: 'Suresh Patil',
    driverId: 'DRV-002',
    driverPhone: '+91 98765 43211',
    status: 'Emergency',
    location: { coordinates: [72.9780, 19.2100] },
    currentDestination: { name: 'Majiwada Junction Accident', coordinates: [72.9810, 19.2150] },
    eta: '4 min',
    distanceKm: 1.2,
    greenCorridorActive: true,
    routeSignals: [
      { id: 'sig-1', name: 'Viviana Mall Signal', coordinates: [72.9740, 19.2060], status: 'GREEN', passed: true },
      { id: 'sig-2', name: 'Kapurbawdi Junction', coordinates: [72.9760, 19.2090], status: 'GREEN', passed: false },
      { id: 'sig-3', name: 'Manpada Signal', coordinates: [72.9790, 19.2120], status: 'RED', passed: false },
      { id: 'sig-4', name: 'Majiwada Junction', coordinates: [72.9810, 19.2150], status: 'RED', passed: false }
    ]
  },
  {
    vehicleNumber: 'MH-04-EF-9012',
    hospitalId: 'HOSP-001',
    driverName: 'Amit Sharma',
    driverId: 'DRV-003',
    driverPhone: '+91 98765 43212',
    status: 'Offline',
    location: { coordinates: [72.9700, 19.2020] }
  },
  {
    vehicleNumber: 'MH-04-GH-3456',
    hospitalId: 'HOSP-002',
    driverName: 'Vikram Singh',
    driverId: 'DRV-004',
    driverPhone: '+91 98765 43213',
    status: 'Available',
    location: { coordinates: [72.9912, 19.1965] }
  },
  {
    vehicleNumber: 'MH-04-IJ-7890',
    hospitalId: 'HOSP-002',
    driverName: 'Manoj Yadav',
    driverId: 'DRV-005',
    driverPhone: '+91 98765 43214',
    status: 'Available',
    location: { coordinates: [72.9900, 19.1950] }
  }
];

// Driver seed data
const sampleDrivers = [
  {
    driverId: 'DRV-001',
    name: 'Rajesh Kumar',
    password: bcrypt.hashSync('driver123', 10),
    phone: '+91 98765 43210',
    ambulanceNumber: 'MH-04-AB-1234',
    hospitalId: 'HOSP-001',
    status: 'Available',
    totalTrips: 142
  },
  {
    driverId: 'DRV-002',
    name: 'Suresh Patil',
    password: bcrypt.hashSync('driver123', 10),
    phone: '+91 98765 43211',
    ambulanceNumber: 'MH-04-CD-5678',
    hospitalId: 'HOSP-001',
    status: 'Emergency',
    totalTrips: 98
  },
  {
    driverId: 'DRV-003',
    name: 'Amit Sharma',
    password: bcrypt.hashSync('driver123', 10),
    phone: '+91 98765 43212',
    ambulanceNumber: 'MH-04-EF-9012',
    hospitalId: 'HOSP-001',
    status: 'Offline',
    totalTrips: 67
  },
  {
    driverId: 'DRV-004',
    name: 'Vikram Singh',
    password: bcrypt.hashSync('driver123', 10),
    phone: '+91 98765 43213',
    ambulanceNumber: 'MH-04-GH-3456',
    hospitalId: 'HOSP-002',
    status: 'Available',
    totalTrips: 203
  },
  {
    driverId: 'DRV-005',
    name: 'Manoj Yadav',
    password: bcrypt.hashSync('driver123', 10),
    phone: '+91 98765 43214',
    ambulanceNumber: 'MH-04-IJ-7890',
    hospitalId: 'HOSP-002',
    status: 'Available',
    totalTrips: 55
  }
];

// Medical camp seed data
const sampleMedicalCamps = [
  {
    hospitalId: 'HOSP-001',
    hospitalName: 'Jupiter Hospital Thane',
    location: { address: 'Ghodbunder Road, Near Ovala, Thane West', coordinates: [72.9712, 19.2612] },
    disease: 'Dengue',
    riskLevel: 'High',
    detectedCases: 34,
    requiredDoctors: 3,
    requiredNurses: 5,
    ambulanceRequired: true,
    preferredDate: '2026-10-05',
    status: 'Approved',
    regionName: 'Thane City (TMC)',
    distanceKm: '3.2 km'
  },
  {
    hospitalId: 'HOSP-001',
    hospitalName: 'Jupiter Hospital Thane',
    location: { address: 'Kalwa East, Near Railway Station', coordinates: [72.9950, 19.1920] },
    disease: 'Malaria',
    riskLevel: 'Moderate',
    detectedCases: 12,
    requiredDoctors: 2,
    requiredNurses: 3,
    ambulanceRequired: false,
    preferredDate: '2026-10-08',
    status: 'Pending',
    regionName: 'Thane City (TMC)',
    distanceKm: '5.1 km'
  }
];

// Accident alert seed data
const sampleAccidentAlerts = [
  {
    title: 'Multi-vehicle collision on EEH',
    location: {
      address: 'Eastern Express Highway, Nitin Company Junction, Thane West',
      coordinates: [72.9698, 19.1990]
    },
    severity: 'Critical',
    distanceKm: '1.5 km',
    reportedBy: 'Citizen via CityTwin App',
    description: 'Two vehicle collision near Nitin Company junction. Multiple injuries reported.',
    status: 'Dispatched',
    dispatchedAmbulance: 'MH-04-CD-5678',
    nearestHospitalId: 'HOSP-001'
  },
  {
    title: 'Bike accident near Kopri Bridge',
    location: {
      address: 'Kopri Bridge, Thane East',
      coordinates: [72.9850, 19.1870]
    },
    severity: 'Moderate',
    distanceKm: '2.8 km',
    reportedBy: 'Traffic Police',
    description: 'Single bike accident. Rider conscious but injured.',
    status: 'New',
    nearestHospitalId: 'HOSP-002'
  },
  {
    title: 'Pedestrian hit near Naupada',
    location: {
      address: 'Gokhale Road, Naupada, Thane West',
      coordinates: [72.9745, 19.1882]
    },
    severity: 'Severe',
    distanceKm: '0.8 km',
    reportedBy: 'Citizen Report',
    description: 'Pedestrian hit by auto-rickshaw near market area. Needs immediate medical attention.',
    status: 'New',
    nearestHospitalId: 'HOSP-001'
  }
];

// Pandemic risk areas (connected to CityTwin-User region data)
const samplePandemicRisks = [
  {
    id: 'pr-1',
    disease: 'Dengue',
    location: 'Mira Road, Bhayandar',
    regionName: 'Mira - Bhayandar (MBMC)',
    coordinates: [72.8562, 19.2813],
    riskLevel: 'High',
    cases: 34,
    trend: 'Increasing',
    distanceKm: '8.2 km',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'pr-2',
    disease: 'Malaria',
    location: 'Bhiwandi Industrial Area',
    regionName: 'Bhiwandi - Nizampur (BNMC)',
    coordinates: [73.0631, 19.2969],
    riskLevel: 'High',
    cases: 51,
    trend: 'Increasing',
    distanceKm: '12.4 km',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'pr-3',
    disease: 'Dengue',
    location: 'Ghodbunder Road, Thane',
    regionName: 'Thane City (TMC)',
    coordinates: [72.9712, 19.2612],
    riskLevel: 'High',
    cases: 28,
    trend: 'Increasing',
    distanceKm: '3.2 km',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'pr-4',
    disease: 'Malaria',
    location: 'Kalwa East, Thane',
    regionName: 'Thane City (TMC)',
    coordinates: [72.9950, 19.1920],
    riskLevel: 'Moderate',
    cases: 12,
    trend: 'Stable',
    distanceKm: '5.1 km',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'pr-5',
    disease: 'Cholera',
    location: 'Ulhasnagar Camp 5',
    regionName: 'Ulhasnagar (UMC)',
    coordinates: [73.1554, 19.2215],
    riskLevel: 'Moderate',
    cases: 7,
    trend: 'Stable',
    distanceKm: '18.6 km',
    lastUpdated: new Date().toISOString()
  }
];

// Traffic signals for green corridor simulation
const sampleTrafficSignals = [
  { id: 'sig-1', name: 'Viviana Mall Signal', coordinates: [72.9740, 19.2060], defaultStatus: 'RED' },
  { id: 'sig-2', name: 'Kapurbawdi Junction', coordinates: [72.9760, 19.2090], defaultStatus: 'RED' },
  { id: 'sig-3', name: 'Manpada Signal', coordinates: [72.9790, 19.2120], defaultStatus: 'RED' },
  { id: 'sig-4', name: 'Majiwada Junction', coordinates: [72.9810, 19.2150], defaultStatus: 'RED' },
  { id: 'sig-5', name: 'Waghbil Circle', coordinates: [72.9680, 19.2200], defaultStatus: 'RED' },
  { id: 'sig-6', name: 'Ghodbunder Naka', coordinates: [72.9650, 19.2350], defaultStatus: 'RED' },
  { id: 'sig-7', name: 'Panchpakhadi Signal', coordinates: [72.9680, 19.1945], defaultStatus: 'RED' },
  { id: 'sig-8', name: 'Teen Hath Naka', coordinates: [72.9720, 19.1860], defaultStatus: 'RED' }
];

module.exports = {
  sampleHospitals,
  sampleAmbulances,
  sampleDrivers,
  sampleMedicalCamps,
  sampleAccidentAlerts,
  samplePandemicRisks,
  sampleTrafficSignals
};
