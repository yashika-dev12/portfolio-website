import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const T = {
  bg:        "#000000",   // Pure Black
  bgAlt:     "#0A0A0A",   // Almost black
  bgCard:    "#1A1A1A",   // Dark gray
  ink:       "#FFFFFF",   // Pure White
  inkMid:    "#B0B0B0",   // Light gray
  inkFaint:  "#666666",   // Medium gray
  sage:      "#00FF9F",   // Neon Green (Primary)
  steel:     "#c8bbc8",   // Hot Magenta (Secondary)
  orange:    "#00FFFF",   // Neon Cyan (Accent)
  border:    "#333333",   // Dark border
  borderMid: "#555555",   // Strong border
  shadow:    "rgba(0,255,159,0.1)",  // Green glow
  shadowMd:  "rgba(0,255,159,0.15)",
  shadowLg:  "rgba(0,255,159,0.2)",
};
/* ============================================================
   DATA
   ============================================================ */
const DATA = {
  name: "Yashika",
  // nameShort: "YS",

  bio: "Aspiring Full Stack Developer and CSE student exploring AI, emerging technologies, and impactful digital solutions.",
  email: "your-email@example.com",
  location: "Chandigarh, India",
  university: "Chitkara University",

  cgpa: "8.9",
  projectsCount: 3,
  techCount: 10,

  resumeUrl: "YOUR_RESUME_LINK",

roles: [
  "Aspiring Full Stack Developer",
  "CSE Student",
  "Hackathon Participant",
  "Web Developer",
  "AI & Future Tech Enthusiast"
],
  education: [
    {
      year: "2025–2029",
      degree: "B.E. Computer Science Engineering (AI & Future Technologies)",
      institution: "Chitkara University",
      grade: "Currently Pursuing",
      current: true
    }
  ],

 skills: [
  // Frontend
  { name: "HTML", category: "Frontend", level: 85 },
  { name: "CSS", category: "Frontend", level: 80 },
  { name: "React.js", category: "Frontend", level: 60 },

  // Languages
  { name: "JavaScript", category: "Language", level: 75 },
  { name: "C", category: "Language", level: 80 },
  { name: "Python", category: "Language", level: 70 },

  // Backend
  { name: "Node.js", category: "Backend", level: 50 },

  // Database
  { name: "MongoDB", category: "Database", level: 45 },

  // Tools
  { name: "Git", category: "Tools", level: 75 },
  { name: "GitHub", category: "Tools", level: 80 },
  { name: "VS Code", category: "Tools", level: 90 },
  { name: "Vercel", category: "Tools", level: 75 }
],

projects: [
  {
    index: "01",
    title: "Finance Tracker",
    type: "Full Stack Web Application",
    year: "2026",
    summary:
      "A personal finance tracking application that helps users manage income, expenses, and budgeting through an intuitive dashboard.",
    impact:
      "Built to simplify financial management and provide clear insights into spending habits.",
    tech: ["React", "JavaScript", "Node.js", "MongoDB"],
    stars: 0,
    accent: T.sage,
    demo: "#",
    github: "#"
  },

  {
    index: "02",
    title: "NGO Website",
    type: "Responsive Web Platform",
    year: "2026",
    summary:
      "A responsive website developed for an NGO to showcase its mission, initiatives, events, and community impact.",
    impact:
      "Improved the organization's online presence and made information more accessible to visitors and donors.",
    tech: ["HTML", "CSS", "JavaScript"],
    stars: 0,
    accent: T.steel,
    demo: "#",
    github: "#"
  },

  {
    index: "03",
    title: "Portfolio Website",
    type: "Personal Branding Website",
    year: "2026",
    summary:
      "A modern portfolio website designed to showcase my skills, projects, achievements, and journey as a Computer Science Engineering student.",
    impact:
      "Created a professional online presence for internships, hackathons, and networking opportunities.",
    tech: ["React", "JavaScript", "CSS"],
    stars: 0,
    accent: T.orange,
    demo: "#",
    github: "#"
  }
],

  achievements: [
  {
    date: "2025",
    title: "Started B.E. CSE (AI & Future Technologies)",
    context: "Chitkara University"
  },

  {
    date: "2025",
    title: "Microsoft Azure AI Fundamentals",
    context: "Earned Microsoft Azure AI certification"
  },

  {
    date: "2026",
    title: "Participated in 2 Hackathons",
    context: "Worked in teams to design and build solutions under time constraints"
  },

  {
    date: "2026",
    title: "Model United Nations Delegate",
    context: "Represented a country and participated in policy discussions and debates"
  },

  {
    date: "2026",
    title: "Built 3 Web Development Projects",
    context: "Finance Tracker, NGO Website, and Personal Portfolio Website"
  }
],

  socials: [
    {
      name: "GitHub",
      href: "YOUR_GITHUB_LINK",
      short: "GH"
    },
    {
      name: "LinkedIn",
      href: "YOUR_LINKEDIN_LINK",
      short: "LI"
    },
    {
      name: "LeetCode",
      href: "YOUR_LEETCODE_LINK",
      short: "LC"
    },
    {
      name: "Email",
      href: "mailto:your-email@example.com",
      short: "@"
    }
  ]
};

/* ============================================================
   GLOBAL MOUSE STATE — single RAF loop, zero jank
   ============================================================ */
const G = { mx: 0, my: 0, subscribers: new Set() };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", e => { G.mx = e.clientX; G.my = e.clientY; }, { passive: true });
  const loop = () => { G.subscribers.forEach(fn => fn(G.mx, G.my)); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}

function useMouse(lag = 1) {
  const pos = useRef({ x: 0, y: 0 });
  const [out, setOut] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (mx, my) => {
      if (lag === 1) { setOut({ x: mx, y: my }); return; }
      pos.current.x += (mx - pos.current.x) * lag;
      pos.current.y += (my - pos.current.y) * lag;
      setOut({ ...pos.current });
    };
    G.subscribers.add(fn);
    return () => G.subscribers.delete(fn);
  }, [lag]);
  return out;
}

/* ============================================================
   INTERSECTION HOOK
   ============================================================ */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ============================================================
   COUNTER
   ============================================================ */
function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const num = parseFloat(target);
    if (isNaN(num)) return;
    let t0 = null;
    const ease = t => 1 - Math.pow(1 - t, 4);
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(+(num * ease(p)).toFixed(1));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(num);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

/* ============================================================
   SCROLL PROGRESS
   ============================================================ */
