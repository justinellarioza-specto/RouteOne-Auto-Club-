export interface CircuitLocation {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  latitude: number;
  longitude: number;
  circuitLength: string;
  turns: number;
  lapRecord: string;
  recordHolder: string;
  mainStraightHeading: number; // Degrees 0-360
  role: string;
  // Default/fallback weather when offline or loading
  fallback: {
    ambientTemp: number; // °C
    trackTemp: number; // °C
    windSpeed: number; // km/h
    windDirection: number; // degrees
    humidity: number; // %
    pressure: number; // hPa
    condition: string;
    weatherCode: number;
    isDay: number;
  };
}

export const MAJOR_CIRCUITS: CircuitLocation[] = [
  {
    id: 'silverstone',
    name: 'Silverstone',
    fullName: 'Silverstone Circuit',
    country: 'United Kingdom',
    countryCode: 'GBR',
    flag: '🇬🇧',
    city: 'Northamptonshire',
    latitude: 52.0786,
    longitude: -1.0169,
    circuitLength: '5.891 km',
    turns: 18,
    lapRecord: '1:27.097',
    recordHolder: 'M. Verstappen (2020)',
    mainStraightHeading: 195,
    role: 'RouteOne Proving Ground & HQ',
    fallback: {
      ambientTemp: 18.2,
      trackTemp: 26.4,
      windSpeed: 17.5,
      windDirection: 280,
      humidity: 52,
      pressure: 994,
      condition: 'Partly Cloudy',
      weatherCode: 2,
      isDay: 1,
    },
  },
  {
    id: 'spa',
    name: 'Spa-Francorchamps',
    fullName: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    countryCode: 'BEL',
    flag: '🇧🇪',
    city: 'Stavelot, Ardennes',
    latitude: 50.4372,
    longitude: 5.9714,
    circuitLength: '7.004 km',
    turns: 19,
    lapRecord: '1:46.286',
    recordHolder: 'V. Bottas (2018)',
    mainStraightHeading: 70,
    role: 'High-Elevation Aerodynamics Hub',
    fallback: {
      ambientTemp: 16.5,
      trackTemp: 23.8,
      windSpeed: 12.0,
      windDirection: 240,
      humidity: 64,
      pressure: 968,
      condition: 'Variable Overcast',
      weatherCode: 3,
      isDay: 1,
    },
  },
  {
    id: 'nurburgring',
    name: 'Nürburgring',
    fullName: 'Nürburgring Nordschleife',
    country: 'Germany',
    countryCode: 'DEU',
    flag: '🇩🇪',
    city: 'Nürburg, Eifel',
    latitude: 50.3356,
    longitude: 6.9475,
    circuitLength: '20.832 km',
    turns: 73,
    lapRecord: '5:19.546',
    recordHolder: 'T. Bernhard (919 Evo)',
    mainStraightHeading: 240,
    role: 'Chassis Rigidity & Endurance Benchmark',
    fallback: {
      ambientTemp: 15.1,
      trackTemp: 21.3,
      windSpeed: 14.2,
      windDirection: 290,
      humidity: 58,
      pressure: 955,
      condition: 'Mild Overcast',
      weatherCode: 3,
      isDay: 1,
    },
  },
  {
    id: 'monza',
    name: 'Monza',
    fullName: 'Autodromo Nazionale Monza',
    country: 'Italy',
    countryCode: 'ITA',
    flag: '🇮🇹',
    city: 'Monza, Lombardy',
    latitude: 45.6156,
    longitude: 9.2811,
    circuitLength: '5.793 km',
    turns: 11,
    lapRecord: '1:21.046',
    recordHolder: 'R. Barrichello (2004)',
    mainStraightHeading: 215,
    role: 'Low-Drag V-Max Speed Validation',
    fallback: {
      ambientTemp: 24.3,
      trackTemp: 34.6,
      windSpeed: 8.5,
      windDirection: 180,
      humidity: 46,
      pressure: 1014,
      condition: 'Sunny / Clear',
      weatherCode: 0,
      isDay: 1,
    },
  },
  {
    id: 'suzuka',
    name: 'Suzuka',
    fullName: 'Suzuka International Racing Course',
    country: 'Japan',
    countryCode: 'JPN',
    flag: '🇯🇵',
    city: 'Mie Prefecture',
    latitude: 34.8431,
    longitude: 136.5410,
    circuitLength: '5.807 km',
    turns: 18,
    lapRecord: '1:30.983',
    recordHolder: 'L. Hamilton (2019)',
    mainStraightHeading: 160,
    role: 'Lateral G-Force Stability Facility',
    fallback: {
      ambientTemp: 22.8,
      trackTemp: 31.5,
      windSpeed: 15.6,
      windDirection: 110,
      humidity: 68,
      pressure: 1008,
      condition: 'High Coastal Humidity',
      weatherCode: 1,
      isDay: 1,
    },
  },
  {
    id: 'cota',
    name: 'COTA Austin',
    fullName: 'Circuit of the Americas',
    country: 'United States',
    countryCode: 'USA',
    flag: '🇺🇸',
    city: 'Austin, Texas',
    latitude: 30.1328,
    longitude: -97.6411,
    circuitLength: '5.513 km',
    turns: 20,
    lapRecord: '1:36.169',
    recordHolder: 'C. Leclerc (2019)',
    mainStraightHeading: 210,
    role: 'High Thermal Degradation Testing',
    fallback: {
      ambientTemp: 31.4,
      trackTemp: 44.2,
      windSpeed: 11.2,
      windDirection: 170,
      humidity: 42,
      pressure: 1012,
      condition: 'Sunny / High Ambient',
      weatherCode: 0,
      isDay: 1,
    },
  },
  {
    id: 'monaco',
    name: 'Monaco',
    fullName: 'Circuit de Monaco',
    country: 'Monaco',
    countryCode: 'MCO',
    flag: '🇲🇨',
    city: 'Monte Carlo',
    latitude: 43.7347,
    longitude: 7.4206,
    circuitLength: '3.337 km',
    turns: 19,
    lapRecord: '1:12.909',
    recordHolder: 'L. Hamilton (2021)',
    mainStraightHeading: 230,
    role: 'Low-Speed Mechanical Agility Test',
    fallback: {
      ambientTemp: 23.0,
      trackTemp: 33.1,
      windSpeed: 9.8,
      windDirection: 195,
      humidity: 55,
      pressure: 1016,
      condition: 'Clear Sea Breeze',
      weatherCode: 0,
      isDay: 1,
    },
  },
  {
    id: 'yasmarina',
    name: 'Yas Marina',
    fullName: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    countryCode: 'UAE',
    flag: '🇦🇪',
    city: 'Abu Dhabi',
    latitude: 24.4672,
    longitude: 54.6031,
    circuitLength: '5.281 km',
    turns: 16,
    lapRecord: '1:26.103',
    recordHolder: 'M. Verstappen (2021)',
    mainStraightHeading: 340,
    role: 'Twilight Cooling Transition Lab',
    fallback: {
      ambientTemp: 34.2,
      trackTemp: 42.0,
      windSpeed: 13.4,
      windDirection: 310,
      humidity: 38,
      pressure: 1009,
      condition: 'Hot Desert Air',
      weatherCode: 0,
      isDay: 1,
    },
  },
];

