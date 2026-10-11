export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  author?: string;
}

export const JOURNAL_ARTICLES: Article[] = [
  {
    id: "aerodynamics",
    title: "The Art of Aerodynamics",
    subtitle: "How aerodynamic thinking and ground effect shape modern performance cars.",
    category: "ENGINEERING",
    readTime: "4 MIN READ",
    date: "SEPTEMBER 2026",
    image: "/images/cars/aston-amr24.webp",
    excerpt: "Downforce is not simply about pushing a vehicle into the asphalt; it is an orchestrated balance between high-pressure vortex generation and drag reduction systems.",
    content: [
      "In modern Formula 1, over 60% of total aerodynamic load is generated beneath the floor through Venturi tunnels and ground effect tunnels. The RouteOne R1 concept takes this principle directly to the road.",
      "Traditional spoilers create massive parasitic drag. By sealing the underfloor aerodynamics and integrating active diffuser flaps, we achieve stability at 300 km/h without sacrificing top-end acceleration.",
      "Driver confidence is directly linked to pitch sensitivity. A car whose aerodynamic balance shifts abruptly during hard braking breeds hesitation; one that remains stable under extreme deceleration breeds lap records."
    ]
  },
  {
    id: "behind-the-machine",
    title: "Behind the Machine",
    subtitle: "Exploring the engineering philosophy behind extreme high-performance vehicles.",
    category: "CHASSIS & POWERTRAIN",
    readTime: "5 MIN READ",
    date: "AUGUST 2026",
    image: "/images/cars/ferrari-f2004.webp",
    excerpt: "Every gram must earn its right to exist in the chassis. Carbon weave orientation, titanium uprights, and pushrod kinematics come together as one unified mechanical organism.",
    content: [
      "A supercar is defined not by its peak horsepower number on a dyno graph, but by the linear immediacy of its throttle response and the rigidity of its structural passenger cell.",
      "Inboard pushrod suspension decouples spring rates from aerodynamic loads, allowing the vehicle to remain supple over kerbs while maintaining a flat aerodynamic platform in high-speed sweeps."
    ]
  },
  {
    id: "one-lap",
    title: "One Lap",
    subtitle: "Why track driving is about discipline and precision, not simply raw speed.",
    category: "CIRCUIT DISCIPLINE",
    readTime: "3 MIN READ",
    date: "JULY 2026",
    image: "/images/cars/redbull-rb20.webp",
    excerpt: "The timer does not reward aggression. It rewards patience at the apex, smoothness on the brake release, and opening the steering before applying full throttle.",
    content: [
      "Amateur drivers frequently overdrive into the corner entry, washing out the front tires and delaying throttle application. The RouteOne track curriculum focuses on trail-braking telemetry.",
      "When you compress your braking zone and rotate the car around the apex with pedal pressure alone, lap times drop by full seconds without adding a single unit of horsepower."
    ]
  },
  {
    id: "collectors-perspective",
    title: "The Collector's Perspective",
    subtitle: "What makes an exotic vehicle worth experiencing in an era of digital homogeny.",
    category: "EDITORIAL & HERITAGE",
    readTime: "6 MIN READ",
    date: "JUNE 2026",
    image: "/images/cars/mclaren-mp44.webp",
    excerpt: "As electric propulsion homogenizes 0-100 times, authentic mechanical engagement, acoustic harmonics, and tactile hydraulic steering have become the ultimate luxury.",
    content: [
      "True automotive pedigree cannot be simulated through software sound enhancers. The spine-tingling crescendo of an atmospheric V10 revving past 9,000 RPM is an irreplaceable tactile memory.",
      "At RouteOne Auto Club, our curation prioritizes cars that demand respect, reward skill, and celebrate the uncompromised pinnacle of combustion engineering."
    ]
  }
];

export const SOCIAL_CAMPAIGN_POSTS = [
  {
    id: "post-1",
    platform: "Instagram",
    author: "RouteOne Auto Club",
    handle: "@routeoneautoclub",
    tag: "#RouteOneDrive",
    caption: "ONE LAP. ONE MACHINE. NO DISTRACTIONS. When you're sitting in the carbon tub of the R1 concept at turn 3, the rest of the world fades into white noise. What would you drive if you had one lap?",
    likes: "18.4K",
    comments: "429",
    date: "2 HOURS AGO",
    image: "/images/cars/r1-concept.webp"
  },
  {
    id: "post-2",
    platform: "TikTok",
    author: "RouteOne Pit Lane",
    handle: "@routeone.live",
    tag: "#SupercarExperience",
    caption: "Listen to that naturally aspirated downshift into Copse Corner. V10 symphonies only. 🏁 Sound up! #RouteOneDrive #F1Paddock #TrackDay",
    likes: "64.2K",
    comments: "1.1K",
    views: "890K views",
    date: "YESTERDAY",
    image: "/images/cars/williams-fw14b.webp"
  },
  {
    id: "post-3",
    platform: "YouTube",
    author: "RouteOne Media",
    handle: "RouteOne Auto Club Official",
    tag: "#TrackTelemetry",
    caption: "FULL TELEMETRY DEBRIEF: Pushing the McLaren 750S Track Pack to the limit through Maggotts and Becketts. Analyzing apex speeds with Chief Driver Mark.",
    likes: "32.1K",
    comments: "812",
    views: "340K views",
    date: "3 DAYS AGO",
    image: "/images/cars/mclaren-750s.webp"
  },
  {
    id: "post-4",
    platform: "Facebook",
    author: "RouteOne Auto Club",
    handle: "@RouteOneAutoClub",
    tag: "#RouteOneAutoClub",
    caption: "Private viewing slots for the RouteOne Autumn Paddock Showcase are now open to registered applicants. Reserve your 1-on-1 walkaround with our technical team.",
    likes: "4.8K",
    comments: "156",
    date: "5 DAYS AGO",
    image: "/images/cars/bugatti-tourbillon.webp"
  }
];