function ScrollProgress() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      setProg((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return <div style={{ position: "fixed", top: 0, left: 0, height: 2, width: `${prog}%`, background: T.sage, zIndex: 300, transformOrigin: "left" }} />;
}

/* ============================================================
   BUTTERFLY CURSOR - FIXED & ENHANCED
   ============================================================ */
function Butterfly() {
  const [butterflies, setButterflies] = useState([]);
  const mousePos = useMouse(0.12);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (Math.abs(mousePos.x - lastPosRef.current.x) > 40 || 
        Math.abs(mousePos.y - lastPosRef.current.y) > 40) {
      lastPosRef.current = mousePos;
      
      const id = Date.now() + Math.random();
      const newButterfly = {
        id,
        x: mousePos.x - 12,
        y: mousePos.y - 12,
        duration: 1.2 + Math.random() * 0.6,
      };
      
      setButterflies(prev => [...prev.slice(-1), newButterfly]);
      
      const timer = setTimeout(() => {
        setButterflies(prev => prev.filter(b => b.id !== id));
      }, (2.4 + Math.random() * 0.8) * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [mousePos]);

  return (
    <>
      {butterflies.map(butterfly => (
        <div
          key={butterfly.id}
          style={{
            position: 'fixed',
            left: butterfly.x,
            top: butterfly.y,
            pointerEvents: 'none',
            zIndex: 9998,
            animation: `butterflyFlutter ${butterfly.duration}s ease-out forwards`,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: `drop-shadow(0 2px 6px ${T.shadow})`,
            }}
          >
            {/* Left wing outer */}
            <path
              d="M14 8 Q11 5 8 6 Q5 7 6 10 Q7 13 14 13 Z"
              fill={T.sage}
              opacity="0.3"
            />
            {/* Left wing inner accent */}
            <circle cx="10" cy="9" r="1.5" fill={T.ink} opacity="0.4" />
            
            {/* Right wing outer */}
            <path
              d="M14 8 Q17 5 20 6 Q23 7 22 10 Q21 13 14 13 Z"
              fill={T.sage}
              opacity="0.95"
            />
            {/* Right wing inner accent */}
            <circle cx="18" cy="9" r="1.5" fill={T.ink} opacity="0.4" />
            
            {/* Body */}
            <ellipse cx="14" cy="13" rx="2" ry="3" fill={T.ink} opacity="0.8" />
            
            {/* Head */}
            <circle cx="14" cy="10" r="1.2" fill={T.ink} />
            
            {/* Antennae */}
            <line x1="14" y1="8.8" x2="12" y2="5.5" stroke={T.sage} strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
            <line x1="14" y1="8.8" x2="16" y2="5.5" stroke={T.sage} strokeWidth="1.2" opacity="0.8" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes butterflyFlutter {
          0% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
            opacity: 1; 
          }
          15% { 
            transform: translateY(-12px) translateX(4px) rotate(15deg) scale(0.95); 
          }
          30% { 
            transform: translateY(-6px) translateX(-4px) rotate(-10deg) scale(0.98); 
          }
          50% { 
            transform: translateY(-18px) translateX(6px) rotate(8deg) scale(1); 
            opacity: 1;
          }
          70% { 
            transform: translateY(-32px) translateX(-8px) rotate(-5deg) scale(0.95); 
            opacity: 0.8;
          }
          100% { 
            transform: translateY(-48px) translateX(0px) rotate(0deg) scale(0.7); 
            opacity: 0; 
          }
        }
      `}</style>
    </>
  );
}

function Cursor() {
  const ring  = useMouse(0.1);
  const dot   = useMouse(0.85);
  const [big, setBig] = useState(false);
  useEffect(() => {
    const over = e => { if (e.target.closest("a,button,[data-mag]")) setBig(true); };
    const out  = e => { if (e.target.closest("a,button,[data-mag]")) setBig(false); };
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  const s = big ? 40 : 18;
  return (
    <>
      <div style={{ position:"fixed", pointerEvents:"none", zIndex:9999, left:ring.x-s/2, top:ring.y-s/2, width:s, height:s, borderRadius:"50%", border:`1.5px solid ${big ? T.sage : T.borderMid}`, transition:"width 0.25s ease,height 0.25s ease,border-color 0.25s ease", }} />
      <div style={{ position:"fixed", pointerEvents:"none", zIndex:9999, left:dot.x-3, top:dot.y-3, width:6, height:6, borderRadius:"50%", background:big?T.sage:T.inkMid, transition:"background 0.2s ease" }} />
    </>
  );
}

/* ============================================================
   MAGNETIC BUTTON
   ============================================================ */
function MagBtn({ children, onClick, href, download, sx, primary, accent }) {
  const ref = useRef(null);
  const [d, setD]   = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  const bg = accent || (primary ? T.sage : "transparent");
  const move = e => {
    const r = ref.current.getBoundingClientRect();
    setD({ x: (e.clientX - r.left - r.width/2) * 0.35, y: (e.clientY - r.top - r.height/2) * 0.35 });
  };
  const leave = () => { setD({ x:0,y:0 }); setHov(false); };
  const style = {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:600,
    cursor:"pointer", textDecoration:"none", border:"none", letterSpacing:"-0.01em",
    background: (primary||accent) ? bg : (hov ? T.bgCard : "transparent"),
    color: primary||accent ? "#0B1020" : hov ? T.ink : T.inkMid,
    border: primary||accent ? "none" : `1px solid ${hov ? T.borderMid : T.border}`,
    transform: `translate(${d.x}px,${d.y}px) scale(${hov?1.04:1})`,
    transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, color 0.2s, border-color 0.2s",
    boxShadow: hov
      ? (primary||accent ? `0 16px 40px ${T.shadowMd}, 0 4px 12px ${T.shadow}` : `0 6px 20px ${T.shadow}`)
      : (primary||accent ? `0 4px 12px ${T.shadow}` : "none"),
    willChange:"transform",
    ...sx,
  };
  const p = { ref, "data-mag":"", style, onMouseMove:move, onMouseEnter:()=>setHov(true), onMouseLeave:leave };
  return href ? <a href={href} download={download} {...p}>{children}</a> : <button onClick={onClick} {...p}>{children}</button>;
}


/* ============================================================
   REVEAL — scroll-triggered entrance
   ============================================================ */
function Reveal({ children, delay=0, y=32, x=0 }) {
  const [ref, inView] = useInView(0.07);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : `translate(${x}px,${y}px)`,
      transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* ============================================================
   NAV — left sidebar
   ============================================================ */
const NAV_ITEMS = [
  { id:"home",         label:"Home",         num:"—"  },
  { id:"about",        label:"About",        num:"01" },
  { id:"skills",       label:"Skills",       num:"02" },
  { id:"projects",     label:"Projects",     num:"03" },
  { id:"achievements", label:"Achievements", num:"04" },
  { id:"contact",      label:"Contact",      num:"05" },
];

function Nav({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive:true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); };

  return (
    <>
      {/* Top navigation bar — desktop + mobile */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding: scrolled ? "12px 32px" : "20px 32px",
        background: scrolled ? `${T.bg}B3` : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        boxShadow: scrolled ? `0 1px 0 ${T.border}, 0 8px 24px ${T.shadow}` : "none",
        transition:"padding 0.35s cubic-bezier(0.22,1,0.36,1), background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
        opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(-12px)",
      }}>
        {/* Logo */}
        <button onClick={() => go("home")} style={{
          background:"none", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", gap:8, padding:0,
        }}>
          <span style={{
            width:28, height:28, borderRadius:8, background:T.sage,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:12, fontWeight:800, color:"#0B1020", letterSpacing:"-0.02em",
          }}>{DATA.nameShort}</span>
          <span style={{ fontWeight:700, fontSize:14, color:T.ink, letterSpacing:"-0.02em" }} className="nav-wordmark">{DATA.name}</span>
        </button>

        {/* Center nav pill — desktop only */}
        <div className="nav-pill" style={{
          display:"flex", alignItems:"center", gap:2,
          background: scrolled ? T.bgCard : `${T.bgCard}90`,
          border:`1px solid ${T.border}`,
          borderRadius:100, padding:4,
          position:"absolute", left:"50%", transform:"translateX(-50%)",
          backdropFilter:"blur(12px)",
          transition:"background 0.35s ease",
        }}>
          {NAV_ITEMS.filter(n => n.id !== "home").map(n => {
            const isActive = active === n.id;
            return (
              <button key={n.id} onClick={() => go(n.id)} style={{
                position:"relative", border:"none", cursor:"pointer",
                padding:"7px 16px", borderRadius:100, fontSize:13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#0B1020" : T.inkMid,
                background: isActive ? T.sage : "transparent",
                transition:"color 0.25s ease, background 0.3s cubic-bezier(0.22,1,0.36,1)",
                whiteSpace:"nowrap",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = T.ink; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = T.inkMid; }}
              >{n.label}</button>
            );
          })}
        </div>

        {/* Right: resume CTA (desktop) + hamburger (mobile) */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div className="nav-cta">
            <MagBtn href={DATA.resumeUrl} download primary sx={{ padding:"8px 18px", borderRadius:8, fontSize:13 }}>Resume</MagBtn>
          </div>
          <button onClick={() => setOpen(true)} className="nav-hamburger" style={{
            display:"none", background:"none", border:`1px solid ${T.border}`,
            borderRadius:8, padding:"7px 10px", cursor:"pointer",
            color:T.ink, fontSize:14, lineHeight:1,
          }}>
            <span style={{ display:"block", width:16, height:1.5, background:T.ink, marginBottom:4, borderRadius:1 }} />
            <span style={{ display:"block", width:16, height:1.5, background:T.ink, borderRadius:1 }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {open && (
        <div style={{ position:"fixed", inset:0, background:T.bg, zIndex:300, display:"flex", flexDirection:"column", padding:"24px 28px", animation:"fadeIn 0.2s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:52 }}>
            <span style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:28, height:28, borderRadius:8, background:T.sage, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:"#0B1020" }}>{DATA.nameShort}</span>
              <span style={{ fontWeight:700, fontSize:15, color:T.ink }}>{DATA.name}</span>
            </span>
            <button onClick={() => setOpen(false)} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:8, width:36, height:36, fontSize:18, cursor:"pointer", color:T.ink }}>✕</button>
          </div>
          {NAV_ITEMS.map((n, i) => (
            <button key={n.id} onClick={() => go(n.id)} style={{
              background:"none", border:"none", textAlign:"left",
              fontSize:30, fontWeight:700, color: active === n.id ? T.sage : T.ink,
              letterSpacing:"-0.03em", padding:"14px 0", cursor:"pointer",
              borderBottom:`1px solid ${T.border}`,
              display:"flex", alignItems:"baseline", gap:14,
            }}>
              <span style={{ fontSize:12, fontWeight:600, color:T.inkFaint, fontVariantNumeric:"tabular-nums" }}>{n.num}</span>
              {n.label}
            </button>
          ))}
          <div style={{ marginTop:32 }}><MagBtn primary href={DATA.resumeUrl} download sx={{ width:"100%",padding:"14px 0" }}>Download Resume</MagBtn></div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @media(max-width:900px){
          .nav-pill{display:none!important}
        }
        @media(max-width:680px){
          .nav-wordmark{display:none!important}
          .nav-cta{display:none!important}
          .nav-hamburger{display:block!important}
        }
      `}</style>
    </>
  );
}

/* ============================================================
   HERO — deep parallax, ambient drift, paper texture
   ============================================================ */
function Hero() {
  const mouse  = useMouse(0.05); // very lagged for slow parallax
  const [mounted, setMounted] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVis, setRoleVis] = useState(true);
  const t = useRef(0);
  const orbsRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  // Role cycling
  useEffect(() => {
    const iv = setInterval(() => {
      setRoleVis(false);
      setTimeout(() => { setRoleIdx(i => (i+1) % DATA.roles.length); setRoleVis(true); }, 380);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  // Ambient drift — independent of mouse, always moving
  useEffect(() => {
    const tick = (ts) => {
      t.current = ts * 0.0003;
      if (orbsRef.current) {
        const orbs = orbsRef.current.querySelectorAll("[data-orb]");
        orbs.forEach((orb, i) => {
          const speed = 0.18 + i * 0.07;
          const phase = i * 1.2;
          const dx = Math.sin(t.current * speed + phase) * 22;
          const dy = Math.cos(t.current * speed * 0.7 + phase) * 18;
          orb.style.transform = `translate(${dx}px,${dy}px)`;
        });
        // Geometric shapes
        const shapes = orbsRef.current.querySelectorAll("[data-shape]");
        shapes.forEach((sh, i) => {
          const speed = 0.12 + i * 0.05;
          const phase = i * 2.1;
          const dx = Math.sin(t.current * speed + phase) * 14;
          const dy = Math.cos(t.current * speed * 0.8 + phase) * 10;
          const rot = t.current * (20 + i * 8) % 360;
          sh.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Mouse parallax layers (separate depths)
  const W = typeof window !== "undefined" ? window.innerWidth : 1200;
  const H = typeof window !== "undefined" ? window.innerHeight : 800;
  const nx = (mouse.x / W - 0.5);
  const ny = (mouse.y / H - 0.5);

  return (
    <section id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 64px", position:"relative", overflow:"hidden" }}>

      {/* — Background layer 0: paper grain via SVG filter (minimal for premium look) — */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:0.08 }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* — Background layer 1: subtle grid — */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`linear-gradient(${T.border}70 1px,transparent 1px),linear-gradient(90deg,${T.border}70 1px,transparent 1px)`,
        backgroundSize:"72px 72px",
        opacity:0.7,
        transform:`translate(${nx*8}px,${ny*8}px)`,
        transition:"transform 0.05s linear",
      }} />

      {/* — Background layer 2: orbs + shapes, ambient drift — */}
      <div ref={orbsRef} style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        {/* Deep navy orbs — teal + lavender */}
        {[
          { left:"8%",  top:"18%", size:380, color:`${T.sage}22`,   depth:18 },
          { left:"68%", top:"55%", size:300, color:`${T.steel}14`,  depth:28 },
          { left:"50%", top:"8%",  size:200, color:`${T.orange}18`, depth:22 },
          { left:"80%", top:"25%", size:160, color:`${T.sage}12`,   depth:35 },
        ].map((o, i) => (
          <div key={i} data-orb=""
            style={{
              position:"absolute", left:o.left, top:o.top,
              width:o.size, height:o.size, borderRadius:"50%",
              background:`radial-gradient(circle, ${o.color} 0%, transparent 68%)`,
              willChange:"transform",
            }}
          />
        ))}

        {/* Floating geometric shapes */}
        {[
          { left:"78%", top:"72%", size:44,  shape:"circle",  color:`${T.sage}35` },
          { left:"62%", top:"18%", size:28,  shape:"square",  color:`${T.sage}40` },
          { left:"22%", top:"82%", size:36,  shape:"ring",    color:`${T.steel}50` },
          { left:"88%", top:"48%", size:20,  shape:"square",  color:`${T.orange}45` },
          { left:"40%", top:"90%", size:14,  shape:"circle",  color:`${T.sage}30` },
        ].map((s, i) => (
          <div key={i} data-shape=""
            style={{
              position:"absolute", left:s.left, top:s.top,
              width:s.size, height:s.size,
              borderRadius: s.shape === "circle" ? "50%" : s.shape === "ring" ? "50%" : 4,
              background: s.shape === "ring" ? "transparent" : s.color,
              border: s.shape === "ring" ? `2px solid ${s.color}` : "none",
              willChange:"transform",
            }}
          />
        ))}
      </div>

      {/* — Background layer 3: large ghost index number — mouse parallax depth 3 — */}
      <div style={{
        position:"absolute", right:-24, top:"50%",
        fontSize:"clamp(200px,32vw,380px)", fontWeight:900, lineHeight:1,
        color:`${T.borderMid}55`, letterSpacing:"-0.06em", userSelect:"none", pointerEvents:"none",
        transform:`translateY(-50%) translate(${nx * -22}px, ${ny * -12}px)`,
        transition:"transform 0.06s linear",
      }}>01</div>

      {/* — Content — */}
      <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:80, justifyContent:"space-between" }}>

        {/* Left side: Text content */}
        <div style={{ flex:1, minWidth:0 }}>

        {/* Status badge */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:`${T.sage}12`, border:`1px solid ${T.sage}38`, borderRadius:100,
          padding:"5px 14px", marginBottom:52, width:"fit-content",
          opacity:mounted?1:0, transform:mounted?"none":"translateY(10px)",
          transition:"opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s",
          boxShadow:`0 2px 12px ${T.sage}18`,
        }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:T.sage,display:"block",animation:"pulse 2.4s ease-in-out infinite" }} />
          <span style={{ fontSize:12,fontWeight:600,color:T.sage,letterSpacing:"0.02em" }}>Open to opportunities · {DATA.location}</span>
        </div>

        {/* Eyebrow */}
        <div style={{
          fontSize:11, fontWeight:700, color:T.inkFaint, letterSpacing:"0.15em",
          textTransform:"uppercase", marginBottom:18,
          opacity:mounted?1:0, transition:"opacity 0.7s ease 0.22s",
        }}>Computer Science Engineering Student · AI & Future Technologies</div>

        {/* Name */}
        <h1 style={{ margin:0, marginBottom:28 }}>
          {DATA.name.split(" ").map((word, i) => (
            <span key={i} style={{ display:"block", overflow:"hidden", lineHeight:1.02 }}>
              <span style={{
                display:"block",
                fontSize:"clamp(56px,9vw,112px)", fontWeight:800, letterSpacing:"-0.04em",
                color: i===1 ? T.sage : T.ink,
                fontStyle: i===1 ? "italic" : "normal",
                opacity:mounted?1:0,
                transform:mounted?"none":"translateY(100%)",
                transition:`opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${0.3+i*0.1}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${0.3+i*0.1}s`,
              }}>{word}</span>
            </span>
          ))}
        </h1>

        {/* Role ticker */}
        <div style={{ height:28, overflow:"hidden", marginBottom:36 }}>
          <span style={{
            display:"block", fontSize:18, color:T.inkMid, fontWeight:500, letterSpacing:"-0.02em",
            opacity:roleVis?1:0, transform:roleVis?"none":"translateY(10px)",
            transition:"opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          }}>{DATA.roles[roleIdx]}</span>
        </div>

        <p style={{
          fontSize:16, color:T.inkMid, maxWidth:440, lineHeight:1.78, marginBottom:48,
          opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)",
          transition:"opacity 0.7s ease 0.52s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.52s",
        }}>{DATA.bio}</p>

        {/* CTAs */}
        <div style={{
          display:"flex", gap:12, flexWrap:"wrap", alignItems:"center",
          opacity:mounted?1:0, transform:mounted?"none":"translateY(14px)",
          transition:"opacity 0.7s ease 0.62s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.62s",
        }}>
          <MagBtn primary onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior:"smooth" })}>View Projects →</MagBtn>
          <MagBtn href={DATA.resumeUrl} download>Download Resume</MagBtn>
        </div>
        </div>

        {/* Right side: Circular Portrait with floating stat cards */}
        <div style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative",
          opacity:mounted?1:0, transform:mounted?"none":"translateY(20px)",
          transition:"opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s",
        }}>
          {/* Main circular portrait container */}
          <div style={{
            position:"relative",
            width:340, height:340,
            borderRadius:"50%",
            overflow:"hidden",
            background:`linear-gradient(135deg, ${T.sage}30, ${T.steel}20)`,
            boxShadow:`0 20px 60px ${T.shadow}, inset 0 1px 0 ${T.sage}40`,
            border:`1px solid ${T.sage}50`,
          }}>
            {/* Portrait placeholder - replace with your image */}
            <div style={{
              width:"100%", height:"100%",
              background:`linear-gradient(135deg, ${T.sage}40 0%, ${T.bgCard}60% 50%, ${T.steel}30%)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:T.inkMid, fontSize:14, textAlign:"center",
              padding:20,
            }}>
              <div>
                {/* When you add your image, replace this div with: */}
                {/* <img src="YOUR_IMAGE_URL" style={{width:"100%", height:"100%", objectFit:"cover"}} /> */}
                Add your<br/>portrait photo<br/>here 📸
              </div>
            </div>
          </div>

          {/* Floating stat cards */}
          <div style={{
            position:"absolute", top:"20px", right:"0px",
            background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"12px 16px", minWidth:140,
            boxShadow:`0 8px 24px ${T.shadow}`,
            animation:"floatCard 6s ease-in-out infinite",
          }}>
            <div style={{ fontSize:24, fontWeight:800, color:T.sage }}>2+</div>
            <div style={{ fontSize:11, color:T.inkMid, marginTop:4 }}>Hackathons</div>
            <div style={{ fontSize:10, color:T.inkFaint }}>Participated</div>
          </div>

          <div style={{
            position:"absolute", bottom:"30px", left:"-20px",
            background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"12px 16px", minWidth:130,
            boxShadow:`0 8px 24px ${T.shadow}`,
            animation:"floatCard 8s ease-in-out infinite 0.5s",
          }}>
            <div style={{ fontSize:24, fontWeight:800, color:T.steel }}>3+</div>
            <div style={{ fontSize:11, color:T.inkMid, marginTop:4 }}>Projects</div>
            <div style={{ fontSize:10, color:T.inkFaint }}>Completed</div>
          </div>

          <div style={{
            position:"absolute", bottom:"60px", right:"-30px",
            background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:12,
            padding:"12px 16px", minWidth:140,
            boxShadow:`0 8px 24px ${T.shadow}`,
            animation:"floatCard 7s ease-in-out infinite 1s",
          }}>
            <div style={{ fontSize:20, fontWeight:700, color:T.orange }}>Always</div>
            <div style={{ fontSize:11, color:T.inkMid, marginTop:4 }}>Learning</div>
            <div style={{ fontSize:10, color:T.inkFaint }}>Something New</div>
          </div>

          {/* Glowing orbs */}
          <div style={{
            position:"absolute", top:"-40px", right:"-40px",
            width:120, height:120,
            borderRadius:"50%", background:`${T.sage}15`,
            filter:`blur(30px)`, pointerEvents:"none",
          }} />
          <div style={{
            position:"absolute", bottom:"-60px", left:"-60px",
            width:140, height:140,
            borderRadius:"50%", background:`${T.steel}12`,
            filter:`blur(40px)`, pointerEvents:"none",
          }} />
        </div>
      </div>




      {/* Scroll indicator */}
      <div style={{
        position:"absolute", bottom:40, left:64,
        display:"flex", alignItems:"center", gap:12, color:T.inkFaint, fontSize:11,
        opacity:mounted?1:0, transition:"opacity 0.8s ease 1.1s",
        letterSpacing:"0.08em", textTransform:"uppercase",
      }}>
        <div style={{ width:1, height:40, background:T.borderMid, animation:"lineBreath 2.2s ease-in-out infinite alternate" }} />
        Scroll
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
        @keyframes lineBreath { from{height:28px;opacity:0.4} to{height:52px;opacity:1} }
        @keyframes float { 0%, 100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes floatCard { 0%, 100%{transform:translateY(0px)} 50%{transform:translateY(-16px)} }
        @media(max-width:768px){
          #home{padding:48px 24px 80px!important;}
          #home > div:first-of-type > div:last-child{flex:0 0 100%; margin-top:60px;}
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function About() {
  const [ref, inView] = useInView(0.08);
  const cgpa     = useCounter(parseFloat(DATA.cgpa), inView, 1800);
  const projects = useCounter(DATA.projectsCount, inView, 1600);
  const tech     = useCounter(DATA.techCount, inView, 2000);

  return (
    <section id="about" ref={ref} style={{ padding:"100px 64px", borderTop:`1px solid ${T.border}`, position:"relative" }}>
      <Reveal><SectionEyebrow num="01">About</SectionEyebrow></Reveal>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start", marginTop:48 }}>
        <div>
          <Reveal delay={60}>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.03em", color:T.ink, lineHeight:1.1, marginBottom:32 }}>
              Building my future in
                software development
              and <em>AI.</em>
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p style={{ color:T.inkMid, lineHeight:1.82, fontSize:15, marginBottom:20 }}>
             
              I'm a first-year Computer Science Engineering student specializing in AI and Future Technologies at Chitkara University. I enjoy building websites, learning new technologies, and turning ideas into practical software projects.

            </p>
          </Reveal>
          <Reveal delay={190}>
            <p style={{ color:T.inkMid, lineHeight:1.82, fontSize:15 }}>
              Currently, I'm focused on mastering full-stack development with React, Node.js, Express, and databases while preparing for hackathons, internships, and competitive programming opportunities.
            </p>
          </Reveal>
        </div>

        <div>
          <Reveal delay={80} x={20}>
            {/* Stats with 3D card tilt */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, marginBottom:40, background:T.border, borderRadius:14, overflow:"hidden", boxShadow:`0 4px 24px ${T.shadow}` }}>
              {[
                { val:cgpa.toFixed(1), label:"CGPA",    suffix:"" },
                { val:Math.round(projects), label:"Projects", suffix:"+" },
                { val:Math.round(tech),     label:"Tech",     suffix:"+" },
              ].map((s, i) => <StatCard key={s.label} {...s} />)}
            </div>
          </Reveal>

          <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:T.inkFaint, marginBottom:20 }}>Education</div>
          {DATA.education.map((ed, i) => (
            <Reveal key={i} delay={100 + i * 100} x={20}><EduEntry ed={ed} /></Reveal>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){#about>div:last-child{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </section>
  );
}

function StatCard({ val, suffix, label }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const [hov, setHov] = useState(false);
  const move = e => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-r.top)/r.height-0.5)*-12, y:((e.clientX-r.left)/r.width-0.5)*12 });
  };
  return (
    <div ref={ref} onMouseMove={move} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setTilt({x:0,y:0});setHov(false);}}
      style={{
        background:T.bgCard, padding:"26px 20px", textAlign:"center", cursor:"default",
        transform:`perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov?1.02:1})`,
        transition:"transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        boxShadow:hov?`0 16px 40px ${T.shadowMd},0 4px 12px ${T.shadow}`:`0 2px 8px ${T.shadow}`,
        willChange:"transform",
      }}>
      <div style={{ fontSize:34, fontWeight:800, color:T.ink, letterSpacing:"-0.04em", lineHeight:1 }}>{val}{suffix}</div>
      <div style={{ fontSize:11, color:T.inkFaint, marginTop:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</div>
    </div>
  );
}

function EduEntry({ ed }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        borderLeft:`2px solid ${hov||ed.current?T.sage:T.border}`,
        paddingLeft:20, marginBottom:28, paddingBottom:4,
        background:hov?T.bgCard:"transparent",
        borderRadius:hov?"0 10px 10px 0":"0 0 0 0",
        padding:hov?"12px 16px 12px 20px":"0 0 0 20px",
        transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)",
        boxShadow:hov?`0 4px 16px ${T.shadow}`:"none",
      }}>
      <div style={{ fontSize:11, color:T.sage, fontWeight:600, marginBottom:4 }}>{ed.year}</div>
      <div style={{ fontWeight:700, color:T.ink, fontSize:14, marginBottom:2 }}>{ed.degree}</div>
      <div style={{ color:T.inkMid, fontSize:13, marginBottom:2 }}>{ed.institution}</div>
      <div style={{ color:T.steel, fontSize:13, fontWeight:600 }}>{ed.grade}</div>
    </div>
  );
}

/* ============================================================
   SKILLS — workspace panel with animated indicator
   ============================================================ */
function Skills() {
  const cats = ["All", ...new Set(DATA.skills.map(s => s.category))]
  const [active, setActive] = useState("All");
  const [prevActive, setPrev] = useState("All");
  const [transitioning, setTransitioning] = useState(false);
  const [panelRef, panelInView] = useInView(0.05);
  const levelLabel = l => l>=90?"Expert":l>=80?"Advanced":l>=70?"Proficient":"Familiar";
  const filtered = active === "All" ? DATA.skills : DATA.skills.filter(s => s.category === active);

  const switchCat = c => {
    if (c === active) return;
    setTransitioning(true);
    setTimeout(() => { setActive(c); setPrev(c); setTransitioning(false); }, 200);
  };

  return (
    <section id="skills" style={{ borderTop:`1px solid ${T.border}` }}>
      <div style={{ padding:"100px 64px 0" }}>
        <Reveal><SectionEyebrow num="02">Skills</SectionEyebrow></Reveal>
      </div>
      <div ref={panelRef} style={{ display:"grid", gridTemplateColumns:"200px 1fr", borderTop:`1px solid ${T.border}`, marginTop:32 }}>
        {/* Category sidebar */}
        <div style={{ borderRight:`1px solid ${T.border}`, padding:"32px 0", background:T.bgAlt }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.inkFaint, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0 24px", marginBottom:16 }}>Category</div>
          {cats.map((c, i) => (
            <Reveal key={c} delay={i*35} x={-12}>
              <button onClick={() => switchCat(c)} style={{
                display:"block", width:"100%", textAlign:"left",
                padding:"9px 24px", background:"none", border:"none", cursor:"pointer",
                fontSize:13, fontWeight:active===c?600:400,
                color:active===c?T.ink:T.inkMid,
                borderLeft:`2px solid ${active===c?T.sage:"transparent"}`,
                backgroundColor:active===c?`${T.sage}10`:"transparent",
                transition:"all 0.2s ease",
              }}>{c}</button>
            </Reveal>
          ))}
        </div>

        {/* Skill rows — animate out/in on category change */}
        <div style={{ padding:"32px 48px", display:"flex", flexDirection:"column", gap:2, opacity:transitioning?0:1, transition:"opacity 0.18s ease" }}>
          {filtered.map((sk, i) => <SkillRow key={sk.name} skill={sk} inView={panelInView} delay={i*40} levelLabel={levelLabel} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){#skills>div:last-child{grid-template-columns:1fr!important;}#skills>div:last-child>div:first-child{border-right:none!important;border-bottom:1px solid ${T.border};padding:16px 24px!important;display:flex;gap:8px;flex-wrap:wrap;}}`}</style>
    </section>
  );
}

function SkillRow({ skill, inView, delay, levelLabel }) {
  const [hov, setHov] = useState(false);
  const [barIn, setBarIn] = useState(false);
  useEffect(() => { if (inView) setTimeout(() => setBarIn(true), delay + 200); }, [inView, delay]);
  const accentColor = skill.level >= 85 ? T.sage : skill.level >= 75 ? T.steel : T.inkFaint;

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"grid", gridTemplateColumns:"160px 1fr 56px 90px",
        alignItems:"center", gap:20, padding:"11px 16px", borderRadius:10,
        background:hov?T.bgAlt:"transparent",
        boxShadow:hov?`0 2px 16px ${T.shadow}`:"none",
        transform:hov?"translateX(5px)":"none",
        opacity:inView?1:0,
        transition:`opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.3s cubic-bezier(0.22,1,0.36,1), background 0.2s, box-shadow 0.2s`,
      }}>
      <div style={{ fontWeight:600, fontSize:14, color:T.ink }}>{skill.name}</div>
      <div style={{ height:3, background:T.border, borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:barIn?`${skill.level}%`:"0%", background:accentColor, borderRadius:2, transition:`width 1.1s cubic-bezier(0.22,1,0.36,1) ${delay*0.3}ms` }} />
      </div>
      <div style={{ fontSize:12, color:T.inkFaint, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{skill.level}%</div>
      <div style={{ fontSize:11, fontWeight:600, color:accentColor, textAlign:"right", opacity:hov?1:0, transform:hov?"none":"translateX(8px)", transition:"all 0.22s ease" }}>{levelLabel(skill.level)}</div>
    </div>
  );
}

