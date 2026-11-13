// ===== Gymplified illustrations =====
// Every picture in the app is an inline SVG built here: no image downloads, nothing third-party, and no
// style attributes (the page's Content-Security-Policy only allows styles from app.css). Colours are SVG
// presentation attributes; sizes come from the .art classes in app.css.
// All markup in this file is fixed text written by us. Nothing a user typed is ever placed inside it.

const ART_GOLD='#f2c14e',ART_GOLD_DARK='#b07d1e',ART_GOLD_LIGHT='#ffe08a',ART_INK='#2b2110';

// 48 x 48 icons.
const ART={
 flame:'<path d="M24 5c2 8 12 12 12 24a12 12 0 0 1-24 0c0-6 3-9 5.5-11 .3 3.5 1.5 5.5 3 6.5 0-7 1.5-14 3.5-19.500z" fill="#ff8a1f"/><path d="M24 25c1.5 4 6 6 6 10.500a6 6 0 0 1-12 0c0-4.5 4.5-6.5 6-10.500z" fill="#ffd23f"/>',
 freeze:'<circle cx="24" cy="24" r="20" fill="#4cc2ff" stroke="#1e90d6" stroke-width="2"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M24 10v28M11.9 17l24.2 14M11.9 31l24.2-14"/><path d="M20 12.500l4 4 4-4M20 35.500l4-4 4 4"/></g>',
 bolt:'<circle cx="24" cy="24" r="20" fill="#f2c14e" stroke="#b07d1e" stroke-width="2"/><path d="M27 8 13 27h9l-2 13 15-20h-9z" fill="#fff8e1" stroke="#b07d1e" stroke-width="2" stroke-linejoin="round"/>',
 trophy:'<path d="M15 11H9v3a7 7 0 0 0 7 7M33 11h6v3a7 7 0 0 1-7 7" fill="none" stroke="#b07d1e" stroke-width="3" stroke-linecap="round"/><path d="M15 8h18v10a9 9 0 0 1-18 0z" fill="#f2c14e"/><path d="M21 26h6v7h-6z" fill="#b07d1e"/><path d="M15 32h18a2 2 0 0 1 2 2v6H13v-6a2 2 0 0 1 2-2z" fill="#8a5a22"/><path d="M19 11v7a5 5 0 0 0 2 4" fill="none" stroke="#ffe08a" stroke-width="2.5" stroke-linecap="round"/>',
 dumbbell:'<rect x="14" y="21" width="20" height="6" rx="2" fill="#8b8f98"/><rect x="8" y="12" width="8" height="24" rx="3" fill="#f2c14e"/><rect x="32" y="12" width="8" height="24" rx="3" fill="#f2c14e"/><rect x="3" y="17" width="6" height="14" rx="2.5" fill="#b07d1e"/><rect x="39" y="17" width="6" height="14" rx="2.5" fill="#b07d1e"/><rect x="10" y="15" width="2.5" height="9" rx="1.2" fill="#ffe08a"/>',
 drop:'<path d="M24 4c7 9 13 15 13 23a13 13 0 0 1-26 0c0-8 6-14 13-23z" fill="#4cc2ff"/><path d="M17 27a7 7 0 0 0 5 7" fill="none" stroke="#e6f7ff" stroke-width="3" stroke-linecap="round"/>',
 apple:'<path d="M24 14c-3-3-13-3-13 8 0 9 5 19 9 19 2 0 2.5-1 4-1s2 1 4 1c4 0 9-10 9-19 0-11-10-11-13-8z" fill="#ff5d5d"/><path d="M24 14c0-4 2-7 5-8" fill="none" stroke="#8a5a22" stroke-width="2.5" stroke-linecap="round"/><path d="M27 9c2-4 7-4 9-3-1 4-5 6-9 3z" fill="#58cc6b"/><path d="M16 22c0-2 1.5-4 4-4" fill="none" stroke="#ffc2c2" stroke-width="2.5" stroke-linecap="round"/>',
 target:'<circle cx="24" cy="24" r="20" fill="#ff5d5d"/><circle cx="24" cy="24" r="14" fill="#fff"/><circle cx="24" cy="24" r="8" fill="#ff5d5d"/><circle cx="24" cy="24" r="3" fill="#fff"/>',
 calendar:'<rect x="6" y="9" width="36" height="32" rx="6" fill="#fff4d6"/><path d="M6 15a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v5H6z" fill="#ff5d5d"/><rect x="14" y="5" width="4" height="9" rx="2" fill="#8a5a22"/><rect x="30" y="5" width="4" height="9" rx="2" fill="#8a5a22"/><path d="m16 30 5 5 11-11" fill="none" stroke="#2f9e44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
 chest:'<path d="M6 21a11 11 0 0 1 11-11h14a11 11 0 0 1 11 11v2H6z" fill="#b07d1e"/><rect x="6" y="22" width="36" height="19" rx="3" fill="#8a5a22"/><path d="M13 11v30M35 11v30" stroke="#f2c14e" stroke-width="3"/><path d="M6 22.500h36" stroke="#5e3b12" stroke-width="2"/><rect x="20" y="18" width="8" height="10" rx="2" fill="#f2c14e"/><circle cx="24" cy="23" r="1.7" fill="#5e3b12"/>',
 chestOpen:'<path d="M9 25 13 14h22l4 11z" fill="#ffe08a"/><path d="M8 13a9 9 0 0 1 9-9h14a9 9 0 0 1 9 9v2H8z" fill="#b07d1e"/><path d="M14 5v10M34 5v10" stroke="#f2c14e" stroke-width="3"/><rect x="6" y="25" width="36" height="17" rx="3" fill="#8a5a22"/><path d="M13 25v17M35 25v17" stroke="#f2c14e" stroke-width="3"/><rect x="20" y="25" width="8" height="8" rx="2" fill="#f2c14e"/><path d="m24 15.5 1.1 2.4 2.4 1.1-2.4 1.100L24 22.500l-1.1-2.4-2.4-1.1 2.4-1.100z" fill="#fff"/>',
 star:'<path d="m24 4 6 12.5 13.5 1.8-9.9 9.4 2.5 13.500L24 34.600l-12.1 6.6 2.5-13.5-9.9-9.400L18 16.500z" fill="#f2c14e" stroke="#b07d1e" stroke-width="2" stroke-linejoin="round"/>',
 crown:'<path d="m6 16 8 8 10-14 10 14 8-8-4 20H10z" fill="#f2c14e" stroke="#b07d1e" stroke-width="2" stroke-linejoin="round"/><rect x="10" y="36" width="28" height="5" rx="2" fill="#b07d1e"/><circle cx="24" cy="29" r="3" fill="#ff5d5d"/>',
 check:'<circle cx="24" cy="24" r="20" fill="#58cc6b"/><path d="m14 24.5 7 7 13-14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
 lock:'<path d="M15 21v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#8b8f98" stroke-width="4"/><rect x="9" y="21" width="30" height="22" rx="5" fill="#b3b7bf"/><circle cx="24" cy="31" r="3.5" fill="#5c6068"/>',
 people:'<circle cx="33" cy="18" r="6.5" fill="#4cc2ff"/><path d="M27 41a11 11 0 0 1 18 0z" fill="#4cc2ff"/><circle cx="17" cy="16" r="8" fill="#f2c14e"/><path d="M3 41a14 14 0 0 1 28 0z" fill="#f2c14e"/>',
 chart:'<rect x="5" y="5" width="38" height="38" rx="8" fill="#2f9e44"/><path d="m11 32 8-9 6 5 12-14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="37" cy="14" r="3.5" fill="#ffd23f"/>',
 gear:'<g fill="#8b8f98"><rect x="20.5" y="3" width="7" height="42" rx="2.5"/><rect x="20.5" y="3" width="7" height="42" rx="2.5" transform="rotate(60 24 24)"/><rect x="20.5" y="3" width="7" height="42" rx="2.5" transform="rotate(120 24 24)"/><circle cx="24" cy="24" r="14"/></g><circle cx="24" cy="24" r="6" fill="#fff4d6"/>',
 user:'<circle cx="24" cy="24" r="20" fill="#4cc2ff"/><circle cx="24" cy="19" r="7" fill="#fff"/><path d="M11 38a13 13 0 0 1 26 0 20 20 0 0 1-26 0z" fill="#fff"/>',
 sparkle:'<path d="m22 4 4.5 12.500L39 21l-12.5 4.500L22 38l-4.5-12.500L5 21l12.5-4.500z" fill="#f2c14e"/><path d="m38 30 1.8 4.200L44 36l-4.2 1.800L38 42l-1.8-4.200L32 36l4.2-1.800z" fill="#ffe08a"/>',
 sun:'<g stroke="#ff8a1f" stroke-width="4" stroke-linecap="round"><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.900l4.2 4.200M33.9 33.900l4.2 4.200M9.9 38.100l4.2-4.200M33.9 14.100l4.2-4.2"/></g><circle cx="24" cy="24" r="10" fill="#ffd23f"/>',
 moon:'<path d="M32 6a19 19 0 1 0 10 26A16 16 0 0 1 32 6z" fill="#a78bfa"/><circle cx="37" cy="13" r="2" fill="#ffe08a"/><circle cx="42" cy="21" r="1.3" fill="#ffe08a"/>',
 compass:'<circle cx="24" cy="24" r="19" fill="#fff4d6" stroke="#8a5a22" stroke-width="3"/><path d="m32 16-5 11-6-6z" fill="#ff5d5d"/><path d="m16 32 5-11 6 6z" fill="#4cc2ff"/><circle cx="24" cy="24" r="2" fill="#2b2110"/>',
 plate:'<circle cx="24" cy="24" r="20" fill="#5c6068"/><circle cx="24" cy="24" r="14" fill="none" stroke="#8b8f98" stroke-width="2"/><circle cx="24" cy="24" r="5" fill="#f2c14e"/>',
 flag:'<path d="M12 5v38" stroke="#8a5a22" stroke-width="4" stroke-linecap="round"/><path d="M14 7h24l-6 8 6 8H14z" fill="#58cc6b"/>',
 timer:'<rect x="20" y="3" width="8" height="5" rx="2" fill="#8b8f98"/><circle cx="24" cy="27" r="17" fill="#fff4d6" stroke="#8b8f98" stroke-width="3"/><path d="M24 17v10l6 4" fill="none" stroke="#ff5d5d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
};

