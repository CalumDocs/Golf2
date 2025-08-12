import React, { useMemo, useState, useEffect, useRef } from "react";

const THEME = {
  bg: "#FAF9F6",
  header: "#0B3D2E",
  gold: "#C9A341",
  text: "#1F2937",
  subtext: "#6B7280",
  border: "#E5E7EB",
  panel: "#FFFFFF",
};

const CATEGORY_CONFIG = {
  Signature: { creditCost: 5, cap: 10, color: "#C9A341" },
  Select: { creditCost: 3, cap: 25, color: "#3C7D4E" },
  Classic: { creditCost: 2, cap: 40, color: "#8BC79A" },
};

const PACKAGES = [
  { id: "starter", name: "Starter", credits: 20, price: 249, creditValue: 12.45 },
  { id: "core", name: "Core", credits: 50, price: 499, creditValue: 9.98 },
  { id: "enthusiast", name: "Enthusiast", credits: 100, price: 899, creditValue: 8.99 },
  { id: "elite", name: "Elite", credits: 150, price: 1199, creditValue: 7.99 },
];

const ADD_ONS = [
  { id: "guest_pass", name: "Guest passes", desc: "Four guest rounds for Select or Classic", price: 49 },
  { id: "benefits_pack", name: "Golfer benefits pack", desc: "Ball voucher glove voucher one free regrip", price: 25 },
  { id: "range_bundle", name: "Range credit bundle", desc: "Ten range buckets at partner ranges", price: 29 },
  { id: "winter_boost", name: "Winter boost", desc: "Unlimited Classic midweek from Nov to Feb where available", price: 0 },
];

function getCategoryBanks(totalCredits) {
  const sig = Math.floor(totalCredits * 0.3);
  const sel = Math.floor(totalCredits * 0.4);
  const cla = totalCredits - sig - sel;
  const out = { Signature: sig, Select: sel, Classic: cla };
  if (out.Classic > 0) { out.Classic -= 1; out.Select += 1; }
  return out;
}

function packageMetrics(pkg) {
  const cpc = pkg.price / pkg.credits;
  return {
    cpc,
    sig: cpc * CATEGORY_CONFIG.Signature.creditCost,
    sel: cpc * CATEGORY_CONFIG.Select.creditCost,
    cla: cpc * CATEGORY_CONFIG.Classic.creditCost,
  };
}

function Badge({ category }) {
  const color = CATEGORY_CONFIG[category]?.color || THEME.text;
  const darkText = category === "Classic";
  return (
    <span className="badge" style={{ backgroundColor: color, color: darkText ? THEME.text : "#FFFFFF" }}>{category}</span>
  );
}

const STEPS = ["WELCOME","SIGNUP","RADIUS","FREQUENCY","ALLOCATE","UPSELL","SUMMARY","DASHBOARD","BOOK"];

function Header({ onMenuToggle, showBack, onBack }) {
  return (
    <header className="w-full px-4 py-3 text-white flex items-center justify-between" style={{ background: THEME.header, borderBottom: `3px solid ${THEME.gold}` }}>
      <div className="flex items-center gap-3">
        {showBack && <button onClick={onBack} className="rounded-xl border px-3 py-1 text-xs bg-white text-[color:#0B3D2E]">Back</button>}
        <h1 className="text-lg font-semibold">Yorkshire Golf Passport</h1>
      </div>
      <button onClick={onMenuToggle} className="rounded-xl border px-3 py-1 text-xs bg-white text-[color:#0B3D2E]">Menu</button>
    </header>
  );
}

