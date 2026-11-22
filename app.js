const fallbackEvents = [
 {date:"2026-11-21",store:"Empire Games",type:"Challenge",time:"10:00",price:"",url:"https://www.empiregames.es/producto/pokemon-vgc-league-challenge-sabado-21-11-26-1000h",name:"League Challenge"},
 {date:"2026-11-22",store:"Jupiter",type:"Challenge",time:"",price:"",url:"https://jupiterjuegos.com/tiendas/actividad-pagar/796/",name:"League Challenge"},
 {date:"2026-12-12",store:"Empire Games",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2026-12-13",store:"Holoplaza",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2026-12-19",store:"Tiny",type:"Challenge",time:"11:00",price:"6 €",url:"",name:"League Challenge"},
 {date:"2026-12-26",store:"Tiny",type:"Especial",time:"11:00",price:"6 €",url:"",name:"Especial Navidad"},
 {date:"2027-01-02",store:"Tiny",type:"Especial",time:"11:00",price:"6 €",url:"",name:"Especial Año Nuevo"},
 {date:"2027-01-09",store:"Empire Games",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2027-01-10",store:"Holoplaza",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2027-01-16",store:"Tiny",type:"Challenge",time:"11:00",price:"6 €",url:"",name:"League Challenge"},
 {date:"2027-02-06",store:"Tiny",type:"Cup",time:"10:00",price:"12 €",url:"",name:"League Cup"},
 {date:"2027-02-06",store:"Tiny",type:"Challenge",time:"17:00",price:"6 €",url:"",name:"League Challenge"},
 {date:"2027-02-06",store:"Empire Games",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2027-02-07",store:"Holoplaza",type:"Challenge",time:"10:00",price:"",url:"",name:"League Challenge"},
 {date:"2027-02-13",store:"Tiny",type:"Especial",time:"17:00",price:"6 €",url:"",name:"Especial San Valentín"},
 {date:"2027-02-13",store:"Empire Games",type:"Cup",time:"10:00",price:"",url:"",name:"League Cup"},
 {date:"2027-02-14",store:"Holoplaza",type:"Cup",time:"10:00",price:"",url:"",name:"League Cup"}
];
let events = [...fallbackEvents];
let currentMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
let selectedDate = null;
const $ = s => document.querySelector(s);
// Normaliza fechas procedentes de CSV de Google Sheets (ISO, DD/MM/AAAA o serial de Excel).
function normalizeDate(value){
 const s=String(value??"").trim();
 if(!s) return "";
 let m=s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
 if(m) return `${m[1]}-${pad(Number(m[2]))}-${pad(Number(m[3]))}`;
 m=s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
 if(m) return `${m[3]}-${pad(Number(m[2]))}-${pad(Number(m[1]))}`;
 if(/^\d+(\.\d+)?$/.test(s)){
  const serial=Number(s);
  if(serial>20000 && serial<80000){const d=new Date(Date.UTC(1899,11,30)+serial*86400000);return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;}
 }
 return "";
}
const dateObj = s => { const normalized=normalizeDate(s); if(!normalized)return new Date(NaN); const [y,m,d]=normalized.split("-").map(Number); return new Date(y,m-1,d); };
const todayISO = () => {const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;};
const eventEnd = e => normalizeDate(e.endDate || e.date) || normalizeDate(e.date);
const isPast = e => eventEnd(e) < todayISO();
const occursOn = (e, dayISO) => normalizeDate(e.date) <= dayISO && eventEnd(e) >= dayISO;
const displayDate = e => eventEnd(e) !== normalizeDate(e.date) ? `${fmtDate(e.date)} – ${fmtDate(eventEnd(e))}` : fmtDate(e.date);
const pad = n => String(n).padStart(2,"0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDate = s => dateObj(s).toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"});
const fmtShort = s => dateObj(s).toLocaleDateString("es-ES",{day:"2-digit",month:"short"}).replace(".","").toUpperCase();
const typeClass = t => {const v=String(t).toLowerCase();return v==="cup"?"cup":v==="especial"?"special":v==="regional"?"regional":v==="special event"?"special-event":v==="internacional"?"internacional":"challenge";};
const typeLabel = t => t==="Especial"?"Especial":t;
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function eventTitle(e){return e.name || (e.type==="Cup"?"League Cup":e.type==="Challenge"?"League Challenge":e.type==="Regional"?"Regional":e.type==="Special Event"?"Special Event":e.type==="Internacional"?"Campeonato Internacional":"Evento especial");}
function sorted(list){return [...list].sort((a,b)=>a.date.localeCompare(b.date)||(a.time||"").localeCompare(b.time||""));}
function registerLink(e,cls="register-link"){return e.url?`<a class="${cls}" href="${esc(e.url)}" target="_blank" rel="noopener">INSCRIPCIÓN / INFO <span>↗</span></a>`:`<span class="${cls} disabled">ENLACE PRÓXIMAMENTE</span>`;}
function card(e){return `<article class="event-card type-${typeClass(e.type)}"><div class="card-topline"></div><div class="card-body"><div class="card-meta"><span class="type-pill">${esc(typeLabel(e.type))}</span><span class="card-date">${esc(eventEnd(e)!==normalizeDate(e.date)?`${fmtShort(e.date)} – ${fmtShort(eventEnd(e))}`:fmtShort(e.date))}</span></div><h3>${esc(e.store)}</h3><div class="event-subtitle">${esc(eventTitle(e))}</div><div class="card-details"><span>◷ ${esc(e.time||"Hora por confirmar")}</span><span>€ ${esc(e.price||"Precio por confirmar")}</span></div></div><div class="card-footer">${registerLink(e)}</div></article>`;}
function listRow(e){const d=dateObj(e.date),past=isPast(e);return `<article class="list-event ${past?"is-past":""}"><div class="list-date"><strong>${d.getDate()}</strong><span>${d.toLocaleDateString("es-ES",{month:"short"}).replace(".","").toUpperCase()}</span></div><div class="list-main"><h3>${esc(e.store)} · ${esc(eventTitle(e))}</h3><p>${esc(displayDate(e))} · ${esc(e.time||"Hora por confirmar")} · ${esc(e.type)}</p>${e.winner?`<p class="winner-line">🏆 Ganador: <strong>${esc(e.winner)}</strong></p>`:""}</div><div class="list-tags"><span class="type-pill">${esc(e.type)}</span><span class="list-price">${esc(e.price||"Precio por confirmar")}</span>${past?'<span class="status-pill">REALIZADO</span>':""}</div>${past?'<span class="list-action completed-label">TORNEO REALIZADO</span>':registerLink(e,"list-action")}</article>`;}
function renderFeatured(){const upcoming=sorted(events.filter(e=>!isPast(e))).slice(0,3);$("#featured-events").innerHTML=upcoming.length?upcoming.map(card).join(""):`<div class="empty-state">No hay próximos torneos publicados.</div>`;}
function renderStats(){ $("#stat-events").textContent=events.length; $("#stat-stores").textContent=new Set(events.map(e=>e.store)).size; }
function renderList(){const status=$("#status-filter").value,store=$("#store-filter").value,type=$("#type-filter").value,q=$("#search-filter").value.trim().toLowerCase();const filtered=sorted(events).filter(e=>(!status||(status==="past"?isPast(e):!isPast(e)))&&(!store||e.store===store)&&(!type||e.type===type)&&(!q||[e.store,e.name,e.type].join(" ").toLowerCase().includes(q)));$("#all-events").innerHTML=filtered.map(listRow).join("");$("#result-count").textContent=`${filtered.length} ${filtered.length===1?"EVENTO":"EVENTOS"}`;$("#empty-state").hidden=filtered.length>0;}
function populateStores(){const sel=$("#store-filter"),v=sel.value;sel.innerHTML='<option value="">Todas las tiendas</option>'+[...new Set(events.map(e=>e.store))].sort().map(s=>`<option>${esc(s)}</option>`).join("");sel.value=v;}
function renderCalendar(){const y=currentMonth.getFullYear(),m=currentMonth.getMonth();$("#month-label").textContent=currentMonth.toLocaleDateString("es-ES",{month:"long",year:"numeric"}).toUpperCase();const first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),prevDays=new Date(y,m,0).getDate();let html="";for(let i=0;i<42;i++){let day,month=m+1,year=y,muted=false;if(i<start){day=prevDays-start+i+1;month=m;muted=true;}else if(i>=start+days){day=i-start-days+1;month=m+2;muted=true;}else day=i-start+1;if(month===0){month=12;year=y-1;}if(month===13){month=1;year=y+1;}const d=`${year}-${pad(month)}-${pad(day)}`,ev=sorted(events.filter(e=>occursOn(e,d)));const selected=selectedDate===d;const dots=ev.slice(0,2).map(e=>`<span class="day-event ${typeClass(e.type)} ${isPast(e)?"past":""}">${esc(e.store)} · ${esc(e.type)}</span>`).join("");html+=`<button class="calendar-day ${muted?"muted":""} ${selected?"selected":""}" data-date="${d}"><span class="day-number">${day}</span>${dots}${ev.length>2?`<span class="more-events">+${ev.length-2} más</span>`:""}</button>`;}$("#calendar-grid").innerHTML=html;$("#calendar-grid").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{selectedDate=b.dataset.date;renderCalendar();renderSelectedDay();}));}
function renderSelectedDay(){const host=$("#selected-day-events");if(!selectedDate){host.innerHTML="";return;}const ev=sorted(events.filter(e=>occursOn(e,selectedDate)));host.innerHTML=ev.length?`<div class="selected-day-card"><strong>${esc(fmtDate(selectedDate))}</strong><div class="selected-day-list">${ev.map(e=>`<div class="selected-day-event"><span>${esc(e.store)} · ${esc(eventTitle(e))}${eventEnd(e)!==normalizeDate(e.date)?` · ${esc(displayDate(e))}`:""}${e.time?` · ${esc(e.time)}`:""}</span>${e.winner?`<span class="winner-line">🏆 Ganador: <strong>${esc(e.winner)}</strong></span>`:""}${isPast(e)?'<span class="status-pill">REALIZADO</span>':registerLink(e,"selected-register")}</div>`).join("")}</div></div>`:`<div class="selected-day-card"><strong>${esc(fmtDate(selectedDate))}</strong><span>No hay torneos publicados para este día.</span></div>`;}
function parseCSV(text){
 const rows=[];let row=[],cell="",quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i],n=text[i+1];
  if(c==='"'&&quoted&&n==='"'){cell+='"';i++;}
  else if(c==='"'){quoted=!quoted;}
  else if(c===","&&!quoted){row.push(cell);cell="";}
  else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&n==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell="";}
  else cell+=c;
 }
 row.push(cell);if(row.some(x=>x.trim()))rows.push(row);
 const headers=rows.shift().map(x=>x.replace(/^\uFEFF/,"").trim().toLowerCase());
 return rows
  .map(r=>Object.fromEntries(headers.map((h,i)=>[h,(r[i]||"").trim()])))
  .filter(r=>r.fecha||r.date)
  .map(r=>({date:normalizeDate(r.fecha||r.date),endDate:normalizeDate(r.fecha_fin||r.fechafin||r.end_date||r.enddate||r.hasta||"")||normalizeDate(r.fecha||r.date),store:r.tienda||r.store,type:r.modalidad||r.tipo||r.type,time:r.hora||r.time,price:r.precio||r.price,url:r.inscripcion||r.enlace||r.url,name:r.nombre||r.torneo||r.name||"",winner:r.ganador||r.winner||""}))
  .filter(r=>r.date&&r.store&&r.type);
}
async function loadSheet(){const url=window.SEVILLA_VGC_CONFIG?.SHEET_CSV_URL;if(!url)return;try{const res=await fetch(url);if(!res.ok)throw new Error("No se pudo cargar la hoja");const data=parseCSV(await res.text());if(data.length)events=data;}catch(err){console.warn("Se mantienen los torneos incluidos en la web:",err);}}
function init(){const cfg=window.SEVILLA_VGC_CONFIG||{};if(cfg.WHATSAPP_URL)$("#whatsapp-link").href=cfg.WHATSAPP_URL;$("#prev-month").addEventListener("click",()=>{currentMonth=new Date(currentMonth.getFullYear(),currentMonth.getMonth()-1,1);renderCalendar();});$("#next-month").addEventListener("click",()=>{currentMonth=new Date(currentMonth.getFullYear(),currentMonth.getMonth()+1,1);renderCalendar();});["status-filter","store-filter","type-filter","search-filter"].forEach(id=>$("#"+id).addEventListener(id==="search-filter"?"input":"change",renderList));$("#clear-filters").addEventListener("click",()=>{$("#status-filter").value="";$("#store-filter").value="";$("#type-filter").value="";$("#search-filter").value="";renderList();});loadSheet().then(()=>{populateStores();renderStats();renderFeatured();renderList();renderCalendar();});}
init();
