(()=>{
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY="jk_reports",STN=["Terkirim","Diverifikasi","Disurvei","Dalam perbaikan","Selesai"];
const CENTER=[-6.2349,106.9896];
/* Sumber gambar peta tanpa API key. Dicoba berurutan: bila 4 kotak pertama gagal dimuat, otomatis pindah ke sumber berikutnya.
   Catatan: tile.openstreetmap.org menolak (403) halaman yang dibuka dari file lokal karena tanpa Referer, sehingga ia jadi cadangan. */
const PROV=[
 {u:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",a:'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors',n:18},
 {u:"https://tile.openstreetmap.org/{z}/{x}/{y}.png",a:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',n:19}
];
const TC={Ringan:"#22a55b",Sedang:"#f5a524",Berat:"#e5484d"};
/* kode lama punya variabel global bernama L, jadi Leaflet diambil lewat window.L */
const LL=window.L,hasL=!!(LL&&typeof LL.map==="function");
const say=m=>{try{toast(m)}catch(e){}};
/* batas longgar saja, untuk menangkap pin yang jauh sekali dari Bekasi */
const nearBekasi=(la,lo)=>la>=-6.42&&la<=-6.12&&lo>=106.85&&lo<=107.12;
const num=v=>typeof v==="number"&&Number.isFinite(v);
const validCo=c=>Array.isArray(c)&&c.length===2&&num(c[0])&&num(c[1])&&Math.abs(c[0])<=90&&Math.abs(c[1])<=180&&!(c[0]===0&&c[1]===0);
const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v.filter(Boolean):[]}catch(e){return[]}};

/* ===== ikon ===== */
const PIN='<svg viewBox="0 0 34 44" width="34" height="44" aria-hidden="true"><path d="M17 43C17 43 31 28 31 16A14 14 0 003 16C3 28 17 43 17 43Z" fill="#f26a1b" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="16" r="5.5" fill="#fff"/></svg>';
const pinIcon=ok=>LL.divIcon({className:"jkpin "+(ok?"ok":"u"),html:PIN,iconSize:[34,44],iconAnchor:[17,43],popupAnchor:[0,-40]});
const dotIcon=(c,done)=>LL.divIcon({className:"jkdot"+(done?" dn":""),html:'<i style="--c:'+c+'"></i>',iconSize:[26,26],iconAnchor:[13,13],popupAnchor:[0,-12]});
function addTiles(map){
 let i=0,bad=0,good=0,lay=null;
 const use=n=>{
  if(lay)lay.remove();
  const p=PROV[n];bad=0;
  lay=LL.tileLayer(p.u,{maxZoom:19,maxNativeZoom:p.n,attribution:p.a}).addTo(map);
  lay.on("tileload",()=>{good++});
  lay.on("tileerror",()=>{bad++;if(!good&&bad>=4&&i<PROV.length-1){i++;use(i)}})};
 use(0)}

/* ===== 1. penanda titik di form lapor ===== */
const RP=$("rp"),RF=$("rf"),loc=RP&&RP.querySelector(".rloc");
if(RP&&RF&&loc){
 loc.insertAdjacentHTML("afterend",'<div class="rmap"><div class="mc" id="rmc" role="application" aria-label="Peta untuk menandai lokasi jalan rusak"></div><p class="mh" id="rmh" aria-live="polite"></p></div>');
 const H0="Geser <b>pin oranye</b> atau ketuk peta ke jalan yang rusak. Perbesar peta agar titiknya tepat.";
 let fm=null,pin=null,acc=null,touched=false;
 const hint=(t,ok)=>{const h=$("rmh");h.className="mh"+(ok?" ok":"");h.innerHTML=t};
 const clearAcc=()=>{if(acc){acc.remove();acc=null}};
 const sync=(src,a)=>{
  const p=pin.getLatLng(),la=+p.lat.toFixed(5),lo=+p.lng.toFixed(5);
  if(window.jkSetCoords)window.jkSetCoords([la,lo]);
  let t=src==="gps"
   ?'Posisi awal dari GPS (akurasi sekitar '+Math.round(a||0)+' m). GPS di HP sering meleset, <b>geser pin</b> ke jalan yang rusak.'
   :'Titik ditandai: <b>'+la.toFixed(5)+', '+lo.toFixed(5)+'</b>. Geser lagi bila belum pas.';
  if(!nearBekasi(la,lo))t+='<em>Titik ini tampaknya jauh dari Kota Bekasi, periksa lagi posisinya.</em>';
  hint(t,true)};
 const put=(ll,src,a)=>{
  touched=true;pin.setLatLng(ll);pin.setIcon(pinIcon(true));
  clearAcc();
  if(src==="gps"&&num(a)&&a>0)acc=LL.circle(pin.getLatLng(),{radius:a,color:"#f26a1b",weight:1,fillColor:"#f26a1b",fillOpacity:.12,interactive:false}).addTo(fm);
  sync(src,a)};
 const resetPin=()=>{touched=false;clearAcc();if(!fm)return;pin.setLatLng(CENTER);pin.setIcon(pinIcon(false));fm.setView(CENTER,13);hint(H0,false)};
 function init(){
  if(fm)return;
  const c=$("rmc");
  if(!hasL){c.innerHTML='<div class="off">Peta tidak bisa dimuat. Periksa koneksi internet lalu muat ulang halaman. Anda tetap bisa memakai tombol Lokasi saya.</div>';hint("",false);return}
  fm=LL.map(c,{center:CENTER,zoom:13,scrollWheelZoom:false,doubleClickZoom:false});
  addTiles(fm);
  pin=LL.marker(CENTER,{draggable:true,autoPan:true,keyboard:true,title:"Geser ke lokasi jalan yang rusak",icon:pinIcon(false)}).addTo(fm);
  pin.on("dragend",()=>put(pin.getLatLng(),"pin"));
  fm.on("click",e=>put(e.latlng,"pin"));
  hint(H0,false)}
 new MutationObserver(()=>{if(!RP.classList.contains("open"))return;init();[80,450].forEach(ms=>setTimeout(()=>{if(fm){fm.invalidateSize();if(!touched)fm.setView(CENTER,13)}},ms))}).observe(RP,{attributes:true,attributeFilter:["class"]});
 /* tombol Lokasi saya: hanya mengisi posisi awal pin */
 const g=$("rgps");
 if(g)g.onclick=()=>{
  if(!navigator.geolocation){say("Perangkat ini tidak mendukung lokasi");return}
  g.disabled=true;
  navigator.geolocation.getCurrentPosition(p=>{
   const la=+p.coords.latitude.toFixed(5),lo=+p.coords.longitude.toFixed(5),i=$("rlok");
   if(!i.value.trim())i.value="Titik "+la+", "+lo;
   if(fm){put([la,lo],"gps",p.coords.accuracy);fm.setView([la,lo],18);say("Posisi awal didapat, geser pin bila perlu")}
   else{if(window.jkSetCoords)window.jkSetCoords([la,lo]);say("Lokasi didapat")}
   g.disabled=false},
  ()=>{say("Izin lokasi ditolak, geser pin di peta secara manual");g.disabled=false},{enableHighAccuracy:true,timeout:8000})};
 /* setiap laporan wajib punya titik */
 const warn=()=>{
  say("Tandai lokasi di peta dulu: geser pin ke jalan yang rusak");
  const c=$("rmc");c.scrollIntoView({behavior:"smooth",block:"center"});
  c.classList.remove("need");void c.offsetWidth;c.classList.add("need");setTimeout(()=>c.classList.remove("need"),900)};
 const need=()=>!!fm&&!touched;
 document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#rf .rsend");if(!b||!need())return;e.preventDefault();e.stopImmediatePropagation();warn()},true);
 document.addEventListener("submit",e=>{if(e.target!==RF||!need())return;e.preventDefault();e.stopImmediatePropagation();warn()},true);
 RF.addEventListener("reset",()=>setTimeout(resetPin,0));
}

/* ===== 2. halaman Peta ===== */
const PT=$("pt");
let pm=null,grp=null,mode=null,tk="Semua";
/* ===== lokasi saya (titik biru seperti Google Maps) ===== */
let meM=null,meC=null,meW=null,meBtn=null,mePend=false;
const meIcon=()=>LL.divIcon({className:"jkme",html:"<span></span><i></i>",iconSize:[22,22],iconAnchor:[11,11],popupAnchor:[0,-12]});
function meShow(p,fly){
 const ll=[p.coords.latitude,p.coords.longitude],a=p.coords.accuracy;
 if(!meM){
  meC=LL.circle(ll,{radius:a,color:"#1a73e8",weight:1,fillColor:"#1a73e8",fillOpacity:.12,interactive:false}).addTo(pm);
  meM=LL.marker(ll,{icon:meIcon(),zIndexOffset:2000,keyboard:false,title:"Lokasi Anda"}).addTo(pm)}
 else{meM.setLatLng(ll);meC.setLatLng(ll);meC.setRadius(a)}
 meM.bindPopup("<b>Lokasi Anda</b>"+(num(a)?"<br><small>Akurasi sekitar "+Math.round(a)+" m</small>":""));
 if(meBtn)meBtn.classList.add("on");
 if(fly)pm.flyTo(ll,Math.max(pm.getZoom(),16),{duration:.8})}
function meStop(){if(meW!=null&&navigator.geolocation){navigator.geolocation.clearWatch(meW)}meW=null}
function meClear(){meStop();if(meM){meM.remove();meM=null}if(meC){meC.remove();meC=null}if(meBtn)meBtn.classList.remove("on","wait");mePend=false}
function meStart(fly){
 if(!navigator.geolocation){say("Perangkat ini tidak mendukung lokasi");return}
 if(fly)mePend=true;
 if(meW!=null){if(meM&&fly){pm.flyTo(meM.getLatLng(),Math.max(pm.getZoom(),16),{duration:.6});mePend=false}return}
 if(meBtn)meBtn.classList.add("wait");
 meW=navigator.geolocation.watchPosition(
  p=>{if(meBtn)meBtn.classList.remove("wait");const f=mePend;mePend=false;meShow(p,f)},
  e=>{
   const was=mePend;meClear();
   if(!was&&e.code!==1)return;
   say(e.code===1?(window.isSecureContext?"Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser":"Lokasi tidak bisa diakses di pratinjau ini. Buka halaman lewat Safari atau Chrome"):"Lokasi belum didapat, coba lagi di tempat terbuka")},
  {enableHighAccuracy:true,maximumAge:5000,timeout:20000})}
function meAuto(){
 if(!navigator.permissions||!navigator.permissions.query||!navigator.geolocation)return;
 navigator.permissions.query({name:"geolocation"}).then(r=>{if(r.state==="granted"&&pm&&meW==null)meStart(false)}).catch(()=>{})}
function meControl(){
 const C=LL.Control.extend({options:{position:"bottomright"},onAdd(){
  const d=LL.DomUtil.create("div","leaflet-bar leaflet-control jkloc"),b=LL.DomUtil.create("a","",d);
  b.href="#";b.setAttribute("role","button");b.title="Lokasi saya";b.setAttribute("aria-label","Tampilkan lokasi saya");
  b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="7.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>';
  meBtn=b;
  LL.DomEvent.disableClickPropagation(d);
  LL.DomEvent.on(b,"click",e=>{LL.DomEvent.preventDefault(e);meStart(true)});
  return d}});
 new C().addTo(pm)}

const fdate=ts=>new Date(ts).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
const SMP=[["Jl. Ahmad Yani",-6.2447,106.9965,"Lubang","Berat",0],["Jl. Ahmad Yani",-6.2418,106.9921,"Retak","Sedang",1],["Jl. Raya Narogong",-6.2790,106.9985,"Lubang","Berat",3],["Jl. Raya Narogong",-6.2925,107.0012,"Amblas","Berat",2],["Jl. Cut Meutia",-6.2381,107.0024,"Lubang","Sedang",1],["Jl. Cut Meutia",-6.2362,107.0051,"Genangan / drainase","Ringan",4],["Jl. KH. Noer Ali",-6.2476,106.9857,"Retak","Ringan",4],["Jl. KH. Noer Ali",-6.2491,106.9802,"Lubang","Sedang",3],["Jl. Juanda",-6.2297,106.9991,"Lubang","Berat",0],["Jl. Juanda",-6.2318,107.0016,"Lainnya","Ringan",2],["Jl. Raya Pekayon",-6.2662,106.9781,"Amblas","Sedang",1],["Jl. Raya Pekayon",-6.2641,106.9754,"Retak","Sedang",3],["Jl. Pondok Gede Raya",-6.2736,106.9147,"Lubang","Berat",0],["Jl. Pondok Gede Raya",-6.2711,106.9186,"Genangan / drainase","Sedang",2]];
const sample=()=>SMP.map((s,i)=>({id:"CONTOH-"+String(i+1).padStart(2,"0"),lok:s[0],la:s[1],lo:s[2],jenis:s[3],tk:s[4],stage:s[5],ts:Date.now()-i*6e7,foto:"",desc:""}));
const real=()=>read().filter(r=>validCo(r.co)).map(r=>({id:r.id,lok:r.lok,la:r.co[0],lo:r.co[1],jenis:r.jenis,tk:r.tk,stage:Math.max(0,Math.min(4,+r.stage||0)),ts:r.ts,foto:r.foto,desc:r.desc}));
function popup(r){
 const c=TC[r.tk]||TC.Sedang,img=typeof r.foto==="string"&&r.foto.indexOf("data:image/")===0?'<img decoding="async" src="'+r.foto+'" alt="Foto '+esc(r.id)+'">':"";
 return'<div class="ppu"><b>'+esc(r.id)+' &middot; '+esc(r.jenis)+'</b><span class="tg" style="--c:'+c+'">'+esc(r.tk)+'</span><p>'+esc(r.lok)+'</p><small>'+esc(STN[r.stage])+' &middot; '+fdate(r.ts)+'</small>'+(r.desc?'<small>&ldquo;'+esc(r.desc)+'&rdquo;</small>':"")+img+'</div>'}
function buildMap(){
 if(pm)return;
 const m=$("ptm");
 if(!hasL){m.innerHTML='<div class="off">Peta tidak bisa dimuat. Periksa koneksi internet lalu muat ulang halaman.</div>';return}
 pm=LL.map(m,{center:CENTER,zoom:13,zoomControl:false});
 LL.control.zoom({position:"bottomright"}).addTo(pm);
 meControl();
 addTiles(pm);
 grp=LL.layerGroup().addTo(pm)}
function paint(fit){
 const R=real(),noCo=read().filter(r=>!validCo(r.co)).length;
 if(!mode)mode=R.length?"real":"demo";
 const D=mode==="real"?R:sample(),F=D.filter(r=>tk==="Semua"||r.tk===tk),isReal=mode==="real";
 $("ptf").innerHTML=["Semua","Ringan","Sedang","Berat"].map(x=>'<button type="button" data-k="'+x+'" class="'+(x===tk?"on":"")+'">'+x+'</button>').join("");
 $("ptd").innerHTML='<button type="button" data-m="real" class="'+(isReal?"on":"")+'">Data nyata ('+R.length+')</button><button type="button" data-m="demo" class="'+(isReal?"":"on")+'">Data contoh</button>';
 $("pts").innerHTML='<b>'+F.length+' titik</b>'+(tk!=="Semua"?' tingkat '+tk.toLowerCase():"")+(isReal?(noCo?' &middot; '+noCo+' laporan lama belum punya titik':""):' &middot; lokasi contoh hanya perkiraan');
 const e=$("pte");e.hidden=!(isReal&&!R.length);e.textContent="Belum ada laporan yang punya titik. Kirim laporan dan tandai lokasinya, atau pilih Data contoh.";
 if(!pm)return;
 grp.clearLayers();
 F.forEach(r=>{const mk=LL.marker([r.la,r.lo],{icon:dotIcon(TC[r.tk]||TC.Sedang,r.stage===4),title:r.id+" · "+r.jenis,riseOnHover:true});mk.bindPopup(popup(r),{maxWidth:260,minWidth:200});grp.addLayer(mk)});
 if(fit){if(F.length)pm.fitBounds(LL.latLngBounds(F.map(r=>[r.la,r.lo])),{padding:[70,70],maxZoom:16});else pm.setView(CENTER,13)}}
window.openMap=function(){
 if(!PT)return;
 buildMap();if(pm)meAuto();mode=null;tk="Semua";
 window.jkSync&&window.jkSync().then(ok=>{if(ok&&PT.classList.contains("open")){mode=null;paint(true)}});
 PT.classList.add("open");PT.setAttribute("aria-hidden","false");
 paint(false);
 if(pm){pm.invalidateSize();paint(true);setTimeout(()=>{pm.invalidateSize()},350)}
 setTimeout(()=>{const x=$("ptx");if(x)x.focus({preventScroll:true})},60)};
function closeMap(){if(!PT||!PT.classList.contains("open"))return;if(pm){pm.closePopup();meClear()}PT.classList.remove("open");PT.setAttribute("aria-hidden","true")}
if(PT){
 $("ptx").onclick=closeMap;
 $("ptf").onclick=e=>{const b=e.target.closest("button[data-k]");if(!b)return;tk=b.dataset.k;paint(true)};
 $("ptd").onclick=e=>{const b=e.target.closest("button[data-m]");if(!b)return;mode=b.dataset.m;paint(true)};
 addEventListener("keydown",e=>{if(e.key==="Escape")closeMap()});
 /* menu Peta lama (navbar, sidebar, bar bawah) hanya memanggil toast "segera hadir": arahkan ke halaman Peta */
 const _t=window.toast;
 if(typeof _t==="function")window.toast=function(m){if(m==="Halaman Peta segera hadir"){window.openMap();return}return _t.apply(this,arguments)};
}
})();
