/** Stiliserad karta över trakten (inte skalenlig). Dekorativ – adressen står i texten intill. */
export default function MapIllustration() {
  return (
    <svg viewBox="0 0 480 300" className="map-svg" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="480" height="300" className="map-land" />
      <path d="M0 210 C 70 190, 120 240, 190 230 S 300 270, 340 300 L 0 300 Z" className="map-water" />
      <path d="M-10 60 C 80 70, 140 40, 230 70 S 380 120, 490 90" className="map-park" strokeWidth="46" fill="none" />
      <path d="M300 -10 C 290 80, 330 150, 320 310" className="map-road-major" fill="none" />
      <path d="M-10 150 C 90 140, 180 170, 300 150 S 420 120, 490 140" className="map-road" fill="none" />
      <path d="M150 -10 C 160 60, 140 120, 170 160" className="map-road" fill="none" />
      <path d="M220 160 C 230 200, 260 220, 250 260" className="map-road" fill="none" />
      <path d="M40 250 L 220 160 L 470 40" className="map-rail" fill="none" />
      <g transform="translate(232 92)">
        <circle r="26" className="map-pin-halo" />
        <path d="M0 -22 C 12 -22 20 -13 20 -3 C 20 11 0 26 0 26 C 0 26 -20 11 -20 -3 C -20 -13 -12 -22 0 -22 Z" className="map-pin" />
        <circle cy="-4" r="7" className="map-pin-dot" />
      </g>
      <text x="312" y="24" className="map-label">E6</text>
    </svg>
  );
}
