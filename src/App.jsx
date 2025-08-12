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

function StickyFooter({ canContinue, onContinue, note, cta = "Continue" }) {
  return (
    <div className="fixed inset-x-0 bottom-0 p-3 bg-brandpanel" style={{ borderTop: `1px solid ${THEME.border}` }}>
      <div className="flex items-center gap-3 max-w-xl mx-auto">
        <div className="flex-1 text-xs" style={{ color: THEME.subtext }}>{note}</div>
        <button onClick={onContinue} disabled={!canContinue} className={`btn-gold ${canContinue ? "" : "opacity-60"}`}>{cta}</button>
      </div>
    </div>
  );
}

const STEPS = { WELCOME: "WELCOME", SIGNUP: "SIGNUP", RADIUS: "RADIUS", FREQUENCY: "FREQUENCY", ALLOCATE: "ALLOCATE", UPSELL: "UPSELL", SUMMARY: "SUMMARY", DASHBOARD: "DASHBOARD", BOOK: "BOOK" };

const COURSES = [{"id":1,"name":"Ganton","category":"Signature","city_area":"Ganton, North Yorkshire","latitude":54.191,"longitude":-0.494,"notes":"inland links heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":2,"name":"Alwoodley","category":"Signature","city_area":"Leeds","latitude":53.87,"longitude":-1.55,"notes":"heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":3,"name":"Moortown","category":"Signature","city_area":"Leeds","latitude":53.857,"longitude":-1.534,"notes":"heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":4,"name":"Lindrick","category":"Signature","city_area":"South Yorkshire","latitude":53.36,"longitude":-1.12,"notes":"heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":5,"name":"Fulford","category":"Signature","city_area":"York","latitude":53.942087,"longitude":-1.054979,"notes":"heathland parkland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":6,"name":"Hallamshire","category":"Signature","city_area":"Sheffield","latitude":53.37,"longitude":-1.54,"notes":"moorland heath","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":7,"name":"Huddersfield Fixby","category":"Signature","city_area":"Huddersfield","latitude":53.676,"longitude":-1.82,"notes":"parkland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":8,"name":"Pannal","category":"Signature","city_area":"Harrogate","latitude":53.966,"longitude":-1.537,"notes":"heathland parkland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":9,"name":"York Strensall","category":"Signature","city_area":"Strensall, York","latitude":54.017,"longitude":-1.05,"notes":"heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":10,"name":"Sand Moor","category":"Signature","city_area":"Leeds","latitude":53.86,"longitude":-1.54,"notes":"heathland","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":11,"name":"Cleveland Redcar","category":"Signature","city_area":"Redcar","latitude":54.618,"longitude":-1.071,"notes":"true seaside links","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":12,"name":"Ilkley","category":"Signature","city_area":"Ilkley","latitude":53.924,"longitude":-1.823,"notes":"parkland river","cap_per_member":10,"credit_cost":5,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":13,"name":"Woodsome Hall","category":"Select","city_area":"Huddersfield","latitude":53.607,"longitude":-1.727,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":14,"name":"Rotherham","category":"Select","city_area":"Rotherham","latitude":53.432,"longitude":-1.356,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":15,"name":"Moor Allerton","category":"Select","city_area":"Leeds","latitude":53.86,"longitude":-1.53,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":16,"name":"Headingley","category":"Select","city_area":"Leeds","latitude":53.85,"longitude":-1.59,"notes":"heathland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":17,"name":"Bingley St Ives","category":"Select","city_area":"Bingley","latitude":53.85,"longitude":-1.85,"notes":"heathland moorland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":18,"name":"Garforth","category":"Select","city_area":"Leeds","latitude":53.799,"longitude":-1.38,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":19,"name":"Wakefield","category":"Select","city_area":"Wakefield","latitude":53.68,"longitude":-1.49,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":20,"name":"Knaresborough","category":"Select","city_area":"Knaresborough","latitude":54.009,"longitude":-1.468,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":21,"name":"Oakdale Harrogate","category":"Select","city_area":"Harrogate","latitude":53.999,"longitude":-1.548,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":22,"name":"Malton and Norton","category":"Select","city_area":"Malton and Norton","latitude":54.136,"longitude":-0.796,"notes":"heathland parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":23,"name":"Wetherby","category":"Select","city_area":"Wetherby","latitude":53.929,"longitude":-1.384,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":24,"name":"Crosland Heath","category":"Select","city_area":"Huddersfield","latitude":53.627,"longitude":-1.818,"notes":"heathland moorland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":25,"name":"Abbeydale","category":"Select","city_area":"Sheffield","latitude":53.32,"longitude":-1.51,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":26,"name":"Shipley Northcliffe","category":"Select","city_area":"Shipley","latitude":53.838,"longitude":-1.789,"notes":"parkland woodland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":27,"name":"Keighley","category":"Select","city_area":"Keighley","latitude":53.867,"longitude":-1.906,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":28,"name":"Ripon City","category":"Select","city_area":"Ripon","latitude":54.136,"longitude":-1.523,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":29,"name":"Easingwold","category":"Select","city_area":"Easingwold","latitude":54.121,"longitude":-1.191,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":30,"name":"Thirsk and Northallerton","category":"Select","city_area":"Thirsk","latitude":54.232,"longitude":-1.343,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":31,"name":"Bedale","category":"Select","city_area":"Bedale","latitude":54.288,"longitude":-1.592,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":32,"name":"Romanby","category":"Select","city_area":"Northallerton","latitude":54.339,"longitude":-1.455,"notes":"parkland resort","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":33,"name":"Richmond","category":"Select","city_area":"Richmond","latitude":54.405,"longitude":-1.736,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":34,"name":"Catterick","category":"Select","city_area":"Catterick","latitude":54.375,"longitude":-1.704,"notes":"parkland military","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":35,"name":"Scarborough South Cliff","category":"Select","city_area":"Scarborough","latitude":54.27,"longitude":-0.401,"notes":"cliff top links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":36,"name":"Scarborough North Cliff","category":"Select","city_area":"Scarborough","latitude":54.301,"longitude":-0.416,"notes":"cliff top links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":37,"name":"Filey","category":"Select","city_area":"Filey","latitude":54.206,"longitude":-0.29,"notes":"links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":38,"name":"Whitby","category":"Select","city_area":"Whitby","latitude":54.486,"longitude":-0.613,"notes":"cliff top links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":39,"name":"Bridlington Links","category":"Select","city_area":"Bridlington","latitude":54.12,"longitude":-0.182,"notes":"cliff top links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":40,"name":"Hornsea","category":"Select","city_area":"Hornsea","latitude":53.912,"longitude":-0.166,"notes":"links style parkland coastal","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":41,"name":"Beverley and East Riding","category":"Select","city_area":"Beverley","latitude":53.84,"longitude":-0.43,"notes":"common land heath style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":42,"name":"Flamborough Head","category":"Select","city_area":"Flamborough","latitude":54.115,"longitude":-0.11,"notes":"cliff top links style","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":43,"name":"Hull GC","category":"Select","city_area":"Kirk Ella, Hull","latitude":53.75,"longitude":-0.45,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":44,"name":"Ganstead Park","category":"Select","city_area":"Hull","latitude":53.77,"longitude":-0.26,"notes":"parkland","cap_per_member":25,"credit_cost":3,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":45,"name":"Burstwick","category":"Classic","city_area":"Burstwick","latitude":53.74,"longitude":-0.15,"notes":"parkland open","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":46,"name":"Cottingham Parks","category":"Classic","city_area":"Cottingham","latitude":53.79,"longitude":-0.44,"notes":"parkland resort","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":47,"name":"Driffield","category":"Classic","city_area":"Driffield","latitude":54.007,"longitude":-0.44,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":48,"name":"KP Club Kilnwick Percy","category":"Classic","city_area":"Kilnwick Percy, Pocklington","latitude":53.93,"longitude":-0.77,"notes":"resort parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":49,"name":"Pike Hills","category":"Classic","city_area":"York","latitude":53.93,"longitude":-1.15,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":50,"name":"Forest Park","category":"Classic","city_area":"York","latitude":54.01,"longitude":-1.01,"notes":"parkland 27 holes","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":51,"name":"Heworth York","category":"Classic","city_area":"York","latitude":53.97,"longitude":-1.05,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":52,"name":"Scarthingwell","category":"Classic","city_area":"Scarthingwell, Tadcaster","latitude":53.85,"longitude":-1.27,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":53,"name":"Tadcaster","category":"Classic","city_area":"Tadcaster","latitude":53.885,"longitude":-1.264,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":54,"name":"Selby","category":"Classic","city_area":"Selby","latitude":53.783,"longitude":-1.063,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":55,"name":"Drax","category":"Classic","city_area":"Drax","latitude":53.72,"longitude":-1.018,"notes":"parkland wooded","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":56,"name":"Scalm Park","category":"Classic","city_area":"Selby","latitude":53.812,"longitude":-1.208,"notes":"parkland flat","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":57,"name":"Swallow Hall","category":"Classic","city_area":"Wheldrake, York","latitude":53.877,"longitude":-1.038,"notes":"pay and play parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":58,"name":"The Village Wike Leeds","category":"Classic","city_area":"Wike, Leeds","latitude":53.874,"longitude":-1.509,"notes":"9 hole parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":59,"name":"Leeds GC Cobble Hall","category":"Classic","city_area":"Leeds","latitude":53.829,"longitude":-1.495,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":60,"name":"Scarcroft","category":"Classic","city_area":"Scarcroft, Leeds","latitude":53.872,"longitude":-1.46,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":61,"name":"Temple Newsam","category":"Classic","city_area":"Leeds","latitude":53.78,"longitude":-1.47,"notes":"municipal parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":62,"name":"Calverley","category":"Classic","city_area":"Calverley","latitude":53.83,"longitude":-1.69,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":63,"name":"Woodhall Hills","category":"Classic","city_area":"Pudsey","latitude":53.83,"longitude":-1.68,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":64,"name":"Howley Hall","category":"Classic","city_area":"Morley, Leeds","latitude":53.75,"longitude":-1.62,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":65,"name":"Pontefract and District","category":"Classic","city_area":"Pontefract","latitude":53.693,"longitude":-1.311,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":66,"name":"Waterton Park","category":"Classic","city_area":"Walton, Wakefield","latitude":53.65,"longitude":-1.42,"notes":"parkland resort","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":67,"name":"Woolley Park","category":"Classic","city_area":"Woolley, Wakefield","latitude":53.62,"longitude":-1.53,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":68,"name":"Low Laithes","category":"Classic","city_area":"Ossett, Wakefield","latitude":53.689,"longitude":-1.583,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":69,"name":"Thornhurst Manor Doncaster","category":"Classic","city_area":"Doncaster","latitude":53.6,"longitude":-1.12,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":70,"name":"Wheatley Hills Doncaster","category":"Classic","city_area":"Doncaster","latitude":53.54,"longitude":-1.11,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":71,"name":"Doncaster Town Moor","category":"Classic","city_area":"Doncaster","latitude":53.53,"longitude":-1.12,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":72,"name":"Hickleton","category":"Classic","city_area":"Hickleton, Doncaster","latitude":53.56,"longitude":-1.27,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":73,"name":"Sitwell Park","category":"Classic","city_area":"Rotherham","latitude":53.39,"longitude":-1.34,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":74,"name":"Rother Valley","category":"Classic","city_area":"Sheffield","latitude":53.32,"longitude":-1.34,"notes":"pay and play parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":75,"name":"Beauchief","category":"Classic","city_area":"Sheffield","latitude":53.32,"longitude":-1.49,"notes":"municipal parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":76,"name":"Birley Wood","category":"Classic","city_area":"Sheffield","latitude":53.34,"longitude":-1.39,"notes":"municipal parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":77,"name":"Tinsley Park","category":"Classic","city_area":"Sheffield","latitude":53.39,"longitude":-1.4,"notes":"municipal parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":78,"name":"Dore and Totley","category":"Classic","city_area":"Sheffield","latitude":53.31,"longitude":-1.53,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":79,"name":"Hillsborough","category":"Classic","city_area":"Sheffield","latitude":53.41,"longitude":-1.5,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":80,"name":"Hallowes","category":"Classic","city_area":"Dronfield","latitude":53.31,"longitude":-1.48,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":81,"name":"Tankersley Park","category":"Classic","city_area":"Barnsley","latitude":53.5,"longitude":-1.5,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":82,"name":"Wortley","category":"Classic","city_area":"Wortley","latitude":53.483,"longitude":-1.55,"notes":"parkland woodland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":83,"name":"Silkstone","category":"Classic","city_area":"Barnsley","latitude":53.55,"longitude":-1.56,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":84,"name":"Penistone","category":"Classic","city_area":"Penistone","latitude":53.526,"longitude":-1.63,"notes":"parkland hillside","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":85,"name":"Meltham","category":"Classic","city_area":"Meltham","latitude":53.593,"longitude":-1.853,"notes":"moorland parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":86,"name":"Outlane","category":"Classic","city_area":"Huddersfield","latitude":53.66,"longitude":-1.87,"notes":"moorland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":87,"name":"Longley Park","category":"Classic","city_area":"Huddersfield","latitude":53.64,"longitude":-1.79,"notes":"parkland compact","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":88,"name":"Halifax Ogden","category":"Classic","city_area":"Halifax","latitude":53.726,"longitude":-1.86,"notes":"moorland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":89,"name":"West Bradford","category":"Classic","city_area":"Bradford","latitude":53.793,"longitude":-1.752,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":90,"name":"Lightcliffe","category":"Classic","city_area":"Calderdale","latitude":53.724,"longitude":-1.81,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":91,"name":"Cleckheaton and District","category":"Classic","city_area":"Cleckheaton","latitude":53.724,"longitude":-1.712,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":92,"name":"Dewsbury District","category":"Classic","city_area":"Dewsbury","latitude":53.692,"longitude":-1.633,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":93,"name":"Baildon","category":"Classic","city_area":"Baildon","latitude":53.85,"longitude":-1.77,"notes":"moorland hillside","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":94,"name":"Bracken Ghyll","category":"Classic","city_area":"Addingham","latitude":53.944,"longitude":-1.883,"notes":"parkland moorland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":95,"name":"Skipton","category":"Classic","city_area":"Skipton","latitude":53.961,"longitude":-2.016,"notes":"parkland dales","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":96,"name":"Fulneck","category":"Classic","city_area":"Pudsey","latitude":53.79,"longitude":-1.66,"notes":"hillside parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":97,"name":"Cookridge Hall Leeds","category":"Classic","city_area":"Leeds","latitude":53.856,"longitude":-1.615,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":98,"name":"Ilkley District Ben Rhydding","category":"Classic","city_area":"Ben Rhydding, Ilkley","latitude":53.916,"longitude":-1.813,"notes":"9 hole hillside","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":99,"name":"Bradford Hawksworth","category":"Classic","city_area":"Hawksworth, Bradford","latitude":53.85,"longitude":-1.73,"notes":"parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"},{"id":100,"name":"North Leeds Compact","category":"Classic","city_area":"Leeds","latitude":53.84,"longitude":-1.57,"notes":"small parkland","cap_per_member":40,"credit_cost":2,"golfnow_url":"https://www.golfnow.co.uk/","status":"active"}];

function distanceMiles(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function runInlineTests() {
  try {
    [20, 50, 100, 1].forEach(total => {
      const b = getCategoryBanks(total);
      console.assert(b.Signature + b.Select + b.Classic === total, `Bank sum mismatch for ${total}`);
      if (total > 1) console.assert(b.Select >= Math.floor(total * 0.4), `Select shift not applied for ${total}`);
    });
    console.assert(Math.abs(distanceMiles(53.8, -1.55, 53.8, -1.55)) < 1e-6, "Distance zero test failed");
    const dSym = Math.abs(distanceMiles(53.8, -1.55, 53.96, -1.08) - distanceMiles(53.96, -1.08, 53.8, -1.55));
    console.assert(dSym < 1e-9, "Distance symmetry failed");
  } catch (e) {
    console.warn("Inline tests encountered an error", e);
  }
}
runInlineTests();

export default function App() {
  const [step, setStep] = useState("WELCOME");
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
  const bankSpent = useMemo(() => {
    const out = { Signature: 0, Select: 0, Classic: 0 };
    Object.entries(alloc).forEach(([cid, rounds]) => {
      const c = COURSES.find(x => String(x.id) === String(cid));
      if (!c) return;
      out[c.category] += rounds * CATEGORY_CONFIG[c.category].creditCost;
    });
    return out;
  }, [alloc]);

  const bankRemaining = {
    Signature: Math.max(0, baseBanks.Signature - bankSpent.Signature),
    Select: Math.max(0, baseBanks.Select - bankSpent.Select),
    Classic: Math.max(0, baseBanks.Classic - bankSpent.Classic),
  };

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

  const [bookings, setBookings] = useState([]);
  const [bookingDraft, setBookingDraft] = useState({ courseId: null, date: "", time: "", extras: { cart: false, insurance: false, meal: false, balls: false } });

  const [selectedAddOns, setSelectedAddOns] = useState({});
  const addOnTotal = useMemo(() => ADD_ONS.filter(a => selectedAddOns[a.id]).reduce((s,a)=>s + (a.price||0), 0), [selectedAddOns]);

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

  const nextRound = timeToNextRound();
  const lastRound = bookings.filter(b => new Date(b.whenISO) <= new Date()).sort((a,b)=> new Date(b.whenISO) - new Date(a.whenISO))[0] || null;
  const canOrderBalls = nextRound && nextRound.hours > 48;

  function Page({ title, subtitle, children }) {
    return (
      <div className="min-h-screen pb-28 bg-brandbg">
        <header className="p-4 text-white" style={{ background: THEME.header, borderBottom: `3px solid ${THEME.gold}` }}>
          <h1 className="text-xl font-semibold">Yorkshire Golf Passport</h1>
          {title && <p className="text-sm mt-1 opacity-95">{title}</p>}
          {subtitle && <p className="text-xs opacity-90">{subtitle}</p>}
        </header>
        <main className="p-4 max-w-xl mx-auto text-[color:var(--brandtext)]">{children}</main>
      </div>
    );
  }

  if (step === "WELCOME") {
    return (
      <Page title="Play one hundred Yorkshire courses with one flexible membership" subtitle="Choose a travel radius pick your favourites spend credits by category and upgrade any time">
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

  if (step === "SIGNUP") {
    return (
      <Page title="Create your profile" subtitle="We use this to tailor courses and travel distance. You can update later">
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
        <StickyFooter canContinue={true} onContinue={() => { 
          setProfile(p => ({ 
            ...p, 
            name: nameRef.current?.value || "", 
            email: emailRef.current?.value || "", 
            dob: dobRef.current?.value || "", 
            postcode: postcodeRef.current?.value || "LS1 1AA", 
            handicap: Number(handicapRef.current?.value || 18) 
          })); 
          setStep("RADIUS"); 
        }} note="Next choose your travel radius" />
      </Page>
    );
  }

  if (step === "RADIUS") {
    const presets = [10,20,30,40,50,75,100];
    return (
      <Page title="Choose your travel radius" subtitle="We show courses inside your chosen distance from home">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {presets.map(m => (
            <button key={m} onClick={()=>setProfile({...profile, radius:m})} className={`py-2 rounded-xl border ${profile.radius===m?"border-green-600 bg-green-50":"bg-white"}`} style={{ borderColor: THEME.border }}>{m} miles</button>
          ))}
        </div>
        <p className="text-sm mb-2 text-[color:#6B7280]">Courses in range right now {byDistance.length}</p>
        <div className="divide-y rounded-2xl border mb-6 bg-white" style={{ borderColor: THEME.border }}>
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
        <StickyFooter canContinue={true} onContinue={()=>setStep("FREQUENCY")} note="Next pick how often you play" />
      </Page>
    );
  }

  if (step === "FREQUENCY") {
    const cards = [
      { id: "starter", title: "Occasional golfer" },
      { id: "core", title: "Regular golfer" },
      { id: "enthusiast", title: "Avid golfer" },
      { id: "elite", title: "High frequency" },
    ];
    const banks = getCategoryBanks(50);
    return (
      <Page title="How often do you play" subtitle="Pick the package that fits your year. We show price credits and estimated round value">
        <div className="grid gap-3">
          {cards.map(c => {
            const p = PACKAGES.find(pp => pp.id === c.id);
            const m = packageMetrics(p);
            const selected = (p.id === "core");
            return (
              <div key={c.id} className={`text-left card ${selected?"border-green-600 bg-green-50":"bg-white"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold">{c.title}</div>
                  {c.id === "enthusiast" && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: THEME.gold, color: THEME.header }}>Recommended package</span>}
                </div>
                <div className="text-sm text-[color:#6B7280]">{p.name} • {p.credits} credits • £{p.price} • £{m.cpc.toFixed(2)} per credit</div>
                <div className="text-xs mt-1 text-[color:#6B7280]">Est round cost Signature £{m.sig.toFixed(2)} Select £{m.sel.toFixed(2)} Classic £{m.cla.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-[color:#6B7280]">Your starting banks Signature {banks.Signature} Select {banks.Select} Classic {banks.Classic}</div>
        <div className="h-10" />
        <StickyFooter canContinue={true} onContinue={()=>setStep("ALLOCATE")} note="Next allocate rounds to courses inside your radius" />
      </Page>
    );
  }

  if (step === "ALLOCATE") {
    const banks = baseBanks;
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
      <Page title="Pick your courses and spend credits" subtitle="Each category has its own bank. Plus and minus adjust rounds. Caps prevent overuse">
        {bankCards}
        {section("Signature")}
        {section("Select")}
        {section("Classic")}
        <div className="h-14" />
        <StickyFooter canContinue={true} onContinue={()=>setStep("UPSELL")} note="You can adjust allocations later from the dashboard" />
      </Page>
    );
  }

  if (step === "UPSELL") {
    return (
      <Page title="Boost your season" subtitle="Optional extras that improve value for big days out">
        <div className="grid gap-3">
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
        </div>
        <div className="text-sm mt-3">Extras total £{addOnTotal}</div>
        <div className="h-10" />
        <StickyFooter canContinue={true} onContinue={()=>setStep("SUMMARY")} note="Review your membership then confirm" />
      </Page>
    );
  }

  if (step === "SUMMARY") {
    const banks = baseBanks;
    const pkgObj = pkg;
    const chosenAddOns = ADD_ONS.filter(a => selectedAddOns[a.id]);
    const total = pkgObj.price + addOnTotal;
    return (
      <Page title="Your membership" subtitle="This is a demo. Nothing will be submitted or charged">
        <div className="card mb-4">
          <div className="font-semibold">Package</div>
          <div className="text-sm text-[color:#6B7280]">{pkgObj.name} • {pkgObj.credits} credits • £{pkgObj.price}</div>
          <div className="text-xs mt-1 text-[color:#6B7280]">Banks Signature {banks.Signature} Select {banks.Select} Classic {banks.Classic}</div>
        </div>
        <div className="card mb-4">
          <div className="font-semibold mb-1">Add ons</div>
          {chosenAddOns.length === 0 ? (
            <div className="text-sm text-[color:#6B7280]">No add ons selected</div>
          ) : (
            <ul className="text-sm list-disc pl-5">
              {chosenAddOns.map(a => <li key={a.id}>{a.name} {a.price>0 && `• £${a.price}`}</li>)}
            </ul>
          )}
          <div className="text-sm mt-2">Extras total £{addOnTotal}</div>
        </div>
        <div className="card mb-4">
          <div className="font-semibold">Total</div>
          <div className="text-lg">£{total}</div>
        </div>
        <button className="w-full py-3 btn-gold" onClick={()=>setStep("DASHBOARD")}>Confirm</button>
      </Page>
    );
  }

  if (step === "BOOK") {
    const c = COURSES.find(x => x.id === bookingDraft.courseId);
    return (
      <Page title="Confirm your round" subtitle="Pick a date and time then add optional extras">
        <div className="card mb-4">
          <div className="font-semibold mb-1">{c?.name}</div>
          <div className="text-sm text-[color:#6B7280]">{c?.city_area}</div>
          <div className="mt-3 grid gap-2">
            <input type="date" className="border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} value={bookingDraft.date} onChange={e=>setBookingDraft({...bookingDraft, date:e.target.value})} />
            <input type="time" className="border rounded-xl p-3 bg-white" style={{ borderColor: THEME.border }} value={bookingDraft.time} onChange={e=>setBookingDraft({...bookingDraft, time:e.target.value})} />
          </div>
        </div>
        <div className="card mb-4">
          <div className="font-semibold mb-2">Round extras</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, cart: !b.extras.cart} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.cart?"bg-green-50 border-green-600":""}`}>Golf cart</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, insurance: !b.extras.insurance} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.insurance?"bg-green-50 border-green-600":""}`}>Course insurance</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, meal: !b.extras.meal} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.meal?"bg-green-50 border-green-600":""}`}>Meal voucher</button>
            <button onClick={()=>setBookingDraft(b=>({ ...b, extras:{...b.extras, balls: !b.extras.balls} }))} className={`border rounded-xl p-3 ${bookingDraft.extras.balls?"bg-green-50 border-green-600":""}`}>Order balls</button>
          </div>
        </div>
        <button className="w-full py-3 btn-gold mb-3" onClick={confirmBooking}>Confirm booking</button>
        <button className="w-full py-3 rounded-2xl border" onClick={()=>setStep("DASHBOARD")}>Cancel</button>
      </Page>
    );
  }

  const greeting = profile.name ? `Welcome back ${profile.name}` : "Welcome back Golfer";
  const nextRoundObj = timeToNextRound();
  const lastCourse = null;
  const nextCourse = null;

  return (
    <Page title={greeting} subtitle="Book rounds track credits collect stamps">
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
        <div className="font-semibold mb-1">Your info</div>
        <div className="text-sm text-[color:#6B7280]">
          Current handicap {profile.handicap}
          <br />
          Last game {lastCourse ? `${lastCourse.name}` : "None yet"}
          <br />
          Next game {nextCourse ? `${nextCourse.name}` : "None yet"}
        </div>
      </section>

      <section className="card mb-4">
        <div className="font-semibold mb-2">Your courses</div>
        <div className="text-sm text-[color:#6B7280]">Allocate rounds to see courses here</div>
      </section>

      <section className="card mb-24">
        <div className="font-semibold mb-1">Credit banks</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-xl border" style={{ background: "#FFF8E6", borderColor: THEME.gold }}>Signature {bankRemaining.Signature}/{baseBanks.Signature}</div>
          <div className="p-2 rounded-xl border" style={{ background: "#EDF9F0", borderColor: "#3C7D4E" }}>Select {bankRemaining.Select}/{baseBanks.Select}</div>
          <div className="p-2 rounded-xl border" style={{ background: "#F2FBF2", borderColor: "#8BC79A" }}>Classic {bankRemaining.Classic}/{baseBanks.Classic}</div>
        </div>
        <div className="text-xs mt-2 text-[color:#6B7280]">Need flexibility later Use buy more credits</div>
        <button className="mt-2 btn-gold" onClick={()=>{
          alert("In the demo, use the Allocate step to change your mix. A buy flow will be added later.");
        }}>Buy more credits</button>
      </section>

      <div className="fixed inset-x-0 bottom-0 p-3 bg-white" style={{ borderTop: `1px solid ${THEME.border}` }}>
        <button className="w-full py-3 rounded-2xl border" onClick={()=>setStep("ALLOCATE")}>Adjust allocations</button>
      </div>
    </Page>
  );
}
