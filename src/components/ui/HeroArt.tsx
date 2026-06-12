import React from 'react'

/** Arte decorativa do hero: blob com gradiente + ilustração de cavalo (SVG 1:1 do HTML). */
export function HeroArt({ children }: { children?: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-[1/1.05] w-full max-w-[540px]"
    >
      {/* blob */}
      <div className="absolute inset-0 -rotate-[8deg] rounded-[56%_44%_62%_38%/48%_52%_48%_52%] bg-[linear-gradient(135deg,var(--color-brand-tint)_0%,#F0F4E6_60%,#E8EFD8_100%)] after:absolute after:inset-[12%] after:rounded-[50%_60%_40%_50%/55%_45%_55%_45%] after:bg-[radial-gradient(circle_at_30%_30%,rgba(98,155,4,.12)_0%,transparent_70%)] after:content-['']" />

      {/* cavalo */}
      <div className="absolute inset-0 z-[2] grid place-items-center [&_path]:fill-none [&_path]:stroke-brand-dark [&_path]:[stroke-linecap:round] [&_path]:[stroke-linejoin:round] [&_path]:[stroke-width:1.4] [&_.accent]:stroke-brand-green [&_.accent]:[stroke-width:1.8]">
        <svg
          viewBox="0 0 400 420"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Ilustração de cavalo"
          className="h-auto w-[78%] max-w-[420px]"
        >
          <path d="M 80 240 C 90 200, 130 180, 175 185 C 200 188, 215 200, 235 205 C 260 210, 285 200, 305 180 C 320 165, 325 140, 320 115 C 318 100, 315 90, 318 80 C 322 70, 332 65, 338 72 C 344 80, 342 90, 338 100 C 335 108, 330 115, 332 122 C 335 130, 345 132, 348 140 C 352 152, 348 168, 340 178" />
          <path d="M 318 80 C 308 78, 296 82, 288 92 C 282 100, 278 110, 280 122 C 282 132, 290 138, 296 144" />
          <path className="accent" d="M 322 78 L 326 64 L 332 76 Z" />
          <circle cx="306" cy="100" r="2.5" fill="#456A54" stroke="none" />
          <path d="M 294 138 C 292 140, 292 144, 294 146" />
          <path
            className="accent"
            d="M 320 92 C 308 86, 298 88, 290 96 M 314 100 C 304 96, 296 100, 290 108 M 308 110 C 300 108, 294 114, 290 122"
          />
          <path d="M 240 205 C 244 240, 248 280, 252 320 C 254 340, 258 350, 254 360" />
          <path d="M 270 200 C 274 235, 278 275, 282 315 C 284 335, 286 345, 282 360" />
          <path d="M 100 235 C 96 260, 92 290, 90 320 C 88 340, 92 350, 88 360" />
          <path d="M 130 240 C 128 270, 126 300, 124 325 C 122 343, 124 352, 120 360" />
          <path className="accent" d="M 80 240 C 60 250, 48 270, 44 290 C 42 304, 48 316, 56 322" />
          <line
            x1="40"
            y1="375"
            x2="290"
            y2="375"
            stroke="#456A54"
            strokeDasharray="3 6"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </svg>
      </div>

      {children}
    </div>
  )
}
