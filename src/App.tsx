import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      /* Neutrals */
      --cream:        #FAF8F5;
      --warm-white:   #FDFCFA;
      --beige:        #F2EDE6;
      --beige-mid:    #E8E0D5;
      --sand:         #D4C9B8;
      --taupe:        #B8A99A;
      --charcoal:     #252320;
      --charcoal-mid: #3A3834;
      --gray-text:    #6B6560;
      --gray-light:   #9A9490;
      --border:       #E8E0D5;
      --border-hover: #CEC4B5;

      /* Brand accent — warm sky blue, very restrained */
      --accent:       #4A9EBF;
      --accent-light: rgba(74,158,191,0.12);
      --accent-mid:   rgba(74,158,191,0.25);
      --accent-star:  #F5A623;   /* warm amber for stars */
      --accent-star-l:rgba(245,166,35,0.18);

      --shadow:       rgba(37,35,32,0.055);
      --shadow-hover: rgba(37,35,32,0.10);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--cream);
      font-family: 'DM Sans', sans-serif;
      color: var(--charcoal);
      -webkit-font-smoothing: antialiased;
    }

    .survey-root {
      min-height: 100vh;
      background: var(--cream);
      padding: 0 0 96px;
    }

    /* ─── Header ──────────────────────────────────────────────────── */
    .survey-header {
      background: var(--warm-white);
      border-bottom: 1px solid var(--border);
      padding: 52px 24px 48px;
      text-align: center;
    }

    .logo-img {
      display: block;
      margin: 0 auto 36px;
      width: 240px;
      max-width: 70vw;
      height: auto;
    }
    @media (max-width: 480px) { .logo-img { width: 185px; } }

    .header-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(26px, 5vw, 38px);
      font-weight: 600;
      color: var(--charcoal);
      letter-spacing: -0.02em;
      line-height: 1.15;
      margin-bottom: 14px;
    }

    .header-subtitle {
      font-size: 15px;
      font-weight: 300;
      color: var(--gray-text);
      line-height: 1.75;
      max-width: 400px;
      margin: 0 auto;
    }

    /* ─── Progress Bar ────────────────────────────────────────────── */
    .progress-wrap {
      background: var(--warm-white);
      border-bottom: 1px solid var(--border);
      padding: 0 20px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .progress-wrap::-webkit-scrollbar { display: none; }

    .progress-steps {
      display: flex;
      max-width: 680px;
      margin: 0 auto;
      position: relative;
    }

    .progress-steps::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--beige-mid);
    }

    .progress-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 4px 12px;
      min-width: 80px;
      position: relative;
      cursor: default;
    }

    .progress-step::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background 0.3s ease;
    }

    .progress-step.done::after  { background: var(--accent); }
    .progress-step.active::after { background: var(--accent); }

    .step-dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid var(--beige-mid);
      background: var(--warm-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', sans-serif;
      font-size: 9px;
      font-weight: 600;
      color: var(--gray-light);
      transition: all 0.25s ease;
      flex-shrink: 0;
    }
    .progress-step.done  .step-dot { background: var(--accent); border-color: var(--accent); color: white; }
    .progress-step.active .step-dot { background: var(--accent); border-color: var(--accent); color: white; box-shadow: 0 0 0 4px var(--accent-light); }

    .step-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 400;
      color: var(--gray-light);
      text-align: center;
      white-space: nowrap;
      transition: color 0.25s ease;
      letter-spacing: 0.01em;
    }
    .progress-step.active .step-label { color: var(--accent); font-weight: 500; }
    .progress-step.done   .step-label { color: var(--charcoal); }

    /* ─── Body ────────────────────────────────────────────────────── */
    .survey-body {
      max-width: 680px;
      margin: 0 auto;
      padding: 36px 20px 0;
    }

    /* ─── Section Number Pill ─────────────────────────────────────── */
    .section-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--accent-light);
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 10px;
    }

    /* ─── Cards ───────────────────────────────────────────────────── */
    .card {
      background: var(--warm-white);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px 32px 36px;
      margin-bottom: 16px;
      box-shadow: 0 1px 8px var(--shadow), 0 4px 16px var(--shadow);
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card:hover {
      box-shadow: 0 2px 12px var(--shadow-hover), 0 6px 28px var(--shadow-hover);
      border-color: var(--border-hover);
    }
    .card.invalid {
      border-color: #e45757;
      animation: flashBorder 0.9s ease 2;
      box-shadow: 0 2px 12px rgba(228,87,87,0.06), 0 6px 28px rgba(228,87,87,0.04);
    }
    @keyframes flashBorder {
      0% { border-color: #e45757; }
      50% { border-color: var(--border); }
      100% { border-color: #e45757; }
    }
    @media (max-width: 480px) { .card { padding: 26px 20px 30px; } }

    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 600;
      color: var(--charcoal);
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--beige-mid);
      letter-spacing: -0.015em;
    }

    /* ─── Fields ──────────────────────────────────────────────────── */
    .field-group { display: flex; flex-direction: column; gap: 20px; }
    .field       { display: flex; flex-direction: column; gap: 7px; position: relative; }

    label.field-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--gray-text);
    }

    input[type="text"],
    input[type="email"],
    input[type="date"],
    select,
    textarea {
      width: 100%;
      background: var(--cream);
      border: 1.5px solid var(--border);
      border-radius: 11px;
      padding: 13px 15px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 300;
      color: var(--charcoal);
      appearance: none;
      -webkit-appearance: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      outline: none;
    }
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="date"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
      background: white;
    }
    input::placeholder, textarea::placeholder { color: var(--gray-light); }

    .select-wrapper { position: relative; }
    .select-wrapper::after {
      content: '';
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid var(--taupe);
      pointer-events: none;
    }

    textarea { resize: vertical; min-height: 120px; line-height: 1.65; }

    /* ─── Stars ───────────────────────────────────────────────────── */
    .ratings-grid { display: flex; flex-direction: column; gap: 10px; }

    .rating-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      background: var(--cream);
      border: 1.5px solid var(--border);
      border-radius: 12px;
      gap: 12px;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .rating-row.rated {
      background: var(--warm-white);
      border-color: var(--border-hover);
    }

    .rating-row.invalid { border-color: #e45757; }

    .rating-label {
      font-size: 14px;
      font-weight: 400;
      color: var(--charcoal-mid);
      flex: 1;
      min-width: 0;
    }

    .stars-row { display: flex; gap: 3px; flex-shrink: 0; }

    /* allow horizontal pointer tracking across stars */
    .stars-row { touch-action: none; }
    .star-btn {
      background: none; border: none; cursor: pointer;
      padding: 3px; line-height: 1;
      transition: transform 0.15s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .star-btn:hover { transform: scale(1.2); }

    .star-svg {
      width: 24px; height: 24px;
      transition: fill 0.15s ease, stroke 0.15s ease;
    }
    .star-svg.filled { fill: var(--accent-star); stroke: var(--accent-star); }
    .star-svg.empty  { fill: none; stroke: var(--beige-mid); stroke-width: 1.5; }
    .star-svg.hover  { fill: var(--accent-star); stroke: var(--accent-star); opacity: 0.55; }

    @media (max-width: 480px) {
      .rating-row { flex-direction: column; align-items: flex-start; gap: 10px; }
    }

    /* ─── Toggles ─────────────────────────────────────────────────── */
    .toggle-group { display: flex; flex-direction: column; gap: 10px; }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 18px;
      background: var(--cream);
      border: 1.5px solid var(--border);
      border-radius: 12px;
      gap: 16px;
      transition: border-color 0.2s ease;
    }
    .toggle-row:has(input:checked) { border-color: var(--border-hover); }
    .toggle-row.invalid { border-color: #e45757; }

    .toggle-text { font-size: 14px; font-weight: 400; color: var(--charcoal-mid); flex: 1; }

    .toggle-switch {
      position: relative; width: 48px; height: 28px;
      flex-shrink: 0; cursor: pointer;
    }
    .toggle-switch input { display: none; }
    .toggle-track {
      position: absolute; inset: 0;
      background: var(--beige-mid);
      border-radius: 14px;
      transition: background 0.25s ease;
    }
    .toggle-switch input:checked + .toggle-track { background: var(--accent); }
    .toggle-thumb {
      position: absolute; top: 3px; left: 3px;
      width: 22px; height: 22px;
      background: white; border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0,0,0,0.14);
      transition: transform 0.25s ease;
    }
    .toggle-switch input:checked ~ .toggle-thumb { transform: translateX(20px); }

    /* ─── Photo Card (cream version) ──────────────────────────────── */
    .photo-card {
      background: #F5F0E8;
      border: 1.5px solid #DDD5C5;
      border-radius: 18px;
      padding: 32px 32px 36px;
      margin-bottom: 16px;
      box-shadow: 0 1px 8px var(--shadow), 0 4px 16px var(--shadow);
      position: relative;
      overflow: hidden;
    }
    .photo-card::before {
      content: '';
      position: absolute;
      top: -50px; right: -50px;
      width: 180px; height: 180px;
      background: rgba(74,158,191,0.04);
      border-radius: 50%;
    }
    @media (max-width: 480px) { .photo-card { padding: 26px 20px 30px; } }

    .photo-eyebrow {
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .photo-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 600;
      color: var(--charcoal);
      letter-spacing: -0.015em;
      margin-bottom: 12px;
    }
    .photo-body {
      font-size: 14.5px;
      font-weight: 300;
      color: var(--gray-text);
      line-height: 1.7;
      margin-bottom: 20px;
    }
    .photo-discount {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: white;
      border: 1.5px solid var(--border);
      border-radius: 12px;
      padding: 12px 18px;
      margin-bottom: 20px;
      box-shadow: 0 1px 6px var(--shadow);
    }
    .photo-discount-badge {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: -0.02em;
    }
    .photo-discount-divider {
      width: 1px; height: 32px;
      background: var(--border);
    }
    .photo-discount-text {
      font-size: 13px;
      font-weight: 400;
      color: var(--gray-text);
      line-height: 1.5;
    }
    .photo-email {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13.5px;
      font-weight: 400;
      color: var(--gray-text);
    }
    .photo-email a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }
    .photo-email a:hover { border-color: var(--accent); }
    .photo-social {
      margin-top: 12px;
      font-size: 12.5px;
      font-weight: 300;
      color: var(--taupe);
      font-style: italic;
    }

    /* ─── Private badge ───────────────────────────────────────────── */
    .private-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 400;
      color: var(--gray-light);
      background: var(--beige);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 4px 10px;
      margin-top: -10px;
      margin-bottom: 18px;
    }

    /* invalid field marker */
    .field.invalid::after,
    .rating-row.invalid::after,
    .toggle-row.invalid::after {
      content: '!';
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #e45757;
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(228,87,87,0.12);
      pointer-events: none;
      z-index: 5;
    }

    /* ─── Submit ──────────────────────────────────────────────────── */
    .submit-section { text-align: center; padding: 8px 0 0; }

    .submit-btn {
      background: var(--charcoal);
      color: white;
      border: none;
      border-radius: 13px;
      padding: 17px 52px;
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 18px rgba(37,35,32,0.20);
      min-width: 240px;
    }
    .submit-btn:hover {
      background: var(--charcoal-mid);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(37,35,32,0.24);
    }
    .submit-btn:active { transform: translateY(0); }

    .submit-btn[disabled] {
      opacity: 0.7;
      cursor: default;
      transform: none;
      box-shadow: none;
    }

    .submit-note {
      margin-top: 14px;
      font-size: 12px;
      font-weight: 300;
      color: var(--gray-light);
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    /* ─── Success ─────────────────────────────────────────────────── */
    .success-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--cream);
      padding: 40px 24px;
      text-align: center;
      animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    }

    .success-ring {
      position: relative;
      width: 88px; height: 88px;
      margin: 0 auto 32px;
    }
    .success-ring-outer {
      position: absolute; inset: 0;
      border-radius: 50%;
      border: 2px solid var(--accent-mid);
      animation: ringPop 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
    }
    .success-ring-inner {
      position: absolute; inset: 8px;
      border-radius: 50%;
      background: var(--accent);
      display: flex; align-items: center; justify-content: center;
      animation: scalePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
    }
    @keyframes ringPop {
      from { opacity: 0; transform: scale(0.7); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes scalePop {
      from { opacity: 0; transform: scale(0.5); }
      to   { opacity: 1; transform: scale(1); }
    }

    .success-logo-img {
      display: block;
      margin: 0 auto 28px;
      width: 160px;
      max-width: 60vw;
      height: auto;
      animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both;
      opacity: 0.85;
    }

    .success-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(30px, 6vw, 44px);
      font-weight: 600;
      color: var(--charcoal);
      letter-spacing: -0.025em;
      line-height: 1.15;
      margin-bottom: 6px;
      animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s both;
    }
    .success-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 300;
      color: var(--taupe);
      margin-bottom: 24px;
      letter-spacing: 0.01em;
      animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both;
    }
    .success-divider {
      width: 48px; height: 2px;
      background: var(--accent-mid);
      border-radius: 2px;
      margin: 0 auto 24px;
      animation: fadeUp 0.6s ease 0.35s both;
    }
    .success-body {
      font-size: 15px;
      font-weight: 300;
      color: var(--gray-text);
      line-height: 1.75;
      max-width: 340px;
      margin: 0 auto;
      animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.4s both;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// ─── Progress Steps ───────────────────────────────────────────────────────────
const STEPS = [
  { label: "Info" },
  { label: "Details" },
  { label: "Ratings" },
  { label: "Feedback" },
  { label: "Permissions" },
];

function ProgressBar({ activeStep, completed, onStepClick }: { activeStep: number; completed?: boolean[]; onStepClick?: (i: number) => void }) {
  return (
    <div className="progress-wrap">
      <div className="progress-steps">
        {STEPS.map((s, i) => {
          const state = completed?.[i] ? "done" : i === activeStep ? "active" : "";
          return (
            <div
              key={i}
              className={`progress-step ${state}`}
              onClick={() => onStepClick?.(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onStepClick?.(i);
                }
              }}
              role={onStepClick ? "button" : undefined}
              tabIndex={onStepClick ? 0 : -1}
              style={onStepClick ? { cursor: "pointer" } : undefined}
            >
              <div className="step-dot">
                {i < activeStep ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({
  id,
  label,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  invalid?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    const onUp = () => setTracking(false);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div id={id ? `rating-${id}` : undefined} className={`rating-row${value > 0 ? " rated" : ""}${invalid ? ' invalid' : ''}`}>
      <span className="rating-label">{label}</span>
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= value;
          const isHover  = star <= hovered && hovered > 0;
          return (
            <button
              key={star}
              type="button"
              className="star-btn"
              onClick={() => onChange(star)}
              onPointerDown={(e) => {
                // start tracking for slide gestures; set selection immediately
                try { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); } catch {}
                e.preventDefault();
                setTracking(true);
                setHovered(star);
                onChange(star);
              }}
              onPointerEnter={() => {
                setHovered(star);
                if (tracking) onChange(star);
              }}
              onPointerLeave={() => {
                if (!tracking) setHovered(0);
              }}
              onPointerUp={(e) => {
                try { (e.currentTarget as Element).releasePointerCapture?.(e.pointerId); } catch {}
                setTracking(false);
              }}
              onPointerCancel={() => setTracking(false)}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <svg
                className={`star-svg ${isHover ? "hover" : isFilled ? "filled" : "empty"}`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.5l2.8 5.7 6.3.9-4.55 4.44 1.07 6.26L12 17.27l-5.6 2.95 1.07-6.26L2.9 9.1l6.3-.9z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({
  label,
  id,
  checked,
  onChange,
  invalid = false,
}: {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  invalid?: boolean;
}) {
  return (
    <div className={`toggle-row ${invalid ? 'invalid' : ''}`}>
      <span className="toggle-text">{label}</span>
      <label className="toggle-switch" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={onChange} />
        <div className="toggle-track" />
        <div className="toggle-thumb" />
      </label>
    </div>
  );
}

// ─── Derive active step from scroll / form state ──────────────────────────────
function getActiveStep(form: any) {
  if (form.favorite || form.improve || form.improveSkills) return 3;
  if (form.ratingOverall || form.ratingComm || form.ratingSetup || form.ratingClean || form.ratingBooking) return 2;
  if (form.inflatable || form.howHeard) return 1;
  if (form.name || form.email || form.eventDate) return 0;
  return 0;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [submitted, setSubmitted] = useState(false);
  type SurveyForm = {
    name: string;
    email: string;
    eventDate: string;
    inflatable: string;
    howHeard: string;
    ratingOverall: number;
    ratingComm: number;
    ratingSetup: number;
    ratingClean: number;
    ratingBooking: number;
    favorite: string;
    improve: string;
    improveSkills: string;
    publishReview: boolean;
    useName: boolean;
  };

  const [form, setForm] = useState<SurveyForm>({
    name: "", email: "", eventDate: "",
    inflatable: "", howHeard: "",
    ratingOverall: 0, ratingComm: 0, ratingSetup: 0, ratingClean: 0, ratingBooking: 0,
    favorite: "", improve: "", improveSkills: "",
    publishReview: false, useName: false,
  });

    const set       = (key: keyof SurveyForm) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setRating = (key: keyof SurveyForm) => (v: number) => setForm((f) => ({ ...f, [key]: v }));
  const [permissionTouched, setPermissionTouched] = useState(false);
  const setToggle = (key: keyof SurveyForm) => (e: any) => {
    setForm((f) => ({ ...f, [key]: e.target.checked }));
    setPermissionTouched(true);
  };

  const derivedStep = getActiveStep(form);
  const [uiActiveStep, setUiActiveStep] = useState<number>(derivedStep);
  const [submitting, setSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setUiActiveStep(derivedStep);
  }, [derivedStep]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate individual fields
    const invalid: Record<string, boolean> = {};
    if (!form.name || !form.name.trim()) invalid.name = true;
    if (!form.email || !form.email.trim()) invalid.email = true;
    if (!form.eventDate) invalid.eventDate = true;
    if (!form.inflatable || !form.inflatable.trim()) invalid.inflatable = true;
    if (!form.howHeard || !form.howHeard.trim()) invalid.howHeard = true;
    if (form.ratingOverall <= 0) invalid.ratingOverall = true;
    if (form.ratingComm <= 0) invalid.ratingComm = true;
    if (form.ratingSetup <= 0) invalid.ratingSetup = true;
    if (form.ratingClean <= 0) invalid.ratingClean = true;
    if (form.ratingBooking <= 0) invalid.ratingBooking = true;
    if (!form.favorite || !form.favorite.trim()) invalid.favorite = true;
    if (!form.improve?.trim() && !form.improveSkills?.trim()) {
      invalid.improve = true;
      invalid.improveSkills = true;
    }
    if (!permissionTouched) {
      invalid.publishReview = true;
      invalid.useName = true;
    }

    if (Object.keys(invalid).length > 0) {
      setInvalidFields(invalid);
      // find first invalid field and scroll to it
      const order = [
        'name','email','eventDate',
        'inflatable','howHeard',
        'ratingOverall','ratingComm','ratingSetup','ratingClean','ratingBooking',
        'favorite','improve','improveSkills','publishReview','useName'
      ];
      const firstKey = order.find((k) => invalid[k]);
      if (firstKey) {
        const el = document.getElementById(firstKey) || document.getElementById(`rating-${firstKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert({
        name: form.name,
        email: form.email,
        event_date: form.eventDate,
        inflatable: form.inflatable,
        how_heard: form.howHeard,
        rating_overall: form.ratingOverall,
        rating_comm: form.ratingComm,
        rating_setup: form.ratingSetup,
        rating_clean: form.ratingClean,
        rating_booking: form.ratingBooking,
        favorite: form.favorite,
        improve: form.improve,
        improve_skills: form.improveSkills,
        publish_review: form.publishReview,
        use_name: form.useName,
        user_agent: navigator.userAgent,
      });

      if (error) throw error;

      fetch("/api/send-feedback-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          event_date: form.eventDate,
          inflatable: form.inflatable,
          how_heard: form.howHeard,
          rating_overall: form.ratingOverall,
          favorite: form.favorite,
          improve: form.improve,
          improveSkills: form.improveSkills,
        }),
      }).catch((emailError) => {
        console.error("Email notification failed:", emailError);
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong submitting your feedback. Please try again.");
      setSubmitting(false);
    }
  };
  

  const goToStep = (i: number) => {
    setUiActiveStep(i);
    const ids = [
      'step-info',
      'step-details',
      'step-ratings',
      'step-feedback',
      'step-permissions',
    ];
    const id = ids[i];
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Completion rules per section: all inputs in a section must be filled
  const infoDone = !!(form.name.trim() && form.email.trim() && form.eventDate);
  const detailsDone = !!(form.inflatable.trim() && form.howHeard.trim());
  const ratingsDone = !!(
    form.ratingOverall > 0 && form.ratingComm > 0 && form.ratingSetup > 0 && form.ratingClean > 0 && form.ratingBooking > 0
  );
  const feedbackDone = !!(form.favorite.trim() && (form.improve.trim() || form.improveSkills.trim()));
  const permissionsDone = !!permissionTouched;

  const completed = [infoDone, detailsDone, ratingsDone, feedbackDone, permissionsDone];

  useEffect(() => {
    // Clear invalid flags for individual fields when they become valid
    setInvalidFields((prev) => {
      const next = { ...prev };
      if (form.name && form.name.trim()) delete next.name;
      if (form.email && form.email.trim()) delete next.email;
      if (form.eventDate) delete next.eventDate;
      if (form.inflatable && form.inflatable.trim()) delete next.inflatable;
      if (form.howHeard && form.howHeard.trim()) delete next.howHeard;
      if (form.ratingOverall > 0) delete next.ratingOverall;
      if (form.ratingComm > 0) delete next.ratingComm;
      if (form.ratingSetup > 0) delete next.ratingSetup;
      if (form.ratingClean > 0) delete next.ratingClean;
      if (form.ratingBooking > 0) delete next.ratingBooking;
      if (form.favorite && form.favorite.trim()) delete next.favorite;
      if (form.improve && form.improve.trim()) delete next.improve;
      if (form.improveSkills && form.improveSkills.trim()) delete next.improveSkills;
      if (permissionTouched) {
        delete next.publishReview;
        delete next.useName;
      }
      return next;
    });
  }, [form, permissionTouched]);

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <FontStyle />
        <div className="success-screen">
          <img src="/logo.png" alt="Inflate Twenty-Eight" className="success-logo-img" />
          <div className="success-ring">
            <div className="success-ring-outer" />
            <div className="success-ring-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <h1 className="success-title">Thank you for<br />your feedback.</h1>
          <p className="success-subtitle">We received your response.</p>
          <div className="success-divider" />
          <p className="success-body">
            We appreciate your support and look forward to serving you and your family again.
          </p>
        </div>
      </>
    );
  }

  // ── Survey ──────────────────────────────────────────────────────────────────
  return (
    <>
      <FontStyle />
      <div className="survey-root">

        {/* Header */}
        <header className="survey-header">
          <img src="/logo.png" alt="Inflate Twenty-Eight" className="logo-img" />
          <h1 className="header-title">Customer Feedback Survey</h1>
          <p className="header-subtitle">
            Thank you for choosing Inflate Twenty-Eight. Your feedback helps us improve
            future events, customer service, and rental experiences.
          </p>
        </header>

        {/* Progress */}
        <ProgressBar activeStep={uiActiveStep} completed={completed} onStepClick={goToStep} />

        <form className="survey-body" onSubmit={handleSubmit}>

          {/* ── 01 Customer Information ── */}
          <div className="card" id="step-info">
            <div className="section-num">1</div>
            <h2 className="section-title">Customer Information</h2>
            <div className="field-group">
              <div className={`field ${invalidFields['name'] ? 'invalid' : ''}`}>
                <label className="field-label" htmlFor="name">Customer Name</label>
                <input id="name" type="text" placeholder="Your full name" value={form.name} onChange={set("name")} />
              </div>
                <div className={`field ${invalidFields['email'] ? 'invalid' : ''}`}>
                <label className="field-label" htmlFor="email">Email Address</label>
                <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
              </div>
                <div className={`field ${invalidFields['eventDate'] ? 'invalid' : ''}`}>
                <label className="field-label" htmlFor="eventDate">Event Date</label>
                <input id="eventDate" type="date" value={form.eventDate} onChange={set("eventDate")} />
              </div>
            </div>
          </div>

          {/* ── 02 Event Details ── */}
          <div className="card" id="step-details">
            <div className="section-num">2</div>
            <h2 className="section-title">Event Details</h2>
            <div className="field-group">
              <div className={`field ${invalidFields['inflatable'] ? 'invalid' : ''}`}>
                <label className="field-label" htmlFor="inflatable">Which Inflatable Did You Rent?</label>
                <div className="select-wrapper">
                  <select id="inflatable" value={form.inflatable} onChange={set("inflatable")}> 
                    <option value="" disabled>Select an inflatable…</option>
                    <option value="The White Rock">The White Rock</option>
                    <option value="The Royal Lane">The Royal Lane</option>
                    <option value="The Lovers Lane">The Lovers Lane</option>
                    <option value="The Eastside">The Eastside</option>
                    <option value="The Birdie">The Birdie</option>
                  </select>
                </div>
              </div>
              <div className={`field ${invalidFields['howHeard'] ? 'invalid' : ''}`}>
                <label className="field-label" htmlFor="howHeard">How Did You Hear About Us?</label>
                <div className="select-wrapper">
                  <select id="howHeard" value={form.howHeard} onChange={set("howHeard")}>
                    <option value="" disabled>Select an option…</option>
                    <option>Google Search</option>
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Friend or Family</option>
                    <option>School Event</option>
                    <option>Repeat Customer</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── 03 Experience Ratings ── */}
          <div className="card" id="step-ratings">
            <div className="section-num">3</div>
            <h2 className="section-title">Experience Ratings</h2>
            <div className="ratings-grid">
              <StarRating id="ratingOverall" label="Overall Experience"       value={form.ratingOverall} onChange={setRating("ratingOverall")} invalid={!!invalidFields['ratingOverall']} />
              <StarRating id="ratingComm" label="Communication"            value={form.ratingComm}    onChange={setRating("ratingComm")} invalid={!!invalidFields['ratingComm']} />
              <StarRating id="ratingSetup" label="Setup & Takedown"         value={form.ratingSetup}   onChange={setRating("ratingSetup")} invalid={!!invalidFields['ratingSetup']} />
              <StarRating id="ratingClean" label="Cleanliness of Equipment" value={form.ratingClean}   onChange={setRating("ratingClean")} invalid={!!invalidFields['ratingClean']} />
              <StarRating id="ratingBooking" label="Booking Process"          value={form.ratingBooking} onChange={setRating("ratingBooking")} invalid={!!invalidFields['ratingBooking']} />
            </div>
          </div>

          {/* ── 04 Your Review ── */}
          <div className="card" id="step-feedback">
            <div className="section-num">4</div>
            <h2 className="section-title">Your Review</h2>
            <div className={`field ${invalidFields['favorite'] ? 'invalid' : ''}`}>
              <label className="field-label" htmlFor="favorite">What was your favorite part of working with Inflate Twenty-Eight?</label>
              <textarea id="favorite" placeholder="We'd love to hear what stood out…" value={form.favorite} onChange={set("favorite")} style={{ minHeight: 140 }} />
            </div>
          </div>

          {/* ── 05 Private Feedback ── */}
          <div className="card" id="step-private-feedback">
            <div className="section-num">5</div>
            <h2 className="section-title">Private Feedback</h2>
            <div className="private-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Visible only to our team
            </div>
            <div className={`field ${invalidFields['improve'] ? 'invalid' : ''}`}>
              <label className="field-label" htmlFor="improve">What could we improve?</label>
              <textarea id="improve" placeholder="Your honest feedback helps us grow. This is never published." value={form.improve} onChange={set("improve")} style={{ minHeight: 140 }} />
            </div>
            <div className={`field ${invalidFields['improveSkills'] ? 'invalid' : ''}`}>
              <label className="field-label" htmlFor="improveSkills">Were there any issues, damages, or safety concerns at your event?</label>
              <textarea id="improveSkills" placeholder="Please describe any problems, equipment damage, or safety concerns (this is private)." value={form.improveSkills} onChange={set("improveSkills")} style={{ minHeight: 120 }} />
            </div>
          </div>

          {/* ── 06 Review Permissions ── */}
          <div className="card" id="step-permissions">
            <div className="section-num">6</div>
            <h2 className="section-title">Review Permissions</h2>
            <div className="toggle-group">
              <Toggle id="publishReview" label="May we publish your review on our website?"    checked={form.publishReview} onChange={setToggle("publishReview")} invalid={!!invalidFields['publishReview']} />
              <Toggle id="useName"       label="May we use your first name with your review?"  checked={form.useName}      onChange={setToggle("useName")} invalid={!!invalidFields['useName']} />
            </div>
          </div>

          {/* ── 07 Photo Program ── */}
          <div className="photo-card">
            <p className="photo-eyebrow">Exclusive Offer</p>
            <h2 className="photo-title">Photo Submission Program</h2>
            <p className="photo-body">
              Submit 5–10 high-quality photos from your event and receive a discount code for your next rental. We love showcasing real customer events on our social media and website.
            </p>
            <div className="photo-discount">
              <span className="photo-discount-badge">15% OFF</span>
              <div className="photo-discount-divider" />
              <span className="photo-discount-text">your next rental<br />applied at checkout</span>
            </div>
            <p className="photo-email">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
              Send photos to&nbsp;<a href="mailto:party@inflatetwentyeight.com">party@inflatetwentyeight.com</a>
            </p>
            <p className="photo-social">We love showcasing real customer events on our social media and website.</p>
          </div>

          {/* ── Submit ── */}
          <div className="submit-section">
            <button type="submit" className="submit-btn" disabled={submitting} aria-busy={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <p className="submit-note">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Your responses are securely recorded.
            </p>
          </div>

        </form>
      </div>
    </>
  );
}