function artSvg(inner,cls,box){return '<svg class="art'+(cls?' '+cls:'')+'" viewBox="0 0 '+(box||'48 48')+'" aria-hidden="true" focusable="false">'+inner+'</svg>';}
// One icon by name. Unknown names fall back to the star so a typo never leaves a hole in the page.
function art(name,cls){return artSvg(ART[name]||ART.star,cls);}

// --- Mascot: a friendly gold kettlebell. Moods: happy, cheer, focused, sleepy. ---
const MASCOT_BODY='<path d="M38 54c-9-22 3-40 22-40s31 18 22 40" fill="none" stroke="#b07d1e" stroke-width="11" stroke-linecap="round"/><ellipse cx="60" cy="76" rx="41" ry="36" fill="#f2c14e"/><path d="M20 84a41 36 0 0 0 80 0 46 30 0 0 1-80 0z" fill="#d9a436"/><ellipse cx="40" cy="57" rx="9" ry="4.5" fill="#ffe7a3" transform="rotate(-32 40 57)"/>';
const MASCOT_EYES='<ellipse cx="47" cy="74" rx="8" ry="9" fill="#fff"/><ellipse cx="73" cy="74" rx="8" ry="9" fill="#fff"/><circle cx="49" cy="75" r="4.3" fill="#2b2110"/><circle cx="75" cy="75" r="4.3" fill="#2b2110"/><circle cx="50.6" cy="73.3" r="1.5" fill="#fff"/><circle cx="76.6" cy="73.3" r="1.5" fill="#fff"/>';
const MASCOT_CHEEKS='<ellipse cx="36" cy="86" rx="5" ry="3" fill="#ff8a6b" opacity=".55"/><ellipse cx="84" cy="86" rx="5" ry="3" fill="#ff8a6b" opacity=".55"/>';
const MASCOT_FACES={
 happy:MASCOT_EYES+MASCOT_CHEEKS+'<path d="M52 88q8 7 16 0" fill="none" stroke="#2b2110" stroke-width="3.5" stroke-linecap="round"/>',
 cheer:'<path d="M21 68 9 50M99 68l12-18" stroke="#b07d1e" stroke-width="7" stroke-linecap="round"/><circle cx="8" cy="48" r="5.5" fill="#f2c14e"/><circle cx="112" cy="48" r="5.5" fill="#f2c14e"/>'+MASCOT_EYES+MASCOT_CHEEKS+'<path d="M50 86h20a10 10 0 0 1-20 0z" fill="#2b2110"/><path d="M55 92.500a6 4 0 0 1 10 0 8 8 0 0 1-10 0z" fill="#ff7a8a"/><path d="m18 18 1.8 4.200L24 24l-4.2 1.800L18 30l-1.8-4.200L12 24l4.2-1.800zM102 12l1.5 3.500L107 17l-3.5 1.500L102 22l-1.5-3.500L97 17l3.5-1.500z" fill="#ffe08a"/>',
 focused:'<path d="M21 66q39-17 78 0" fill="none" stroke="#ff5d5d" stroke-width="7" stroke-linecap="round"/>'+MASCOT_EYES+'<path d="M38 62l15 4M82 62l-15 4" stroke="#2b2110" stroke-width="3.5" stroke-linecap="round"/><path d="M53 89q7 4 14 0" fill="none" stroke="#2b2110" stroke-width="3.5" stroke-linecap="round"/><path d="M100 58c2.5 3.5 4 5.5 4 7.500a4 4 0 0 1-8 0c0-2 1.5-4 4-7.500z" fill="#4cc2ff"/>',
 sleepy:MASCOT_CHEEKS+'<path d="M40 75q7 5 14 0M66 75q7 5 14 0" fill="none" stroke="#2b2110" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="60" cy="89" rx="3.5" ry="3" fill="#2b2110"/><path d="M92 30h9l-9 10h9M104 14h6l-6 7h6" fill="none" stroke="#a78bfa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
};
function mascot(mood,cls){const face=MASCOT_FACES[mood]||MASCOT_FACES.happy;return artSvg(MASCOT_BODY+face,'mascot mascot-'+(MASCOT_FACES[mood]?mood:'happy')+(cls?' '+cls:''),'120 120');}

