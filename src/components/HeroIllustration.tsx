// Home-page cover art: a minimalist, flat-vector scene of children learning
// together outdoors — small groups reading under trees, guided by a couple of
// adults, no classroom. Colors come from the brand palette (coral accent, warm
// cream sky, muted sage nature tones) to stay on-brand without looking busy.

type Figure = {
  x: number
  y: number
  s?: number
  flip?: boolean
  skin: string
  hair: string
  shirt: string
  pants: string
  bun?: boolean
}

// Happy face — two eye dots and a smile. Shared by kids and adults.
function Face({ cy }: { cy: number }) {
  return (
    <>
      <circle cx="0" cy={cy} r="1.7" fill="#41332b" />
      <circle cx="9" cy={cy} r="1.7" fill="#41332b" />
      <path d={`M0 ${cy + 6} q4.5 4 9 0`} stroke="#41332b" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </>
  )
}

// A single seated, cross-legged child. Drawn facing right; `flip` mirrors it.
function SeatedKid({ x, y, s = 1, flip = false, skin, hair, shirt, pants, bun = false }: Figure) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="12" rx="30" ry="14" fill={pants} />
      <path d="M-20 12 C-25 -22 25 -22 20 12 Z" fill={shirt} />
      {bun && <circle cx="-11" cy="-40" r="7" fill={hair} />}
      <circle cx="4" cy="-38" r="15" fill={hair} />
      <circle cx="4" cy="-33" r="14" fill={skin} />
      <g transform="translate(4 2)">
        <Face cy={-35} />
      </g>
    </g>
  )
}

// A grown-up sitting cross-legged (storyteller). Bigger body, smaller head
// relative to the body than a child, and one hand open toward the group.
function SeatedAdult({ x, y, s = 1, flip = false, skin, hair, shirt, pants, bun = false }: Figure) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="16" rx="40" ry="17" fill={pants} />
      <path d="M-26 16 C-31 -42 31 -42 26 16 Z" fill={shirt} />
      {/* open hand gesturing toward the children */}
      <path d="M22 -12 q26 8 30 28" stroke={shirt} strokeWidth="13" fill="none" strokeLinecap="round" />
      <circle cx="54" cy="18" r="8" fill={skin} />
      {bun && <circle cx="-13" cy="-54" r="8" fill={hair} />}
      <circle cx="3" cy="-52" r="16" fill={hair} />
      <circle cx="3" cy="-47" r="14.5" fill={skin} />
      <g transform="translate(-1 4)">
        <Face cy={-53} />
      </g>
    </g>
  )
}

// A standing adult (teacher), one arm gesturing down toward a group.
function Adult({ x, y, s = 1, flip = false, skin, hair, shirt, pants, bun = false }: Figure) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="-9" cy="-2" rx="9" ry="5" fill="#5b4a3c" />
      <ellipse cx="9" cy="-2" rx="9" ry="5" fill="#5b4a3c" />
      <path d="M-15 -6 L-15 -58 L-2 -58 L-3 -6 Z" fill={pants} />
      <path d="M15 -6 L15 -58 L2 -58 L3 -6 Z" fill={pants} />
      <path d="M-21 -54 C-25 -116 25 -116 21 -54 Z" fill={shirt} />
      {/* near arm reaching toward the children */}
      <path d="M17 -100 q28 4 34 36" stroke={shirt} strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="-60" r="7.5" fill={skin} />
      {bun && <circle cx="-14" cy="-130" r="8" fill={hair} />}
      <circle cx="2" cy="-128" r="16.5" fill={hair} />
      <circle cx="2" cy="-122" r="15" fill={skin} />
      <g transform="translate(0 3)">
        <Face cy={-125} />
      </g>
    </g>
  )
}

// An open book, tented toward the viewer, sitting between children.
function OpenBook({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 L-42 -9 Q-46 -9 -46 -4 L-3 7 Z" fill="#fffaf5" stroke="#e6cdbf" strokeWidth="1.2" />
      <path d="M0 0 L42 -9 Q46 -9 46 -4 L3 7 Z" fill="#fffaf5" stroke="#e6cdbf" strokeWidth="1.2" />
      <path d="M0 -1 L0 7" stroke="#d9b7a6" strokeWidth="2" strokeLinecap="round" />
      <g stroke="#e7b9a8" strokeWidth="1" opacity="0.75" strokeLinecap="round">
        <path d="M-36 -4 l26 5.5" />
        <path d="M-36 0 l26 5.5" />
        <path d="M36 -4 l-26 5.5" />
        <path d="M36 0 l-26 5.5" />
      </g>
    </g>
  )
}

// A simple stylised tree: a brown trunk under a soft three-lobe canopy.
function Tree({ x, groundY, s = 1 }: { x: number; groundY: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${groundY}) scale(${s})`}>
      <path d="M-7 0 q4 -84 5 -128 l10 0 q1 44 5 128 z" fill="#bd9074" />
      <circle cx="5" cy="-184" r="100" fill="#8fa877" />
      <circle cx="-45" cy="-164" r="70" fill="#a3ba8a" />
      <circle cx="48" cy="-162" r="64" fill="#a3ba8a" />
      <circle cx="0" cy="-230" r="68" fill="#a3ba8a" />
    </g>
  )
}

// A small three-blade grass tuft.
function Grass({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} q-3 -11 -7 -15 M${x} ${y} q0 -13 0 -17 M${x} ${y} q3 -11 7 -15`}
      stroke="#93a878"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
    />
  )
}

