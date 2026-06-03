export default function PageBackground() {
  return (
    <svg
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "none" }}
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="rg1" cx="20%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#daeeff" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#f0f6ff" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="rg2" cx="85%" cy="75%" r="50%">
          <stop offset="0%" stopColor="#c8e0f8" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#f0f6ff" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="600" fill="#f0f6ff"/>
      <rect width="1200" height="600" fill="url(#rg1)"/>
      <rect width="1200" height="600" fill="url(#rg2)"/>
      <circle cx="-40" cy="80" r="220" fill="none" stroke="#438fe5" strokeWidth="1" strokeOpacity="0.12"/>
      <circle cx="-40" cy="80" r="160" fill="none" stroke="#438fe5" strokeWidth="0.8" strokeOpacity="0.09"/>
      <circle cx="-40" cy="80" r="100" fill="none" stroke="#438fe5" strokeWidth="0.6" strokeOpacity="0.07"/>
      <circle cx="1240" cy="540" r="260" fill="none" stroke="#438fe5" strokeWidth="1" strokeOpacity="0.1"/>
      <circle cx="1240" cy="540" r="190" fill="none" stroke="#438fe5" strokeWidth="0.8" strokeOpacity="0.08"/>
      <polygon points="80,280 130,230 180,280 130,330" fill="none" stroke="#438fe5" strokeWidth="1" strokeOpacity="0.15"/>
      <polygon points="85,280 130,237 175,280 130,323" fill="#438fe5" fillOpacity="0.04"/>
      <polygon points="1050,120 1090,80 1130,120 1090,160" fill="none" stroke="#438fe5" strokeWidth="1" strokeOpacity="0.13"/>
      <polygon points="1055,120 1090,87 1125,120 1090,153" fill="#438fe5" fillOpacity="0.04"/>
      <g fill="#438fe5" fillOpacity="0.12">
        <circle cx="860" cy="80" r="1.5"/><circle cx="900" cy="80" r="1.5"/>
        <circle cx="940" cy="80" r="1.5"/><circle cx="980" cy="80" r="1.5"/>
        <circle cx="860" cy="116" r="1.5"/><circle cx="900" cy="116" r="1.5"/>
        <circle cx="940" cy="116" r="1.5"/><circle cx="980" cy="116" r="1.5"/>
        <circle cx="860" cy="152" r="1.5"/><circle cx="900" cy="152" r="1.5"/>
        <circle cx="940" cy="152" r="1.5"/><circle cx="980" cy="152" r="1.5"/>
        <circle cx="860" cy="188" r="1.5"/><circle cx="900" cy="188" r="1.5"/>
        <circle cx="940" cy="188" r="1.5"/><circle cx="980" cy="188" r="1.5"/>
      </g>
      <g fill="#438fe5" fillOpacity="0.09">
        <circle cx="200" cy="420" r="1.5"/><circle cx="240" cy="420" r="1.5"/>
        <circle cx="280" cy="420" r="1.5"/><circle cx="320" cy="420" r="1.5"/>
        <circle cx="200" cy="456" r="1.5"/><circle cx="240" cy="456" r="1.5"/>
        <circle cx="280" cy="456" r="1.5"/><circle cx="320" cy="456" r="1.5"/>
        <circle cx="200" cy="492" r="1.5"/><circle cx="240" cy="492" r="1.5"/>
        <circle cx="280" cy="492" r="1.5"/><circle cx="320" cy="492" r="1.5"/>
      </g>
      <rect x="920" y="340" width="180" height="80" rx="4" fill="none" stroke="#438fe5" strokeWidth="0.8" strokeOpacity="0.1"/>
      <line x1="0" y1="580" x2="300" y2="320" stroke="#438fe5" strokeWidth="0.6" strokeOpacity="0.07"/>
      <line x1="1200" y1="20" x2="900" y2="280" stroke="#438fe5" strokeWidth="0.6" strokeOpacity="0.07"/>
      <path d="M 500 -20 Q 600 60 700 -20" fill="none" stroke="#438fe5" strokeWidth="0.8" strokeOpacity="0.1"/>
    </svg>
  )
}