// --- Medallions for badges ---
const BADGE_TIERS={bronze:['#d9935a','#9a5b2c'],silver:['#cfd6dd','#8d97a3'],gold:['#f2c14e','#b07d1e'],diamond:['#7ee0f2','#2a9bb5'],ruby:['#ff7a8a','#c23a4d']};
// Which picture, metal and label each badge wears. Badges missing from this list still get a gold star.
const BADGE_ART={
 first:['flag','bronze'],ws:['dumbbell','bronze'],ws10:['dumbbell','silver','10'],ws50:['dumbbell','gold','50'],ws100:['dumbbell','diamond','100'],ws250:['dumbbell','ruby','250'],
 pr:['trophy','bronze'],pr10:['trophy','silver','10'],pr25:['trophy','gold','25'],pr5m:['bolt','gold','×5'],
 vol10:['plate','bronze','10t'],vol50:['plate','silver','50t'],vol100:['plate','gold','100t'],
 w2:['calendar','bronze','2'],w4:['calendar','silver','4'],w8:['calendar','gold','8'],w12:['crown','diamond','12'],
 d7:['flame','bronze','7'],d30:['flame','gold','30'],d100:['flame','ruby','100'],
 h2o:['drop','bronze'],h2o7:['drop','silver','7'],h2o30:['drop','gold','30'],h2o100:['drop','diamond','100'],
 food30:['apple','silver','30'],early:['sun','gold'],night:['moon','gold'],explore:['compass','silver','25'],
 l5:['star','bronze','5'],l10:['star','silver','10'],l20:['star','gold','20'],fr:['people','bronze']
};
function badgeArt(id,got,cls){
 const spec=BADGE_ART[id]||['star','gold'],tier=BADGE_TIERS[spec[1]]||BADGE_TIERS.gold,label=spec[2]||'';
 const ribbon='<path d="M19 44 12 62l9-3 5 5 5-16zM45 44l7 18-9-3-5 5-5-16z" fill="'+(got?'#ff5d5d':'#8b8f98')+'"/>';
 const disc='<circle cx="32" cy="28" r="26" fill="'+tier[0]+'" stroke="'+tier[1]+'" stroke-width="3"/><circle cx="32" cy="28" r="19.5" fill="#fff8e6" stroke="'+tier[1]+'" stroke-width="1.5"/>';
 const glyph='<g transform="translate(18 14) scale(.5833)">'+(ART[spec[0]]||ART.star)+'</g>';
 const tag=label?'<rect x="'+(32-(label.length*4+7))+'" y="42" width="'+(label.length*8+14)+'" height="15" rx="7.5" fill="'+tier[1]+'"/><text class="art-text" x="32" y="53.3" text-anchor="middle" font-size="11" fill="#fff">'+label+'</text>':'';
 const lock=got?'':'<g transform="translate(40 36) scale(.46)">'+ART.lock+'</g>';
 return artSvg(ribbon+'<g class="medallion-face">'+disc+glyph+tag+'</g>'+lock,'medallion'+(got?'':' is-locked')+(cls?' '+cls:''),'64 66');
}