export interface RealtimeTelemetry {
  circuitId: string;
  ambientTemp: number; // °C
  trackTemp: number; // °C
  apparentTemp: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: number; // degrees
  surfacePressure: number; // hPa
  precipitation: number; // mm
  weatherCode: number;
  conditionText: string;
  isDay: number;
  solarRadiation: number; // W/m²
  gripLevel: number; // 0-100%
  trackStatus: 'DRY • OPTIMAL GRIP' | 'DAMP • CAUTION' | 'WET • STANDING WATER' | 'HOT • THERMAL STRESS' | 'COLD • EXTENDED WARMUP';
  recommendedCompound: 'SOFT (C4/C5)' | 'MEDIUM (C3)' | 'HARD (C1/C2)' | 'INTERMEDIATE' | 'FULL WET';
  windImpact: string;
  lastUpdated: string;
}

// Convert wind degrees into 16-point compass directions
export function getCompassDirection(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const idx = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[idx];
}

// Convert WMO weather code to readable string
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return 'Clear Sky';
    case 1: return 'Mainly Clear';
    case 2: return 'Partly Cloudy';
    case 3: return 'Overcast';
    case 45:
    case 48: return 'Track Fog / Reduced Visibility';
    case 51:
    case 53:
    case 55: return 'Light Drizzle';
    case 61: return 'Light Rain';
    case 63: return 'Moderate Rain';
    case 65: return 'Heavy Rain';
    case 80:
    case 81:
    case 82: return 'Rain Showers';
    case 95: return 'Thunderstorm Warning';
    default: return 'Stable Conditions';
  }
}

// Calculate aerodynamic wind effect relative to circuit straight
export function calculateWindImpact(windDirection: number, windSpeed: number, straightHeading: number): string {
  const diff = Math.abs((windDirection - straightHeading + 180) % 360 - 180);
  if (windSpeed < 5) {
    return 'Calm track breeze — negligible aerodynamic yaw impact';
  }
  if (diff < 35) {
    return `Direct headwind into Turn 1 (${windSpeed.toFixed(0)} km/h) — enhanced front-wing braking stability`;
  }
  if (diff > 145) {
    return `Tailwind on Main Straight (${windSpeed.toFixed(0)} km/h) — +3–5 km/h top speed, extended braking zone`;
  }
  if (diff >= 65 && diff <= 115) {
    return `Crosswind across apexes (${windSpeed.toFixed(0)} km/h) — high aero yaw sensitivity in high-speed sweeps`;
  }
  return `Quartering wind (${windSpeed.toFixed(0)} km/h) — asymmetrical aero downforce on fast entries`;
}
