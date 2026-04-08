import React, { useMemo } from 'react';

/* ─── seeded pseudo-random so SSR is stable ─── */
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ─── symbol pool ─── */
const SYMBOLS = ['৳', '৳', '৳', '💵', '💴', '💶', '💰', '₹', '$'];

function MoneyParticle({ rand, index }) {
  const r = useMemo(() => {
    const rng = seededRand(index * 7919);
    return {
      symbol:        SYMBOLS[Math.floor(rng() * SYMBOLS.length)],
      left:          rng() * 100,           // vw
      startY:        rng() * 100,           // vh — where it begins
      size:          12 + rng() * 28,       // 12–40px
      duration:      10 + rng() * 20,       // 10–30s
      delay:         -(rng() * 20),         // negative = already mid-air
      rotate:        rng() * 360,
      rotateDelta:   (rng() - 0.5) * 720,  // full barrel roll possible
      opacity:       0.06 + rng() * 0.14,  // 6–20% — whisper-subtle
      drift:         (rng() - 0.5) * 120,  // horizontal drift vw
    };
  }, [index]);

  const style = {
    position:  'absolute',
    left:      `${r.left}%`,
    top:       `${r.startY}%`,
    fontSize:  `${r.size}px`,
    opacity:   r.opacity,
    userSelect: 'none',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
    animation: `moneyFly${index % 6} ${r.duration}s ${r.delay}s linear infinite`,
    '--drift':  `${r.drift}px`,
    '--rotate': `${r.rotate}deg`,
    '--spin':   `${r.rotate + r.rotateDelta}deg`,
    filter: 'blur(0.3px)',
    fontStyle: 'normal',
  };

  return <span style={style} aria-hidden="true">{r.symbol}</span>;
}

/* ─── small "bill" rectangles (green glow) ─── */
function BillStreak({ rand, index }) {
  const r = useMemo(() => {
    const rng = seededRand(index * 3571 + 999);
    return {
      left:       rng() * 100,
      top:        rng() * 100,
      width:      20 + rng() * 40,
      height:     10 + rng() * 14,
      duration:   14 + rng() * 18,
      delay:      -(rng() * 18),
      opacity:    0.04 + rng() * 0.07,
      rotate:     (rng() - 0.5) * 40,
      drift:      (rng() - 0.5) * 80,
    };
  }, [index]);

  const style = {
    position: 'absolute',
    left:     `${r.left}%`,
    top:      `${r.top}%`,
    width:    `${r.width}px`,
    height:   `${r.height}px`,
    borderRadius: 3,
    background: 'linear-gradient(90deg, #10b981, #059669)',
    opacity:  r.opacity,
    pointerEvents: 'none',
    userSelect: 'none',
    boxShadow: '0 0 8px rgba(16,185,129,0.3)',
    willChange: 'transform',
    animation: `billFloat${index % 4} ${r.duration}s ${r.delay}s ease-in-out infinite`,
    '--drift': `${r.drift}px`,
    '--rotate': `${r.rotate}deg`,
    '--spin': `${r.rotate + 15}deg`,
  };

  return <div style={style} aria-hidden="true" />;
}