// --- Rank shield: the colour follows the level title (Rookie … Legend) ---
const RANK_COLOURS=[['#d9935a','#9a5b2c'],['#cfd6dd','#8d97a3'],['#f2c14e','#b07d1e'],['#58cc6b','#2f9e44'],['#4cc2ff','#1e90d6'],['#a78bfa','#6d4fd6'],['#ff7a8a','#c23a4d'],['#ffd23f','#c9820a']];
const RANK_FROM=[1,3,5,8,12,16,20,30];
function rankTier(level){let tier=0;RANK_FROM.forEach((from,i)=>{if(level>=from)tier=i;});return tier;}
function rankShield(level,cls){
 const n=Math.max(1,Math.round(Number(level)||1)),c=RANK_COLOURS[rankTier(n)],text=String(n);
 return artSvg((rankTier(n)===RANK_COLOURS.length-1?'<g transform="translate(14 -3) scale(.42)">'+ART.crown+'</g>':'')+
  '<path d="M24 5 42 11v12c0 10.5-7.5 17.5-18 22C13.5 40.5 6 33.5 6 23V11z" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.5" stroke-linejoin="round"/>'+
  '<path d="M24 9.5 37.5 14v9c0 8-5.5 13.5-13.5 17.300z" fill="#fff" opacity=".22"/>'+
  '<text class="art-text" x="24" y="'+(text.length>2?29.5:30.5)+'" text-anchor="middle" font-size="'+(text.length>2?13:text.length>1?16:19)+'" fill="'+ART_INK+'">'+text+'</text>','rank-shield'+(cls?' '+cls:''));
}