/* ============================================================
   PROJECTS — rows with true 3D tilt on the whole row
   ============================================================ */
function Projects() {
  const [expanded, setExpanded] = useState(null);
  return (
    <section id="projects" style={{ borderTop:`1px solid ${T.border}` }}>
      <div style={{ padding:"100px 64px 0" }}>
        <Reveal><SectionEyebrow num="03">Projects</SectionEyebrow></Reveal>
        <Reveal delay={60}>
          <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.03em", color:T.ink, lineHeight:1.1, margin:"24px 0 48px" }}>Selected work</h2>
        </Reveal>
      </div>
      <div style={{ borderTop:`1px solid ${T.border}` }}>
        {DATA.projects.map((p, i) => (
          <ProjectRow key={p.title} project={p} idx={i}
            expanded={expanded === i}
            onToggle={() => setExpanded(expanded===i?null:i)} />
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project, idx, expanded, onToggle }) {
  const [ref, inView] = useInView(0.04);
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const rowRef = useRef(null);

  const move = e => {
    if (!rowRef.current) return;
    const r = rowRef.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-r.top)/r.height-0.5)*-5, y:((e.clientX-r.left)/r.width-0.5)*5 });
  };
  const leave = () => { setTilt({x:0,y:0}); setHov(false); };

  return (
    <div ref={ref} style={{
      borderBottom:`1px solid ${T.border}`,
      opacity:inView?1:0, transform:inView?"none":"translateY(22px)",
      transition:`opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${idx*90}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${idx*90}ms`,
    }}>
      {/* Tilt wrapper */}
      <div ref={rowRef}
        onMouseMove={move} onMouseEnter={()=>setHov(true)} onMouseLeave={leave}
        onClick={onToggle}
        style={{
          display:"grid", gridTemplateColumns:"72px 1fr auto",
          alignItems:"center", gap:24, padding:"28px 64px",
          cursor:"pointer",
          background:hov||expanded?T.bgAlt:"transparent",
          transform:`perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition:"background 0.2s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
          boxShadow:(hov&&!expanded)?`0 4px 24px ${T.shadow},0 1px 4px ${T.shadow}`:"none",
          willChange:"transform",
        }}>
        <span style={{ fontSize:13, fontWeight:700, color:project.accent, letterSpacing:hov?"0.07em":"0em", transition:"letter-spacing 0.35s ease" }}>
          {project.index}
        </span>
        <div>
          <div style={{ display:"flex", alignItems:"baseline", gap:16, flexWrap:"wrap" }}>
            <span style={{ fontSize:"clamp(17px,2.5vw,22px)", fontWeight:700, color:T.ink, letterSpacing:"-0.02em", display:"inline-block", transform:hov?"translateX(5px)":"none", transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1)" }}>{project.title}</span>
            <span style={{ fontSize:12, color:T.inkFaint, fontWeight:500 }}>{project.type}</span>
          </div>
          {!expanded && <div style={{ fontSize:13, color:T.inkMid, marginTop:5, maxWidth:520, lineHeight:1.6 }}>{project.summary}</div>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <span style={{ fontSize:12, color:T.inkFaint }}>{project.year}</span>
          <span style={{ fontSize:20, color:project.accent, transform:expanded?"rotate(45deg)":"none", transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1)", fontWeight:300, lineHeight:1 }}>+</span>
        </div>
      </div>

      {/* Expand panel — height animation */}
      <ExpandPanel project={project} expanded={expanded} />
    </div>
  );
}

function ExpandPanel({ project, expanded }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    setHeight(expanded ? ref.current.scrollHeight : 0);
  }, [expanded]);
  return (
    <div style={{ overflow:"hidden", height, transition:"height 0.45s cubic-bezier(0.22,1,0.36,1)" }}>
      <div ref={ref}>
        <DetailPanel project={project} visible={expanded} />
      </div>
    </div>
  );
}

function DetailPanel({ project, visible }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const move = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientY-r.top)/r.height-0.5)*-7, y:((e.clientX-r.left)/r.width-0.5)*7 });
  };

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={()=>setTilt({x:0,y:0})}
      style={{
        margin:"0 64px 32px", padding:"32px 36px",
        background:T.bgCard, borderRadius:16,
        border:`1px solid ${T.border}`,
        transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition:"transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        boxShadow:(tilt.x!==0||tilt.y!==0)?`0 28px 56px ${T.shadowLg},0 8px 20px ${T.shadowMd}`:`0 4px 20px ${T.shadow}`,
        willChange:"transform",
        opacity:visible?1:0, transitionProperty:"transform,box-shadow,opacity",
      }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:40 }}>
        <div>
          <FieldLabel>What it does</FieldLabel>
          <p style={{ fontSize:14, color:T.inkMid, lineHeight:1.82, marginBottom:24 }}>{project.summary}</p>
          <FieldLabel>Impact</FieldLabel>
          <p style={{ fontSize:14, color:T.inkMid, lineHeight:1.82 }}>{project.impact}</p>
        </div>
        <div>
          <FieldLabel>Stack</FieldLabel>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:32 }}>
            {project.tech.map((t, i) => <TechBadge key={t} label={t} delay={i*40} accent={project.accent} />)}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <MagBtn accent={project.accent} href={project.demo} sx={{ padding:"9px 20px", borderRadius:8, fontSize:13 }}>Live Demo →</MagBtn>
            <MagBtn href={project.github} sx={{ padding:"9px 20px", borderRadius:8, fontSize:13 }}>⭐ {project.stars}</MagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize:11, fontWeight:700, color:T.inkFaint, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>{children}</div>;
}

function TechBadge({ label, delay, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <span onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        fontSize:12, fontWeight:500,
        color:hov?accent:T.inkMid,
        background:hov?`${accent}14`:T.bgAlt,
        border:`1px solid ${hov?`${accent}50`:T.border}`,
        borderRadius:6, padding:"4px 12px",
        transform:hov?"translateY(-2px)":"none",
        boxShadow:hov?`0 4px 12px ${accent}28`:"none",
        transition:"all 0.22s cubic-bezier(0.22,1,0.36,1)",
        cursor:"default",
        animation:`badgeIn 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`,
      }}>{label}</span>
  );
}

/* ============================================================
   ACHIEVEMENTS
   ============================================================ */
function Achievements() {
  const [spineRef, spineInView] = useInView(0.05);
  const [spineH, setSpineH] = useState(0);
  useEffect(() => { if (spineInView) setTimeout(() => setSpineH(100), 120); }, [spineInView]);

  return (
    <section id="achievements" style={{ borderTop:`1px solid ${T.border}`, padding:"100px 64px" }}>
      <Reveal><SectionEyebrow num="04">Achievements</SectionEyebrow></Reveal>
      <Reveal delay={60}>
        <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.03em", color:T.ink, lineHeight:1.1, margin:"24px 0 56px" }}>Milestones</h2>
      </Reveal>

      <div ref={spineRef} style={{ maxWidth:720, position:"relative" }}>
        {/* Growing spine */}
        <div style={{ position:"absolute", left:134, top:8, bottom:0, width:1, background:T.border, overflow:"hidden" }}>
          <div style={{ width:"100%", background:`linear-gradient(to bottom,${T.sage},${T.borderMid})`, height:`${spineH}%`, transition:"height 2s cubic-bezier(0.22,1,0.36,1) 0.15s" }} />
        </div>
        {DATA.achievements.map((a, i) => (
          <Reveal key={i} delay={i * 110}>
            <AchievementEntry item={a} last={i === DATA.achievements.length - 1} entryDelay={i * 110} spineInView={spineInView} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AchievementEntry({ item, last, entryDelay, spineInView }) {
  const [hov, setHov] = useState(false);
  const [dotIn, setDotIn] = useState(false);
  useEffect(() => { if (spineInView) setTimeout(() => setDotIn(true), entryDelay + 300); }, [spineInView, entryDelay]);

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"grid", gridTemplateColumns:"120px 20px 1fr", gap:24, alignItems:"start" }}>
      <div style={{ paddingTop:3, textAlign:"right" }}>
        <span style={{ fontSize:12, fontWeight:600, color:hov?T.sage:T.inkFaint, transition:"color 0.25s ease", letterSpacing:"0.02em" }}>{item.date}</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
        {/* Dot with pop-in */}
        <div style={{
          width:10, height:10, borderRadius:"50%", zIndex:1, marginTop:3, flexShrink:0,
          background:hov?T.sage:T.bgCard,
          border:`2px solid ${hov?T.sage:T.borderMid}`,
          transform:dotIn?(hov?"scale(1.5)":"scale(1)"):"scale(0)",
          boxShadow:hov?`0 0 0 5px ${T.sage}22`:"none",
          transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, border-color 0.25s, box-shadow 0.25s",
        }} />
      </div>
      <div style={{ paddingBottom:36 }}>
        <div style={{ fontWeight:700, color:T.ink, fontSize:15, lineHeight:1.3, marginBottom:4, transform:hov?"translateX(5px)":"none", transition:"transform 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
          {item.title}
        </div>
        <div style={{ fontSize:13, color:T.inkMid, lineHeight:1.6 }}>{item.context}</div>
      </div>
    </div>
  );
}

/ * ============================================================
  //  RESUME SECTION
  //  ============================================================ */
function ResumePreview() {
  return (
    <section id="resume" style={{ padding:"100px 64px", borderTop:`1px solid ${T.border}` }}>
      <h2 style={{ fontSize:44, fontWeight:800, color:T.ink, marginBottom:48 }}>Resume</h2>
      
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
        <div style={{ background:T.bgCard, padding:32, borderRadius:12, border:`1px solid ${T.border}` }}>
          <div style={{ height:250, background:`${T.sage}20`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
            📄 PDF Preview
          </div>
          <h3 style={{ fontSize:20, fontWeight:800, color:T.ink, marginBottom:12 }}>Download Resume</h3>
          <p style={{ color:T.inkMid, marginBottom:24 }}>Get my complete CV and experience.</p>
          <a href={DATA.resumeUrl} download style={{ padding:"12px 24px", background:T.sage, color:T.bg, fontWeight:700, textDecoration:"none", borderRadius:8, display:"inline-block" }}>
            ⬇️ Download PDF
          </a>
        </div>
 
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:24 }}>
          <div>
            <h3 style={{ fontSize:16, fontWeight:800, color:T.sage, marginBottom:12, textTransform:"uppercase" }}>Education</h3>
            <p style={{ fontWeight:700, color:T.ink, margin:0 }}>{DATA.university}</p>
            <p style={{ color:T.inkMid, margin:"4px 0" }}>{DATA.degree}</p>
            <p style={{ color:T.inkFaint, fontSize:13 }}>CGPA: {DATA.cgpa}</p>
          </div>
 
          <div>
            <h3 style={{ fontSize:16, fontWeight:800, color:T.orange, marginBottom:12, textTransform:"uppercase" }}>Quick Stats</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ background:`${T.sage}10`, padding:12, borderRadius:8 }}>
                <p style={{ fontSize:12, color:T.inkFaint, fontWeight:600, margin:0 }}>PROJECTS</p>
                <p style={{ fontSize:20, fontWeight:800, color:T.sage, margin:"4px 0 0 0" }}>15+</p>
              </div>
              <div style={{ background:`${T.orange}10`, padding:12, borderRadius:8 }}>
                <p style={{ fontSize:12, color:T.inkFaint, fontWeight:600, margin:0 }}>EXPERIENCE</p>
                <p style={{ fontSize:20, fontWeight:800, color:T.orange, margin:"4px 0 0 0" }}>2+ Yrs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <style>{`
        @media(max-width:1024px) {
          #resume > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */
function Contact() {
  const [ref, inView] = useInView(0.08);
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);
  const submit = e => { e.preventDefault(); setTimeout(() => setSent(true), 260); };

  return (
    <section id="contact" ref={ref} style={{ borderTop:`1px solid ${T.border}`, padding:"100px 64px" }}>
      <Reveal><SectionEyebrow num="05">Contact</SectionEyebrow></Reveal>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, marginTop:48, alignItems:"start" }}>

        <div style={{ opacity:inView?1:0, transform:inView?"none":"translateY(24px)", transition:"all 0.75s cubic-bezier(0.22,1,0.36,1) 0.08s" }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800, letterSpacing:"-0.03em", color:T.ink, lineHeight:1.1, marginBottom:24 }}>
            Let's build something<br /><em style={{ fontStyle:"italic", color:T.sage }}>worth shipping.</em>
          </h2>
          <p style={{ color:T.inkMid, lineHeight:1.82, fontSize:15, marginBottom:40 }}>
            Whether it's an internship, a collaboration, or a conversation about a problem that needs solving — my inbox is open.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {DATA.socials.map((s, i) => <SocialLink key={s.name} social={s} delay={i*55} inView={inView} />)}
          </div>
        </div>

        <div style={{ opacity:inView?1:0, transform:inView?"none":"translateY(24px)", transition:"all 0.75s cubic-bezier(0.22,1,0.36,1) 0.2s" }}>
          {sent ? (
            <div style={{ padding:"56px 40px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:16, textAlign:"center", boxShadow:`0 8px 32px ${T.shadow}`, animation:"successIn 0.5s cubic-bezier(0.22,1,0.36,1)" }}>
              <div style={{ fontSize:40, marginBottom:16, animation:"successBounce 0.6s cubic-bezier(0.22,1,0.36,1)" }}>✉</div>
              <div style={{ fontWeight:700, color:T.ink, fontSize:18, marginBottom:8 }}>Sent. Talk soon.</div>
              <div style={{ color:T.inkMid, fontSize:14 }}>I reply within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {[
                { key:"name",  label:"Name",  type:"text",  ph:"Jane Smith" },
                { key:"email", label:"Email", type:"email", ph:"jane@company.com" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:12, fontWeight:600, color:focused===f.key?T.sage:T.inkMid, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em", transition:"color 0.2s" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]}
                    onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                    onFocus={()=>setFocused(f.key)} onBlur={()=>setFocused(null)}
                    required style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:10, fontSize:14, background:T.bgCard, border:`1.5px solid ${focused===f.key?T.sage:T.border}`, color:T.ink, outline:"none", boxShadow:focused===f.key?`0 0 0 3px ${T.sage}18`:"none", transition:"border-color 0.2s,box-shadow 0.2s" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:focused==="msg"?T.sage:T.inkMid, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em", transition:"color 0.2s" }}>Message</label>
                <textarea rows={5} placeholder="Tell me about your project or opportunity..."
                  value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                  onFocus={()=>setFocused("msg")} onBlur={()=>setFocused(null)}
                  required style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px", borderRadius:10, fontSize:14, background:T.bgCard, border:`1.5px solid ${focused==="msg"?T.sage:T.border}`, color:T.ink, outline:"none", resize:"vertical", boxShadow:focused==="msg"?`0 0 0 3px ${T.sage}18`:"none", transition:"border-color 0.2s,box-shadow 0.2s" }} />
              </div>
              <MagBtn primary sx={{ padding:"13px 28px", borderRadius:10, fontSize:14, alignSelf:"flex-start" }}>Send message →</MagBtn>
            </form>
          )}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){#contact>div:last-child{grid-template-columns:1fr!important;gap:48px!important;}}
        @keyframes successIn{from{opacity:0;transform:scale(0.95) translateY(10px)}to{opacity:1;transform:none}}
        @keyframes successBounce{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
      `}</style>
    </section>
  );
}

function SocialLink({ social, delay, inView }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={social.href}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:12,
        color:hov?T.ink:T.inkMid, textDecoration:"none", fontSize:14, fontWeight:500,
        padding:"11px 12px", borderRadius:10, borderBottom:`1px solid ${T.border}`,
        background:hov?T.bgCard:"transparent",
        transform:hov?"translateX(5px)":"none",
        boxShadow:hov?`0 2px 16px ${T.shadow}`:"none",
        transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)",
        opacity:inView?1:0,
        transitionDelay:inView?`${delay}ms`:"0ms",
      }}>
      <span style={{ width:32, height:32, borderRadius:8, background:hov?T.ink:T.bgCard, border:`1px solid ${hov?T.ink:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:hov?T.bg:T.ink, flexShrink:0, transition:"all 0.25s ease" }}>{social.short}</span>
      {social.name}
      <span style={{ marginLeft:"auto", fontSize:12, color:T.inkFaint, transform:hov?"translate(3px,-3px)":"none", transition:"transform 0.25s ease" }}>↗</span>
    </a>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer style={{ borderTop:`1px solid ${T.border}`, padding:"32px 64px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
      <span style={{ fontWeight:800, fontSize:14, color:T.ink, letterSpacing:"-0.03em" }}>{DATA.name}</span>
      <span style={{ fontSize:12, color:T.inkFaint }}>© {new Date().getFullYear()} · Built with React</span>
      <div style={{ display:"flex", gap:8 }}>
        {DATA.socials.map(s => {
          const [hov, setHov] = useState(false);
          return (
            <a key={s.name} href={s.href} title={s.name}
              onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{ width:36, height:36, borderRadius:8, background:hov?T.ink:T.bgCard, border:`1px solid ${hov?T.ink:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:hov?T.bg:T.inkMid, fontSize:11, fontWeight:700, textDecoration:"none", transform:hov?"translateY(-3px)":"none", boxShadow:hov?`0 6px 18px ${T.shadow}`:"none", transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)" }}>
              {s.short}
            </a>
          );
        })}
      </div>
    </footer>
  );
}

/* ============================================================
   SHARED
   ============================================================ */
function SectionEyebrow({ num, children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
      <span style={{ fontSize:11, fontWeight:700, color:T.sage, fontVariantNumeric:"tabular-nums" }}>{num}</span>
      <span style={{ width:24, height:1, background:T.sage }} />
      <span style={{ fontSize:11, fontWeight:700, color:T.inkFaint, textTransform:"uppercase", letterSpacing:"0.12em" }}>{children}</span>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin:"-35% 0px -35% 0px" }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:"'Inter',system-ui,sans-serif", color:T.ink, cursor:"none" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700;1,800&display=swap" rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        ::selection{background:${T.sage}40;color:#0B1020;}
        @keyframes badgeIn{from{opacity:0;transform:scale(0.85) translateY(4px)}to{opacity:1;transform:none}}
        @media(max-width:768px){
          .main-content{margin-left:0!important;padding-top:64px!important;}
          body{cursor:auto!important;}
          .no-cursor{display:none!important;}
        }
      `}</style>

      <div className="no-cursor"><Cursor /></div>
      <div><Butterfly /></div>
      <ScrollProgress />
      <Nav active={active} />

      <div className="main-content" style={{ marginLeft:200 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