function Progress({ stepIndex }) {
  const total = 7; // progress for the setup steps only
  const clamped = Math.min(stepIndex, total - 1);
  const pct = Math.round(((clamped + 1) / total) * 100);
  return (
    <div className="w-full h-2 bg-gray-200">
      <div className="h-2" style={{ width: `${pct}%`, background: THEME.gold }} />
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("WELCOME");
  const stepIndex = STEPS.indexOf(step);
  const showProgress = ["SIGNUP","RADIUS","FREQUENCY","ALLOCATE","UPSELL","SUMMARY"].includes(step);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", dob: "", postcode: "LS1 1AA", handicap: 18, lat: 53.8008, lon: -1.5491, radius: 20 });

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const dobRef = useRef(null);
  const postcodeRef = useRef(null);
  const handicapRef = useRef(null);

  const [packageId, setPackageId] = useState("core");
  const pkg = useMemo(() => PACKAGES.find(p => p.id === packageId) || PACKAGES[1], [packageId]);
  const baseBanks = useMemo(() => getCategoryBanks(pkg.credits), [pkg]);

  const [alloc, setAlloc] = useState({});

  function distanceMiles(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const R = 3958.8;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const COURSES = [
    {"id":1,"name":"Ganton","category":"Signature","city_area":"Ganton, North Yorkshire","latitude":54.191,"longitude":-0.494},
    {"id":2,"name":"Alwoodley","category":"Signature","city_area":"Leeds","latitude":53.87,"longitude":-1.55},
    {"id":13,"name":"Woodsome Hall","category":"Select","city_area":"Huddersfield","latitude":53.607,"longitude":-1.727},
    {"id":16,"name":"Headingley","category":"Select","city_area":"Leeds","latitude":53.85,"longitude":-1.59},
    {"id":99,"name":"Scalm Park","category":"Classic","city_area":"Selby","latitude":53.803,"longitude":-1.155},
    {"id":100,"name":"Drax","category":"Classic","city_area":"Drax","latitude":53.72,"longitude":-1.02}
  ];

  const rank = { Signature: 0, Select: 1, Classic: 2 };
  const filteredCourses = useMemo(() => {
    return COURSES
      .map(c => ({ ...c, distance: distanceMiles(profile.lat, profile.lon, Number(c.latitude), Number(c.longitude)) }))
      .filter(c => c.distance <= profile.radius)
      .sort((a, b) => {
        const byCat = rank[a.category] - rank[b.category];
        if (byCat !== 0) return byCat;
        const byDist = a.distance - b.distance;
        if (byDist !== 0) return byDist;
        return a.name.localeCompare(b.name);
      });
  }, [profile.lat, profile.lon, profile.radius]);

  const byDistance = useMemo(() => {
    return COURSES
      .map(c => ({ ...c, distance: distanceMiles(profile.lat, profile.lon, Number(c.latitude), Number(c.longitude)) }))
      .filter(c => c.distance <= profile.radius)
      .sort((a, b) => (a.distance - b.distance) || a.name.localeCompare(b.name));
  }, [profile.lat, profile.lon, profile.radius]);

  // Booking state
  const [bookings, setBookings] = useState([]);
  const [bookingDraft, setBookingDraft] = useState({ courseId: null, date: "", time: "", extras: { cart: false, insurance: false, meal: false, balls: false } });

  useEffect(() => {
    if (step === "BOOK" && !bookingDraft.date && !bookingDraft.time) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setBookingDraft(prev => ({ ...prev, date: `${yyyy}-${mm}-${dd}`, time: "09:00" }));
    }
  }, [step]);

  function openBooking(courseId) {
    setBookingDraft({ courseId, date: "", time: "", extras: { cart: false, insurance: false, meal: false, balls: false } });
    setStep("BOOK");
  }

  function confirmBooking() {
    const { courseId, date, time, extras } = bookingDraft;
    if (!courseId || !date || !time) return;
    const r = alloc[courseId] || 0;
    if (r > 0) setAlloc(prev => ({ ...prev, [courseId]: r - 1 }));
    const whenISO = new Date(`${date}T${time}:00`).toISOString();
    setBookings(b => [...b, { courseId, whenISO, extras }]);
    setStep("DASHBOARD");
  }

  function timeToNextRound() {
    const future = bookings.map(b => new Date(b.whenISO)).filter(d => d > new Date()).sort((a,b) => a - b)[0];
    if (!future) return null;
    const ms = future.getTime() - Date.now();
    const hours = Math.max(0, Math.floor(ms / 36e5));
    const minutes = Math.max(0, Math.floor((ms % 36e5) / 6e4));
    return { hours, minutes, date: future };
  }

  const bankSpent = useMemo(() => {
    const out = { Signature: 0, Select: 0, Classic: 0 };
    Object.entries(alloc).forEach(([cid, rounds]) => {
      const c = COURSES.find(x => String(x.id) == String(cid));
      if (!c) return;
      out[c.category] += rounds * CATEGORY_CONFIG[c.category].creditCost;
    });
    return out;
  }, [alloc]);

  const bankRemaining = {
    Signature: Math.max(0, getCategoryBanks(pkg.credits).Signature - bankSpent.Signature),
    Select: Math.max(0, getCategoryBanks(pkg.credits).Select - bankSpent.Select),
    Classic: Math.max(0, getCategoryBanks(pkg.credits).Classic - bankSpent.Classic),
  };

  function Page({ children }) {
    return (
      <div className="min-h-screen bg-brandbg">
        <Header onMenuToggle={()=>setMenuOpen(v=>!v)} showBack={step!=="WELCOME"} onBack={()=>{
          const prev = Math.max(0, stepIndex - 1);
          setStep(STEPS[prev]);
        }} />
        {showProgress && <Progress stepIndex={stepIndex} />}
        <main className="p-4 w-full">{children}</main>

        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={()=>setMenuOpen(false)}>
            <div className="absolute right-2 top-14 w-64 card" onClick={e=>e.stopPropagation()}>
              <div className="font-semibold mb-2">Menu</div>
              <div className="grid gap-2 text-sm text-[color:#6B7280]">
                <button className="border rounded-xl px-3 py-2" onClick={()=>{ setMenuOpen(false); setStep("DASHBOARD"); }}>Dashboard</button>
                <button className="border rounded-xl px-3 py-2" onClick={()=>{ setMenuOpen(false); setStep("ALLOCATE"); }}>Adjust allocations</button>
                <button className="border rounded-xl px-3 py-2" onClick={()=>{ setMenuOpen(false); setStep("SUMMARY"); }}>Membership summary</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // WELCOME
  if (step === "WELCOME") {
    return (
      <Page>
        <div className="grid gap-3 text-sm">
          <div className="card">
            <div className="font-semibold">How it works</div>
            <p className="mt-1 text-[color:#6B7280]">Set your radius then select courses across Signature Select and Classic. Each category has its own credit bank so everyone gets fair access to the most popular venues.</p>
          </div>
          <div className="card">
            <div className="font-semibold">Why join</div>
            <ul className="list-disc pl-5 mt-1 text-[color:#6B7280]">
              <li>Explore a curated network without paying full visitor rates every time</li>
              <li>Credits and caps protect availability at the most in demand clubs</li>
              <li>Buy more credits whenever you need them</li>
            </ul>
          </div>
        </div>
        <button className="w-full mt-6 py-3 btn-gold" onClick={() => setStep("SIGNUP")}>Get started</button>
      </Page>
    );
  }

  // SIGNUP
  if (step === "SIGNUP") {
    return (
      <Page>
        <div className="space-y-3">
          <label className="text-sm text-[color:#6B7280]">Full name</label>
          <input ref={nameRef} className="w-full border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} placeholder="Name" defaultValue="" />
          <label className="text-sm text-[color:#6B7280]">Email</label>
          <input ref={emailRef} className="w-full border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} placeholder="Email" defaultValue="" />
          <label className="text-sm text-[color:#6B7280]">Date of birth</label>
          <input ref={dobRef} type="date" className="w-full border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} />
          <label className="text-sm text-[color:#6B7280]">Postcode</label>
          <input ref={postcodeRef} className="w-full border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} placeholder="Postcode" defaultValue={"LS1 1AA"} />
          <div>
            <label className="text-sm text-[color:#6B7280]">Handicap</label>
            <input ref={handicapRef} type="number" min={0} max={54} className="w-full border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} defaultValue={18} />
            <p className="text-xs mt-1 text-[color:#6B7280]">Suggested amateur handicap is set to 18 by default</p>
          </div>
        </div>
        <div className="h-10" />
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("WELCOME")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">Next choose your travel radius</div>
            <button onClick={() => { 
              setProfile(p => ({ 
                ...p, 
                name: nameRef.current?.value || "", 
                email: emailRef.current?.value || "", 
                dob: dobRef.current?.value || "", 
                postcode: postcodeRef.current?.value || "LS1 1AA", 
                handicap: Number(handicapRef.current?.value || 18) 
              })); 
              setStep("RADIUS"); 
            }} className="btn-gold">Continue</button>
          </div>
        </div>
      </Page>
    );
  }

  // RADIUS
  if (step === "RADIUS") {
    const presets = [10,20,30,40,50,75,100];
    return (
      <Page>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map(m => (
            <button key={m} onClick={()=>setProfile({...profile, radius:m})} className={`py-2 rounded-xl border ${profile.radius===m?"border-green-600 bg-green-50":"bg-white"}`} style={{ borderColor: THEME.border }}>{m} miles</button>
          ))}
        </div>
        <p className="text-sm mb-2 text-[color:#6B7280]">Courses in range right now {byDistance.length}</p>
        <div className="divide-y rounded-2xl border mb-24 bg-white" style={{ borderColor: THEME.border }}>
          {byDistance.map(c => (
            <div key={c.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium flex items-center gap-2">{c.name} <Badge category={c.category} /></div>
                <div className="text-xs text-[color:#6B7280]">{c.city_area || "Yorkshire"} • {c.distance.toFixed(1)} miles</div>
              </div>
            </div>
          ))}
          {byDistance.length === 0 && (
            <div className="p-4 text-sm text-[color:#6B7280]">No courses in this radius. Try a larger distance</div>
          )}
        </div>
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("SIGNUP")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">Next pick how often you play</div>
            <button onClick={()=>setStep("FREQUENCY")} className="btn-gold">Continue</button>
          </div>
        </div>
      </Page>
    );
  }

  // FREQUENCY
  if (step === "FREQUENCY") {
    const cards = [
      { id: "starter", title: "Occasional golfer" },
      { id: "core", title: "Regular golfer" },
      { id: "enthusiast", title: "Avid golfer" },
      { id: "elite", title: "High frequency" },
    ];
    const banks = getCategoryBanks(PACKAGES.find(p=>p.id===packageId)?.credits || 50);
    return (
      <Page>
        <div className="grid gap-3 mb-24">
          {cards.map(c => {
            const p = PACKAGES.find(pp => pp.id === c.id);
            const m = packageMetrics(p);
            const selected = packageId === c.id;
            return (
              <button key={c.id} onClick={()=>setPackageId(c.id)} className={`text-left card ${selected?"border-green-600 bg-green-50":"bg-white"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold">{c.title}</div>
                  {c.id === "enthusiast" && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: THEME.gold, color: THEME.header }}>Recommended</span>}
                </div>
                <div className="text-sm text-[color:#6B7280]">{p.name} • {p.credits} credits • £{p.price} • £{m.cpc.toFixed(2)} per credit</div>
                <div className="text-xs mt-1 text-[color:#6B7280]">Est round cost Signature £{m.sig.toFixed(2)} Select £{m.sel.toFixed(2)} Classic £{m.cla.toFixed(2)}</div>
                {selected && <div className="text-xs mt-2 text-green-700">Selected</div>}
              </button>
            );
          })}
        </div>
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("RADIUS")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">Your banks Signature {banks.Signature} Select {banks.Select} Classic {banks.Classic}</div>
            <button onClick={()=>setStep("ALLOCATE")} className="btn-gold">Continue</button>
          </div>
        </div>
      </Page>
    );
  }

  // ALLOCATE
  if (step === "ALLOCATE") {
    const banks = getCategoryBanks(pkg.credits);
    const bankCards = (
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs sticky top-0 z-10" style={{ background: THEME.bg, paddingTop: 8 }}>
        <div className="p-2 rounded-xl border" style={{ background: "#FFF8E6", borderColor: THEME.gold }}>
          <div className="font-semibold">Signature</div>
          <div>Remaining {bankRemaining.Signature} of {banks.Signature}</div>
        </div>
        <div className="p-2 rounded-xl border" style={{ background: "#EDF9F0", borderColor: "#3C7D4E" }}>
          <div className="font-semibold">Select</div>
          <div>Remaining {bankRemaining.Select} of {banks.Select}</div>
        </div>
        <div className="p-2 rounded-xl border" style={{ background: "#F2FBF2", borderColor: "#8BC79A" }}>
          <div className="font-semibold">Classic</div>
          <div>Remaining {bankRemaining.Classic} of {banks.Classic}</div>
        </div>
      </div>
    );

    const section = (cat) => (
      <div className="mb-4" key={cat}>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Badge category={cat} /> <span className="text-[color:#6B7280]">Courses in range</span></h3>
        <div className="divide-y" style={{ borderColor: THEME.border }}>
          {filteredCourses.filter(c => c.category === cat).map(c => {
            const rounds = alloc[c.id] || 0;
            const cap = CATEGORY_CONFIG[c.category].cap;
            const cost = CATEGORY_CONFIG[c.category].creditCost;
            const canIncrease = bankRemaining[c.category] >= cost && rounds < cap;
            return (
              <div key={c.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">{c.name} <Badge category={c.category} /></div>
                  <div className="text-xs text-[color:#6B7280]">{c.city_area || "Yorkshire"} • {c.distance.toFixed(1)} miles</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setAlloc(prev=>({ ...prev, [c.id]: Math.max(0, (prev[c.id]||0) - 1) }))} className="w-9 h-9 rounded-xl border bg-white text-xl">−</button>
                  <div className="w-10 text-center">{rounds}</div>
                  <button onClick={()=> canIncrease && setAlloc(prev=>({ ...prev, [c.id]: (prev[c.id]||0) + 1 }))} className={`w-9 h-9 rounded-xl border text-xl ${canIncrease?"bg-white":"bg-gray-100 text-gray-400"}`}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <Page>
        {bankCards}
        {section("Signature")}
        {section("Select")}
        {section("Classic")}
        <div className="h-14" />
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("FREQUENCY")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">You can adjust allocations later from the dashboard</div>
            <button onClick={()=>setStep("UPSELL")} className="btn-gold">Continue</button>
          </div>
        </div>
      </Page>
    );
  }

  // UPSELL
  if (step === "UPSELL") {
    const [selectedAddOns, setSelectedAddOns] = useState({});
    const addOnTotal = useMemo(() => ADD_ONS.filter(a => selectedAddOns[a.id]).reduce((s,a)=>s + (a.price||0), 0), [selectedAddOns]);
    return (
      <Page>
        <div className="grid gap-3 mb-24">
          {ADD_ONS.map(x => {
            const active = !!selectedAddOns[x.id];
            return (
              <button key={x.id} onClick={()=>setSelectedAddOns(s=>({ ...s, [x.id]: !s[x.id] }))} className={`text-left card ${active?"bg-green-50 border-green-600":"bg-white"}`}>
                <div className="font-medium flex items-center justify-between">
                  <span>{x.name}</span>
                  {x.price>0 && <span>£{x.price}</span>}
                </div>
                <div className="text-sm text-[color:#6B7280]">{x.desc}</div>
              </button>
            );
          })}
          <div className="text-sm">Extras total £{addOnTotal}</div>
        </div>
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("ALLOCATE")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">Review your membership then confirm</div>
            <button onClick={()=>setStep("SUMMARY")} className="btn-gold">Continue</button>
          </div>
        </div>
      </Page>
    );
  }

  // SUMMARY
  if (step === "SUMMARY") {
    const banks = getCategoryBanks(pkg.credits);
    return (
      <Page>
        <div className="card mb-4">
          <div className="font-semibold">Package</div>
          <div className="text-sm text-[color:#6B7280]">{PACKAGES.find(p=>p.id===packageId).name} • {PACKAGES.find(p=>p.id===packageId).credits} credits • £{PACKAGES.find(p=>p.id===packageId).price}</div>
          <div className="text-xs mt-1 text-[color:#6B7280]">Banks Signature {banks.Signature} Select {banks.Select} Classic {banks.Classic}</div>
        </div>
        <div className="card mb-4">
          <div className="font-semibold mb-1">Add ons</div>
          <div className="text-sm text-[color:#6B7280]">See previous step for details</div>
        </div>
        <div className="card mb-4">
          <div className="font-semibold">Total</div>
          <div className="text-lg">Calculated at checkout</div>
        </div>
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("UPSELL")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">This is a demo. Nothing will be submitted or charged</div>
            <button className="btn-gold" onClick={()=>setStep("DASHBOARD")}>Confirm</button>
          </div>
        </div>
      </Page>
    );
  }

  // BOOK
  if (step === "BOOK") {
    const c = COURSES.find(x => x.id === bookingDraft.courseId);
    return (
      <Page>
        <div className="card mb-4">
          <div className="font-semibold mb-1">{c?.name}</div>
          <div className="text-sm text-[color:#6B7280]">{c?.city_area}</div>
          <div className="mt-3 grid gap-2">
            <input type="date" className="border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} value={bookingDraft.date} onChange={e=>setBookingDraft({...bookingDraft, date:e.target.value})} />
            <input type="time" className="border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} value={bookingDraft.time} onChange={e=>setBookingDraft({...bookingDraft, time:e.target.value})} />
          </div>
        </div>
        <div className="card mb-24">
          <div className="font-semibold mb-2">Round extras</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, cart: !b.extras.cart} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.cart?"bg-green-50 border-green-600":""}`}>Golf cart</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, insurance: !b.extras.insurance} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.insurance?"bg-green-50 border-green-600":""}`}>Course insurance</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, meal: !b.extras.meal} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.meal?"bg-green-50 border-green-600":""}`}>Meal voucher</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, balls: !b.extras.balls} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.balls?"bg-green-50 border-green-600":""}`}>Order balls</button>
          </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
          <div className="flex items-center gap-3">
            <button className="border rounded-2xl px-4 py-2" onClick={()=>setStep("DASHBOARD")}>Back</button>
            <div className="flex-1 text-xs text-[color:#6B7280]">Confirm your date and time</div>
            <button className="btn-gold" onClick={confirmBooking}>Confirm booking</button>
          </div>
        </div>
      </Page>
    );
  }

  // DASHBOARD
  const nextRoundObj = timeToNextRound();

  return (
    <Page>
      <div className="text-lg font-semibold mb-2">Welcome back {profile.name || "Golfer"}</div>
      <div className="card mb-4">
        <div className="font-semibold mb-1">Weather</div>
        <div className="text-sm text-[color:#6B7280]">Leeds 16C light breeze chance of showers later</div>
      </div>

      <section className="card mb-4">
        <div className="font-semibold mb-1">Your next round</div>
        {!nextRoundObj && <div className="text-sm text-[color:#6B7280]">No rounds booked yet</div>}
        {nextRoundObj && (
          <div className="text-sm">
            Starts in {nextRoundObj.hours} hours {nextRoundObj.minutes} minutes
            <div className="text-xs text-[color:#6B7280]">{nextRoundObj.date?.toLocaleString?.()}</div>
            {(nextRoundObj.hours > 48) && (
              <button className="mt-2 px-3 py-2 rounded-xl border">Order balls for this round</button>
            )}
          </div>
        )}
      </section>

      <section className="card mb-4">
        <div className="font-semibold mb-1">Your courses</div>
        <div className="grid gap-2">
          {Object.keys(alloc).length === 0 && (
            <div className="text-sm text-[color:#6B7280]">You have not allocated any rounds yet</div>
          )}
          {Object.entries(alloc).map(([cid, rounds]) => {
            const c = COURSES.find(cc => String(cc.id) == String(cid));
            if (!c || rounds <= 0) return null;
            return (
              <div key={cid} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: THEME.border }}>
                <div>
                  <div className="font-medium flex items-center gap-2">{c.name} <Badge category={c.category} /></div>
                  <div className="text-xs text-[color:#6B7280]">Rounds remaining {rounds}</div>
                </div>
                <button className="px-3 py-2 rounded-xl btn-gold" onClick={()=>openBooking(c.id)}>Book</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card mb-24">
        <div className="font-semibold mb-1">Buy more rounds</div>
        <div className="text-sm text-[color:#6B7280]">Need extra rounds later Use this to top up your banks. You can still adjust allocations in the Allocate step.</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <button className="border rounded-xl px-3 py-2">Add 10 credits</button>
          <button className="border rounded-xl px-3 py-2">Add 25 credits</button>
          <button className="border rounded-xl px-3 py-2">Add 50 credits</button>
          <button className="border rounded-xl px-3 py-2">Add 100 credits</button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
        <div className="grid grid-cols-2 gap-2">
          <button className="w-full py-3 rounded-2xl border" onClick={()=>setStep("ALLOCATE")}>Adjust allocations</button>
          <button className="w-full py-3 rounded-2xl border" onClick={()=>setStep("FREQUENCY")}>Change package</button>
        </div>
      </div>
    </Page>
  );
}