export default function MoneyBackground() {
  const particleCount = 40;
  const billCount = 20;

  return (
    <>
      {/* ─── Keyframe injection ─── */}
      <style>{`
        /* 6 variant fly paths so particles don't look identical */
        @keyframes moneyFly0 {
          0%   { transform: translateY(0)    translateX(0)           rotate(var(--rotate)); opacity: 0; }
          5%   { opacity: var(--opacity, 0.1); }
          95%  { opacity: var(--opacity, 0.1); }
          100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
        @keyframes moneyFly1 {
          0%   { transform: translateY(0) translateX(0) rotate(var(--rotate)) scale(1); opacity: 0; }
          10%  { opacity: var(--opacity, 0.1); }
          50%  { transform: translateY(-55vh) translateX(calc(var(--drift) * 0.5)) rotate(calc(var(--spin) * 0.5)) scale(1.1); }
          90%  { opacity: var(--opacity, 0.1); }
          100% { transform: translateY(-115vh) translateX(var(--drift)) rotate(var(--spin)) scale(0.8); opacity: 0; }
        }
        @keyframes moneyFly2 {
          0%   { transform: translateY(20px) translateX(0) rotate(var(--rotate)); opacity: 0; }
          15%  { opacity: var(--opacity, 0.1); }
          85%  { opacity: var(--opacity, 0.1); }
          100% { transform: translateY(-120vh) translateX(calc(var(--drift) * 1.3)) rotate(var(--spin)); opacity: 0; }
        }
        @keyframes moneyFly3 {
          0%   { transform: translateY(0) translateX(0) rotate(var(--rotate)) scale(0.8); opacity: 0; }
          8%   { opacity: var(--opacity, 0.12); }
          40%  { transform: translateY(-45vh) translateX(calc(var(--drift) * -0.3)) rotate(calc(var(--spin) * 0.3)) scale(1.2); }
          92%  { opacity: var(--opacity, 0.12); }
          100% { transform: translateY(-108vh) translateX(var(--drift)) rotate(var(--spin)) scale(0.6); opacity: 0; }
        }
        @keyframes moneyFly4 {
          0%   { transform: translateY(10px) translateX(0) rotate(var(--rotate)); opacity: 0; }
          20%  { opacity: var(--opacity, 0.08); }
          80%  { opacity: var(--opacity, 0.08); }
          100% { transform: translateY(-125vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
        @keyframes moneyFly5 {
          0%   { transform: translateY(0) translateX(5px) rotate(var(--rotate)) scale(1.1); opacity: 0; }
          12%  { opacity: var(--opacity, 0.1); }
          60%  { transform: translateY(-65vh) translateX(calc(var(--drift)*0.7)) rotate(calc(var(--spin)*0.6)) scale(0.9); }
          88%  { opacity: var(--opacity, 0.1); }
          100% { transform: translateY(-112vh) translateX(var(--drift)) rotate(var(--spin)) scale(0.7); opacity: 0; }
        }

        /* Bill rectangle floats */
        @keyframes billFloat0 {
          0%,100% { transform: translateY(0)    translateX(0)           rotate(var(--rotate)); }
          50%     { transform: translateY(-6vh) translateX(var(--drift)) rotate(var(--spin)); }
        }
        @keyframes billFloat1 {
          0%,100% { transform: translateY(0) translateX(0) rotate(var(--rotate)) scaleX(1); }
          33%     { transform: translateY(-8vh) translateX(calc(var(--drift)*0.5)) rotate(calc((var(--spin))*0.5)) scaleX(1.1); }
          66%     { transform: translateY(-4vh) translateX(var(--drift)) rotate(var(--spin)) scaleX(0.9); }
        }
        @keyframes billFloat2 {
          0%   { transform: translateY(0)     translateX(0) rotate(var(--rotate)); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-105vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
        }
        @keyframes billFloat3 {
          0%,100% { transform: translateY(4px) translateX(0) rotate(var(--rotate)); }
          50%     { transform: translateY(-5vh) translateX(calc(var(--drift)*0.8)) rotate(var(--spin)); }
        }
      `}</style>

      {/* ─── Container layer ─── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Radial pulse glows */}
        <div style={{
          position: 'absolute',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
          top: '10%', left: '5%',
          animation: 'pulseGlow 8s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute',
          width: 800, height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          bottom: '5%', right: '5%',
          animation: 'pulseGlow 11s ease-in-out 2s infinite alternate-reverse',
        }} />
        <style>{`
          @keyframes pulseGlow {
            from { transform: scale(0.9); opacity: 0.5; }
            to   { transform: scale(1.15); opacity: 1; }
          }
        `}</style>

        {/* Flying currency symbols */}
        {Array.from({ length: particleCount }, (_, i) => (
          <MoneyParticle key={`p-${i}`} index={i} />
        ))}

        {/* Glowing bill streaks */}
        {Array.from({ length: billCount }, (_, i) => (
          <BillStreak key={`b-${i}`} index={i} />
        ))}
      </div>
    </>
  );
}