// --- Leaderboard medals for places 1 to 3 ---
function medalArt(rank){
 const c=[BADGE_TIERS.gold,BADGE_TIERS.silver,BADGE_TIERS.bronze][rank-1];if(!c)return '';
 return artSvg('<path d="M13 3h9l4 15h-9zM35 3h-9l-4 15h9z" fill="#ff5d5d"/><circle cx="24" cy="31" r="13.5" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="2.5"/><text class="art-text" x="24" y="36.5" text-anchor="middle" font-size="16" fill="'+ART_INK+'">'+rank+'</text>','medal');
}

// --- Progress ring. pct is clamped to 0–100; the ring starts at 12 o'clock. ---
function ringArt(pct,cls){
 const p=Math.max(0,Math.min(100,Number(pct)||0)),r=52,c=2*Math.PI*r,on=(c*p/100).toFixed(1);
 return artSvg('<circle class="ring-track" cx="60" cy="60" r="'+r+'" fill="none" stroke-width="12"/>'+
  (p>0?'<circle class="ring-value" cx="60" cy="60" r="'+r+'" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+on+' '+(c-on).toFixed(1)+'" transform="rotate(-90 60 60)"/>':''),'ring'+(cls?' '+cls:''),'120 120');
}

// --- A glass that fills with the day's water ---
function waterGlassArt(pct){
 const p=Math.max(0,Math.min(100,Number(pct)||0)),top=58-p/100*48,edge=y=>(y-6)/52*5,x1=(9+edge(top)).toFixed(1),x2=(39-edge(top)).toFixed(1);
 return artSvg((p>0?'<path d="M'+x1+' '+top.toFixed(1)+'H'+x2+'L34.5 58h-21z" fill="#4cc2ff"/><path d="M'+x1+' '+top.toFixed(1)+'H'+x2+'" stroke="#bfe9ff" stroke-width="2.5" stroke-linecap="round"/>':'')+
  '<path d="M8 5h32l-5 54H13z" fill="none" stroke="#8fb9d6" stroke-width="3" stroke-linejoin="round"/><path d="M14 12l2.5 28" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".45"/>'+
  (p>=100?'<g transform="translate(26 0) scale(.42)">'+ART.check+'</g>':''),'water-glass','48 64');
}

// Fills the static placeholders in index.html: <span data-art="trophy"></span> or data-mascot="happy".
function hydrateArt(root){
 const scope=root||document;
 scope.querySelectorAll('[data-art]').forEach(el=>{if(!el.firstElementChild)el.innerHTML=art(el.dataset.art);});
 scope.querySelectorAll('[data-mascot]').forEach(el=>{if(!el.firstElementChild)el.innerHTML=mascot(el.dataset.mascot);});
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>hydrateArt());else hydrateArt();}