export default function HeroIllustration({ className, label }: { className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 1200 560"
      className={className}
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="eca-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf5f0" />
          <stop offset="100%" stopColor="#f6e5da" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="1200" height="560" fill="url(#eca-sky)" />

      {/* sun with a very soft halo */}
      <circle cx="250" cy="120" r="62" fill="#e0765a" opacity="0.12" />
      <circle cx="250" cy="120" r="44" fill="#e0765a" />

      {/* two tiny birds */}
      <g stroke="#8a7d75" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M470 108 q9 -8 18 0 q9 -8 18 0" />
        <path d="M540 140 q6 -5 12 0 q6 -5 12 0" />
      </g>

      {/* rolling ground — a lighter hill behind, a sage meadow in front */}
      <path d="M0 430 Q 320 366 640 408 T 1200 402 L1200 560 L0 560 Z" fill="#d9e0cb" />
      <path d="M0 472 Q 360 424 720 460 T 1200 452 L1200 560 L0 560 Z" fill="#c6d1ad" />

      {/* a distant little tree on the back hill */}
      <g transform="translate(470 392) scale(0.5)">
        <path d="M-4 0 l0 -30 l8 0 l0 30 z" fill="#a9866c" />
        <circle cx="-16" cy="-44" r="24" fill="#97b085" />
        <circle cx="18" cy="-44" r="22" fill="#97b085" />
        <circle cx="0" cy="-66" r="28" fill="#97b085" />
      </g>

      {/* a medium tree on the left, the big one on the right */}
      <Tree x={120} groundY={458} s={0.62} />
      <Tree x={1082} groundY={438} s={1} />

      {/* a couple of leaves drifting down from the big tree */}
      <ellipse cx="1010" cy="360" rx="6" ry="3" fill="#e6a94e" opacity="0.8" transform="rotate(-25 1010 360)" />
      <ellipse cx="1150" cy="392" rx="6" ry="3" fill="#cf8a5e" opacity="0.8" transform="rotate(20 1150 392)" />

      {/* soft ground shadows to seat each cluster */}
      <ellipse cx="330" cy="510" rx="185" ry="18" fill="#3a4a2f" opacity="0.06" />
      <ellipse cx="614" cy="506" rx="120" ry="15" fill="#3a4a2f" opacity="0.06" />
      <ellipse cx="880" cy="512" rx="230" ry="20" fill="#3a4a2f" opacity="0.06" />

      {/* left cluster — a standing teacher and a pair sharing a book */}
      <Adult x={228} y={470} s={1} skin="#e8b48f" hair="#4a3a30" shirt="#6f9e8f" pants="#55606a" bun />
      <SeatedKid x={320} y={464} s={1.45} skin="#f0c19a" hair="#5a4636" shirt="#e0765a" pants="#6f7f6a" />
      <SeatedKid x={432} y={462} s={1.45} flip bun skin="#c07f4f" hair="#2f2620" shirt="#efe3d6" pants="#b0895f" />
      <OpenBook x={376} y={490} s={1.35} />

      {/* centre cluster — a pair reading together */}
      <SeatedKid x={560} y={462} s={1.4} skin="#f0c19a" hair="#3a2d25" shirt="#d98f86" pants="#6f7f6a" />
      <SeatedKid x={665} y={460} s={1.4} flip bun skin="#c07f4f" hair="#2f2620" shirt="#8098a8" pants="#7d8a6a" />
      <OpenBook x={612} y={488} s={1.3} />

      {/* right cluster — three children and a seated storyteller under the tree */}
      <SeatedKid x={752} y={458} s={1.32} skin="#d59e6f" hair="#4a3a30" shirt="#e6a94e" pants="#6f7f6a" />
      <SeatedKid x={912} y={456} s={1.3} flip skin="#c07f4f" hair="#6b4a34" shirt="#84a58f" pants="#9a7d5f" />
      <SeatedKid x={835} y={478} s={1.5} skin="#f0c19a" hair="#3a2d25" shirt="#c85a3c" pants="#7d8a6a" />
      <OpenBook x={835} y={500} s={1.25} />
      <SeatedAdult x={1000} y={478} s={1.42} flip skin="#d59e6f" hair="#3a2d25" shirt="#c47a5c" pants="#6b6256" bun />

      {/* sparse grass + a few coral wildflowers */}
      <Grass x={185} y={516} />
      <Grass x={1128} y={472} />
      <path d="M150 506 l0 -14" stroke="#93a878" strokeWidth="2" strokeLinecap="round" />
      <circle cx="150" cy="490" r="4" fill="#e0765a" />
      <path d="M498 508 l0 -14" stroke="#93a878" strokeWidth="2" strokeLinecap="round" />
      <circle cx="498" cy="492" r="4" fill="#e6a94e" />
      <path d="M700 516 l0 -14" stroke="#93a878" strokeWidth="2" strokeLinecap="round" />
      <circle cx="700" cy="500" r="4" fill="#e0765a" />
    </svg>
  )
}
