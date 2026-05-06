export const farms = [
  { id: '1', name: 'Hacienda Verde', owner: 'Juan Dela Cruz', location: 'Initao, Misamis Oriental', size: 12.5, healthScore: 82, riskLevel: 'Low Risk' },
  { id: '2', name: 'Cacao Valley Farm', owner: 'Maria Santos', location: 'Initao, Misamis Oriental', size: 8.3, healthScore: 65, riskLevel: 'Moderate Risk' },
  { id: '3', name: 'Sunrise Plantation', owner: 'Pedro Reyes', location: 'Initao, Misamis Oriental', size: 15.0, healthScore: 91, riskLevel: 'Healthy' },
  { id: '4', name: 'Golden Pod Estate', owner: 'Ana Lopez', location: 'Initao, Misamis Oriental', size: 6.7, healthScore: 38, riskLevel: 'High Risk' },
  { id: '5', name: 'Mountain Cacao', owner: 'Carlos Tan', location: 'Initao, Misamis Oriental', size: 10.2, healthScore: 75, riskLevel: 'Low Risk' },
];

export const recentScans = [
  { id: '1', farmName: 'Hacienda Verde', zoneName: 'Zone A', date: '2026-02-13', severity: 'Mild', confidence: 87.5, affectedArea: 12, imageUrl: '' },
  { id: '2', farmName: 'Golden Pod Estate', zoneName: 'Zone B', date: '2026-02-12', severity: 'Severe', confidence: 94.2, affectedArea: 45, imageUrl: '' },
  { id: '3', farmName: 'Cacao Valley Farm', zoneName: 'Zone A', date: '2026-02-12', severity: 'Moderate', confidence: 78.3, affectedArea: 28, imageUrl: '' },
  { id: '4', farmName: 'Sunrise Plantation', zoneName: 'Zone C', date: '2026-02-11', severity: 'Healthy', confidence: 96.1, affectedArea: 0, imageUrl: '' },
  { id: '5', farmName: 'Mountain Cacao', zoneName: 'Zone A', date: '2026-02-11', severity: 'Mild', confidence: 82.0, affectedArea: 8, imageUrl: '' },
];

export const alerts = [
  { id: '1', farmName: 'Golden Pod Estate', severity: 'critical', message: 'Severe Black Pod detected in Zone B — 45% pod area affected. Immediate action required.', createdAt: '2 hours ago', status: 'new' },
  { id: '2', farmName: 'Cacao Valley Farm', severity: 'warning', message: 'Moderate infection spreading in Zone A. Schedule fungicide application.', createdAt: '5 hours ago', status: 'new' },
  { id: '3', farmName: 'Hacienda Verde', severity: 'info', message: 'Mild symptoms detected in Zone A. Monitor closely over next 48 hours.', createdAt: '1 day ago', status: 'acknowledged' },
  { id: '4', farmName: 'Mountain Cacao', severity: 'warning', message: 'Rising moisture levels may increase disease risk. Preventive measures recommended.', createdAt: '1 day ago', status: 'acknowledged' },
];

export const monthlyTrends = [
  { month: 'Sep', healthy: 78, mild: 12, moderate: 7, severe: 3 },
  { month: 'Oct', healthy: 72, mild: 15, moderate: 9, severe: 4 },
  { month: 'Nov', healthy: 68, mild: 17, moderate: 10, severe: 5 },
  { month: 'Dec', healthy: 65, mild: 18, moderate: 12, severe: 5 },
  { month: 'Jan', healthy: 70, mild: 16, moderate: 9, severe: 5 },
  { month: 'Feb', healthy: 74, mild: 14, moderate: 8, severe: 4 },
];

export const dashboardStats = {
  totalFarms: 24,
  totalScans: 156,
  detectedCases: 42,
  healthyPercentage: 74,
};

export const initialUsers = [
  { id: '1', name: 'Juan Dela Cruz', email: 'juan@cacaoguard.com', role: 'Admin', active: true },
  { id: '2', name: 'Maria Santos', email: 'maria@cacaoguard.com', role: 'Farmer', active: true },
  { id: '3', name: 'Pedro Reyes', email: 'pedro@cacaoguard.com', role: 'Technician', active: true },
  { id: '4', name: 'Ana Lopez', email: 'ana@cacaoguard.com', role: 'Farmer', active: false },
  { id: '5', name: 'Carlos Tan', email: 'carlos@cacaoguard.com', role: 'Technician', active: true },
];
